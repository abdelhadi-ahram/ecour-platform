import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
from department.models import (Teaching, Module, Section, Lecture, Element, Homework, StudentHomeworkAnswer)

from graphql import GraphQLError
import json

from student.models import HomeworkFinished, LectureFinished, ElementLog, ExamFinished
from exam.models import QuestionType, Question, Choice, Exam, StudentAttempt, StudentQuestionAnswer
from authentication.hash import Hasher
from authentication.user_queries import require_auth, require_teacher
import math

from department.types import (
	TeachingType,
	DepartmentType,
	LectureType,
	HomeworkAnswerType,
	HomeworkType,
	SectionType,
	ElementType,
	ModuleType,
	CustomStudentType
)

from exam.types import (
	QuestionModelType,
	ExamType,
	ChoiceType,
	QuestionTypeType,
	AttemptType,
	StudentQuestionAnswerType
)

def makeJson(type, text):
	response = {
		"type" : type,
		"text" : text
	}
	return json.dumps(response)



class TeacherQueries(graphene.ObjectType):
	get_teachings = graphene.List(TeachingType)
	department = graphene.Field(DepartmentType)
	get_element_lectures = graphene.Field(ElementType, teaching_id = graphene.ID())
	section = graphene.Field(SectionType)
	lecture = graphene.Field(LectureType)
	module = graphene.Field(ModuleType)
	homework = graphene.Field(HomeworkType)
	exam = graphene.Field(ExamType)
	student = graphene.Field(CustomStudentType)
	choice = graphene.Field(ChoiceType)

	get_lecture_by_id = graphene.Field(LectureType, lecture_id=graphene.ID())
	get_homework_by_id = graphene.Field(HomeworkType, homework_id=graphene.ID())

	get_question_types = graphene.List(QuestionTypeType)

	get_exam_questions = graphene.List(QuestionModelType, exam_id=graphene.ID())

	get_exam_by_id = graphene.Field(ExamType, exam_id=graphene.ID())
	get_attempt_content = graphene.Field(AttemptType, attempt_id=graphene.ID())

	get_question_answer = graphene.Field(StudentQuestionAnswerType, question_id=graphene.ID(), attempt_id=graphene.ID())

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
				lecture = Lecture.objects.get(pk=lecture_id)
				element = lecture.section.element
				teacher = Teacher.objects.get(user=user)
				teaching = Teaching.objects.get(element=element, teacher=teacher)
				return lecture
			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))
			except Lecture.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You can not perform this operation"))
		else :
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))


	def resolve_get_homework_by_id(self, info, homework_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				homework = Homework.objects.get(pk=homework_id)
				element = homework.section.element
				teacher = Teacher.objects.get(user=user)
				teaching = Teaching.objects.get(element=element, teacher=teacher)
				return homework
			except StudentHomeworkAnswer.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The requested data does not exist"))
			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))
			except Homework.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You can not perform this operation"))
		else :
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))

	def resolve_get_question_types(self, info):
		return QuestionType.objects.all()

	@require_teacher
	def resolve_get_exam_questions(self, info, exam_id):
		teacher = info.context.user.teacher 
		try:
			decoded_id = Hasher.decode("exam", exam_id)
			exam = Exam.objects.get(pk=decoded_id)
			Teaching.objects.get(element=exam.section.element, teacher=teacher)
			return Question.objects.filter(exam=exam)
		except Exam.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
		except Teaching.DoesNotExist:
			raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))


	@require_teacher
	def resolve_get_exam_by_id(self, info, exam_id):
		teacher = info.context.user.teacher
		try:
			decoded_exam_id = Hasher.decode("exam", exam_id)
			exam = Exam.objects.get(pk=decoded_exam_id)
			Teaching.objects.get(element=exam.section.element, teacher=teacher)
			return exam
		except Exam.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
		except Teaching.DoesNotExist:
			raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))		


	@require_teacher
	def resolve_get_attempt_content(self, info, attempt_id):
		teacher = info.context.user.teacher
		try:
			decoded_attempt_id = Hasher.decode(teacher.user.cin, attempt_id)
			attempt = StudentAttempt.objects.get(id=decoded_attempt_id)
			Teaching.objects.get(element=attempt.exam.section.element, teacher=teacher)
			return attempt
		except StudentAttempt.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
		except Teaching.DoesNotExist:
			raise GraphQLError(makeJson("PERMISSION", "You don't have the permission to see this content"))	


	@require_teacher
	def resolve_get_question_answer(self, info, question_id, attempt_id):
		user = info.context.user
		decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
		decoded_question_id = Hasher.decode(user.cin, question_id)
		try:
			return StudentQuestionAnswer.objects.get(question__id=decoded_question_id, attempt__id=decoded_attempt_id) 
		except StudentQuestionAnswer.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR","The provided data is not valid"))
		except Exception as e:
			raise GraphQLError(e)


