from django.db import models


class ConfressionTime(models.Model):
    calendar_confression = models.TextField(max_length=90000, null=True)
    content_confression = models.TextField(max_length=90000, null=True)
    content_adoration = models.TextField(max_length=90000, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.content_confression

    class Meta:
        db_table = 'confression_time'
        app_label = 'church'
