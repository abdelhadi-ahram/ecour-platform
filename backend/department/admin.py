from django.contrib import admin
from .models import Module,Teaching,Element,Section,Lecture, StudentHomeworkAnswer, Homework


admin.site.register(Module)
admin.site.register(Teaching)
admin.site.register(Element)
admin.site.register(Section)
admin.site.register(Lecture)
admin.site.register(Homework)
admin.site.register(StudentHomeworkAnswer)
