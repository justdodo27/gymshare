from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from gymshareapi.dataset import EXERCISES
from workouts.models import Exercise

class Command(BaseCommand):
    """
    Create a list of exercises if none exist
    Example:
        manage.py initexercises
    """

    def handle(self, *args, **options):
        if Exercise.objects.count() == 0:
            for exercise in EXERCISES:
                exercise_kwargs = {
                    'title': exercise[0],
                    'description': exercise[1],
                    'difficulty': exercise[2],
                    "calories_burn_rate":exercise[3],
                    "exercise_type": exercise[6],
                }
                thumbnail = exercise[4]
                video = exercise[5]
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

        