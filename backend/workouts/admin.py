from django.contrib import admin

from .models import Exercise, FavoriteWorkout, Workout, ExcerciseInWorkout


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'difficulty', 'calories_burn_rate', 'exercise_type')


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'title', 'avg_time', 'visibility')


@admin.register(FavoriteWorkout)
class FavoriteWorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'workout', 'user')


@admin.register(ExcerciseInWorkout)
class ExerciseInWorkoutAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ExcerciseInWorkout._meta.get_fields()]
