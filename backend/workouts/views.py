from rest_framework import viewsets, permissions, filters, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Value, FloatField, F, Sum
from django.db.models.functions import Coalesce

from . import serializers, models
from .utils import get_user_weight


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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description', 'author__username']
    filterset_fields = ['visibility', ]
    pagination_class = PageNumberPagination
    pagination_class.page_size = 15

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]

        return super().get_permissions()

    def get_queryset(self):
        queryset_for_hidden = (Q(visibility=models.Workout.HIDDEN) & Q(author=self.request.user))
        queryset_for_public = Q(visibility=models.Workout.PUBLIC)

        if self.request.user.is_anonymous:
            qs = self.queryset.filter(queryset_for_public)
        else:
            qs = self.queryset.filter(queryset_for_public | queryset_for_hidden)

        qs = qs.annotate(difficulty=Avg(Coalesce('excerciseinworkout__exercise__difficulty', Value(0))))\
            .annotate(calc_time=Coalesce('excerciseinworkout__time', F('excerciseinworkout__repeats') * 5, 0, output_field=FloatField()))\
            .annotate(
                calc_calories=Coalesce(Coalesce(
                    F('excerciseinworkout__time') / Value(60.0), F('excerciseinworkout__repeats') * 5.0 / 60, Value(0.0), output_field=FloatField()
                ) * get_user_weight(self.request.user) * F('excerciseinworkout__exercise__calories_burn_rate'), Value(0.0))
            )\
            .annotate(calc_rating=Avg(Coalesce('rating__rate', Value(0))))


        if self.action == 'list' and (ordering := self.request.query_params.get('ordering')) in \
            ['id', '-id', 'title', '-title', 'difficulty', '-difficulty', 'avg_time', '-avg_time',
            'sum_of_cb', '-sum_of_cb', 'avg_rating', '-avg_rating']:
            
            match ordering:
                case 'id': # order by id ASC
                    qs = qs.order_by('id')
                case '-id': # order by id DESC
                    qs = qs.order_by('-id')
                case 'title': # order by title ASC
                    qs = qs.order_by('title')
                case '-title': # order by title DESC
                    qs = qs.order_by('-title')
                case 'difficulty': # order by difficulty ASC
                    qs = qs.order_by('difficulty')
                case '-difficulty': # order by difficulty DESC
                    qs = qs.order_by('-difficulty')
                case 'avg_time': # order by average time ASC
                    qs = qs.order_by('calc_time')
                case '-avg_time': # order by average time ASC
                    qs = qs.order_by('-calc_time')
                case 'sum_of_cb': # order by sum of cbr ASC
                    qs = qs.order_by('calc_calories')
                case '-sum_of_cb': # order by sum of cbr DESC
                    qs = qs.order_by('-calc_calories')
                case 'avg_rating': # order by average rating ASC
                    qs = qs.order_by('calc_rating')
                case '-avg_rating': # order by average rating ASC
                    qs = qs.order_by('-calc_rating')
                case _:
                    pass
            
        return qs

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return serializers.WorkoutCreateSerializer
        return serializers.WorkoutSerializerWithAuthor

    @action(detail=False, methods=['post'], url_path='upload')
    def upload_exercises(self, request):
        """
        Deletes old exercises and creates new ones from the given data or creates new workout with exercises.
        """
        serializer = serializers.WorkoutUploadSerializer(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            workout = serializer.save()
            if serializer.data.get('workout_to_create'):
                serializer.data['workout_to_create']['id'] = workout.id
            print(serializer.data)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class ExerciseInWorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows exercises to be viewed or edited.
    """
    queryset = models.ExcerciseInWorkout.objects.all()
    serializer_class = serializers.ExerciseInWorkoutSerializer

    def get_queryset(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return models.ExcerciseInWorkout.objects.filter(workout__author=self.request.user)
        return models.ExcerciseInWorkout.objects.all()

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]

        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return serializers.ExerciseInWorkoutCreateSerializer
        return serializers.ExerciseInWorkoutSerializer


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
