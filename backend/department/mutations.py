
from graphene_file_upload.scalars import Upload
import graphene
from .models import Section, Teaching, Lecture
from authentication.models import Teacher

from graphql import GraphQLError

import json

def getFileType(file):
	if file.endswith(("jpg","png", "jpeg")):
		return "image"
	elif file.endswith((".mp4",)):
		return "video"
	elif file/endswith('.pdf'):
		return "pdf"
	return "document"


def makJson(type, text):
	response = {
		"type" : type,
		"text" : "text"
	}
	return json.dumps(response)


#add Lecture
class AddLectureFile(graphene.Mutation):
	class Arguments:
		title = graphene.String(required=True)
		description = graphene.String(required=False)
		file = Upload(required=True)
		sec = graphene.ID()

	success = graphene.Boolean()

	@classmethod
	def mutate(self, info, title, description="", file, sec):
		user = info.context.user
		if user is not None:
			try:
				section = Section.objects.get(pk=sec)
			except:
				raise GraphQLError(makeJson("DATAERROR", "The given section is not valid"))

			try:
				teacher = Teacher.objects.get(user=user)
				is_valid = Teaching.objects.get(teacher=teacher, element=element)
				if is_valid is not None:
					lecture = Lecture(section=section, title=title, content=description, type=getFileType(file), file=file)
					lecture.save()
					return AddLectureFile(success=True)
			except:
				raise GraphQLError(makeJson("PERMISSION","You don't have the right to perform this action"))

		raise GraphQLError(makeJson("LOGIN","You are nt logged in"))


class AddLectureText(graphene.Mutation):
	class Arguments:
		title = graphene.String(required=True)
		description = graphene.String(required=True)
		sec = graphene.ID()

	ok = graphene.Boolean()

	def mutate(self, info, title, description, sec):
		user = info.context.user
		if user is not None:
			try:
				section = Section.objects.get(pk=sec)
			except:
				raise GraphQLError(makeJson("DATAERROR","The given section is not valid"))

			try:
				teacher = Teacher.objects.get(user=user)
				is_valid = Teaching.objects.get(teacher=teacher, element=section.element)
				lecture = Lecture(section=section, title=title, content=description, type="text")
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
		description = graphene.String(required=False)
		file = Upload(required=False)
		sec = graphene.ID(required=False)

	ok = graphene.Boolean()

	def mutate(self, info, id, title=None, description=None, file=None, sec=None):
		user = info.context.user
		if user.is_authenticate:
			try:
				lecture = Lecture.objects.get(pk=id)
				is_valid = Teaching.objects.get(teacher=user, lecture.section.element)
				if is_valid:
					if title:
						lecture.title = title
					if description:
						lecture.cntent = description
					if file:
						lecture.file = file
					if sec:
						lecture.section = sec
					lecture.save()
					return UpdateLecture(ok=True)
				else :
					raise Exception(makeJson("PERMISSION", "You are not allowed to perform this action"))
			except Lecture.DoesNotExist:
				raise GraphQLError(makeJson("DATAERROR","The provided lecture is not valid")
			except Teaching.DoesNotExist:
				raise GraphQLError(makeJson("PERMISSION","You don't have the right to perform this action")


class AddSection(graphene.Mutation):
	class Arguments:
		_element = graphene.ID()
		name = graphene.String()

	ok = graphene.Boolean()

	def mutate(self, info, _element, name):
		pass
