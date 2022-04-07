import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
# from department.models import (Teaching, Module, Section, Lecture, Element, Homework, StudentHomeworkAnswer)

from exam.models import (
		Exam, 
		StudentAttempt, 
		Question, 
		StudentQuestion, 
		StudentQuestion, 
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
		return self.exam.get_left_time()

	def resolve_sequentiel(self, info):
		return self.exam.sequentiel

class StudentChoicesType(DjangoObjectType):
	class Meta:
		model = Choice
		fields = ("content",)

	id = graphene.ID()
	def resolve_id(self, info):
		user = info.context.user
		encoded_id = Hasher.encode(user.cin, self.id)
		return encoded_id


class StudentQuestionType(DjangoObjectType):
	class Meta:
		model = Question 
		fields = ("content', 'choices", "type", "mark")

	estimated_time = graphene.Int()
	content = graphene.String()
	choices = graphene.List(StudentChoicesType)

	def resolve_estimated_time(self, info):
		marks = Question.objects.filter(exam=self.exam).aggregate(Sum("mark"))
		return (self.mark / marks["mark__sum"]) * self.exam.get_left_time()
	def resolve_content(self, info):
		return self.content 
	def resolve_choices(self, info):
		return Choice.objects.filter(question=self)

class StudentExamQueries(graphene.ObjectType):
	get_attempt_details = graphene.Field(AttemptType, attempt_id=graphene.ID())
	get_question_content = graphene.Field(StudentQuestionType, question_id=graphene.ID(), attempt_id=graphene.ID())

	def resolve_get_attempt_details(self, info, attempt_id):
		user = info.context.user 
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
				attempt = StudentAttempt.objects.get(pk=decoded_attempt_id)
				if attempt.student == student:
					ends_at = attempt.exam.starts_at + attempt.exam.duration 
					if timezone.now() < ends_at:
						return attempt
					raise GraphQLError(makeJson("TIMEOUT", "This exam has been closed"))
				raise GraphQLError(makeJson("PERMISSION", "You don'thave the permission to access this content"))
			except StudentAttempt.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to access this content"))
			except:
				raise GraphQLError(makeJson("DATAERROR", "Unvalid data"))
		return GraphQLError(makeJson("LOGIN", "You are not logged in"))

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
					if StudentQuestion.objects.filter(student_attempt=attempt, question=question).exists():
						raise GraphQLError(makeJson("PERMISSION", "You have already answered this question"))
					return question
				raise GraphQLError(makeJson("PERMISSION", "You don'thave the permission to access this content"))
			except StudentAttempt.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to access thi content"))
		return GraphQLError(makeJson("LOGIN", "You are not logged in"))