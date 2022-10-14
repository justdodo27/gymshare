from django.contrib.auth.models import User
from django.db.models import Avg, FloatField, F, Sum
from django.db.models.functions import Coalesce
from rest_framework import serializers
from accounts.models import Profile
from accounts.serializers import ProfileSerializer

from . import models
from .utils import get_user_weight


class ExerciseSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()

    class Meta:
        model = models.Exercise
        fields = '__all__'

    def get_thumbnail(self, exercise):
        request = self.context.get('request')
        if not exercise.thumbnail:
            return ""

        thumbnail_url = exercise.thumbnail.url
        return request.build_absolute_uri(thumbnail_url)

    def get_video(self, exercise):
        request = self.context.get('request')
        if not exercise.video:
            return ""

        video_url = exercise.video.url
        return request.build_absolute_uri(video_url)


class ExerciseInWorkoutCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExcerciseInWorkout
        fields = '__all__'


class ExerciseInWorkoutSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = models.ExcerciseInWorkout
        fields = '__all__'


class ExerciseInWorkoutUploadSerializer(serializers.Serializer):
    workout = serializers.IntegerField()
    exercises = ExerciseInWorkoutCreateSerializer(many=True)

    def validate(self, attrs):
        workout_id = attrs.get('workout', None)
        exercises = attrs.get('exercises', [])

        if not models.Workout.objects.filter(id=workout_id).exists():
            raise serializers.ValidationError('The workout does not exists.')

        for exercise in exercises:
            if exercise['workout'].id != workout_id:
                raise serializers.ValidationError('Not all exercises belongs to specified workout.')

        return attrs

    def create(self, validated_data):
        exercises = models.ExcerciseInWorkout.objects.filter(workout__id=validated_data['workout'])
        exercises.delete()

        for exercise_data in validated_data['exercises']:
            exercise = models.ExcerciseInWorkout.objects.create(**exercise_data)

        return exercise

    def save(self, **kwargs):
        return self.validated_data


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()

    def get_exercises(self, workout):
        qs = models.ExcerciseInWorkout.objects.filter(workout=workout)
        return ExerciseInWorkoutSerializer(qs, many=True, context=self.context).data

    class Meta:
        model = models.Workout
        fields = '__all__'


class WorkoutCreateSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        context_user = self.context.get('user')
        return models.Workout.objects.create(author=context_user, **validated_data)

    class Meta:
        model = models.Workout
        fields = ('title', 'description', 'visibility', 'cycles', 'thumbnail')


class SimpleAuthorSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'profile_picture')

    def get_profile_picture(self, user):
        qs = Profile.objects.get(user=user)
        return ProfileSerializer(qs, context=self.context).data.get('profile_picture')


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
        return ExerciseInWorkoutSerializer(qs, many=True, context=self.context).data

    def get_is_favorite(self, workout):
        context_user = self.context.get('user')
        if context_user.is_anonymous:
            return False

        return models.FavoriteWorkout.objects.filter(
            workout=workout, user=context_user).exists()

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


class FavoriteWorkoutDetailedSerializer(serializers.ModelSerializer):
    workout = WorkoutSerializerWithAuthor()

    class Meta:
        model = models.FavoriteWorkout
        fields = '__all__'


class FavoriteWorkoutCreateSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        context_user = self.context.get('user')

        if models.FavoriteWorkout.objects.filter(user=context_user, workout=validated_data['workout']).exists():
            raise serializers.ValidationError('The workout has already been marked as favorite.')

        return models.FavoriteWorkout.objects.create(user=context_user, **validated_data)

    def update(self, instance, validated_data):
        context_user = self.context.get('user')
        updated_workout = validated_data.get('workout', instance.workout)

        if instance.workout != updated_workout:
            if models.FavoriteWorkout.objects.filter(user=context_user, workout=updated_workout).exists():
                raise serializers.ValidationError('The workout has already been marked as favorite.')

        instance.workout = updated_workout
        instance.save()

        return instance

    class Meta:
        model = models.FavoriteWorkout
        fields = ('workout',)


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rating
        fields = '__all__'


class RatingCreateSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        context_user = self.context.get('user')

        if models.Rating.objects.filter(user=context_user, workout=validated_data['workout']).exists():
            raise serializers.ValidationError({'detail': 'The workout has already been rated.'})

        return models.Rating.objects.create(user=context_user, **validated_data)

    def update(self, instance, validated_data):
        context_user = self.context.get('user')
        updated_workout = validated_data.get('workout', instance.workout)

        if instance.workout != updated_workout:
            if models.Rating.objects.filter(user=context_user, workout=updated_workout).exists():
                raise serializers.ValidationError({'detail': 'The workout has already been rated.'})

        instance.workout = updated_workout
        instance.rate = validated_data.get('rate', instance.rate)
        instance.save()

        return instance

    class Meta:
        model = models.Rating
        fields = ('workout', 'rate',)
