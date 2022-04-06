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

from .logger import register

from department.teacher_queries import (
	DepartmentType,
	LectureType,
	HomeworkType,
	SectionType,
	ElementType,
	ModuleType,
	HomeworkAnswerType
	)

from student.models import ExamFinished

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


class HomeworkStudentType(DjangoObjectType):
	class Meta:
		model = Homework 
		fields = "__all__"

	deadline = graphene.String()
	is_open = graphene.Boolean()
	answer = graphene.Field(HomeworkAnswerType)
	is_finished = graphene.Boolean()

	def resolve_is_open(self, info):
		return self.is_open()
	def resolve_deadline(self, info):
		return self.deadline.strftime("%a, %m-%y %H:%M")
	def resolve_is_finished(self, info):
		try:
			student = Student.objects.get(user=info.context.user)
			return HomeworkFinished.objects.filter(homework=self, student=student).exists()
		except Student.DoesNotExist:
			return False
	def resolve_answer(self, info):
		try:
			student = Student.objects.get(user=info.context.user)
			return StudentHomeworkAnswer.objects.get(homework=self, student=student)
		except :
			return None

class StudentLectureType(DjangoObjectType):
	class Meta:
		model = Lecture
		fields = "__all__"

	is_finished = graphene.Boolean()

	def resolve_is_finished(self, info):
		try:
			student = Student.objects.get(user=info.context.user)
			return LectureFinished.objects.filter(lecture=self, student=student).exists()
		except Student.DoesNotExist:
			return False

class StudentExamType(DjangoObjectType):
	class Meta:
		model = Exam 
		fields = "__all__"

	id = graphene.ID()
	message = graphene.String()
	is_open = graphene.Boolean()
	is_finished = graphene.Boolean()
	student_attempts = graphene.Int()

	def resolve_id(self, info):
		user = info.context.user 
		if user.is_authenticated:
			id = Hasher.encode("exam", self.id)
			return id
		else:
			return None
	def resolve_is_open(self, info):
		now = timezone.now()
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				if StudentAttempt.objects.filter(student=student, exam=self).count() < self.attempts:
					return (now >= self.starts_at and now < (self.starts_at + self.duration) ) 
			except:
				return False
		return False
	def resolve_message(self, info):
		now = timezone.now()
		if now < self.starts_at:
			return "This exam won't open untill " + self.starts_at.strftime("%a, %m-%y %H:%M")
		elif now > (self.starts_at + self.duration):
			d = self.starts_at + self.duration
			return "This exam was closed since " + d.strftime("%a, %m-%y %H:%M")
		try:
			student = Student.objects.get(user=info.context.user)
			if StudentAttempt.objects.filter(student=student, exam=self).count() >= self.attempts:
				return "You have already taken your attempts"
		except:
			raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to access this content"))
		return "This exam is currently open"

	def resolve_is_finished(self, info):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				return ExamFinished.objects.filter(student=student, exam=self).exists()
			except:
				return False
		else :
			return False

	def resolve_student_attempts(self, info):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				return StudentAttempt.objects.filter(exam=self, student=student).count()
			except Exception as e:
				raise GraphQLError(e)
		else:
			return 0


class StudentQueries(graphene.ObjectType):
	get_department_modules = graphene.List(ModuleType)
	department = graphene.Field(DepartmentType)
	section = graphene.Field(SectionType)
	lecture = graphene.Field(LectureType)
	module = graphene.Field(ModuleType)
	homework = graphene.Field(HomeworkType)

	get_element_content= graphene.Field(ElementType, element_id=graphene.ID())
	get_lecture_content = graphene.Field(StudentLectureType, lecture_id=graphene.ID())

	get_homework_content = graphene.Field(HomeworkStudentType, homework_id=graphene.ID())

	get_exam_content = graphene.Field(StudentExamType, exam_id=graphene.ID())

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