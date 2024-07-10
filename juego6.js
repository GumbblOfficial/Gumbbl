let player = null;
let playerGoal = null;
let fichas = 100;
let bet = null;
let gameOver = false;

document.addEventListener("DOMContentLoaded", function() {
    const cells = document.querySelectorAll(".cell");
    const message = document.getElementById("message");
    const playButton = document.getElementById("playButton");
    const fichasSpan = document.getElementById("fichas");
    const betButtons = document.querySelectorAll(".bet-button");

    betButtons.forEach(button => {
        button.addEventListener("click", function() {
            if (gameOver) return;
            bet = parseInt(this.getAttribute("data-value"));
            if (bet > fichas) {
                alert("You don't have enough fichas to place this bet!");
                return;
            }
            startGame();
        });
    });

    cells.forEach(cell => {
        cell.addEventListener("click", function() {
            if (!player || gameOver) return;
            determineWinner(this.id);
        });
    });

    function startGame() {
        player = Math.random() < 0.5 ? 1 : 2;
        playerGoal = player === 1 ? "same" : "different";
        highlightCells();
        message.textContent = "Choose a cell";
    }

    function highlightCells() {
        const cell1 = document.getElementById("cell1");
        const cell2 = document.getElementById("cell2");

        if (playerGoal === "same") {
            cell1.classList.add("half-blue-half-red");
            cell2.classList.add("half-blue-half-red");
        } else {
            cell1.classList.add("blue");
            cell2.classList.add("red");
        }

        setTimeout(() => {
            cell1.classList.remove("half-blue-half-red", "blue", "red");
            cell2.classList.remove("half-blue-half-red", "blue", "red");
        }, 2500);
    }

    function determineWinner(cellId) {
        const botChoice = Math.random() < 0.5 ? "cell1" : "cell2";
        const playerChoice = cellId;

        let result;
        if (playerGoal === "same") {
            result = (playerChoice === botChoice) ? "WIN" : "LOSE";
        } else {
            result = (playerChoice !== botChoice) ? "WIN" : "LOSE";
        }

        message.textContent = result;
        updateFichas(result);
        setTimeout(() => {
            if (fichas === 0) {
                gameOver = true;
                alert("Game Over! You have run out of fichas.");
            }
            if (!gameOver) {
                playButton.style.display = "block";
            }
        }, 2500);
    }

    playButton.addEventListener("click", function() {
        resetGame();
        this.style.display = "none";
    });

    function updateFichas(result) {
        if (result === "WIN") {
            fichas += bet;
        } else {
            fichas -= bet;
        }
        fichasSpan.textContent = fichas;
    }

    function resetGame() {
        player = null;
        playerGoal = null;
        bet = null;
        message.textContent = "";
        betButtons.forEach(button => {
            button.style.display = "inline-block";
        });
        if (fichas > 0) {
            gameOver = false;
        }
    }
});

