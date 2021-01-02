from django.db import models


class PrayerAfterMass(models.Model):
    title = models.TextField(max_length=900000, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'prayer_after_mass'
        app_label = 'church'
