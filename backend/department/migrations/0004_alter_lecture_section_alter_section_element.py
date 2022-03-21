# Generated by Django 4.0.3 on 2022-03-18 10:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('department', '0003_alter_teaching_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lecture',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lectures', to='department.section'),
        ),
        migrations.AlterField(
            model_name='section',
            name='element',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='department.element'),
        ),
    ]