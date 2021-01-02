from django.contrib import admin

# Register your models here.
from .models import Introduction
from .models import FacebookLink

admin.site.register(Introduction)
admin.site.register(FacebookLink)
