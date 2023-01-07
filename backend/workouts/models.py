from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from cloudinary_storage.storage import VideoMediaCloudinaryStorage
from cloudinary_storage.validators import validate_video


class Exercise(models.Model):
    WITH_OWN_BODY_WEIGHT = 'With own body weight'
    WITH_A_WEIGHT = 'With a weight'
    WITH_TIME = 'With time'

    EXERCISE_TYPES = [
        (WITH_OWN_BODY_WEIGHT, 'With own body weight'),
        (WITH_A_WEIGHT, 'With a weight'),
        (WITH_TIME, 'With time'),
    ]

    title = models.CharField(max_length=80)
    description = models.TextField(max_length=10000, null=True, blank=True)
    difficulty = models.PositiveIntegerField()
    calories_burn_rate = models.FloatField(validators=[MinValueValidator(0)])
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    video = models.FileField(upload_to='videos/', null=True, blank=True, storage=VideoMediaCloudinaryStorage(),
                              validators=[validate_video])
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
    visibility = models.CharField(max_length=20, choices=VISIBILITIES, default=PUBLIC)
    cycles = models.PositiveIntegerField()
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.title} by {self.author}'

    class Meta:
        ordering = ['id']


class FavoriteWorkout(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'workout']


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


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    rate = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self) -> str:
        return f'{self.workout} rating'

    class Meta:
        ordering = ['rate']
        unique_together = ('user', 'workout',)
