from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def home(request):
    return render(request, 'homepage/homepage.html')


def product(request):
    return render(request, 'homepage/product.html')
