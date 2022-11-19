from django.contrib.auth.models import User
from rest_framework import serializers
from accounts.models import Profile
from accounts.serializers import ProfileSerializer

from . import models

class ExerciseCreateSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField()
    video = serializers.FileField()

    class Meta:
        model = models.Exercise
        fields = '__all__'

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


class WorkoutCreateSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(required=False)
    def create(self, validated_data):
        context_user = self.context.get('user')
        return models.Workout.objects.create(author=context_user, **validated_data)

    class Meta:
        model = models.Workout
        fields = ('id', 'title', 'description',
                  'visibility', 'cycles', 'thumbnail')


class ExerciseInWorkoutUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExcerciseInWorkout
        fields = ('id', 'exercise', 'order', 'repeats', 'time', 'series')


class WorkoutUploadSerializer(serializers.Serializer):
    workout_for_update_id = serializers.IntegerField(required=False)
    workout_to_create = WorkoutCreateSerializer(required=False)
    exercises = ExerciseInWorkoutUploadSerializer(many=True, required=False)

    def validate(self, attrs):
        workout_for_update_id = attrs.get('workout_for_update_id', None)
        workout_to_create = attrs.get('workout_to_create', None)
        exercises = attrs.get('exercises', [])

        if workout_to_create is None and workout_for_update_id is None:
            raise serializers.ValidationError(
                'Workout not sepcified. Specify the "workout_for_update_id" or "workout_to_create" field.')

        if workout_to_create and workout_for_update_id:
            raise serializers.ValidationError(
                'You have to specify only one workout.')

        if len(exercises) == 0:
            raise serializers.ValidationError(
                'Exercises list can not be empty.')

        if workout_for_update_id:
            if not models.Workout.objects.filter(id=workout_for_update_id).exists():
                raise serializers.ValidationError(
                    'The workout does not exists.')

        return attrs

    def create(self, validated_data):
        workout_for_update_id = validated_data.get('workout_for_update_id')
        workout_to_create = validated_data.get('workout_to_create')

        if workout_for_update_id:
            workout = models.Workout.objects.get(id=workout_for_update_id)
            exercises = models.ExcerciseInWorkout.objects.filter(
                workout=workout)
            exercises.delete()

        if workout_to_create:
            context_user = self.context.get('user')
            workout = models.Workout.objects.create(
                author=context_user, **workout_to_create)
            validated_data['workout_id'] = workout.id

        for exercise_data in validated_data.get('exercises', []):
            models.ExcerciseInWorkout.objects.create(
                workout=workout, **exercise_data
            )

        return workout

    def save(self, **kwargs):
        workout = self.create(self.validated_data)
        return workout


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = serializers.SerializerMethodField()

    def get_exercises(self, workout):
        qs = models.ExcerciseInWorkout.objects.filter(workout=workout)
        return ExerciseInWorkoutSerializer(qs, many=True, context=self.context).data

    class Meta:
        model = models.Workout
        fields = '__all__'


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
    ratings_count = serializers.SerializerMethodField()
    avg_time = serializers.SerializerMethodField()
    difficulty = serializers.SerializerMethodField()
    sum_of_cb = serializers.SerializerMethodField()
    avg_rating = serializers.SerializerMethodField()

    def get_exercises(self, workout):
        qs = models.ExcerciseInWorkout.objects.filter(workout=workout)
        return ExerciseInWorkoutSerializer(qs, many=True, context=self.context).data

    def get_is_favorite(self, workout):
        context_user = self.context.get('user')
        print(context_user)
        if context_user.is_anonymous:
            return False
        print(models.FavoriteWorkout.objects.filter(
            workout=workout, user=context_user).exists())
        return models.FavoriteWorkout.objects.filter(
            workout=workout, user=context_user).exists()

    def get_avg_rating(self, workout):  # todo give this to singals
        return round(workout.avg_rating, 2)

    def get_ratings_count(self, workout):
        return models.Rating.objects.filter(
            workout=workout
        ).count()

    def get_avg_time(self, workout):
        return round(workout.avg_time, 2)

    def get_difficulty(self, workout):
        return round(workout.difficulty, 2)

    def get_sum_of_cb(self, workout):
        return round(workout.sum_of_cb, 2)

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
            raise serializers.ValidationError(
                'The workout has already been marked as favorite.')

        return models.FavoriteWorkout.objects.create(user=context_user, **validated_data)

    def update(self, instance, validated_data):
        context_user = self.context.get('user')
        updated_workout = validated_data.get('workout', instance.workout)

        if instance.workout != updated_workout:
            if models.FavoriteWorkout.objects.filter(user=context_user, workout=updated_workout).exists():
                raise serializers.ValidationError(
                    'The workout has already been marked as favorite.')

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
            raise serializers.ValidationError(
                {'detail': 'The workout has already been rated.'})

        return models.Rating.objects.create(user=context_user, **validated_data)

    def update(self, instance, validated_data):
        context_user = self.context.get('user')
        updated_workout = validated_data.get('workout', instance.workout)

        if instance.workout != updated_workout:
            if models.Rating.objects.filter(user=context_user, workout=updated_workout).exists():
                raise serializers.ValidationError(
                    {'detail': 'The workout has already been rated.'})

        instance.workout = updated_workout
        instance.rate = validated_data.get('rate', instance.rate)
        instance.save()

        return instance

    class Meta:
        model = models.Rating
        fields = ('workout', 'rate',)
