from django.db import models
from django.contrib.auth.models import User
from workouts.models import Exercise

class StatisticCalories(models.Model):
    date = models.DateField()
    calories = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'{self.user.username} : {self.date} - {self.calories}'

    class Meta:
        ordering = ['id']


class StatisticExercise(models.Model):
    date = models.DateTimeField()
    exercise = models.ForeignKey(Exercise, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    repeats = models.IntegerField(null=True, blank=True)
    time = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True)
    weight = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.user.username} {self.exercise.title} : {self.date}'

    class Meta:
        ordering = ['id']