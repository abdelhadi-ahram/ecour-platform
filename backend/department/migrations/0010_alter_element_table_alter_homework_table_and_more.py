# Generated by Django 4.0.3 on 2022-03-28 17:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('department', '0009_alter_element_module_alter_module_department'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='element',
            table='element',
        ),
        migrations.AlterModelTable(
            name='homework',
            table='homework',
        ),
        migrations.AlterModelTable(
            name='lecture',
            table='lecture',
        ),
        migrations.AlterModelTable(
            name='module',
            table='module',
        ),
        migrations.AlterModelTable(
            name='section',
            table='section',
        ),
        migrations.AlterModelTable(
            name='studenthomeworkanswer',
            table='student_homework_answer',
        ),
        migrations.AlterModelTable(
            name='teaching',
            table='teaching',
        ),
    ]
