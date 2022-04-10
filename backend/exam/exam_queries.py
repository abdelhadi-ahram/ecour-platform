import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student

from .types import (
QuestionsIDsType,
AttemptType,
ChoiceType,
QuestionModelType,
ExamType,
QuestionTypeType,
ChoiceType
)

from exam.models import (
		Exam, 
		StudentAttempt, 
		Question, 
		StudentQuestionAnswer, 
		StudentPickedChoice, 
		Choice
	)

from graphql import GraphQLError
import json
from django.utils import timezone
from django.db.models import Sum


from authentication.hash import Hasher
from random import shuffle

def makeJson(type, text):
	response = {
		"type" : type,
		"text" : text
	}
	return json.dumps(response)

	

class StudentExamQueries(graphene.ObjectType):
	get_attempt_details = graphene.Field(AttemptType, attempt_id=graphene.ID())
	get_question_content = graphene.Field(QuestionModelType, question_id=graphene.ID(), attempt_id=graphene.ID())

	def resolve_get_attempt_details(self, info, attempt_id):
		user = info.context.user 
		try:
			student = Student.objects.get(user=user)
			decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
			attempt = StudentAttempt.objects.get(pk=decoded_attempt_id)
			# if the attempt was created by the current student
			if attempt.student == student:
				# we check if the exam is open
				# and the student has not already answered any question (refresh the page)
				if attempt.exam.is_open() and not StudentQuestionAnswer.objects.filter(attempt=attempt).count() > 0:
					return attempt
			raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to access this content"))
		except StudentAttempt.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
		except Student.DoesNotExist:
			raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to access this content"))
		except:
			raise GraphQLError(makeJson("DATAERROR", "Unvalid data"))

	def resolve_get_question_content(self, info, question_id, attempt_id):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				decoded_question_id = Hasher.decode(user.cin, question_id)
				question = Question.objects.get(pk=decoded_question_id)
				#get the attempt
				decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
				attempt = StudentAttempt.objects.get(pk=decoded_attempt_id)
				if attempt.student == student:
					# Check if the user has not alredy answered this question before if it is
					# a sequentiel exam
					if attempt.exam.sequentiel and StudentQuestionAnswer.objects.filter(attempt=attempt, question=question).exists():
						raise GraphQLError(makeJson("PERMISSION", "You have already answered this question"))
					return question
				raise GraphQLError(makeJson("PERMISSION", "You don'thave the permission to access this content"))
			except StudentAttempt.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to access thi content"))
		return GraphQLError(makeJson("LOGIN", "You are not logged in"))