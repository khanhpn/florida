from django.shortcuts import render
from django.http import HttpResponse
from .models import *


def home(request):
    introduction = Introduction.objects.last()
    facebook_links = FacebookLink.objects.all()[:6]
    prayer = PrayerAfterMass.objects.last()
    youtube_mass = YoutubeMass.objects.all()[:6]
    confression_time = ConfressionTime.objects.last()
    mass_time = MassTime.objects.last()

    context = {
        'introduction': introduction,
        'facebook_links': facebook_links,
        'prayer': prayer,
        'youtube_mass': youtube_mass,
        'confression_time': confression_time,
        'mass_time': mass_time
    }
    return render(request, 'homepage/homepage.html', context)


def product(request):
    return render(request, 'homepage/product.html')
