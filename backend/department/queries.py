import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher
from department.models import Teaching

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
		fields = ("id", "name", "teachings")

class TeacherQueries(graphene.ObjectType):
    get_departments = graphene.List(TeachingType)
	department = graphene.Field(DepartmentType)
	
    def resolve_get_departments(self, info):
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
