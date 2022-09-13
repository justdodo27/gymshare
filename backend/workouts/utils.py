from accounts.models import Profile


def get_user_weight(user):
    if not user.is_anonymous:
        profile = Profile.objects.filter(user=user).first()

        if profile:
            return profile.weight

    return 65
