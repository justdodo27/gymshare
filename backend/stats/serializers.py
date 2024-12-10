from rest_framework import serializers

from . import models
from workouts.models import Exercise
from accounts.models import Profile


class StatisticCaloriesSerializer(serializers.ModelSerializer):
    calories = serializers.SerializerMethodField()

    class Meta:
        model = models.StatisticCalories
        fields = '__all__'

    def validate_calories(self, value):
        if value < 0:
            return serializers.ValidationError('Calories value must be a positive number')
        return value

    def get_calories(self, obj):
        return round(obj.calories)


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


class StatisticExerciseGetSerializer(serializers.ModelSerializer):
    entries = serializers.ListField()

    class Meta:
        model = Exercise
        fields = '__all__'


class ExerciseDataSerializer(serializers.Serializer):
    exercise_id = serializers.IntegerField(required=True)
    time = serializers.IntegerField(required=False, allow_null=True)
    repeats = serializers.IntegerField(required=False, allow_null=True)
    weight = serializers.IntegerField(required=False, allow_null=True)
    series = serializers.IntegerField(required=True)
    date = serializers.DateTimeField(required=True)

    def validate(self, data):
        """
        Check if everything is valid
        """
        if not (exercise := Exercise.objects.filter(id=data['exercise_id']).first()):
            raise serializers.ValidationError('Exercise does not exist')
        match exercise.exercise_type:
            case exercise.WITH_OWN_BODY_WEIGHT:
                if data.get('time', None):
                    raise serializers.ValidationError(
                        'Exercise of type own body weight cannot have time attribute')
                if not data.get('repeats', None) or data['repeats'] <= 0:
                    raise serializers.ValidationError('Repeats not provided')
                if data.get('weight', None):
                    raise serializers.ValidationError(
                        'Exercise of type own body weight cannot have weight attribute')
            case exercise.WITH_A_WEIGHT:
                if data.get('time', None):
                    raise serializers.ValidationError(
                        'Exercise of type weight cannot have time attribute')
                if not data.get('repeats', None) or data['repeats'] <= 0:
                    raise serializers.ValidationError('Repeats not provided')
                if not data.get('weight', None) or data['weight'] <= 0:
                    raise serializers.ValidationError('Weight not provided')
            case exercise.WITH_TIME:
                if not data.get('time', None) or data['time'] <= 0:
                    raise serializers.ValidationError('Time not provided')
                if data.get('repeats', None):
                    raise serializers.ValidationError(
                        'Exercise of type time cannot have repeats attribute')
                if data.get('weight', None):
                    raise serializers.ValidationError(
                        'Exercise of type time cannot have weight attribute')
        if data['series'] is None or data['series'] <= 0:
            raise serializers.ValidationError('Series not provided')
        if data['date'] is None:
            raise serializers.ValidationError('Date not provided')

        return data

    def calc_calories(self, exerciseAttrs, exercise: Exercise, user) -> float:
        user_weight = Profile.objects.get(user=user).weight
        if not user_weight:
            raise Exception('User Profile don\'t have weight data')
        if exerciseAttrs.get('time', None):
            return exercise.calories_burn_rate * user_weight * exerciseAttrs['time'] / 60
        elif exerciseAttrs.get('repeats', None):
            return exercise.calories_burn_rate * user_weight * exerciseAttrs['repeats'] * 5 / 60
        else:
            raise Exception('Wrong Exercise Attributes')

    def create(self, validated_data):
        """
        Save statistics to DB
        """
        exercise = Exercise.objects.get(id=validated_data['exercise_id'])

        exerciseAttrs = None

        if exercise.exercise_type == Exercise.WITH_A_WEIGHT:
            exerciseAttrs = {
                'weight': validated_data['weight'], 'repeats': validated_data['repeats'] * validated_data['series']}
        elif exercise.exercise_type == Exercise.WITH_OWN_BODY_WEIGHT:
            exerciseAttrs = {
                'repeats': validated_data['repeats'] * validated_data['series']}
        elif exercise.exercise_type == Exercise.WITH_TIME:
            exerciseAttrs = {
                'time': validated_data['time'] * validated_data['series']}

        exercise_stats = models.StatisticExercise(
            date=validated_data['date'],
            exercise=exercise,
            **exerciseAttrs,
            user=validated_data['user']
        )
        exercise_stats.save()

        workout_date = validated_data['date'].date()
        if calories_stats := models.StatisticCalories.objects.filter(user=validated_data['user'], date=workout_date).first():
            calories_stats.calories += self.calc_calories(
                exerciseAttrs, exercise, validated_data['user'])
        else:
            calories_stats = models.StatisticCalories(
                date=workout_date,
                user=validated_data['user'],
                calories=self.calc_calories(
                    exerciseAttrs, exercise, validated_data['user'])
            )
        calories_stats.save()

        return True
