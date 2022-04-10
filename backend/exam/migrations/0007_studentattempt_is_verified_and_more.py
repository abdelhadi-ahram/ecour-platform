# Generated by Django 4.0.3 on 2022-04-10 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exam', '0006_studentattempt_is_open'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentattempt',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='studentquestionanswer',
            name='mark',
            field=models.FloatField(null=True),
        ),
    ]
