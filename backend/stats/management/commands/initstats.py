from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from workouts.models import Exercise
from gymshareapi.dataset import STATISTIC_CALORIES, STATISTIC_EXERCISE
from stats.models import StatisticCalories, StatisticExercise
import random
import datetime as dt
from calendar import monthrange
import json

class Command(BaseCommand):
    """
    Create a list of statistics if none exist
    Example:
        manage.py initstats
    """

    def handle(self, *args, **options):
        if StatisticCalories.objects.count() == 0:
            for statistic_calories in STATISTIC_CALORIES:
                month = dt.datetime.now().replace(day=1)
                month = month.replace(month=11)
                month_last_date = monthrange(month.year, month.month)[1]
                for day in range(month_last_date):
                    month = month.replace(day=day+1)

                    stat_cal_kwargs = {
                        'date': month.strftime('%Y-%m-%d'),
                        'calories': statistic_calories.get('calories') * random.randint(1, 20),
                    }
                    user = User.objects.get(id=statistic_calories.get('user'))
                    print(f"Creating statistic calories {stat_cal_kwargs}")
                    stat_cal = StatisticCalories.objects.create(**stat_cal_kwargs, user=user)
                    stat_cal.save()
                month = month.replace(day=1)
                month = month.replace(month=10)
                month_last_date = monthrange(month.year, month.month)[1]
                for day in range(month_last_date):
                    month = month.replace(day=day+1)

                    stat_cal_kwargs = {
                        'date': month.strftime('%Y-%m-%d'),
                        'calories': statistic_calories.get('calories') * random.randint(1, 20),
                    }
                    user = User.objects.get(id=statistic_calories.get('user'))
                    print(f"Creating statistic calories {stat_cal_kwargs}")
                    stat_cal = StatisticCalories.objects.create(**stat_cal_kwargs, user=user)
                    stat_cal.save()
        else:
            print('Statistic Calories already created.')

        if StatisticExercise.objects.count() == 0:
            date_handler = lambda obj: (
                obj.isoformat()
                if isinstance(obj, (dt.datetime, dt.date))
                else None
            )
            
            month = dt.datetime.now().replace(day=1)
            month = month.replace(month=11)
            month_last_date = monthrange(month.year, month.month)[1]
            for day in range(month_last_date):
                month = month.replace(day=day+1)
                for statistic_exercise in STATISTIC_EXERCISE:
                    stat_ex_kwargs = {
                        'date': json.dumps(month, default=date_handler).strip('"'),
                        'repeats': statistic_exercise.get('repeats'),
                        'time': statistic_exercise.get('time'),
                        'weight': statistic_exercise.get('weight'),
                    }
                    exercise = Exercise.objects.get(id=statistic_exercise.get('exercise'))
                    user = User.objects.get(id=statistic_exercise.get('user'))
                    print(f"Creating statistic exercise {stat_ex_kwargs}")
                    stat_ex = StatisticExercise.objects.create(**stat_ex_kwargs, user=user, exercise=exercise)
                    stat_ex.save()
            month = dt.datetime.now().replace(day=1)
            month = month.replace(month=10)
            month_last_date = monthrange(month.year, month.month)[1]
            for day in range(month_last_date):
                month = month.replace(day=day+1)
                for statistic_exercise in STATISTIC_EXERCISE:
                    stat_ex_kwargs = {
                        'date': json.dumps(month, default=date_handler).strip('"'),
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
        