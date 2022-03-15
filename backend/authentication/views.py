from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from django.contrib.auth import login



def login_user(request):
	user = User.objects.get(pk=1)
	login(request, user)
	return HttpResponse("authentication is done successfully")