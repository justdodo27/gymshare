from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Exercise(models.Model):
    WITH_OWN_BODY_WEIGHT = 'With own body weight'
    WITH_A_WEIGHT = 'With a weight'

    EXERCISE_TYPES = [
        (WITH_OWN_BODY_WEIGHT, 'With own body weight'),
        (WITH_A_WEIGHT, 'With a weight'),
    ]

    title = models.CharField(max_length=80)
    description = models.TextField(max_length=300, null=True, blank=True)
    difficulty = models.PositiveIntegerField()
    calories_burn_rate = models.FloatField(validators=[MinValueValidator(0)])
    thumbnail = models.ImageField(null=True, blank=True)
    video = models.FileField(null=True, blank=True)
    exercise_type = models.CharField(max_length=30, choices=EXERCISE_TYPES, default=WITH_A_WEIGHT)

    def __str__(self) -> str:
        return self.title

    class Meta:
        ordering = ['id']


class Workout(models.Model):
    PUBLIC = 'Public'
    HIDDEN = 'Hidden'

    VISIBILITIES = [
        (PUBLIC, 'Public'),
        (HIDDEN, 'Hidden')
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=80)
    description = models.TextField(max_length=300, null=True, blank=True)
    sum_of_cb = models.FloatField(null=True, blank=True)
    difficulty = models.FloatField(null=True, blank=True)
    visibility = models.CharField(max_length=20, choices=VISIBILITIES, default=PUBLIC)
    avg_time = models.FloatField()
    cycles = models.PositiveIntegerField()

    def __str__(self) -> str:
        return f'{self.title} by {self.author}'

    class Meta:
        ordering = ['id']


class ExcerciseInWorkout(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    repeats = models.PositiveIntegerField(null=True, blank=True)
    time = models.FloatField(null=True, blank=True)
    series = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.exercise} in {self.workout}'

    class Meta:
        ordering = ['id']
