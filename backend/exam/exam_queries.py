import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
# from department.models import (Teaching, Module, Section, Lecture, Element, Homework, StudentHomeworkAnswer)

from exam.models import Exam, StudentAttempt
from .models import Studying

from graphql import GraphQLError
import json
from django.utils import timezone

# from department.teacher_queries import (
# 	DepartmentType,
# 	LectureType,
# 	HomeworkType,
# 	SectionType,
# 	ElementType,
# 	ModuleType,
# 	HomeworkAnswerType
# 	)

from authentication.hash import Hasher

def makeJson(type, text):
	response = {
		"type" : type,
		"text" : text
	}
	return json.dumps(response)


class StudentExamQueries(graphene.ObjectType):
	pass_exam = graphene.Field(PassExamType, attempt_id=graphene.ID())

	def resolve_pass_exam(self, info, attempt_id):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
				attempt = StudentAttempt.objects.get(pk=decoded_attempt_id)
			except:
				pass
		return GraphQLError(makeJson("LOGIN", "You are not logged in"))