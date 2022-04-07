from django.db import models
from department.models import Section
from django.utils import timezone

from authentication.models import Student

class Exam(models.Model):
	title = models.CharField(max_length=255)
	description = models.TextField(null=True)
	starts_at = models.DateTimeField(null=True)
	duration = models.DurationField(null=True)
	sequentiel = models.BooleanField(default=False)
	attempts = models.IntegerField(null=True)
	section = models.ForeignKey(Section, related_name="exams", on_delete=models.CASCADE)

	class Meta:
		db_table = "exam"

	def __str__(self):
		return self.title

	def get_left_time(self):
		ends_at = self.starts_at + self.duration 
		left_time = ends_at - timezone.now()
		return left_time.total_seconds()

class QuestionType(models.Model):
	type = models.CharField(max_length=25)

	def __str__(self):
		return self.type

	class Meta:
		db_table = "question_type"


class Question(models.Model):
	content = models.TextField()
	exam = models.ForeignKey(Exam, related_name="questions", on_delete=models.CASCADE)
	type = models.ForeignKey(QuestionType, on_delete=models.CASCADE)
	mark = models.FloatField()

	def __str__(self):
		return self.content

	class Meta:
		db_table = "question"


class Choice(models.Model):
	question = models.ForeignKey(Question, related_name="choices", on_delete=models.CASCADE)
	content = models.TextField()
	is_correct = models.BooleanField(null=True)
	class Meta:
		db_table = "choice"


class StudentAttempt(models.Model):
	student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="exam_attempts")
	exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="student_attempts")
	created_at = models.DateTimeField(auto_now=True)
	finished_at = models.DateTimeField(null=True)
	mark = models.FloatField(null=True)
	class Meta:
		db_table = "student_attempt"

class StudentQuestion(models.Model):
	student_attempt = models.ForeignKey(StudentAttempt, related_name="answers", on_delete=models.CASCADE)
	question = models.ForeignKey(Question, on_delete=models.CASCADE)
	content = models.TextField(null=True)
	class Meta:
		db_table = "student_question"

class StudentAnswer(models.Model):
	student_question = models.ForeignKey(StudentQuestion, on_delete=models.CASCADE, related_name="answers")
	choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
	content = models.TextField(null=True)

	class Meta:
		db_table = "student_answer"
