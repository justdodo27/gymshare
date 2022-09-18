from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from gymshareapi.dataset import WORKOUTS, EXERCISE_IN_WORKOUTS
from django.contrib.auth.models import User
from workouts.models import Exercise, Workout, ExcerciseInWorkout

class Command(BaseCommand):
    """
    Create a list of workout if none exist
    Example:
        manage.py initworkouts
    """

    def handle(self, *args, **options):
        if Workout.objects.count() == 0:
            for workout in WORKOUTS:
                workout_kwargs = {
                    'title': workout[1],
                    'description': workout[2],
                    'visibility': workout[3],
                    'cycles': workout[4]
                }
                author = User.objects.get(id=workout[0])
                print(f"Creating workout {workout_kwargs}")
                workout_obj = Workout.objects.create(**workout_kwargs, author=author)
                workout_obj.save()
        else:
            print('Workout already created')

        if ExcerciseInWorkout.objects.count() == 0:
            for ex_in_work in EXERCISE_IN_WORKOUTS:
                ex_work_kwargs = {
                    'order': ex_in_work[2],
                    'repeats': ex_in_work[3],
                    'time': ex_in_work[4],
                    'series': ex_in_work[5]
                }
                exercise = Exercise.objects.get(id=ex_in_work[0])
                workout = Workout.objects.get(id=ex_in_work[1])
                print(f"Creating exercise in workout {ex_work_kwargs}")
                ex_work_obj = ExcerciseInWorkout.objects.create(**ex_work_kwargs, exercise=exercise, workout=workout)
                ex_work_obj.save()
