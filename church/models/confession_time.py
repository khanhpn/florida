from django.db import models
from tinymce.models import HTMLField


class ConfressionTime(models.Model):
    calendar_confression = HTMLField()
    content_confression = HTMLField()
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.content_confression

    class Meta:
        db_table = 'confression_time'
        app_label = 'church'
