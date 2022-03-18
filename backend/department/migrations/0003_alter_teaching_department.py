# Generated by Django 4.0.3 on 2022-03-17 11:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
        ('department', '0002_teaching_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='teaching',
            name='department',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teachings', to='authentication.department'),
        ),
    ]
