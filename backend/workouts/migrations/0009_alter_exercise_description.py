# Generated by Django 4.0.6 on 2023-01-07 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0008_alter_exercise_video'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exercise',
            name='description',
            field=models.TextField(blank=True, max_length=10000, null=True),
        ),
    ]
