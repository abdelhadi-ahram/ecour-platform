from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.utils import timezone
from .manager import CustomUserManager

# from department.models import Department 


class User(AbstractBaseUser):
	GENDER_CHOICES = [
		("M", "male"),
		("F", "female")
	]

	email = models.EmailField(max_length=40, unique=True)
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	cin = models.CharField(max_length=10, unique=True)
	phone = models.CharField(max_length=14)
	adress = models.CharField(max_length=100)
	gender = models.CharField(max_length=1, choices=GENDER_CHOICES)

	is_admin = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)
	date_joined = models.DateTimeField(default=timezone.now)

	created_at = models.DateTimeField(auto_now=True)

	objects = CustomUserManager()

	USERNAME_FIELD = "email"
	REQUIRED_FIELDS = ["cin"]

	def __str__(self):
		return self.get_full_name()

	def has_module_perms(self, app_label):
		return True

	def has_perm(self, perm, obj=None):
		return True

	@property
	def is_authenticated(self):
		return True

	@property
	def is_staff(self):
		return self.is_admin

	def get_full_name(self):
		return ('%s %s') % (self.first_name, self.last_name)

	def get_short_name(self):
		return self.first_name


class Teacher(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

	def __str__(self):
		str = self.user.get_full_name()
		return str


class Department(models.Model):
	name = models.CharField(max_length=150, unique=True)
	responsible = models.ForeignKey(Teacher, on_delete=models.CASCADE)

	created_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name 

class Student(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
	department = models.ForeignKey(Department, on_delete=models.CASCADE)

	def __str__(self):
		return self.user.get_full_name()
