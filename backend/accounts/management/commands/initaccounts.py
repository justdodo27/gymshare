from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.core.files import File
from accounts.models import Profile
from gymshareapi.dataset import ADMINS, USERS
from random import randint

class Command(BaseCommand):
    """
    Create a list of accounts if none exist
    Example:
        manage.py initaccounts
    """

    def handle(self, *args, **options):
        if User.objects.count() < 500:
            for i in range(50):
                username = f"user{i}"
                email = f"user{i}@test.com"
                password = f"Strong2137"
                profile_picture = '/backend/mediafiles/profiles/admin_profile.png'
                print(f"Creating admin account for {username} ({email}) - {password}")
                admin = User.objects.create_user(username=username, password=password, email=email)
                admin.is_active = True
                admin.is_staff = True
                admin.is_superuser = True
                admin.save()

                admin_profile = Profile.objects.get(user=admin)
                admin_profile.height = randint(160, 200)
                admin_profile.weight = randint(60, 200) * 1.0
                if profile_picture:
                    with open(profile_picture, 'rb') as img_file:
                        admin_profile.profile_picture.save(profile_picture.split('/')[-1], File(img_file), save=True)
                admin_profile.save()
        else:
            print('Accounts already created.')

        