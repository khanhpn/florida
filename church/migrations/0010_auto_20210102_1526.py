# Generated by Django 3.1.4 on 2021-01-02 15:26

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('church', '0009_videmisa'),
    ]

    operations = [
        migrations.AddField(
            model_name='introduction',
            name='address',
            field=models.TextField(max_length=90000, null=True),
        ),
        migrations.AddField(
            model_name='introduction',
            name='email',
            field=models.TextField(max_length=90000, null=True),
        ),
        migrations.AddField(
            model_name='introduction',
            name='logo',
            field=models.FileField(default=django.utils.timezone.now, upload_to='uploads/%Y/%m/%d/'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='introduction',
            name='office_hours',
            field=models.TextField(max_length=90000, null=True),
        ),
        migrations.AddField(
            model_name='introduction',
            name='phone',
            field=models.TextField(max_length=90000, null=True),
        ),
    ]
