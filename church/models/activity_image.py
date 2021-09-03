from django.db import models


class ActivityImage(models.Model):
    title = models.TextField(max_length=90000, null=False)
    file_upload = models.FileField(upload_to='uploads/%Y/%m/%d/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'activity_image'
        app_label = 'church'
        ordering = ('-created_at',)
