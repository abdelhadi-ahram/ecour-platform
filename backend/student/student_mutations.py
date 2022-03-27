from graphene_file_upload.scalars import Upload
from department.models import StudentHomeworkAnswer, Section, Lecture, Element, Homework
import graphene
from authentication.models import Student
from .models import Studying

from graphql import GraphQLError

import json

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