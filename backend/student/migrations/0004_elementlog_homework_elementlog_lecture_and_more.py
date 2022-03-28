# Generated by Django 4.0.3 on 2022-03-27 15:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
        ('department', '0009_alter_element_module_alter_module_department'),
        ('student', '0003_lecturelog'),
    ]

    operations = [
        migrations.AddField(
            model_name='elementlog',
            name='homework',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='accessed_by', to='department.homework'),
        ),
        migrations.AddField(
            model_name='elementlog',
            name='lecture',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='accessed_by', to='department.lecture'),
        ),
        migrations.AlterField(
            model_name='elementlog',
            name='element',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='accessed_by', to='department.element'),
        ),
        migrations.AlterField(
            model_name='elementlog',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accessed_lectures', to='authentication.student'),
        ),
        migrations.DeleteModel(
            name='LectureLog',
        ),
    ]
