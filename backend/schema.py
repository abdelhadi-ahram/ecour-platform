import graphene
from graphql import GraphQLError

from graphene_django import DjangoObjectType

from department.teacher_mutations import (
    AddLectureText,
    AddLectureFile, 
    UpdateLecture, 
    AddSection, 
    DeleteLecture,
    AddHomework,
    DeleteHomework,
    UpdateHomework,
    AddExam,
    AddQuestions
    )

from authentication.user_queries import UserQuery
from department.teacher_queries import TeacherQueries
from student.student_queries import StudentQueries
from student.student_mutations import AddHomeworkAnswer, ToggleLectureFinished, CreateAttempt


class Query(TeacherQueries, UserQuery, StudentQueries, graphene.ObjectType):
    pass



class Mutations(graphene.ObjectType):
    add_lecture_text = AddLectureText.Field()
    add_lecture_file = AddLectureFile.Field()
    update_lecture = UpdateLecture.Field()
    add_section = AddSection.Field()
    delete_lecture = DeleteLecture.Field()
    add_homework = AddHomework.Field()
    delete_homework = DeleteHomework.Field()
    add_homework_answer = AddHomeworkAnswer.Field()
    toggle_lecture_finished = ToggleLectureFinished.Field()
    update_homework = UpdateHomework.Field()
    add_exam = AddExam.Field()
    add_questions = AddQuestions.Field()
    create_attempt = CreateAttempt.Field()

schema = graphene.Schema(query=Query, mutation=Mutations)
