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
