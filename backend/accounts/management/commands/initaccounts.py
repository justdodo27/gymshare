from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.core.files import File
from accounts.models import Profile
from gymshareapi.dataset import ADMINS, USERS

class Command(BaseCommand):
    """
    Create a list of accounts if none exist
    Example:
        manage.py initaccounts
    """

    def handle(self, *args, **options):
        if User.objects.count() == 0:
            for user in ADMINS:
                username = user[0]
                email = user[1]
                password = user[2]
                profile_picture = user[3]
                print(f"Creating admin account for {username} ({email}) - {password}")
                admin = User.objects.create_user(username=username, password=password, email=email)
                admin.is_active = True
                admin.is_staff = True
                admin.is_superuser = True
                admin.save()

                admin_profile = Profile.objects.get(user=admin)
                if profile_picture:
                    with open(profile_picture, 'rb') as img_file:
                        admin_profile.profile_picture.save(profile_picture.split('/')[-1], File(img_file), save=True)
                admin_profile.save()
                
            for user in USERS:
                username = user[0]
                email = user[1]
                password = user[2]
                print(f"Creating user account for {username} ({email})")
                account = User.objects.create_user(username=username, password=password, email=email)
                account.is_active = True
                account.save()
        else:
            print('Accounts already created.')

        