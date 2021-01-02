from django.db import models

# Create your models here.


class Introduction(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=90000)
    youtube_url = models.TextField(max_length=90000, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.title
