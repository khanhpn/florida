from django.db import models


class Introduction(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=90000)
    youtube_url = models.TextField(max_length=90000, null=True)
    created_at = models.DateTimeField(auto_now_add=False)
    updated_at = models.DateTimeField(auto_now=False)

    def __str__(self):
        return self.title

    class Meta:
        app_label = 'church'
