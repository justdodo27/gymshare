from rest_framework.response import Response
from rest_framework import permissions, filters
from rest_framework.generics import CreateAPIView, RetrieveDestroyAPIView, ListAPIView
from rest_framework.exceptions import NotAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.postgres.expressions import ArraySubquery
from django.db.models.functions import JSONObject
from django.db.models import OuterRef

from .models import StatisticExercise, StatisticCalories
from gymshareapi.pagination import DefaultPagination
from .serializers import ExerciseDataSerializer, StatisticCaloriesSerializer, StatisticExerciseGetSerializer, StatisticExerciseSerializer
from workouts.models import Exercise


class SyncStats(CreateAPIView):
    """
    Synchronize user statistics.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExerciseDataSerializer

    def create(self, request, *args, **kwargs):
        serializer = ExerciseDataSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'info': 'ok'})
        return Response(serializer.errors)


class StatisticExerciseList(ListAPIView):
    queryset = StatisticExercise.objects.all()
    serializer_class = StatisticExerciseGetSerializer
    ordering_fields = ['date', '-date', 'repeats', '-repeats', 'time', '-time', 'weight', '-weight']
    # pagination_class = DefaultPagination

    def get_queryset(self):
        day = self.kwargs.get('day')
        month = self.kwargs.get('month')
        year = self.kwargs.get('year')
        if self.request.user.is_anonymous:
            raise NotAuthenticated("No Token Provided")
        if year and month and day:
            qs = StatisticExercise.objects.all().filter(user=self.request.user, date__year=f"{year}", date__month=f"{month}", date__day=f"{day}")
        else:
            qs = StatisticExercise.objects.all().filter(user=self.request.user)

        if (ordering := self.request.query_params.get('ordering')) in self.ordering_fields:
            stats_subq = qs.filter(exercise__id=OuterRef('id')).order_by(ordering).values(
                json=JSONObject(date='date', repeats='repeats', time='time', weight='weight')
            )
        else:
            stats_subq = qs.filter(exercise__id=OuterRef('id')).values(
                json=JSONObject(date='date', repeats='repeats', time='time', weight='weight')
            )

        final_qs = Exercise.objects.annotate(entries=ArraySubquery(stats_subq)).exclude(entries=[])

        if (exercise_id := self.request.query_params.get('exercise')):
            final_qs = final_qs.filter(id=exercise_id)

        return final_qs


class StatisticExerciseDetail(RetrieveDestroyAPIView):
    queryset = StatisticExercise.objects.all()
    serializer_class = StatisticExerciseSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise NotAuthenticated("No Token Provided")
        return self.queryset.filter(user=self.request.user)


class StatisticCaloriesList(ListAPIView):
    queryset = StatisticCalories.objects.all()
    serializer_class = StatisticCaloriesSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['date', ]
    # pagination_class = DefaultPagination

    def get_queryset(self):
        month = self.kwargs.get('month')
        year = self.kwargs.get('year')
        if self.request.user.is_anonymous:
            raise NotAuthenticated("No Token Provided")
        if year and month:
            return self.queryset.filter(user=self.request.user, date__year=f"{year}", date__month=f"{month}")
        return self.queryset.filter(user=self.request.user)


class StatisticCaloriesDetail(RetrieveDestroyAPIView):
    queryset = StatisticCalories.objects.all()
    serializer_class = StatisticCaloriesSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise NotAuthenticated("No Token Provided")
        return self.queryset.filter(user=self.request.user)
