# Generated by Django 3.1.4 on 2021-01-02 08:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('church', '0004_facebooklinks'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='FacebookLinks',
            new_name='FacebookLink',
        ),
        migrations.AlterModelTable(
            name='facebooklink',
            table='facebook_link',
        ),
    ]
