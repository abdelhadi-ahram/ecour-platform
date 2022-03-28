import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
from department.models import (Teaching, Module, Section, Lecture, Element, Homework, StudentHomeworkAnswer)

from .models import Studying

from graphql import GraphQLError
import json

from .models import HomeworkFinished, LectureFinished

from .logger import register

from department.teacher_queries import (
	DepartmentType,
	LectureType,
	HomeworkType,
	SectionType,
	ElementType,
	ModuleType
	)

def makeJson(type, text):
	response = {
		"type" : type,
		"text" : text
	}
	return json.dumps(response)

class StudentType(DjangoObjectType):
	class Meta:
		model = Student 
		fields = ("id","department") 

	full_name = graphene.String()
	cin = graphene.String()

	def resolve_full_name(self, info):
		return self.user.get_full_name()

	def resolve_cin(self, info):
		return self.user.cin

class HomeworkAnswerType(DjangoObjectType):
	class Meta:
		model = StudentHomeworkAnswer
		fields = "__all__"

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
			return StudentHomeworkAnswer.objects.filter(homework=self, student=student).first()
		except Student.DoesNotExist:
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

	# get_homework_answer = graphene.Field(HomeworkAnswerType, homework_id=graphene.ID())

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