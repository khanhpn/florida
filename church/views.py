from django.shortcuts import render
from django.http import HttpResponse
from .models import *


def home(request):
    introduction = Introduction.objects.last()
    facebook_links = FacebookLink.objects.all()[:6]

    context = {'introduction': introduction, 'facebook_links': facebook_links}
    return render(request, 'homepage/homepage.html', context)


def product(request):
    return render(request, 'homepage/product.html')
