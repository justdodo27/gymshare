# Generated by Django 4.0.6 on 2022-09-13 17:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0004_rating'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workout',
            name='avg_time',
        ),
        migrations.RemoveField(
            model_name='workout',
            name='difficulty',
        ),
        migrations.RemoveField(
            model_name='workout',
            name='sum_of_cb',
        ),
    ]
