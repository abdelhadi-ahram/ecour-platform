import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
from department.models import (Teaching, Module, Section, Lecture, Element, Homework, StudentHomeworkAnswer)

from graphql import GraphQLError
import json

from student.models import HomeworkFinished, LectureFinished, ElementLog
from exam.models import QuestionType 

import math

def makeJson(type, text):
	response = {
		"type" : type,
		"text" : text
	}
	return json.dumps(response)

class TeachingType(DjangoObjectType):
    class Meta:
        model = Teaching
        fields = ("id", "department")

    # is_responsible = graphene.String()
class DepartmentType(DjangoObjectType):
	class Meta:
		model = Department
		fields = ("id", "name")


class CustomStudentType(DjangoObjectType):
	class Meta:
		model = Student
		fields = ("id",) 

	full_name = graphene.String()
	cin = graphene.String()
	email = graphene.String()

	def resolve_full_name(self, info):
		return self.user.get_full_name()

	def resolve_cin(self, info):
		return self.user.cin

	def resolve_email(self, info):
		return self.user.email


class LectureType(DjangoObjectType):
	class Meta:
		model = Lecture
		fields = "__all__"

	seen = graphene.Int()
	accessed_by = graphene.List(CustomStudentType)

	def resolve_seen(self, info):
		return ElementLog.objects.filter(lecture=self).count()

	def resolve_accessed_by(self, info):
		qr = ElementLog.objects.filter(lecture=self)
		students = []
		for q in qr:
			students.append(q.student)
		return set(students)

class HomeworkAnswerType(DjangoObjectType):
	class Meta:
		model = StudentHomeworkAnswer
		fields = "__all__"

	created_at = graphene.String()
	def resolve_created_at(self, info):
		return self.created_at.strftime("%a, %m-%y %H:%M")

class HomeworkType(DjangoObjectType):
	class Meta:
		model = Homework 
		fields = "__all__"

	deadline_date = graphene.String()
	def resolve_deadline_date(self, info):
		return self.deadline.strftime("%Y-%m-%d")

	deadline_time = graphene.String()
	def resolve_deadline_time(self, info):
		return self.deadline.strftime("%H:%M")

	student_answers = graphene.List(HomeworkAnswerType)
	def resolve_student_answers(self, info):
		return StudentHomeworkAnswer.objects.filter(homework=self)


class SectionType(DjangoObjectType):
	class Meta:
		model = Section
		fields = ("id", "element", "name", "lectures", "homeworks")

class ElementType(DjangoObjectType):
	class Meta:
		model = Element
		fields = ("id", "module","name","sections")

	progress = graphene.Float()

	def resolve_progress(self, info):
		user = info.context.user 
		try:
			student = Student.objects.get(user=user) 
			elements = Lecture.objects.filter(section__element=self).count() + Homework.objects.filter(section__element=self).count()
			done = LectureFinished.objects.filter(lecture__section__element=self, student=student).count() + HomeworkFinished.objects.filter(homework__section__element=self, student=student).count()
			if(elements):
				return math.floor((done / elements) * 100)
			return 0
		except :
			return 0

class ModuleType(DjangoObjectType):
	class Meta:
		model = Module
		fields = ("name", "department", "id", "elements")

class QuestionTypeType(DjangoObjectType):
	class Meta:
		model = QuestionType
		fields = ("id", "type")


class TeacherQueries(graphene.ObjectType):
	get_teachings = graphene.List(TeachingType)
	department = graphene.Field(DepartmentType)
	get_element_lectures = graphene.Field(ElementType, teaching_id = graphene.ID())
	section = graphene.Field(SectionType)
	lecture = graphene.Field(LectureType)
	module = graphene.Field(ModuleType)
	homework = graphene.Field(HomeworkType)
	student = graphene.Field(CustomStudentType)

	get_lecture_by_id = graphene.Field(LectureType, lecture_id=graphene.ID())
	get_homework_by_id = graphene.Field(HomeworkType, homework_id=graphene.ID())

	get_question_types = graphene.List(QuestionTypeType)

	def resolve_get_teachings(self, info):
		user = info.context.user
		if user.is_authenticated:
			try:
				teacher = Teacher.objects.get(user=user)
				teachings = Teaching.objects.filter(teacher=teacher)
				return teachings
			except:
				raise GraphQLError(makeJson("PERMISSION", "You don't have the right to perform this action"))
			else :
				raise GraphQLError(makeJson("PERMISSION", "You are not logged in"))


	#get lectures that belong to a teaching model
	def resolve_get_element_lectures(self, info, teaching_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				teacher = Teacher.objects.get(user=user)
				teaching = Teaching.objects.get(pk=teaching_id, teacher=teacher)
				return teaching.element
			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except :
				raise GraphQLError(makeJson("DATAERROR", "Could not perform the last operation"))
		else :
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))


	def resolve_get_lecture_by_id(self, info, lecture_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				lecture = Lecture.objects.get(pk=lecture_id)
				element = lecture.section.element
				teacher = Teacher.objects.get(user=user)
				teaching = Teaching.objects.get(element=element, teacher=teacher)
				return lecture
			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))
			except Lecture.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You can not perform this operation"))
		else :
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))


	def resolve_get_homework_by_id(self, info, homework_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				homework = Homework.objects.get(pk=homework_id)
				element = homework.section.element
				teacher = Teacher.objects.get(user=user)
				teaching = Teaching.objects.get(element=element, teacher=teacher)
				return homework
			except StudentHomeworkAnswer.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The requested data does not exist"))
			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))
			except Homework.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You can not perform this operation"))
		else :
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))

	def resolve_get_question_types(self, info):
		return QuestionType.objects.all()


