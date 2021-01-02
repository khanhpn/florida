from django.shortcuts import render
from django.http import HttpResponse
from .models import *

# Create your views here.


def home(request):
    introduction = Introduction.objects.last()
    return render(request, 'homepage/homepage.html', {'introduction': introduction})


def product(request):
    return render(request, 'homepage/product.html')
