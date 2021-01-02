from django.contrib import admin

# Register your models here.
from .models import Introduction
from .models import FacebookLink
from .models import PrayerAfterMass

admin.site.register(Introduction)
admin.site.register(FacebookLink)
admin.site.register(PrayerAfterMass)
