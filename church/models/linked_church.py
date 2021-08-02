from django.db import models


class LinkedChurch(models.Model):
    title = models.TextField(max_length=900000, null=True)
    logo = models.FileField(upload_to='uploads/%Y/%m/%d/')
    church_url = models.TextField(max_length=90000, null=True)

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'linked_church'
        app_label = 'church'
