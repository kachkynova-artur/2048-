from django import forms
from .models import Player, GameSession

class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = ['name', 'email']

class GameSessionForm(forms.ModelForm):
    class Meta:
        model = GameSession
        fields = ['player', 'best_score']