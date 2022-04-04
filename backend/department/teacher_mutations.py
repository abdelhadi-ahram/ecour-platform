
from graphene_file_upload.scalars import Upload
import graphene
from .models import Section, Teaching, Lecture, Element, Homework
from authentication.models import Teacher
from exam.models import Exam

from graphql import GraphQLError

import json
import datetime

def getFileType(file):
	if file.endswith(("jpg","png", "jpeg")):
		return "image"
	elif file.endswith((".mp4",)):
		return "video"
	elif file.endswith('.pdf'):
		return "pdf"
	return "document"


def makeJson(type, text):
	response = {
		"type" : type,
		"text" : text
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
			raise GraphQLError(makJson("LOGIN", "You are not logged in"))



class AddSection(graphene.Mutation):
	class Arguments:
		element_id = graphene.ID()
		name = graphene.String()

	ok = graphene.Boolean()

	def mutate(self, info, element_id, name):
		user = info.context.user
		if user.is_authenticated:
			try:
				teacher = Teacher.objects.get(user=user)
				element = Element.objects.get(id=element_id)
				if Teaching.objects.filter(teacher=teacher, element=element).exists():
					section = Section(element=element, name=name)
					section.save()
					return AddSection(ok=True)
				else:
					raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "Only teachers are allowed to perform this action"))
			except Exception as e:
				raise GraphQLError(e)
		else:
			raise GraphQLError(makJson("LOGIN", "You are not logged in"))



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
			raise GraphQLError(makJson("LOGIN", "You are not logged in"))


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
			raise GraphQLError(makJson("LOGIN", "You are not logged in"))



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
			raise GraphQLError(makJson("LOGIN", "You are not logged in"))


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
					return AddExam(id=exam.id)
				else:
					raise GraphQLError(makeJson("PERMISSION", "You do not have the right to perform this action"))
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION", "Only teachers are allowed to perform this action"))
			except Section.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR", "The provided data is not valid"))
			except Exception as e:
				raise GraphQLError(e)
		else:
			raise GraphQLError(makJson("LOGIN", "You are not logged in"))