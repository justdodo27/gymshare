from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from gymshareapi.dataset import EXERCISES
from workouts.models import Exercise
from random import randint, random, choice

class Command(BaseCommand):
    """
    Create a list of exercises if none exist
    Example:
        manage.py initexercises
    """

    def handle(self, *args, **options):
        if Exercise.objects.count() < 200:
            for i in range(200):

                exercise_kwargs = {
                    'title': f'Exercise {i}',
                    'description': f'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    'difficulty': randint(1,5),
                    "calories_burn_rate": randint(1,90) / randint(100, 3000),
                    "exercise_type": choice([Exercise.WITH_OWN_BODY_WEIGHT, Exercise.WITH_A_WEIGHT, Exercise.WITH_TIME]),
                }
                thumbnail = choice(['/backend/mediafiles/thumbnails/deadlift.png', '/backend/mediafiles/thumbnails/running-treadmill.png', '/backend/mediafiles/thumbnails/pushups.png', None])
                video = choice(['/backend/mediafiles/videos/push-ups.mp4', '/backend/mediafiles/videos/deadlift.mp4', '/backend/mediafiles/videos/running.mp4', None])
                print(f"Creating exercise {exercise_kwargs}")
                exercise = Exercise.objects.create(**exercise_kwargs)
                if thumbnail:
                    with open(thumbnail, 'rb') as img_file:
                        exercise.thumbnail.save(thumbnail.split('/')[-1], File(img_file), save=True)
                if video:
                    with open(video, 'rb') as video_file:
                        exercise.video.save(video.split('/')[-1], File(video_file), save=True)
                exercise.save()
        else:
            print('exercises already created.')

        