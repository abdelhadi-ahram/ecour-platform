from django.contrib import admin

from .models import Exam, QuestionType, Question, Choice , StudentAttempt

admin.site.register(Exam)
admin.site.register(QuestionType)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(StudentAttempt)