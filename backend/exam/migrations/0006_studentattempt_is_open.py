# Generated by Django 4.0.3 on 2022-04-09 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exam', '0005_studentpickedchoice_studentquestionanswer_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentattempt',
            name='is_open',
            field=models.BooleanField(default=False),
        ),
    ]