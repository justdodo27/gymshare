from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
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
                print(f"Creating admin account for {username} ({email}) - {password}")
                admin = User.objects.create_user(username=username, password=password, email=email)
                admin.is_active = True
                admin.is_staff = True
                admin.is_superuser = True
                admin.save()
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

        