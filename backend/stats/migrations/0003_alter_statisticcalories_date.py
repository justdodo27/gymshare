# Generated by Django 4.0.6 on 2022-09-18 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stats', '0002_alter_statisticexercise_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='statisticcalories',
            name='date',
            field=models.DateField(),
        ),
    ]
