from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from .models import Player, GameSession, GameResult
from .forms import PlayerForm, GameSessionForm
from django.contrib.auth.decorators import login_required

def home(request):
    return render(request, 'game/home.html')

@login_required
def create_player(request):
    if request.method == 'POST':
        form = PlayerForm(request.POST)
        if form.is_valid():
            player = form.save(commit=False)
            player.user = request.user
            player.save()
            return redirect('player_list')
    else:
        form = PlayerForm()
    return render(request, 'game/player_form.html', {'form': form})

@login_required
def player_list(request):
    players = Player.objects.all()
    return render(request, 'game/player_list.html', {'players': players})

@login_required
def update_player(request, pk):
    player = get_object_or_404(Player, pk=pk)
    if request.method == 'POST':
        form = PlayerForm(request.POST, instance=player)
        if form.is_valid():
            form.save()
            return redirect('player_list')
    else:
        form = PlayerForm(instance=player)
    return render(request, 'game/player_form.html', {'form': form})

@login_required
def create_session(request):
    if request.method == 'POST':
        form = GameSessionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('session_list')
    else:
        form = GameSessionForm()
    return render(request, 'game/session_form.html', {'form': form})

@login_required
def session_list(request):
    sessions = GameSession.objects.all()
    return render(request, 'game/session_list.html', {'sessions': sessions})

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
@login_required
def save_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        score = data.get('score')
        session = GameSession.objects.filter(player__user=request.user).latest('created_at')
        GameResult.objects.create(session=session, score=score)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)