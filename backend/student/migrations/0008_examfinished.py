# Generated by Django 4.0.3 on 2022-04-05 13:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('exam', '0002_remove_exam_start_at_exam_section_exam_starts_at_and_more'),
        ('authentication', '0002_alter_department_table_alter_student_table_and_more'),
        ('student', '0007_alter_homeworkfinished_unique_together_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExamFinished',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exam.exam')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.student')),
            ],
            options={
                'db_table': 'exam_finished',
            },
        ),
    ]
