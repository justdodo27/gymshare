from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.generics import CreateAPIView, RetrieveDestroyAPIView, ListAPIView
from rest_framework.exceptions import NotAuthenticated

from .models import StatisticExercise, StatisticCalories
from .serializers import ExerciseDataSerializer, StatisticCaloriesSerializer, StatisticExerciseSerializer

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
    serializer_class = StatisticExerciseSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise NotAuthenticated("No Token Provided")
        return self.queryset.filter(user=self.request.user)

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

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise NotAuthenticated("No Token Provided")
        return self.queryset.filter(user=self.request.user)

class StatisticCaloriesDetail(RetrieveDestroyAPIView):
    queryset = StatisticCalories.objects.all()
    serializer_class = StatisticCaloriesSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            raise NotAuthenticated("No Token Provided")
        return self.queryset.filter(user=self.request.user)