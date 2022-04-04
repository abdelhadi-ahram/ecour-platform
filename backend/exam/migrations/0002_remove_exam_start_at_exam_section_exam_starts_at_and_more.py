# Generated by Django 4.0.3 on 2022-04-02 18:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('department', '0010_alter_element_table_alter_homework_table_and_more'),
        ('exam', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exam',
            name='start_at',
        ),
        migrations.AddField(
            model_name='exam',
            name='section',
            field=models.ForeignKey(default=3, on_delete=django.db.models.deletion.CASCADE, related_name='exams', to='department.section'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='exam',
            name='starts_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='exam',
            name='attempts',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='exam',
            name='description',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='exam',
            name='duration',
            field=models.DurationField(null=True),
        ),
    ]
