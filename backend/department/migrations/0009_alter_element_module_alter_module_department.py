# Generated by Django 4.0.3 on 2022-03-25 20:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
        ('department', '0008_alter_studenthomeworkanswer_student'),
    ]

    operations = [
        migrations.AlterField(
            model_name='element',
            name='module',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elements', to='department.module'),
        ),
        migrations.AlterField(
            model_name='module',
            name='department',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='modules', to='authentication.department'),
        ),
    ]