import graphene
from graphene_django import DjangoObjectType
from authentication.models import Department, Teacher, Student
from department.models import (Teaching, Module, Section, Lecture, Element, Homework, StudentHomeworkAnswer)

from graphql import GraphQLError
import json

from student.models import HomeworkFinished, LectureFinished, ElementLog, ExamFinished
from exam.models import QuestionType, Question, Choice, Exam
from authentication.hash import Hasher
from authentication.user_queries import require_auth

class CustomStudentType(DjangoObjectType):
	class Meta:
		model = Student
	id = graphene.ID()
	full_name = graphene.String()
	cin = graphene.String()
	email = graphene.String()

	def resolve_full_name(self, info):
		return self.user.get_full_name()
	def resolve_cin(self, info):
		return self.user.cin
	def resolve_email(self, info):
		return self.user.email
	def resolve_id(self, info):
		return self.user.id

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

	seen = graphene.Int()
	accessed_by = graphene.List(CustomStudentType)

	def resolve_seen(self, info):
		if info.context.user.is_teacher():
			return ElementLog.objects.filter(lecture=self).count()
		return None

	@require_auth
	def resolve_accessed_by(self, info):
		if info.context.user.is_teacher():
			qr = ElementLog.objects.filter(lecture=self)
			students = []
			for q in qr:
				students.append(q.student)
			return set(students)
		return None

	is_finished = graphene.Boolean()
	def resolve_is_finished(self, info):
		try:
			if info.context.user.is_student():
				student = info.context.user.student
				return LectureFinished.objects.filter(lecture=self, student=student).exists()
			return False
		except :
			return False

class HomeworkAnswerType(DjangoObjectType):
	class Meta:
		model = StudentHomeworkAnswer
		fields = "__all__"

	created_at = graphene.String()
	def resolve_created_at(self, info):
		return self.created_at.strftime("%a, %m-%y %H:%M")

class HomeworkType(DjangoObjectType):
	class Meta:
		model = Homework 
		fields = "__all__"

	deadline_date = graphene.String()
	def resolve_deadline_date(self, info):
		return self.deadline.strftime("%Y-%m-%d")

	deadline_time = graphene.String()
	def resolve_deadline_time(self, info):
		return self.deadline.strftime("%H:%M")

	student_answers = graphene.List(HomeworkAnswerType)
	@require_auth
	def resolve_student_answers(self, info):
		if info.context.user.is_teacher():
			return StudentHomeworkAnswer.objects.filter(homework=self)
		return None

	is_finished = graphene.Boolean()
	def resolve_is_finished(self, info):
		try:
			if info.context.user.is_student():
				student = info.context.user.student
				return HomeworkFinished.objects.filter(homework=self, student=student).exists()
			return False
		except :
			return False


class SectionType(DjangoObjectType):
	class Meta:
		model = Section
		fields = ("id", "element", "name", "lectures", "homeworks", "exams")

class ElementType(DjangoObjectType):
	class Meta:
		model = Element
		fields = ("id", "module","name","sections")

	progress = graphene.Float()

	@require_auth
	def resolve_progress(self, info):
		if info.context.user.is_student():
			try:
				student = info.context.user.student
				elements = Lecture.objects.filter(section__element=self).count() + Homework.objects.filter(section__element=self).count()
				done = LectureFinished.objects.filter(lecture__section__element=self, student=student).count() + HomeworkFinished.objects.filter(homework__section__element=self, student=student).count()
				if(elements):
					return math.floor((done / elements) * 100)
				return 0
			except :
				return 0
		return 0

class ModuleType(DjangoObjectType):
	class Meta:
		model = Module
		fields = ("name", "department", "id", "elements")
