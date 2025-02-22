import React, { useState } from 'react';
import './App.css';

function App() {
  const [player1Height, setPlayer1Height] = useState(50);
  const [player1Distance, setPlayer1Distance] = useState(50);
  const [player2Height, setPlayer2Height] = useState(50);
  const [player2Distance, setPlayer2Distance] = useState(50);
  const [result, setResult] = useState('');
  const [winner, setWinner] = useState('');

  const simulateCoinflip = () => {
    const avgHeight = (Number(player1Height) + Number(player2Height)) / 2;
    const avgDistance = (Number(player1Distance) + Number(player2Distance)) / 2;

    const spins = Math.floor(avgHeight / 20);
    const bounces = Math.floor(avgDistance / 33);
    const coinResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const gameWinner = coinResult === 'Heads' ? 'Player 1' : 'Player 2';

    setResult(`Coin flipped with ${spins} spins and ${bounces} bounces. Result: ${coinResult}!`);
    setWinner(gameWinner);
  };

  const resetGame = () => {
    setPlayer1Height(50);
    setPlayer1Distance(50);
    setPlayer2Height(50);
    setPlayer2Distance(50);
    setResult('');
    setWinner('');
  };

  return (
    <div className="App">
      <h1>Unbiased Coinflip</h1>
      <div className="player-inputs">
        <div>
          <h2>Player 1</h2>
          <label>
            Height (1-100):
            <input
              type="number"
              min="1"
              max="100"
              value={player1Height}
              onChange={(e) => setPlayer1Height(e.target.value)}
            />
          </label>
          <label>
            Distance (1-100):
            <input
              type="number"
              min="1"
              max="100"
              value={player1Distance}
              onChange={(e) => setPlayer1Distance(e.target.value)}
            />
          </label>
        </div>
        <div>
          <h2>Player 2</h2>
          <label>
            Height (1-100):
            <input
              type="number"
              min="1"
              max="100"
              value={player2Height}
              onChange={(e) => setPlayer2Height(e.target.value)}
            />
          </label>
          <label>
            Distance (1-100):
            <input
              type="number"
              min="1"
              max="100"
              value={player2Distance}
              onChange={(e) => setPlayer2Distance(e.target.value)}
            />
          </label>
        </div>
      </div>
      <button onClick={simulateCoinflip}>Flip the Coin!</button>
      <button onClick={resetGame}>Reset Game</button>
      {result && (
        <div className="result">
          <p>{result}</p>
          <h3>Winner: {winner}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
