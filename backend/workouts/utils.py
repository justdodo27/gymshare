from django.shortcuts import get_object_or_404

from accounts.models import Profile


def get_user_weight(user):
    if not user.is_anonymous:
        try:
            profile = get_object_or_404(Profile, user=user)
        except Profile.DoesNotExist:
            return 65

        if profile.weight:
            return profile.weight

    return 65
