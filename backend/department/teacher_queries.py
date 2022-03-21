import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher
from department.models import Teaching, Module, Section, Lecture, Element

from graphql import GraphQLError
import json

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

class LectureType(DjangoObjectType):
	class Meta:
		model = Lecture
		fields = "__all__"

class SectionType(DjangoObjectType):
	class Meta:
		model = Section
		fields = ("id", "element", "name", "lectures")

class ElementType(DjangoObjectType):
	class Meta:
		model = Element
		fields = ("id", "module","name","sections")

class ModuleType(DjangoObjectType):
	class Meta:
		model = Module
		fields = ("name", "department", "id")

class TeacherQueries(graphene.ObjectType):
	get_teachings = graphene.List(TeachingType)
	department = graphene.Field(DepartmentType)
	get_element_lectures = graphene.Field(ElementType, teaching_id = graphene.ID())
	section = graphene.Field(SectionType)
	lecture = graphene.Field(LectureType)
	module = graphene.Field(ModuleType)

	get_lecture_by_id = graphene.Field(LectureType, lecture_id=graphene.ID())

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
