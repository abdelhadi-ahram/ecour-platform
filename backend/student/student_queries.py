import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher
from department.models import Teaching, Module, Section, Lecture, Element, Homework

from graphql import GraphQLError
import json

class ElementType(DjangoObjectType):
	class Meta:
		model = Element
		fields = ("id", "module","name")


class SectionType(DjangoObjectType):
	class Meta:
		model = Section
		fields = ("id", "element", "name", "lectures", "homeworks")


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
	get_department_elements = graphene.List(ElementType, department_id=graphene.ID())
	section = graphene.Field(SectionType)