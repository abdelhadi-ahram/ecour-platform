import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
# from department.models import (Teaching, Module, Section, Lecture, Element, Homework, StudentHomeworkAnswer)

from exam.models import Exam, StudentAttempt, Question

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
from random import shuffle

def makeJson(type, text):
	response = {
		"type" : type,
		"text" : text
	}
	return json.dumps(response)

class QuestionsIDsType(DjangoObjectType):
	class Meta:
		model = Question

	id = graphene.ID()
	def resolve_id(self, info):
		encoded_id = Hasher.encode(info.context.user.cin, self.id)
		return encoded_id

class AttemptType(DjangoObjectType):
	class Meta:
		model = StudentAttempt

	questions = graphene.List(QuestionsIDsType)
	left_time = graphene.Int()
	sequentiel = graphene.Boolean()

	def resolve_questions(self, info):
		exam = self.exam
		questions = list(Question.objects.filter(exam=exam) )
		shuffle(questions)
		return questions
	def resolve_left_time(self, info):
		ends_at = self.exam.starts_at + self.exam.duration 
		left_time = ends_at - timezone.now()
		return str(left_time.total_seconds())
	def resolve_sequentiel(self, info):
		return self.exam.sequentiel

class StudentExamQueries(graphene.ObjectType):
	get_attempt_details = graphene.Field(AttemptType, attempt_id=graphene.ID())
	# get_question_content = graphene.Field(StudentQuestionType, question_id=graphene.ID())

	def resolve_get_attempt_details(self, info, attempt_id):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
				attempt = StudentAttempt.objects.get(pk=decoded_attempt_id)
				if attempt.student == student:
					return attempt
				raise GraphQLError(makeJson("PERMISSION", "You don'thave the permission to access this content"))
			except StudentAttempt.DoesNotExist:
				GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Student.DoesNotExist:
				GraphQLError(makeJson("PERMISSION", "You do not have the permission to access thi content"))
		return GraphQLError(makeJson("LOGIN", "You are not logged in"))

	# def resolve_get_question_content(self, info, question_id):
	# 	user = info.context.user 
	# 	if user.is_authenticated:
	# 		try:
	# 			student = Student.objects.get(user=user)
	# 			decoded_question_id = Hasher.decode(user.cin, question_id)
	# 			question = StudentAttempt.objects.get(pk=decoded_attempt_id)
	# 			if attempt.student == student:
	# 				return attempt
	# 			raise GraphQLError(makeJson("PERMISSION", "You don'thave the permission to access this content"))
	# 		except StudentAttempt.DoesNotExist:
	# 			GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
	# 		except Student.DoesNotExist:
	# 			GraphQLError(makeJson("PERMISSION", "You do not have the permission to access thi content"))
	# 	return GraphQLError(makeJson("LOGIN", "You are not logged in"))