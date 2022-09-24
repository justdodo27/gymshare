from django.contrib.auth.models import User
from django.db.models import Avg, FloatField, F, Sum
from django.db.models.functions import Coalesce
from rest_framework import serializers

from . import models
from .utils import get_user_weight


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Exercise
        fields = '__all__'


class ExerciseInWorkoutSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = models.ExcerciseInWorkout
        fields = '__all__'


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()

    def get_exercises(self, workout):
        qs = models.ExcerciseInWorkout.objects.filter(workout=workout)
        return ExerciseInWorkoutSerializer(qs, many=True).data

    class Meta:
        model = models.Workout
        fields = '__all__'


class FavoriteWorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FavoriteWorkout
        fields = '__all__'


class SimpleAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username',)


class WorkoutSerializerWithAuthor(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()
    author = SimpleAuthorSerializer()
    is_favorite = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()
    avg_time = serializers.SerializerMethodField()
    difficulty = serializers.SerializerMethodField()
    sum_of_cb = serializers.SerializerMethodField()

    def get_exercises(self, workout):
        qs = models.ExcerciseInWorkout.objects.filter(workout=workout)
        return ExerciseInWorkoutSerializer(qs, many=True).data

    def get_is_favorite(self, workout):
        context_user = self.context.get('user')
        if context_user.is_anonymous: return False

        qs = models.FavoriteWorkout.objects.filter(workout=workout, user=context_user).first()

        if qs: return True

        return False

    def get_avg_rating(self, workout):
        return models.Rating.objects.filter(
            workout=workout
        ).aggregate(Avg('rate')).get('rate__avg', 0)

    def get_avg_time(self, workout):
        exercises = models.ExcerciseInWorkout.objects.filter(
            workout=workout
        ).annotate(
            calc_time=Coalesce('time', F('repeats') * 5, 0, output_field=FloatField())
        )

        if avg_time := exercises.aggregate(Sum('calc_time')).get('calc_time__sum', 0):
            return round(avg_time, 2)
        return 0


    def get_difficulty(self, workout):
        if difficulty := models.ExcerciseInWorkout.objects.filter(
            workout=workout
        ).aggregate(Avg('exercise__difficulty')).get('exercise__difficulty__avg', 1):
            return round(difficulty, 2)
        return 0

    def get_sum_of_cb(self, workout):
        context_user = self.context.get('user')
        exercises = models.ExcerciseInWorkout.objects.filter(
            workout=workout
        ).annotate(
            calc_calories=Coalesce(
                F('time') / 60, F('repeats') * 5.0 / 60, 0, output_field=FloatField()
            ) * get_user_weight(context_user) * F('exercise__calories_burn_rate')
        )

        if sum_of_cb := exercises.aggregate(
            Sum('calc_calories')).get('calc_calories__sum', 0):
            return round(sum_of_cb, 2)
        return 0

    class Meta:
        model = models.Workout
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rating
        fields = '__all__'
