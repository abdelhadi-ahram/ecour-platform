from django.db import models
from authentication.models import Teacher, Student
from authentication.models import Department


class Module(models.Model):
	name = models.CharField(max_length=150, unique=True)
	department = models.ForeignKey(Department, on_delete=models.CASCADE)

	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return "%s %s" %(self.name, self.department.name)


class Element(models.Model):
	module = models.ForeignKey(Module, on_delete=models.CASCADE)
	name = models.CharField(max_length=150, unique=True)
	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name+ " " + self.module.name


class Teaching(models.Model):
	teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
	element = models.ForeignKey(Element, on_delete=models.CASCADE)
	department = models.ForeignKey(Department, related_name="teachings", on_delete=models.CASCADE)

	def __str__(self):
		return "%s teaches %s" %(self.teacher, self.element.name)




class Section(models.Model):
	element = models.ForeignKey(Element, related_name="sections", on_delete=models.CASCADE)
	name = models.CharField(max_length=150)
	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name + " (" + self.element.name +")"




class Lecture(models.Model):
	section = models.ForeignKey(Section, related_name="lectures", on_delete=models.CASCADE)
	title = models.CharField(max_length=150)
	type = models.CharField(max_length=50)
	content = models.TextField(null=True)
	file = models.FileField(upload_to="lecture", null=True)
	#exam = models.ForeignKey()

	def __str__(self):
		return self.title



class Homework(models.Model):
	title = models.CharField(max_length=255)
	content = models.TextField(null=True)
	file = models.FileField(upload_to='homeworks/exercices', null=True)
	deadline = models.DateTimeField()
	section = models.ForeignKey(Section, related_name="homeworks", on_delete=models.CASCADE)

	def __str__(self):
		return str(self.id) + "-" +self.title[:10]


class StudentHomeworkAnswer(models.Model):
	student = models.ForeignKey(Student, related_name="student_homeworks", on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now=True)
	homework = models.ForeignKey(Homework, related_name="answers", on_delete=models.CASCADE)
	content = models.TextField(null=True)
	file = models.FileField(upload_to='homeworks/answers', null=True)

	def __str__(self):
		return "" + self.student + " " +self.homework