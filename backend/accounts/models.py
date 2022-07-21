from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    height = models.PositiveIntegerField(null=True, blank=True)
    weight = models.FloatField(validators=[MinValueValidator(0)], null=True, blank=True)

    def __str__(self) -> str:
        return f'{self.user}\'s profile'

    class Meta:
        ordering = ['id']
