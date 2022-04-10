from django.db import models

from authentication.models import Student, Department
from department.models import Element, Lecture, Homework, Module

from  exam.models import Exam

class Studying(models.Model):
	department = models.ForeignKey(Department, related_name="studyings", on_delete=models.CASCADE)
	module = models.ForeignKey(Module, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return str(self.module) + " in " + str(self.department)

	class Meta:
		db_table = "study_in"

class LectureFinished(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('student', 'lecture',)

	def __str__(self):
		return str(self.student) + " finished " + str(self.lecture)

	class Meta:
		db_table = "lecture_finished"

class HomeworkFinished(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	homework = models.ForeignKey(Homework, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('student', 'homework',)

	def __str__(self):
		return str(self.student) + " finished " + str(self.homework)

	class Meta:
		db_table = "homework_finished"


class ExamFinished(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE)
	exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('student', 'exam',)

	def __str__(self):
		return str(self.student) + " finished " + str(self.exam)

	class Meta:
		db_table = "exam_finished"


class ElementLog(models.Model):
	student = models.ForeignKey(Student, related_name="accessed_lectures", on_delete=models.CASCADE)
	lecture = models.ForeignKey(Lecture, related_name="accessed_by", null=True, on_delete=models.CASCADE)
	homework = models.ForeignKey(Homework, related_name="accessed_by", null=True, on_delete=models.CASCADE)
	element = models.ForeignKey(Element, related_name="accessed_by", null=True, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = "element_log"
		ordering = ('-created_at', )
