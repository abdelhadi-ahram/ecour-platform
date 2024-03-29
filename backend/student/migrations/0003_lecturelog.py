# Generated by Django 4.0.3 on 2022-03-27 15:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('department', '0009_alter_element_module_alter_module_department'),
        ('authentication', '0001_initial'),
        ('student', '0002_remove_studying_student_studying_module_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='LectureLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('homework', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='accessed_by', to='department.homework')),
                ('lecture', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='accessed_by', to='department.lecture')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='accessed_lectures', to='authentication.student')),
            ],
        ),
    ]
