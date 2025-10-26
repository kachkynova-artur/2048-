// Инициализация игрового поля
const boardSize = 4;
let board = [];
let score = 0;

function initializeBoard() {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    addTile();
    addTile();
    updateBoard();
}

function addTile() {
    let emptyCells = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        let { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.style.backgroundColor = getTileColor(board[i][j]);
            tile.textContent = board[i][j] !== 0 ? board[i][j] : '';
            gameBoard.appendChild(tile);
        }
    }
    document.getElementById('score').textContent = `Score: ${score}`;
}

function getTileColor(value) {
    const colors = {
        0: '#ccc0b3',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#ff0000';
}

document.addEventListener('keydown', handleInput);

function handleInput(event) {
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    if (moved) {
        addTile();
        updateBoard();
        saveScore();
    }
}

// Реализация функций moveUp, moveDown, moveLeft, moveRight
function moveLeft() {
    let moved = false;
    for (let i = 0; i < boardSize; i++) {
        let row = board[i].filter(val => val !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j];
                row[j + 1] = 0;
                moved = true;
            }
        }
        row = row.filter(val => val !== 0);
        while (row.length < boardSize) {
            row.push(0);
        }
        if (board[i].join() !== row.join()) {
            moved = true;
        }
        board[i] = row;
    }
    return moved;
}

// Аналогично реализуйте moveRight, moveUp, moveDown (можно адаптировать moveLeft)

function saveScore() {
    // Отправка очков на сервер через AJAX
    fetch('/save_score/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ score: score })
    });
}

function getCSRFToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

initializeBoard();