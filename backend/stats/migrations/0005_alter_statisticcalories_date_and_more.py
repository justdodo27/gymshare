# Generated by Django 4.0.6 on 2023-05-08 19:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stats', '0004_alter_statisticexercise_exercise'),
    ]

    operations = [
        migrations.AlterField(
            model_name='statisticcalories',
            name='date',
            field=models.DateField(db_index=True),
        ),
        migrations.AlterField(
            model_name='statisticexercise',
            name='date',
            field=models.DateTimeField(db_index=True),
        ),
    ]
