from django.db import models


class FacebookLinks(models.Model):
    title = models.TextField(max_length=90000, null=False)
    link_detail = models.TextField(max_length=90000, null=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'facebook_links'
