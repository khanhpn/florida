# Generated by Django 3.1.4 on 2021-01-03 00:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('church', '0010_auto_20210102_1526'),
    ]

    operations = [
        migrations.AddField(
            model_name='introduction',
            name='facebook_url',
            field=models.TextField(max_length=90000, null=True),
        ),
    ]
