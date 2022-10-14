from rest_framework import viewsets, permissions, filters, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from . import serializers, models


class ExerciseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows exercises to be viewed or edited.
    """
    queryset = models.Exercise.objects.all()
    serializer_class = serializers.ExerciseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', ]
    filterset_fields = ['exercise_type', ]
    ordering_fields = ['title', 'calories_burn_rate', 'difficulty', ]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]

        return super().get_permissions()


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows exercises to be viewed or edited.
    """
    queryset = models.Workout.objects.all()
    serializer_class = serializers.WorkoutSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'author__username']
    filterset_fields = ['visibility', ]
    ordering_fields = ['title', 'sum_of_cb', 'difficulty', 'avg_time']
    pagination_class = PageNumberPagination
    pagination_class.page_size = 15

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]

        return super().get_permissions()

    def get_queryset(self):
        queryset_for_hidden = (Q(visibility=models.Workout.HIDDEN) & Q(author=self.request.user))
        queryset_for_public = Q(visibility=models.Workout.PUBLIC)

        if self.request.user.is_anonymous:
            return self.queryset.filter(queryset_for_public)
        return self.queryset.filter(queryset_for_public | queryset_for_hidden)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.serializer_class = serializers.WorkoutSerializer
        else:
            self.serializer_class = serializers.WorkoutSerializerWithAuthor
        return super().get_serializer_class()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context


class FavoriteWorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows favorite workouts to be viewed or edited.
    """
    queryset = models.FavoriteWorkout.objects.all()
    serializer_class = serializers.FavoriteWorkoutDetailedSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination
    pagination_class.page_size = 15

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return serializers.FavoriteWorkoutCreateSerializer

        return serializers.FavoriteWorkoutDetailedSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    @action(detail=False, methods=['delete'], url_path='delete')
    def destroy_fav_by_workout(self, request):
        user_id = self.request.user.id
        workout_id = request.data.get('workout', None)
        instance = models.FavoriteWorkout.objects.filter(user__id=user_id, workout__id=workout_id)

        if not instance.exists():
            return Response({'detail': 'Favorite workout does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        self.perform_destroy(instance)
        return Response({'detail': 'Favorite workout has been deleted.'}, status=status.HTTP_204_NO_CONTENT)


class ExerciseInWorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows exercises to be viewed or edited.
    """
    queryset = models.ExcerciseInWorkout.objects.all()
    serializer_class = serializers.ExerciseInWorkoutSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]

        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            self.serializer_class = serializers.ExerciseInWorkoutCreateSerializer
        else:
            self.serializer_class = serializers.ExerciseInWorkoutSerializer
        return super().get_serializer_class()


class RatingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows ratings to be viewed or edited.
    """
    queryset = models.Rating.objects.all()
    serializer_class = serializers.RatingSerializer
    pagination_class = PageNumberPagination
    pagination_class.page_size = 15

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    def get_queryset(self):
        if self.action in ('retrieve', 'list'):
            return models.Rating.objects.all()
        return models.Rating.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return serializers.RatingCreateSerializer

        return serializers.RatingSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]

        return super().get_permissions()

    @action(detail=False, methods=['delete'], url_path='delete')
    def destroy_rating_by_workout(self, request):
        user_id = self.request.user.id
        workout_id = request.data.get('workout', None)
        instance = models.Rating.objects.filter(user__id=user_id, workout__id=workout_id)

        if not instance.exists():
            return Response({'detail': 'Rating does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        self.perform_destroy(instance)
        return Response({'detail': 'Rating has been deleted.'}, status=status.HTTP_204_NO_CONTENT)
