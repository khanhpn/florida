from django.db import models


class MassTime(models.Model):
    title = models.TextField(max_length=900000, null=True)
    calendar_notices = models.TextField(max_length=900000, null=True)
    special_notices = models.TextField(max_length=900000, null=True)

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'mass_time'
        app_label = 'church'
