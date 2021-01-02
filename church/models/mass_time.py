from django.db import models


class VideMisa(models.Model):
    title = models.TextField(max_length=900000, null=True)
    url_detail = models.TextField(max_length=900000, null=True)
    position = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'video_misa'
        app_label = 'church'
