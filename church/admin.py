from django.contrib import admin

# Register your models here.
from .models import Introduction
from .models import FacebookLink
from .models import PrayerAfterMass
from .models import YoutubeMass
from .models import ConfressionTime
from .models import MassTime
from .models import LinkedChurch

admin.site.register(Introduction)
admin.site.register(FacebookLink)
admin.site.register(PrayerAfterMass)
admin.site.register(YoutubeMass)
admin.site.register(ConfressionTime)
admin.site.register(MassTime)
admin.site.register(LinkedChurch)
