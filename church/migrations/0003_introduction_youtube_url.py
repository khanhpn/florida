# Generated by Django 3.1.4 on 2021-01-02 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('church', '0002_introduction_date_created'),
    ]

    operations = [
        migrations.AddField(
            model_name='introduction',
            name='youtube_url',
            field=models.TextField(max_length=90000, null=True),
        ),
    ]
