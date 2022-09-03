from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from workouts.models import Exercise
from gymshareapi.dataset import STATISTIC_CALORIES, STATISTIC_EXERCISE
from stats.models import StatisticCalories, StatisticExercise

class Command(BaseCommand):
    """
    Create a list of statistics if none exist
    Example:
        manage.py initstats
    """

    def handle(self, *args, **options):
        if StatisticCalories.objects.count() == 0:
            for statistic_calories in STATISTIC_CALORIES:
                stat_cal_kwargs = {
                    'id': statistic_calories.get('id'),
                    'date': statistic_calories.get('date'),
                    'calories': statistic_calories.get('calories'),
                }
                user = User.objects.get(id=statistic_calories.get('user'))
                print(f"Creating statistic calories {stat_cal_kwargs}")
                stat_cal = StatisticCalories.objects.create(**stat_cal_kwargs, user=user)
                stat_cal.save()
        else:
            print('Statistic Calories already created.')

        if StatisticExercise.objects.count() == 0:
            for statistic_exercise in STATISTIC_EXERCISE:
                stat_ex_kwargs = {
                    'id': statistic_exercise.get('id'),
                    'date': statistic_exercise.get('date'),
                    'repeats': statistic_exercise.get('repeats'),
                    'time': statistic_exercise.get('time'),
                    'weight': statistic_exercise.get('weight'),
                }
                exercise = Exercise.objects.get(id=statistic_exercise.get('exercise'))
                user = User.objects.get(id=statistic_exercise.get('user'))
                print(f"Creating statistic exercise {stat_ex_kwargs}")
                stat_ex = StatisticExercise.objects.create(**stat_ex_kwargs, user=user, exercise=exercise)
                stat_ex.save()
        else:
            print('Statistic Exercise already created.')
        