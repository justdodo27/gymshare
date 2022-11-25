from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from . import models
from workouts.models import FavoriteWorkout


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }


class UserCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'A user with that email already exists.')
        return value

    def save(self):
        user = User(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
        )
        user.set_password(self.validated_data['password'])
        user.save()

        return user

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    likes = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    def get_profile_picture(self, profile):
        request = self.context.get('request')
        if profile.profile_picture:
            return request.build_absolute_uri(profile.profile_picture.url)

    def get_likes(self, profile):
        return FavoriteWorkout.objects.filter(workout__author=profile.user).count()

    class Meta:
        model = models.Profile
        fields = '__all__'


class ProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    profile_picture = serializers.ImageField()

    class Meta:
        model = models.Profile
        fields = ['height', 'weight', 'first_name',
                  'last_name', 'profile_picture']


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_staff'] = self.user.is_staff
        return data
