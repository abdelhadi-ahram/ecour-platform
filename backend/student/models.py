from django.db import models

from authentication.models import Student
from department.models import Element, Lecture

class ElementLog(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	element = models.ForeignKey(Element, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)


class LectureLog():
	student = models.ForeignKey(Student, related_name="accessed_lectures")
	lecture = models.ForeignKey(Lecture, related_name="accessed_by", null=True)
	homework = models.ForeignKey(Homework, related_name="accessed_by", null=True)