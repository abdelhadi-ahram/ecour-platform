from django.db import models
from authentication.models import Teacher, Student
from authentication.models import Department

from django.utils import timezone

class Module(models.Model):
	name = models.CharField(max_length=150, unique=True)
	department = models.ForeignKey(Department, related_name="modules", on_delete=models.CASCADE)

	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return "%s %s" %(self.name, self.department.name)

	class Meta:
		db_table = "module"


class Element(models.Model):
	module = models.ForeignKey(Module, related_name="elements", on_delete=models.CASCADE)
	name = models.CharField(max_length=150, unique=True)
	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name+ " " + self.module.name

	class Meta:
		db_table = "element"


class Teaching(models.Model):
	teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
	element = models.ForeignKey(Element, on_delete=models.CASCADE)
	department = models.ForeignKey(Department, related_name="teachings", on_delete=models.CASCADE)

	def __str__(self):
		return "%s teaches %s" %(self.teacher, self.element.name)

	class Meta:
		db_table = "teaching"




class Section(models.Model):
	element = models.ForeignKey(Element, related_name="sections", on_delete=models.CASCADE)
	name = models.CharField(max_length=150)
	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name + " (" + self.element.name +")"

	class Meta:
		db_table = "section"




class Lecture(models.Model):
	section = models.ForeignKey(Section, related_name="lectures", on_delete=models.CASCADE)
	title = models.CharField(max_length=150)
	type = models.CharField(max_length=50)
	content = models.TextField(null=True)
	file = models.FileField(upload_to="lecture", null=True)
	#exam = models.ForeignKey()

	def __str__(self):
		return self.title

	class Meta:
		db_table = "lecture"



class Homework(models.Model):
	title = models.CharField(max_length=255)
	content = models.TextField(null=True)
	file = models.FileField(upload_to='homeworks/exercices', null=True)
	deadline = models.DateTimeField()
	section = models.ForeignKey(Section, related_name="homeworks", on_delete=models.CASCADE)

	def __str__(self):
		return str(self.id) + "-" +self.title[:10]

	def is_open(self):
		return timezone.now() < self.deadline

	class Meta:
		db_table = "homework"


class StudentHomeworkAnswer(models.Model):
	student = models.ForeignKey(Student, related_name="student_homeworks", on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)
	homework = models.ForeignKey(Homework, related_name="answers", on_delete=models.CASCADE)
	content = models.TextField(null=True)
	file = models.FileField(upload_to='homeworks/answers', null=True)

	def __str__(self):
		return "" + str(self.student) + " " + str(self.homework)

	class Meta:
		db_table = "student_homework_answer"