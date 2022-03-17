import graphene
from authentication.models import User, Student, Teacher
from django.contrib.auth import login, authenticate
from graphql import GraphQLError

from graphene_django import DjangoObjectType

from department.mutations import AddLectureText, AddLectureFile, UpdateLecture, AddSection
from department.queries import TeacherQueries



class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("first_name", "cin")

    role = graphene.String()

    def resolve_role(self, info):
        if Student.objects.filter(user=self).exists():
            return "student"
        elif Teacher.objects.filter(user=self).exists():
            return "teacher"
        return "None"




class Query(TeacherQueries, graphene.ObjectType):
    authenticate_user = graphene.Field(UserType, email=graphene.String(), password=graphene.String())
    get_logged_user = graphene.String()

    def resolve_authenticate_user(self, info, email, password):
        user = authenticate(email=email, password=password)
        if user is not None:
            login(info.context, user)
            return user
        raise GraphQLError("Email or password are incorrect pleaze try again")

    def resolve_get_logged_user(self, info):
        #if info.context.user.is_authenticated:
            #return info.context.user.get_full_name()
        #raise GraphQLError("You must be logged in to see this content")
        return "Hello joe"



class Mutations(graphene.ObjectType):
    add_lecture_text = AddLectureText.Field()
    add_lecture_file = AddLectureFile.Field()
    update_lecture = UpdateLecture.Field()
    add_section = AddSection.Field()

schema = graphene.Schema(query=Query, mutation=Mutations)
