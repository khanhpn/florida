from django.db import models


class FacebookLink(models.Model):
    title = models.TextField(max_length=90000, null=False)
    link_detail = models.TextField(max_length=90000, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'facebook_link'
        app_label = 'church'
        ordering = ('-created_at',)
