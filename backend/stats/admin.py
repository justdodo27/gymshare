from django.contrib import admin
from .models import StatisticCalories, StatisticExercise

@admin.register(StatisticCalories)
class StatisticCaloriesAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'user', 'calories')

@admin.register(StatisticExercise)
class StaisticExerciseAdmin(admin.ModelAdmin):
    list_display = ('id', 'date', 'user', 'exercise')