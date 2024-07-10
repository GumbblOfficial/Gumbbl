let timer = 10;
let countdown;
const timerElement = document.getElementById('timer');
const roundIndicator = document.getElementById('round-indicator');
const board = document.getElementById('board');
let clickCounts = [];
let playerSelections = {};
const botCount = 39;
let selectedCellIndex = null;
let round = 1;
let activePlayers = ['yo', ...Array.from({ length: botCount }, (_, i) => `bot${i + 1}`)];

function createBoard() {
    board.innerHTML = '';
    clickCounts = [];
    for (let i = 1; i <= 12; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        clickCounts.push(0);
    }
}

function startCountdown() {
    timer = 10;
    timerElement.textContent = timer;
    countdown = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer === 0) {
            clearInterval(countdown);
            endRound();
        }
    }, 1000);
}

function resetGame() {
    clearInterval(countdown);
    round = 1;
    roundIndicator.textContent = 'Round One';
    timer = 10;
    timerElement.textContent = timer;
    clickCounts.fill(0);
    selectedCellIndex = null;
    playerSelections = {};
    activePlayers = ['yo', ...Array.from({ length: botCount }, (_, i) => `bot${i + 1}`)];
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('selected');
        cell.textContent = '';
    });
    document.getElementById('winner-list').innerHTML = '';
    createBoard();
    startCountdown();
    startBots();
}

function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;
    if (selectedCellIndex !== null) {
        document.querySelector(`.cell[data-index='${selectedCellIndex}']`).classList.remove('selected');
    }
    if (selectedCellIndex === cellIndex) {
        selectedCellIndex = null;
        playerSelections['yo'] = null;
    } else {
        selectedCellIndex = cellIndex;
        playerSelections['yo'] = cellIndex;
        clickCounts[cellIndex - 1]++;
        event.target.classList.add('selected');
    }
}

function botSelectCell(botNumber) {
    const randomIndex = Math.floor(Math.random() * 12) + 1;
    clickCounts[randomIndex - 1]++;
    playerSelections[`bot${botNumber}`] = randomIndex;
}

function endRound() {
    const maxClicks = Math.max(...clickCounts);

    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = clickCounts[index];
    });

    const winningPlayers = [];
    for (const [player, cellIndex] of Object.entries(playerSelections)) {
        if (cellIndex && clickCounts[cellIndex - 1] === maxClicks) {
            winningPlayers.push(player === 'yo' ? 'You' : `Bot ${player.replace('bot', '')}`);
        }
    }

    const winnerList = document.getElementById('winner-list');
    winnerList.innerHTML = '';
    if (winningPlayers.length > 0) {
        winningPlayers.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = player;
            winnerList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'No winners in this round.';
        winnerList.appendChild(listItem);
    }

    if (winningPlayers.length >= 8) {
        setTimeout(() => {
            round++;
            if (round === 2) {
                roundIndicator.textContent = 'Round Two';
            }
            startNextRound(winningPlayers);
        }, 2000);
    } else {
        roundIndicator.textContent = 'FINISH';
    }
}

function startNextRound(winningPlayers) {
    clearInterval(countdown);
    clickCounts = [];
    selectedCellIndex = null;
    playerSelections = {};
    activePlayers = winningPlayers.map(player => player === 'You' ? 'yo' : `bot${player.replace('Bot ', '')}`);
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('selected');
        cell.textContent = '';
    });
    createBoard();
    startCountdown();
    startBots();
}

document.getElementById('reset-button').addEventListener('click', resetGame);

function startBots() {
    activePlayers.forEach(player => {
        if (player !== 'yo') {
            setTimeout(() => botSelectCell(player.replace('bot', '')), Math.random() * 10000);
        }
    });
}

createBoard();
startCountdown();
startBots();

