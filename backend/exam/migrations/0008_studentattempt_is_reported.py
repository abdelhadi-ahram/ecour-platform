# Generated by Django 4.0.3 on 2022-04-13 00:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exam', '0007_studentattempt_is_verified_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentattempt',
            name='is_reported',
            field=models.BooleanField(default=False),
        ),
    ]