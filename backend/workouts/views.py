from rest_framework import viewsets, permissions, filters, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Value, FloatField, F, OuterRef, Subquery, Func, Prefetch
from django.db.models.functions import Coalesce
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


from gymshareapi.pagination import DefaultPagination
from . import serializers, models
from .utils import get_user_weight


class ExerciseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows exercises to be viewed or edited.
    """
    queryset = models.Exercise.objects.all()
    serializer_class = serializers.ExerciseSerializer
    parser_classes = (MultiPartParser, FormParser)
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', ]
    filterset_fields = ['exercise_type', ]
    ordering_fields = ['title', 'calories_burn_rate', 'difficulty', ]
    pagination_class = DefaultPagination

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]

        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return serializers.ExerciseCreateSerializer
        return serializers.ExerciseSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows exercises to be viewed or edited.
    """
    queryset = models.Workout.objects.all()
    serializer_class = serializers.WorkoutSerializer
    parser_classes = (MultiPartParser, FormParser)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description', 'author__username']
    filterset_fields = ['visibility', 'author__id']
    pagination_class = DefaultPagination

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
        queryset_for_hidden = (
            Q(visibility=models.Workout.HIDDEN) & Q(author=self.request.user))
        queryset_for_public = Q(visibility=models.Workout.PUBLIC)

        if self.request.user.is_anonymous:
            qs = self.queryset.filter(queryset_for_public)
        else:
            qs = self.queryset.filter(
                queryset_for_public | queryset_for_hidden)
        
        # qs = models.Workout.objects.from_raw(
        # """
        # SELECT w.id, w.author_id, w.title, w.description, w.visibility, w.cycles, w.thumbnail,
        # avg(coalesce(e.difficulty, 0.0)) as "difficulty",
        # sum(coalesce(ew.time, ew.repeats * 5.0, 0.0)) as "avg_time",
        # sum(coalesce(ew.time / 60.0, ew.repeats * 5.0/60, 0.0) * 65.0 * e.calories_burn_rate) as "sum_of_cb",
        # avg(coalesce(r.rate, 0.0)) as "avg_rating"
        # FROM workouts_workout w
        # LEFT JOIN workouts_excerciseinworkout ew ON ew.workout_id = w.id
        # LEFT JOIN workouts_exercise e ON ew.exercise_id = e.id
        # LEFT JOIN workouts_rating r ON r.workout_id = w.id
        # WHERE w.visibility = 'Public'
        # GROUP BY w.id, w.author_id, w.title, w.description, w.visibility, w.cycles, w.thumbnail
        # """
        # )

        difficulty_subq = models.ExcerciseInWorkout.objects.filter(workout=OuterRef('id')).annotate(
            calc_difficulty=Func(Coalesce('exercise__difficulty', Value(
                0.0), output_field=FloatField()), function="Avg")
        ).order_by('calc_difficulty')
        time_subq = models.ExcerciseInWorkout.objects.filter(workout=OuterRef('id')).annotate(
            calc_time=Func(Coalesce('time', F('repeats') * Value(5.0),
                           Value(0.0), output_field=FloatField()), function="Sum")
        ).order_by('calc_time')
        calories_subq = models.ExcerciseInWorkout.objects.filter(workout=OuterRef('id')).annotate(
            calc_calories=Func(Coalesce(
                Coalesce(
                    F('time') / Value(60.0), F('repeats') * 5.0 / 60, Value(0.0), output_field=FloatField()
                ) * get_user_weight(self.request.user) * F('exercise__calories_burn_rate'), Value(0.0)
            ), function="Sum")
        ).order_by('calc_calories')
        rating_subq = models.Rating.objects.filter(workout=OuterRef('id')).annotate(
            calc_rating=Func(Coalesce('rate', Value(
                0.0), output_field=FloatField()), function="Avg")
        ).order_by('calc_rating')

        qs = qs.annotate(difficulty=Coalesce(Subquery(difficulty_subq.values(
            'calc_difficulty')[:1]), Value(0.0), output_field=FloatField()))
        qs = qs.annotate(avg_time=Coalesce(Subquery(time_subq.values(
            'calc_time')[:1]), Value(0.0), output_field=FloatField()))
        qs = qs.annotate(sum_of_cb=Coalesce(Subquery(calories_subq.values(
            'calc_calories')[:1]), Value(0.0), output_field=FloatField()))
        qs = qs.annotate(avg_rating=Coalesce(Subquery(rating_subq.values(
            'calc_rating')[:1]), Value(0.0), output_field=FloatField()))

        if self.action == 'list' and (ordering := self.request.query_params.get('ordering')) in \
            ['id', '-id', 'title', '-title', 'difficulty', '-difficulty', 'avg_time', '-avg_time',
             'sum_of_cb', '-sum_of_cb', 'avg_rating', '-avg_rating']:

            qs = qs.order_by(ordering)

        return qs

    # @method_decorator(cache_page(60*60*2))
    # def list(self, request, *args, **kwargs):
    #     return super().list(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return serializers.WorkoutCreateSerializer
        return serializers.WorkoutSerializerWithAuthor


class WorkoutUpload(APIView):
    def post(self, request):
        serializer = serializers.WorkoutUploadSerializer(
            data=request.data, context={'user': self.request.user})
        if serializer.is_valid():
            workout = serializer.save()
            if serializer.data.get('workout_to_create'):
                serializer.data['workout_to_create']['id'] = workout.id
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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['workout__title', 'workout__description', 'workout__author__username']
    pagination_class = DefaultPagination

    def get_queryset(self):
        qs = self.queryset.filter(user=self.request.user)

        difficulty_subq = models.ExcerciseInWorkout.objects.filter(workout=OuterRef('id')).annotate(
            calc_difficulty=Func(Coalesce('exercise__difficulty', Value(
                0.0), output_field=FloatField()), function="Avg")
        ).order_by('calc_difficulty')
        time_subq = models.ExcerciseInWorkout.objects.filter(workout=OuterRef('id')).annotate(
            calc_time=Func(Coalesce('time', F('repeats') * Value(5.0),
                           Value(0.0), output_field=FloatField()), function="Sum")
        ).order_by('calc_time')
        calories_subq = models.ExcerciseInWorkout.objects.filter(workout=OuterRef('id')).annotate(
            calc_calories=Func(Coalesce(
                Coalesce(
                    F('time') / Value(60.0), F('repeats') * 5.0 / 60, Value(0.0), output_field=FloatField()
                ) * get_user_weight(self.request.user) * F('exercise__calories_burn_rate'), Value(0.0)
            ), function="Sum")
        ).order_by('calc_calories')
        rating_subq = models.Rating.objects.filter(workout=OuterRef('id')).annotate(
            calc_rating=Func(Coalesce('rate', Value(
                0.0), output_field=FloatField()), function="Avg")
        ).order_by('calc_rating')

        qs = qs.all().prefetch_related(
            Prefetch('workout',
                     models.Workout.objects
                     .annotate(avg_time=Coalesce(Subquery(time_subq.values('calc_time')[:1]), Value(0.0), output_field=FloatField()))
                     .annotate(difficulty=Coalesce(Subquery(difficulty_subq.values('calc_difficulty')[:1]), Value(0.0), output_field=FloatField()))
                     .annotate(sum_of_cb=Coalesce(Subquery(calories_subq.values('calc_calories')[:1]), Value(0.0), output_field=FloatField()))
                     .annotate(avg_rating=Coalesce(Subquery(rating_subq.values('calc_rating')[:1]), Value(0.0), output_field=FloatField()))
                     ))

        if self.action == 'list' and (ordering := self.request.query_params.get('ordering')) in \
            ['id', '-id', 'title', '-title', 'difficulty', '-difficulty', 'avg_time', '-avg_time',
             'sum_of_cb', '-sum_of_cb', 'avg_rating', '-avg_rating']:

            qs = qs.order_by(ordering)

        return qs

    # @method_decorator(cache_page(60*60*2))
    # def list(self, request, *args, **kwargs):
    #     return super().list(request, *args, **kwargs)

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
        instance = models.FavoriteWorkout.objects.filter(
            user__id=user_id, workout__id=workout_id)

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
        instance = models.Rating.objects.filter(
            user__id=user_id, workout__id=workout_id)

        if not instance.exists():
            return Response({'detail': 'Rating does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        self.perform_destroy(instance)
        return Response({'detail': 'Rating has been deleted.'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['put', 'patch'], url_path='update')
    def update_rating_by_workout(self, request):
        user_id = self.request.user.id
        serializer = serializers.RatingCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.update(
                instance=models.Rating.objects.get(
                    user__id=user_id,
                    workout__id=serializer.validated_data['workout'].id
                ),
                validated_data=serializer.validated_data)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
