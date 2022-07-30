from django.urls import include, path
from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'plans', views.WorkoutViewSet)
router.register(r'exercises', views.ExerciseViewSet)
router.register(r'exercises-in-workouts', views.ExerciseInWorkoutViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
