import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import login, authenticate, logout
from authentication.models import User, Student, Teacher

from graphql import GraphQLError
import json

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


class UserQuery(graphene.ObjectType):
    authenticate_user = graphene.Field(UserType, email=graphene.String(), password=graphene.String())
    get_logged_user = graphene.Field(UserType)
    logout = graphene.Boolean()

    def resolve_authenticate_user(self, info, email, password):
        user = authenticate(email=email, password=password)
        if user is not None:
            login(info.context, user)
            return user
        raise GraphQLError("Email or password are incorrect pleaze try again")

    def resolve_get_logged_user(self, info):
        if info.context.user.is_authenticated:
            return info.context.user
        raise GraphQLError("You are not logged in")

    def resolve_logout(self, info):
        logout(info.context)
        return True

