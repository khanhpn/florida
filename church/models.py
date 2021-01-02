from django.db import models

# Create your models here.


class Introduction(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=90000)
