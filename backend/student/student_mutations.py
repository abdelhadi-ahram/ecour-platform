from graphene_file_upload.scalars import Upload
from department.models import StudentHomeworkAnswer, Section, Lecture, Element, Homework
import graphene
from authentication.models import Student
from .models import Studying, LectureFinished, HomeworkFinished, ExamFinished

from exam.models import (
	Exam,
	Question,
	StudentAttempt,
	StudentQuestionAnswer,
	StudentPickedChoice,
	Choice
 )

from graphql import GraphQLError
from .student_queries import makeJson

from authentication.hash import Hasher
from authentication.user_queries import require_auth, require_student

import json
import datetime

class AddHomeworkAnswer(graphene.Mutation):
	class Arguments:
		homework_id = graphene.ID()
		content = graphene.String(required=False)
		file = Upload(required=False)

	ok = graphene.Boolean()

	def mutate(self, info, homework_id, content="", file=None):
		user = info.context.user
		if user.is_authenticated:
			try:
				homework = Homework.objects.get(pk=homework_id)
				student = Student.objects.get(user=user)
				is_valid = Studying.objects.get(department=student.department, module=homework.section.element.module)

				homework_answer = StudentHomeworkAnswer(homework=homework, student=student, content=content, file=file)
				homework_answer.save()

				return AddHomeworkAnswer(ok=True)
			except Homework.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR","The given section is not valid"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You do do not have the permission"))
			except Studying.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You don't have the right to perform this action"))

		else:
			raise GraphQLError(makeJson("LOGIN","You are nt logged in"))


class ToggleLectureFinished(graphene.Mutation):
	class Arguments:
		lecture_id = graphene.ID(required=False)
		homework_id = graphene.ID(required=False)
		exam_id = graphene.ID(required=False)

	ok = graphene.Boolean()

	@staticmethod
	def toggle_lecture_finished(student, lecture):
		try:
			lecture = LectureFinished.objects.get(student=student, lecture=lecture)
			lecture.delete()
		except LectureFinished.DoesNotExist:
			lecture = LectureFinished(student=student, lecture=lecture).save()

	@staticmethod
	def toggle_homework_finished(student, homework):
		try:
			homework = HomeworkFinished.objects.get(student=student, homework=homework)
			homework.delete()
		except HomeworkFinished.DoesNotExist:
			homework = HomeworkFinished(student=student, homework=homework).save()

	@staticmethod
	def toggle_exam_finished(student, exam):
		try:
			exam = ExamFinished.objects.get(student=student, exam=exam)
			exam.delete()
		except ExamFinished.DoesNotExist:
			exam = ExamFinished(student=student, exam=exam).save()

	def mutate(self, info, lecture_id=None, homework_id=None, exam_id=None):
		user = info.context.user
		if user.is_authenticated:
			try:
				student = Student.objects.get(user=user)
				
				if lecture_id:
					lecture = Lecture.objects.get(pk=lecture_id)
					ToggleLectureFinished.toggle_lecture_finished(student, lecture)
					return ToggleLectureFinished(ok=True)

				if homework_id:
					homework = Homework.objects.get(pk=homework_id)
					ToggleLectureFinished.toggle_homework_finished(student, homework)
					return ToggleLectureFinished(ok=True)

				if exam_id:
					exam = Exam.objects.get(pk=exam_id)
					ToggleLectureFinished.toggle_exam_finished(student, exam)
					return ToggleLectureFinished(ok=True)

			except Homework.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR","The given homework is not valid"))
			except Lecture.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR","The given lecture is not valid"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You do do not have the permission"))

		else:
			raise GraphQLError(makeJson("LOGIN","You are nt logged in"))


class CreateAttempt(graphene.Mutation):
	class Arguments:
		exam_id = graphene.ID()
	
	attempt_id = graphene.ID()

	def mutate(self, info, exam_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				decoded_id = Hasher.decode("exam", exam_id)
				exam = Exam.objects.get(pk=decoded_id)
				student = Student.objects.get(user=user)
				Studying.objects.get(department=student.department, module=exam.section.element.module)
				#check if a user has valid attempt
				student_attempts = StudentAttempt.objects.filter(student=student, exam=exam).count()
				if student_attempts < exam.attempts:
					attempt = StudentAttempt(student=student, exam=exam)
					attempt.save()
					attempt_id = Hasher.encode(user.cin, attempt.id)
					return CreateAttempt(attempt_id=attempt_id)
				raise GraphQLError(makeJson("PERMISSION","You do not have the permission for an attempt"))
			except Exam.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR","The given section is not valid"))
			except Student.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You do do not have the permission"))
			except Studying.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You don't have the right to perform this action"))

		else:
			raise GraphQLError(makeJson("LOGIN","You are nt logged in"))


class SaveStudentAnswer(graphene.Mutation):
	class Arguments:
		attempt_id = graphene.ID()
		question_id = graphene.ID()
		content = graphene.String() 

	ok = graphene.Boolean()
	# next_question = graphene.String()

	@require_auth
	def mutate(self, info, attempt_id, question_id, content):
		user = info.context.user 
		if user.is_student():
			try:
				# we get the question and the student attempt from the database
				decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
				attempt = StudentAttempt.objects.get(pk=decoded_attempt_id)
				decoded_question_id = Hasher.decode(user.cin, question_id)
				question = Question.objects.get(pk=decoded_question_id)

				# check if the user has not already answered this question before 
				# if it is a sequentiel exam
				if not StudentQuestionAnswer.objects.filter(attempt=attempt, question=question).exists() :
					student_question = StudentQuestionAnswer(attempt=attempt, question=question)
					student_question.save()
					# if the type of the exam is not plain text 
					# then we will loop on answers and register them in the database
					if question.type.type != "Plain text":
						answers = json.loads(content)
						# if the question is a single question then we must make sure that we only store on choice
						if question.type.type != "Single choice" and len(answers) > 1:
							return SaveStudentAnswer(ok=True)
						for answer in answers:
							decoded_choice_id = Hasher.decode(user.cin, answer)
							choice = Choice.objects.get(pk=decoded_choice_id)
							spc = StudentPickedChoice(student_question=student_question, choice=choice)
							spc.save()
						return SaveStudentAnswer(ok=True)
					# if the question type is plain text then we will add the content to the question
					else:
						student_question.content = content
						student_question.save()
						return SaveStudentAnswer(ok=True)

				else :
					if attempt.exam.sequentiel:
						raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this avtion"))
					student_question = StudentQuestionAnswer.objects.get(attempt=attempt, question=question)
					if question.type.type != "Plain text":
						answers = json.loads(content)
						# if the question is a single question then we must make sure that we only store on choice
						if question.type.type != "Single choice" and len(answers) > 1:
							return SaveStudentAnswer(ok=False)
						# delete picked question if exists
						if(len(answers) > 0):
							StudentPickedChoice.objects.get(student_question=student_question).delete()
						for answer in answers:
							decoded_choice_id = Hasher.decode(user.cin, answer)
							choice = Choice.objects.get(pk=decoded_choice_id)
							spc = StudentPickedChoice(student_question=student_question, choice=choice)
							spc.save()
						return SaveStudentAnswer(ok=True)
					# if the question type is plain text then we will add the content to the question
					elif content:
						student_question.content = content
						student_question.save()
						return SaveStudentAnswer(ok=True)
				return SaveStudentAnswer(ok=False)

			except StudentAttempt.DoesNotExist:
				raise GraphQLError("Student attempt does not exists")
			except Exception as e:
				# raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
				raise GraphQLError(e)
		raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to perform this action"))


class ReportExam(graphene.Mutation):
	class Arguments:
		attempt_id = graphene.ID() 

	ok = graphene.ID()

	@require_student
	def mutate(self, info, attempt_id):
		decoded_attempt_id = Hasher.decode(info.context.user.cin, attempt_id)
		try:
			attempt = StudentAttempt.objects.get(id=decoded_attempt_id)
			attempt.is_reported = True 
			attempt.finsished_at = datetime.datetime.now()
			attempt.save()
			return ReportExam(ok=True)
		except:
			return ReportExam(ok=False)

class FinishExam(graphene.Mutation):
	class Arguments:
		attempt_id = graphene.ID() 

	ok = graphene.ID()

	@require_student
	def mutate(self, info, attempt_id):
		decoded_attempt_id = Hasher.decode(info.context.user.cin, attempt_id)
		try:
			attempt = StudentAttempt.objects.get(id=decoded_attempt_id)
			attempt.is_reported = False 
			attempt.finsished_at = datetime.datetime.now()
			attempt.save()
			return FinishExam(ok=True)
		except:
			return FinishExam(ok=False)
