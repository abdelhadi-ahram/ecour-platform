 
import graphene
from graphene_django import DjangoObjectType
from django.core import serializers

from exam.models import (
		Exam, 
		StudentAttempt,
		Question, 
		QuestionType,
		StudentQuestionAnswer, 
		StudentPickedChoice, 
		Choice
	)
from department.types import CustomStudentType
from graphql import GraphQLError
import json
from django.utils import timezone
from django.db.models import Sum
from authentication.user_queries import require_auth, require_teacher

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
		exclude = ("is_correct", "content", "mark", "id")

	id = graphene.ID()
	@require_auth
	def resolve_id(self, info):
		encoded_id = Hasher.encode(info.context.user.cin, self.id)
		return encoded_id


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

	@require_teacher
	def resolve_is_correct(self, info):
		return self.is_correct 


class StudentQuestionAnswerType(DjangoObjectType):
	class Meta:
		model =StudentQuestionAnswer

	content = graphene.String()
	answer = graphene.String()
	type = graphene.String()
	mark = graphene.Float()

	@require_teacher
	def resolve_content(self, info):
		return self.question.content
	def resolve_type(self, info):
		return self.question.type.type

	def resolve_mark(self, info):
		return self.question.mark

	@require_teacher
	def resolve_answer(self, info):
		user = info.context.user
		if(self.question.type.type == "Plain text"):
			return self.content
		picked_answers = self.picked_choices.all()
		choices = Choice.objects.filter(question=self.question)
		answers = []
		for choice in choices:
			answer = {}
			answer["content"] = choice.content 
			answer["id"] = Hasher.encode(user.cin, choice.id)
			answer["isPicked"] = False
			answer["isCorrect"] = choice.is_correct
			if picked_answers.filter(choice__id=choice.id).exists():
				answer["isPicked"] = True
			answers.append(answer)
		return json.dumps(answers)

class AttemptType(DjangoObjectType):
	class Meta:
		model = StudentAttempt
		fields = ("exam", "is_verified")

	mark = graphene.Float()
	questions = graphene.List(QuestionsIDsType)
	left_time = graphene.Int()
	sequentiel = graphene.Boolean() 
	created_at = graphene.String()
	student = graphene.Field(CustomStudentType)
	id = graphene.ID()
	student_answers = graphene.List(StudentQuestionAnswerType)
	total_marks = graphene.Float()

	@require_auth
	def resolve_total_marks(self, info):
		return self.exam.get_total_marks()
	@require_teacher
	def student_answers(self, info):
		return self.answers.all()
	@require_auth
	def resolve_id(self, info):
		encoded_id = Hasher.encode(info.context.user.cin, self.id)
		return encoded_id
	def resolve_created_at(self,info):
		return self.created_at.strftime("%Y-%m-%d %H:%M")

	@require_auth
	def resolve_mark(self, info):
		if self.is_verified:
			return self.mark 
		return None
	@require_auth
	def resolve_questions(self, info):
		exam = self.exam
		questions = list(Question.objects.filter(exam=exam) )
		if info.context.user.is_student():
			if self.exam.is_open() and StudentAttempt.objects.filter(exam=self.exam).count() <= self.exam.attempts:
				shuffle(questions)
				return questions
		else:
			return questions
		raise GraphQLError(makeJson("PERMISSION", "You do not have the right to access this attempt"))

	def resolve_left_time(self, info):
		return self.exam.get_left_time()

	def resolve_sequentiel(self, info):
		return self.exam.sequentiel

	@require_teacher
	def resolve_student(self,info):
		return self.student


class QuestionTypeType(DjangoObjectType):
	class Meta:
		model = QuestionType
		fields = ("id", "type")

class QuestionModelType(DjangoObjectType):
	class Meta:
		model = Question 
		fields = ("type", "mark")

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
	attempts = graphene.List(AttemptType)

	#For students
	id = graphene.ID()
	message = graphene.String()
	is_open = graphene.Boolean()
	is_finished = graphene.Boolean()
	student_attempts_count = graphene.Int()

	students_attempts = graphene.List(AttemptType)
	
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
		if info.context.user.is_student():
			try:
				student = info.context.user.student
				if StudentAttempt.objects.filter(student=student, exam=self).count() < self.attempts:
					return self.is_open()
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
	def resolve_student_attempts_count(self, info):
		user = info.context.user 
		if user.is_student():
			try:
				return StudentAttempt.objects.filter(exam=self, student=user.student).count()
			except Exception as e:
				raise GraphQLError(e)
		else:
			return 0

	@require_auth
	def resolve_attempts(self, info):
		user = info.context.user 
		if user.is_student():
			try:
				return StudentAttempt.objects.filter(student=user.student, exam=self)
			except :
				return []
		else :
			return None

	@require_teacher
	def resolve_students_attempts(self, info):
		teacher = info.context.user.teacher
		try:
			exam = self.exam
			Teaching.objects.get(element=exam.section.element, teacher=teacher)
			attempts = StudentAttempt.objects.filter(exam=exam)
			return attempts
		except Teaching.DoesNotExist:
			raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))
		except Exam.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))


