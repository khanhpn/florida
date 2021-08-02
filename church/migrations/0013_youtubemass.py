# Generated by Django 3.2.5 on 2021-07-31 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('church', '0012_introduction_copywrite'),
    ]

    operations = [
        migrations.CreateModel(
            name='YoutubeMass',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(max_length=900000, null=True)),
                ('url_detail', models.TextField(max_length=900000, null=True)),
                ('position', models.IntegerField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'youtube_mass',
            },
        ),
    ]