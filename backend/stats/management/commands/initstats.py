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
        if StatisticCalories.objects.count() < 500:
            users = User.objects.all()
            for user in users:
                month = dt.datetime.now().replace(day=1)
                month = month.replace(month=4)
                month_last_date = monthrange(month.year, month.month)[1]
                for day in range(month_last_date):
                    month = month.replace(day=day+1)

                    stat_cal_kwargs = {
                        'date': month.strftime('%Y-%m-%d'),
                        'calories': random.randint(20, 50) * random.randint(1, 20),
                    }
                    print(f"Creating statistic calories {stat_cal_kwargs}")
                    stat_cal = StatisticCalories.objects.create(**stat_cal_kwargs, user=user)
                    stat_cal.save()
                month = month.replace(day=1)
                month = month.replace(month=5)
                month_last_date = monthrange(month.year, month.month)[1]
                for day in range(month_last_date):
                    month = month.replace(day=day+1)

                    stat_cal_kwargs = {
                        'date': month.strftime('%Y-%m-%d'),
                        'calories': random.randint(20, 50) * random.randint(1, 20),
                    }
                    print(f"Creating statistic calories {stat_cal_kwargs}")
                    stat_cal = StatisticCalories.objects.create(**stat_cal_kwargs, user=user)
                    stat_cal.save()
            print('Done stats calories')
        else:
            print('Statistic Calories already created.')

        if StatisticExercise.objects.count() < 500:
            users = User.objects.all()
            exercises = Exercise.objects.all()
            for user in users:
                date_handler = lambda obj: (
                    obj.isoformat()
                    if isinstance(obj, (dt.datetime, dt.date))
                    else None
                )
                
                month = dt.datetime.now().replace(day=1)
                month = month.replace(month=4)
                month_last_date = monthrange(month.year, month.month)[1]
                for day in range(month_last_date):
                    month = month.replace(day=day+1)
                    for i in range(random.randint(3, 8)):
                        exercise = random.choice(exercises)
                        stat_ex_kwargs = {
                            'date': json.dumps(month, default=date_handler).strip('"'),
                            'repeats': random.randint(2, 10) if exercise.exercise_type != Exercise.WITH_TIME else None,
                            'time': random.randint(10, 3600) if exercise.exercise_type == Exercise.WITH_TIME else None,
                            'weight': random.randint(1, 3) if exercise.exercise_type != Exercise.WITH_TIME else None
                        }
                        print(f"Creating statistic exercise {stat_ex_kwargs}")
                        stat_ex = StatisticExercise.objects.create(**stat_ex_kwargs, user=user, exercise=exercise)
                        stat_ex.save()
                month = dt.datetime.now().replace(day=1)
                month = month.replace(month=5)
                month_last_date = monthrange(month.year, month.month)[1]
                for day in range(month_last_date):
                    month = month.replace(day=day+1)
                    for i in random.randint(3, 8):
                        exercise = random.choice(exercises)
                        stat_ex_kwargs = {
                            'date': json.dumps(month, default=date_handler).strip('"'),
                            'repeats': random.randint(2, 10) if exercise.exercise_type != Exercise.WITH_TIME else None,
                            'time': random.randint(10, 3600) if exercise.exercise_type == Exercise.WITH_TIME else None,
                            'weight': random.randint(1, 3) if exercise.exercise_type != Exercise.WITH_TIME else None
                        }
                        print(f"Creating statistic exercise {stat_ex_kwargs}")
                        stat_ex = StatisticExercise.objects.create(**stat_ex_kwargs, user=user, exercise=exercise)
                        stat_ex.save()
            print('Done stats exercises')
        else:
            print('Statistic Exercise already created.')
        