from rest_framework import serializers
from . import models
from workouts.models import Exercise

class StatisticCaloriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StatisticCalories
        fields = '__all__'

    def validate_calories(self, value):
        if value < 0:
            return serializers.ValidationError('Calories value must be a positive number')
        return value

class StatisticExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StatisticExercise
        fields = '__all__'

    def validate(self, data):
        """
        Check that user's exercise statistics are valid
        """
        try:
            exercise = Exercise.objects.get(id=int(data['exercise']))
        except Exercise.DoesNotExist:
            return serializers.ValidationError('Exercise of given ID does not exist')

        if exercise.exercise_type == Exercise.WITH_A_WEIGHT:
            # check weight
            if data.get('weight') is None:
                return serializers.ValidationError('Weight is required when exercise is of type WITH_A_WEIGHT')
            if data.get('weight') <= 0:
                return serializers.ValidationError('Weight must be a positive number')
            # check repeats
            if data.get('repeats') is None:
                return serializers.ValidationError('Repeats are required when exercise is of type with weight or with body weight')
            if data.get('repeats') <= 0:
                return serializers.ValidationError('Repeats must be a positive number')
        elif exercise.exercise_type == Exercise.WITH_OWN_BODY_WEIGHT:
            # check repeats
            if data.get('repeats') is None:
                return serializers.ValidationError('Repeats are required when exercise is of type with weight or with body weight')
            if data.get('repeats') <= 0:
                return serializers.ValidationError('Repeats must be a positive number')
        elif exercise.exercise_type == Exercise.WITH_TIME:
            # check time
            if data.get('time') is None:
                return serializers.ValidationError('Time is required when exercise is of type with time')
            if data.get('time') <= 0:
                return serializers.ValidationError('Time must be a positive number')

        return data