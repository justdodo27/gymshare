from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated


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

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return serializers.ProfileUpdateSerializer
        return serializers.ProfileSerializer

    def get_user_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        user_object = self.get_user_object()
        serializer = self.get_serializer(data=request.data)

        if user_object.is_anonymous:
             raise NotAuthenticated("No Token Provided")

        if serializer.is_valid():
            profile_object = models.Profile.objects.get(user__id=user_object.id)
            profile_object.height = serializer.data.get('height')
            profile_object.weight = serializer.data.get('weight')
            profile_object.save()

            user_object.first_name = serializer.data.get('first_name')
            user_object.last_name = serializer.data.get('last_name')
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