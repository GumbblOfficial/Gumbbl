// Variables globales
let player1Choice = null;
let player2Choice = null;

// Pantalla de bienvenida - iniciar el juego
document.getElementById('startGameBtn')?.addEventListener('click', () => {
    window.location.href = 'game.html'; // Ir a la pantalla del juego
});

// Juego - seleccionar casillas
document.querySelectorAll('.square').forEach(square => {
    square.addEventListener('click', (event) => {
        const player = prompt("¿Eres el Jugador 1 o el Jugador 2? (Escribe 1 o 2)");
        const squareId = event.target.getAttribute('data-id');

        if (player === '1') {
            player1Choice = squareId;
            event.target.style.backgroundColor = '#1e90ff'; // Efecto visual
        } else if (player === '2') {
            player2Choice = squareId;
            event.target.style.backgroundColor = '#ff6347'; // Efecto visual
        }

        if (player1Choice && player2Choice) {
            determineWinner(); // Determinar el ganador
        }
    });
});

// Determinar el ganador
function determineWinner() {
    if (player1Choice === player2Choice) {
        localStorage.setItem('result', 'Jugador 1 gana. Ambos eligieron la misma casilla.');
    } else {
        localStorage.setItem('result', 'Jugador 2 gana. Eligieron casillas diferentes.');
    }

    // Redirigir a la pantalla de resultados
    window.location.href = 'result.html';
}

// Pantalla de resultados - mostrar el resultado y jugar de nuevo
document.addEventListener('DOMContentLoaded', () => {
    const resultText = localStorage.getItem('result');
    if (resultText) {
        document.getElementById('gameResult').innerText = resultText;
    }

    document.getElementById('playAgainBtn')?.addEventListener('click', () => {
        window.location.href = 'index.html'; // Volver a la pantalla de bienvenida
    });
});
