 
import graphene
from graphene_django import DjangoObjectType

from exam.models import (
		Exam, 
		StudentAttempt,
		Question, 
		QuestionType,
		StudentQuestionAnswer, 
		StudentPickedChoice, 
		Choice
	)

from graphql import GraphQLError
import json
from django.utils import timezone
from django.db.models import Sum
from authentication.user_queries import require_auth

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

class ChoiceType(DjangoObjectType):
	class Meta:
		model = Choice
		fields = ("content",)

	id = graphene.ID()
	is_correct = graphene.Boolean()

	def resolve_id(self, info):
		user = info.context.user
		encoded_id = Hasher.encode(user.cin, self.id)
		return encoded_id

	def resolve_is_correct(self, info):
		if info.context.user.is_teacher():
			return self.is_correct 
		return False

class QuestionTypeType(DjangoObjectType):
	class Meta:
		model = QuestionType
		fields = ("id", "type")

class QuestionModelType(DjangoObjectType):
	class Meta:
		model = Question 
		fields = ("content', 'choices", "type", "mark")

	id = graphene.ID()
	estimated_time = graphene.Int()
	content = graphene.String()
	choices = graphene.List(ChoiceType)
	type = graphene.Field(QuestionTypeType)

	def resolve_estimated_time(self, info):
		marks = Question.objects.filter(exam=self.exam).aggregate(Sum("mark"))
		return (self.mark / marks["mark__sum"]) * self.exam.get_left_time()
	def resolve_content(self, info):
		return self.content 
	def resolve_choices(self, info):
		return Choice.objects.filter(question=self)
	def resolve_id(self, info):
		encoded_id = Hasher.encode("question", self.id)
		return encoded_id
	def resolve_type(self, info):
		return self.type


class ExamType(DjangoObjectType):
	class Meta:
		model = Exam 
		fields = "__all__"
	duration = graphene.Int()
	starts_at = graphene.String()

	#For students
	id = graphene.ID()
	message = graphene.String()
	is_open = graphene.Boolean()
	is_finished = graphene.Boolean()
	student_attempts = graphene.Int()
	
	def resolve_duration(self, info):
		return str(self.duration.seconds)
	def resolve_starts_at(self, info):
		return self.starts_at.strftime("%Y-%m-%d %H:%M")

	#Student Attributes
	@require_auth
	def resolve_id(self, info):
		id = Hasher.encode("exam", self.id)
		return id
	@require_auth
	def resolve_is_open(self, info):
		now = timezone.now()
		if info.context.user.is_student():
			try:
				student = info.context.user.student
				if StudentAttempt.objects.filter(student=student, exam=self).count() < self.attempts:
					return (now >= self.starts_at and now < (self.starts_at + self.duration) ) 
			except:
				return False
		return False
	def resolve_message(self, info):
		now = timezone.now()
		user = info.context.user 
		if user.is_student:
			if now < self.starts_at:
				return "This exam won't open untill " + self.starts_at.strftime("%a, %m-%y %H:%M")
			elif now > (self.starts_at + self.duration):
				d = self.starts_at + self.duration
				return "This exam was closed since " + d.strftime("%a, %m-%y %H:%M")
			try:
				if StudentAttempt.objects.filter(student=user.student, exam=self).count() >= self.attempts:
					return "You have already taken your attempts"
			except:
				raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to access this content"))
			return "This exam is currently open"
		return ""

	@require_auth
	def resolve_is_finished(self, info):
		user = info.context.user 
		if user.is_student:
			try:
				student = Student.objects.get(user=user)
				return ExamFinished.objects.filter(student=student, exam=self).exists()
			except:
				return False
		else :
			return False

	@require_auth
	def resolve_student_attempts(self, info):
		user = info.context.user 
		if user.is_student():
			try:
				return StudentAttempt.objects.filter(exam=self, student=user.student).count()
			except Exception as e:
				raise GraphQLError(e)
		else:
			return 0
