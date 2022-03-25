import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
from department.models import (Teaching, Module, Section, Lecture, Element, Homework)

from .models import Studying

from graphql import GraphQLError
import json

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


class StudentQueries(graphene.ObjectType):
	get_department_modules = graphene.List(ModuleType)
	department = graphene.Field(DepartmentType)
	section = graphene.Field(SectionType)
	lecture = graphene.Field(LectureType)
	module = graphene.Field(ModuleType)
	homework = graphene.Field(HomeworkType)

	get_element_content= graphene.Field(ElementType, element_id=graphene.ID())

	def resolve_get_element_content(self,info, element_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				department = student.department
				element = Element.objects.get(pk=element_id)

				Studying.objects.get(department=department, module=element.module)

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