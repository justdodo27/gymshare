from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from gymshareapi.dataset import WORKOUTS, EXERCISE_IN_WORKOUTS
from django.contrib.auth.models import User
from workouts.models import Exercise, Workout, ExcerciseInWorkout
from random import randint, choice

class Command(BaseCommand):
    """
    Create a list of workout if none exist
    Example:
        manage.py initworkouts
    """

    def handle(self, *args, **options):
        if Workout.objects.count() < 50:
            users = User.objects.all()
            for user in users:
                for i in range(2, 5):
                    workout_kwargs = {
                        'title': f"{user.username} workout {i}",
                        'description': f'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                        'visibility': Workout.PUBLIC,
                        'cycles': 1
                    }
                    author = user
                    thumbnail = choice([None, '/backend/mediafiles/thumbnails/admin_workout.png'])
                    print(f"Creating workout {workout_kwargs}")
                    workout_obj = Workout.objects.create(**workout_kwargs, author=author)
                    if thumbnail:
                        with open(thumbnail, 'rb') as img_file:
                            workout_obj.thumbnail.save(thumbnail.split('/')[-1], File(img_file), save=True)
                    workout_obj.save()
        else:
            print('Workout already created')

        if ExcerciseInWorkout.objects.count() < 50:
            exercises = Exercise.objects.all()
            workouts = Workout.objects.all()
            for workout in workouts:
                for i in range(randint(1, 3)):
                    exercise = choice(exercises)
                    ex_work_kwargs = {
                        'order': i+1,
                        'repeats': randint(2, 10) if exercise.exercise_type != Exercise.WITH_TIME else None,
                        'time': randint(10, 3600) if exercise.exercise_type == Exercise.WITH_TIME else None,
                        'series': randint(1, 3) if exercise.exercise_type != Exercise.WITH_TIME else None
                    }
                    print(f"Creating exercise in workout {ex_work_kwargs}")
                    ex_work_obj = ExcerciseInWorkout.objects.create(**ex_work_kwargs, exercise=exercise, workout=workout)
                    ex_work_obj.save()
