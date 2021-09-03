from django.db import models


class Activity(models.Model):
    title = models.TextField(max_length=90000, null=False)
    file_upload = models.FileField(upload_to='uploads/%Y/%m/%d/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'activity'
        app_label = 'church'
        ordering = ('-created_at',)
