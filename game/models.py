from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class GameSession(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    best_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player.name} - {self.created_at}"

class GameResult(models.Model):
    session = models.ForeignKey(GameSession, on_delete=models.CASCADE)
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Score: {self.score} ({self.session})"