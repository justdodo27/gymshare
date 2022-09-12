from django.contrib.auth.models import User
from rest_framework import serializers

from . import models



class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Exercise
        fields = '__all__'


class ExerciseInWorkoutSerializer(serializers.ModelSerializer):
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

    def get_exercises(self, workout):
        qs = models.ExcerciseInWorkout.objects.filter(workout=workout)
        return ExerciseInWorkoutSerializer(qs, many=True).data

    def get_is_favorite(self, workout):
        qs = models.FavoriteWorkout.objects.filter(workout=workout, user=self.context.get('user')).first()
        if qs:
            return True
        return False

    class Meta:
        model = models.Workout
        fields = '__all__'