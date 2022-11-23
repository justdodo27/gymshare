from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView


from . import serializers, models


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return serializers.UserCreateSerializer
        return serializers.UserSerializer

    def get_permissions(self):
        if self.action in ['create']:
            self.permission_classes = [permissions.AllowAny]
        else:
            self.permission_classes = [permissions.IsAuthenticated]

        return super().get_permissions()


class ProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows profiles to be viewed or edited.
    """
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return serializers.ProfileUpdateSerializer
        return serializers.ProfileSerializer

    def get_user_object(self, queryset=None):
        obj = self.request.user
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def retrieve(self, request, pk=None):
        queryset = models.Profile.objects.all()
        profile = get_object_or_404(queryset, user__id=pk)
        serializer = serializers.ProfileSerializer(profile, context=self.get_serializer_context())
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        user_object = self.get_user_object()
        serializer = self.get_serializer(data=request.data)

        if user_object.is_anonymous:
            raise NotAuthenticated("No Token Provided")

        if serializer.is_valid():
            profile_object = models.Profile.objects.get(user__id=user_object.id)
            profile_object.height = serializer.validated_data.get('height')
            profile_object.weight = serializer.validated_data.get('weight')
            profile_object.profile_picture = serializer.validated_data.get('profile_picture')
            profile_object.save()

            user_object.first_name = serializer.validated_data.get('first_name')
            user_object.last_name = serializer.validated_data.get('last_name')
            user_object.save()

            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Profile updated successfully',
                'data': serializer.data
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(generics.UpdateAPIView):
    """
    API endpoint for changing user password.
    """
    serializer_class = serializers.ChangePasswordSerializer
    model = User

    def get_user_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        user_object = self.get_user_object()
        serializer = self.get_serializer(data=request.data)

        if user_object.is_anonymous:
            raise NotAuthenticated("No Token Provided")

        if serializer.is_valid():
            if not user_object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)
            user_object.set_password(serializer.data.get("new_password"))
            user_object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.MyTokenObtainPairSerializer
