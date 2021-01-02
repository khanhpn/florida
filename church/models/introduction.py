from django.db import models


class Introduction(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=90000)
    youtube_url = models.TextField(max_length=90000, null=True)
    address = models.TextField(max_length=90000, null=True)
    email = models.TextField(max_length=90000, null=True)
    phone = models.TextField(max_length=90000, null=True)
    office_hours = models.TextField(max_length=90000, null=True)
    logo = models.FileField(upload_to='uploads/%Y/%m/%d/', max_length=100)
    created_at = models.DateTimeField(auto_now_add=False)
    updated_at = models.DateTimeField(auto_now=False)

    def __str__(self):
        return self.title

    class Meta:
        app_label = 'church'
