# Generated by Django 3.2.5 on 2021-08-01 06:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('church', '0015_auto_20210731_2343'),
    ]

    operations = [
        migrations.CreateModel(
            name='MassTime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(max_length=900000, null=True)),
                ('calendar_notices', models.TextField(max_length=900000, null=True)),
                ('special_notices', models.TextField(max_length=900000, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'mass_time',
            },
        ),
    ]
