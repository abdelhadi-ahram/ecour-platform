from django.contrib import admin

from .models import Exam 
from .models import QuestionType

admin.site.register(Exam)
admin.site.register(QuestionType)