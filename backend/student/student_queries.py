import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
from department.models import (Teaching, Module, Section, Lecture, Element, Homework, StudentHomeworkAnswer)

from exam.models import Exam, StudentAttempt
from .models import Studying

from graphql import GraphQLError
import json
from django.utils import timezone

from .models import HomeworkFinished, LectureFinished
from authentication.user_queries import require_auth
from .logger import register

from department.types import (
	DepartmentType,
	LectureType,
	HomeworkType,
	SectionType,
	ElementType,
	ModuleType,
	HomeworkAnswerType
	)
from exam.types import (
	QuestionsIDsType,
	AttemptType,
	ChoiceType,
	QuestionModelType,
	ExamType,
	QuestionTypeType,
	ChoiceType
)

from student.models import ExamFinished, ElementLog

from authentication.hash import Hasher

def makeJson(type, text):
	response = {
		"type" : type,
		"text" : text
	}
	return json.dumps(response)



class StudentType(DjangoObjectType):
	class Meta:
		model = Student 
		fields = ("department",) 

	full_name = graphene.String()
	cin = graphene.String()
	email = graphene.String()
	id = graphene.ID()

	def resolve_full_name(self, info):
		return self.user.get_full_name()

	def resolve_cin(self, info):
		return self.user.cin

	def resolve_email(self, info):
		return self.user.email
	def resolve_id(self, info):
		return self.user.id


class StudentQueries(graphene.ObjectType):
	get_department_modules = graphene.List(ModuleType)
	department = graphene.Field(DepartmentType)
	section = graphene.Field(SectionType)
	lecture = graphene.Field(LectureType)
	module = graphene.Field(ModuleType)
	homework = graphene.Field(HomeworkType)

	get_element_content= graphene.Field(ElementType, element_id=graphene.ID())
	get_lecture_content = graphene.Field(LectureType, lecture_id=graphene.ID())

	get_homework_content = graphene.Field(HomeworkType, homework_id=graphene.ID())

	get_exam_content = graphene.Field(ExamType, exam_id=graphene.ID())

	get_last_accessed_courses = graphene.List(ElementType)

	def resolve_get_element_content(self,info, element_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				department = student.department
				element = Element.objects.get(pk=element_id)
				is_valid = Studying.objects.get(department=department, module=element.module)

				if is_valid:
					register(student=student, element=element)
					return element
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
			except Studying.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
		else:
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))

	def resolve_get_department_modules(self, info):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				department = student.department
				return Module.objects.filter(department=department)
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
		else:
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))

	def resolve_get_lecture_content(self, info, lecture_id):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				department = student.department
				lecture = Lecture.objects.get(pk=lecture_id)
				module = lecture.section.element.module
				is_valid = Studying.objects.get(department=department, module=module)
				if is_valid:
					register(student=student, lecture=lecture)
					return lecture
			except Studying.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
			except Lecture.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))

		return GraphQLError(makeJson("LOGIN", "You are not logged in"))


	def resolve_get_homework_content(self, info, homework_id):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				department = student.department
				homework = Homework.objects.get(pk=homework_id)
				module = homework.section.element.module
				is_valid = Studying.objects.get(department=department, module=module)
				if is_valid:
					register(student=student, homework=homework)
					return homework
			except Studying.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
			except Homework.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))

		return GraphQLError(makeJson("LOGIN", "You are not logged in"))


	def resolve_get_exam_content(self, info, exam_id):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				department = student.department
				decoded_id = Hasher.decode("exam", exam_id)
				exam = Exam.objects.get(pk=decoded_id)
				module = exam.section.element.module
				is_valid = Studying.objects.get(department=department, module=module)
				return exam
			except Studying.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to see this content"))
			except Exam.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))

		return GraphQLError(makeJson("LOGIN", "You are not logged in"))

		
	def resolve_get_last_accessed_courses(self, info):
		user = info.context.user 
		if user.is_student():
			last_accessed = ElementLog.objects.exclude(element__isnull=True).filter(student=user.student).values_list("element")
			elements = []
			for element in last_accessed:
				try:
					elements.append(Element.objects.get(pk=element[0]))
				except:
					pass
			elements = list(dict.fromkeys(elements))
			return elements[:3]
		return None