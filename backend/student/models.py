from django.db import models

from authentication.models import Student, Department
from department.models import Element, Lecture, Homework, Module

class Studying(models.Model):
	department = models.ForeignKey(Department, related_name="studyings", on_delete=models.CASCADE)
	module = models.ForeignKey(Module, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.student) + " in " + str(self.department)

class LectureFinished(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('student', 'lecture',)

	def __str__(self):
		return str(self.student) + " finished " + str(self.lecture)

class HomeworkFinished(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	homework = models.ForeignKey(Homework, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('student', 'homework',)

	def __str__(self):
		return str(self.student) + " finished " + str(self.homework)


class ElementLog(models.Model):
	student = models.ForeignKey(Student, related_name="accessed_lectures", on_delete=models.CASCADE)
	lecture = models.ForeignKey(Lecture, related_name="accessed_by", null=True, on_delete=models.CASCADE)
	homework = models.ForeignKey(Homework, related_name="accessed_by", null=True, on_delete=models.CASCADE)
	element = models.ForeignKey(Element, related_name="accessed_by", null=True, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)
