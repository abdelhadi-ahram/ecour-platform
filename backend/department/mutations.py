
from graphene_file_upload.scalars import Upload
import graphene
from .models import Section, Teaching, Lecture
from authentication.models import Teacher

from graphql import GraphQLError

def getFileType(file):
	if file.endswith(("jpg","png", "jpeg")):
		return "image"
	elif file.endswith((".mp4",)):
		return "video"
	elif file/endswith('.pdf'):
		return "pdf"
	return "document"


#add Lecture
class AddLectureFile(graphene.Mutation):
	class Arguments:
		title = graphene.String(required=True)
		description = graphene.String(required=False)
		file = Upload(required=True)
		sec = graphene.ID()

	success = graphene.Boolean()

	@classmethod
	def mutate(self, info, title, description, file, sec):
		user = info.context.user
		if user is not None:
			try:
				section = Section.objects.get(pk=sec)
			except:
				raise GraphQLError("The given section is not valid")

			try:
				teacher = Teacher.objects.get(user=user)
				is_valid = Teaching.objects.get(teacher=teacher, section=section)
				if is_valid is not None:
					lecture = Lecture(section=section, title=title, content=description, type=getFileType(file), file=file)
					lecture.save()
					return AddLectureFile(success=True)
			except:
				raise GraphQLError("You don't have the right to perform this action")

		raise GraphQLError("You don't have the right to perform this action")


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
				raise GraphQLError("The given section is not valid")

			try:
				teacher = Teacher.objects.get(user=user)
				is_valid = Teaching.objects.get(teacher=teacher, module=section.element.module)
				lecture = Lecture(section=section, title=title, content=description, type="text")
				lecture.save()
				return AddLectureText(ok=True)

			except Teacher.DoesNotExist:
				raise GraphQLError("Only teachers are allowed to perform this action")

			except Teaching.DoesNotExist:
				raise GraphQLError("You don't have the right to perform this action")

			except Exception as e:
				raise GraphQLError(e)

		raise GraphQLError("You are not logged in")



class UpdateLecture(graphene.Mutation):
	pass
