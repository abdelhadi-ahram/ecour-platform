
from graphene_file_upload.scalars import Upload
import graphene
from department.models import Section, Teaching, Lecture, Element, Homework
from authentication.models import Teacher
from exam.models import (Exam, QuestionType, Choice, Question, StudentQuestionAnswer, StudentAttempt)

from graphql import GraphQLError
from authentication.hash import Hasher
from authentication.user_queries import require_teacher

import json
import datetime

def getFileType(file):
	if file.endswith(("jpg","png", "jpeg")):
		return "image"
	elif file.endswith((".mp4", "ogg", "webM")):
		return "video"
	elif file.endswith('.pdf'):
		return "pdf"
	return "document"


def makeJson(type, text):
	response = {
		"type" : type,
		"message" : text
	}
	return json.dumps(response)


#add Lecture
class AddLectureFile(graphene.Mutation):
	class Arguments:
		title = graphene.String(required=True)
		file = Upload(required=True)
		section_id = graphene.ID()

	ok = graphene.Boolean()

	def mutate(self, info, title, file, section_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				section = Section.objects.get(pk=section_id)
				teacher = Teacher.objects.get(user=user)
				is_valid = Teaching.objects.get(teacher=teacher, element=section.element)
				lecture = Lecture(section=section, title=title, content="", type="", file=file)

				lecture.type = getFileType(lecture.file.name)
				lecture.save()
				return AddLectureFile(ok=True)
			except Section.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR","The given section is not valid"))
			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You do do not have the permission"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You don't have the right to perform this action"))

		else:
			raise GraphQLError(makeJson("LOGIN","You are nt logged in"))


class AddLectureText(graphene.Mutation):
	class Arguments:
		title = graphene.String(required=True)
		content = graphene.String(required=True)
		section_id = graphene.ID()

	ok = graphene.Boolean()

	def mutate(self, info, title, content, section_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				section = Section.objects.get(pk=section_id)
			except:
				raise GraphQLError(makeJson("DATAERROR","The given section is not valid"))

			try:
				teacher = Teacher.objects.get(user=user)
				is_valid = Teaching.objects.get(teacher=teacher, element=section.element)
				lecture = Lecture(section=section, title=title, content=content, type="text")
				lecture.save()
				return AddLectureText(ok=True)

			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","Only teachers are allowed to perform this action"))

			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You don't have the right to perform this action"))

			except Exception as e:
				raise GraphQLError(e)

		raise GraphQLError(makeJson("LOGIN","You are not logged in"))



class UpdateLecture(graphene.Mutation):
	class Arguments:
		id = graphene.ID()
		title = graphene.String(required=False)
		content = graphene.String(required=False)
		file = Upload(required=False)
		section_id = graphene.ID(required=False)

	ok = graphene.Boolean()

	def mutate(self, info, id, title=None, content=None, file=None, section_id=None):
		user = info.context.user
		if user.is_authenticated:
			try:
				lecture = Lecture.objects.get(pk=id)
				teacher = Teacher.objects.get(user=user)
				is_valid = Teaching.objects.get(teacher=teacher, element=lecture.section.element)
				if title:
					lecture.title = title
				if content:
					lecture.content = content
				if file:
					lecture.file = file
					lecture.type = getFileType(lecture.file.name)
				if section_id:
					section = Section.objects.get(pk=section_id)
					lecture.section = section
				lecture.save()
				return UpdateLecture(ok=True)

			except Lecture.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR","The provided lecture is not valid"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You don't have the right to perform this action"))
			except :
				raise GraphQLError(makeJson("PERMISSION","You don't have the right to perform this action"))
		else:
			raise GraphQLError(makeJson("LOGIN","You are nt logged in"))


class DeleteLecture(graphene.Mutation):
	class Arguments:
		lecture_id = graphene.ID()

	ok = graphene.Boolean()

	def mutate(self, info, lecture_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				teacher = Teacher.objects.get(user=user)
				lecture = Lecture.objects.get(id=lecture_id)
				if Teaching.objects.filter(teacher=teacher, element=lecture.section.element).exists():
					lecture.delete()
					return DeleteLecture(ok=True)
				else:
					raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Lecture.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is nt valid"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "Only teachers are allowed to perform this action"))
			except Exception as e:
				raise GraphQLError(e)
		else:
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))



class AddSection(graphene.Mutation):
	class Arguments:
		teaching_id = graphene.ID()
		name = graphene.String()

	sectionId = graphene.ID()

	@require_teacher
	def mutate(self, info, teaching_id, name):
		teacher = info.context.user.teacher
		try:
			teaching = Teaching.objects.get(id=teaching_id)
			if teaching.teacher == teacher:
				section = Section(element=teaching.element, name=name)
				section.save()
				return AddSection(sectionId=section.id)
			raise GraphQLError(makeJson("PERMISSION", "You are not allowed to perform this action"))
		except Teaching.DoesNotExist:
			raise GraphQLError(makeJson("PERMISSION", "Only teachers are allowed to perform this action"))
		except Exception as e:
			raise GraphQLError(e)



class AddHomework(graphene.Mutation):
	class Arguments:
		section_id = graphene.ID()
		title = graphene.String()
		content = graphene.String(required=False)
		file = Upload(required=False)
		deadline = graphene.String()

	ok = graphene.Boolean()

	def mutate(self, info, title, deadline, section_id, content="", file=None):
		user = info.context.user
		if user.is_authenticated:
			try:
				teacher = Teacher.objects.get(user=user)
				section = Section.objects.get(id=section_id)
				if Teaching.objects.filter(teacher=teacher, element=section.element).exists():
					#endtime = datetime.datetime.strptime(deadline, "%y-%m-%d %H:%M")
					homework = Homework(title=title, content=content, deadline=deadline, file=file, section=section)
					homework.save()
					return AddHomework(ok=True)
				else:
					raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "Only teachers are allowed to perform this action"))
			except Section.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Exception as e:
				raise GraphQLError(e)
		else:
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))


class DeleteHomework(graphene.Mutation):
	class Arguments:
		homework_id = graphene.ID()

	ok = graphene.Boolean()

	def mutate(self, info, homework_id):
		user = info.context.user
		if user.is_authenticated:
			try:
				teacher = Teacher.objects.get(user=user)
				homework = Homework.objects.get(id=homework_id)
				if Teaching.objects.filter(teacher=teacher, element=homework.section.element).exists():
					homework.delete()
					return DeleteHomework(ok=True)
				else:
					raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Teacher.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Lecture.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is nt valid"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "Only teachers are allowed to perform this action"))
			except Exception as e:
				raise GraphQLError(e)
		else:
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))



class UpdateHomework(graphene.Mutation):
	class Arguments:
		homework_id = graphene.ID()
		title = graphene.String(required=False)
		content = graphene.String(required=False)
		file = Upload(required=False)
		deadline = graphene.String(required=False)

	ok = graphene.Boolean()

	def mutate(self, info, homework_id, title="", deadline="", content=None, file=None):
		user = info.context.user
		if user.is_authenticated:
			try:
				teacher = Teacher.objects.get(user=user)
				homework = Homework.objects.get(id=homework_id)
				if Teaching.objects.filter(teacher=teacher, element=homework.section.element).exists():
					if title:
						homework.title = title
					if deadline:
						homework.deadline = deadline
					if content:
						homework.content = content
					if file:
						homework.file = file 
					homework.save()
					return UpdateHomework(ok=True)
				else:
					raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "Only teachers are allowed to perform this action"))
			except Section.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Exception as e:
				raise GraphQLError(e)
		else:
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))


class AddExam(graphene.Mutation):
	class Arguments:
		title = graphene.String()
		description = graphene.String()
		starts_at = graphene.String()
		duration = graphene.String()
		attempts = graphene.Int()
		sequentiel = graphene.Boolean()
		section_id = graphene.ID()

	id = graphene.ID()

	def mutate(self, info, title, section_id, starts_at=None, duration=None, description=None, attempts=None, sequentiel=False):
		user = info.context.user
		if user.is_authenticated:
			try:
				teacher = Teacher.objects.get(user=user)
				section = Section.objects.get(id=section_id)
				if Teaching.objects.filter(teacher=teacher, element=section.element).exists():
					d = datetime.datetime.strptime(duration, "%H:%M")
					delta_duration = datetime.timedelta(hours=d.hour, minutes=d.minute)

					exam = Exam(title=title, description=description, starts_at=starts_at, duration=delta_duration, section=section, sequentiel=sequentiel, attempts=attempts)
					exam.save()
					encoded_id = Hasher.encode("exam", exam.id)
					return AddExam(id=encoded_id)
				else:
					raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "Only teachers are allowed to perform this action"))
			except Section.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Exception as e:
				raise GraphQLError(e)
		else:
			raise GraphQLError(makeJson("LOGIN", "You are not logged in"))



class AddQuestions(graphene.Mutation):
	class Arguments:
		exam_id = graphene.ID()
		exam_data = graphene.String()

	ok = graphene.Boolean() 

	@require_teacher
	def mutate(self, info, exam_id, exam_data):
		teacher = info.context.user.teacher
		try:
			decoded_exam_id = Hasher.decode("exam", exam_id)
			exam = Exam.objects.get(pk=decoded_exam_id)
			# check if the teacher is teaching this element
			Teaching.objects.get(teacher=teacher, element=exam.section.element)
			# convert the recieved data to a valid python object
			questions = json.loads(exam_data)
			# looping on the questions
			for question in questions:
				question_id = question.get("id", 0)
				type = QuestionType.objects.get(pk=int(question["type"]) )
				mark = question.get("mark", 1)
				choices = question.get("choices", [])
				content = json.dumps(question.get("content", []) )
				# check if the user did not provide choices
				if type.type != "Plain text" and len(choices) == 0:
					raise GraphQLError(makeJson("DATAERROR", "You must provide at least one choice"))
				else:
					# check if the user wants to update an existig question
					if question_id:
						decoded_question_id = Hasher.decode("question", question_id)
						print(decoded_question_id)
						question = Question.objects.get(pk=decoded_question_id)
						question.content = content if content else None
						question.mark = mark if mark else None
						question.type = type if type else None
					else:
						question = Question(content=content, mark=mark, type=type, exam=exam)
					question.save()
					for choice_ in choices:
						choice_id = choice_.get("id", 0)
						# check if the user wants to update an existing choice
						if choice_id:
							decoded_choice_id = Hasher.decode(teacher.user.cin, choice_id)
							choice = Choice.objects.get(pk=decoded_choice_id)
							choice.content = choice_.get("content")
							choice.is_correct = choice_.get("isCorrect", False)
						else:
							choice = Choice(question=question, content=choice_.get("content"), is_correct=choice_.get("isCorrect"))
						choice.save()
			return AddQuestions(ok=True)
		except Teacher.DoesNotExist:
			raise GraphQLError(makeJson("PERMISSION", "You do not have the permission to perform this action"))
		except Exam.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR", "The provided exam is not valid"))
		except Exam.DoesNotExist:
			raise GraphQLError(makeJson("PERMISSION", "You are not allowed to perform this action"))
		except Exception as e:
			raise GraphQLError(e)


class VerifyAnswer(graphene.Mutation):
	class Arguments:
		attempt_id = graphene.ID()
		question_id = graphene.ID()
		mark = graphene.Float()

	ok = graphene.Boolean()

	@require_teacher
	def mutate(self, info, mark, attempt_id, question_id):
		user = info.context.user 
		decoded_question_id = Hasher.decode(user.cin, question_id)
		decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
		try:
			user_question_answer = StudentQuestionAnswer.objects.get(question__id=decoded_question_id, attempt__id=decoded_attempt_id)
			user_question_answer.mark = float(mark)
			user_question_answer.save()
			print(mark)
			return VerifyAnswer(ok=True)
		except StudentQuestionAnswer.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
		except :
			raise GraphQLError(makeJson("ERROR", "Unexpected error"))

class VerifyAttempt(graphene.Mutation):
	class Arguments:
		attempt_id = graphene.ID()

	ok = graphene.Boolean()

	@require_teacher
	def mutate(self, info, attempt_id):
		user = info.context.user
		decoded_attempt_id = Hasher.decode(user.cin, attempt_id)
		try:
			user_attempt = StudentAttempt.objects.get(id=decoded_attempt_id)
			print(user_attempt.verify() )
			return VerifyAttempt(ok=True)
		except StudentAttempt.DoesNotExist:
			raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
		except Exception as e:
			raise GraphQLError(e)