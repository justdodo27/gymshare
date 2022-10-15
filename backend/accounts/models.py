from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    email_plaintext_message = "{}?token={}".format(reverse('password_reset:reset-password-request'), reset_password_token.key)

    send_mail(
        # title:
        "Password Reset for {title}".format(title="Gymshare"),
        # message:
        email_plaintext_message,
        # from:
        "dominik.gymshare@gmail.com",
        # to:
        [reset_password_token.user.email]
    )


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    height = models.PositiveIntegerField(null=True, blank=True)
    weight = models.FloatField(validators=[MinValueValidator(0)], null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.user}\'s profile'

    class Meta:
        ordering = ['id']
