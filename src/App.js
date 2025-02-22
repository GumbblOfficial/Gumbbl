import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [player1Height, setPlayer1Height] = useState(50);
  const [player1Distance, setPlayer1Distance] = useState(50);
  const [player2Height, setPlayer2Height] = useState(50);
  const [player2Distance, setPlayer2Distance] = useState(50);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState('');
  const [winner, setWinner] = useState('');

  const simulateCoinflip = () => {
    setIsFlipping(true);
    const avgHeight = (Number(player1Height) + Number(player2Height)) / 2;
    const avgDistance = (Number(player1Distance) + Number(player2Distance)) / 2;

    const spins = Math.floor(avgHeight / 20) + 1; // Mínimo 1 spin
    const bounces = Math.floor(avgDistance / 33); // 0-3 rebotes

    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const gameWinner = coinResult === 'Heads' ? 'Player 1' : 'Player 2';
      setResult(`Spins: ${spins} | Bounces: ${bounces} | Result: ${coinResult}`);
      setWinner(gameWinner);
      setIsFlipping(false);
    }, 2000 + spins * 500); // Duración dinámica basada en spins
  };

  const resetGame = () => {
    setPlayer1Height(50);
    setPlayer1Distance(50);
    setPlayer2Height(50);
    setPlayer2Distance(50);
    setResult('');
    setWinner('');
    setIsFlipping(false);
  };

  return (
    <div className="casino-app">
      <h1 className="casino-title">Crypto Coinflip Royale</h1>

      <div className="player-zone">
        <motion.div className="player-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2>Player 1</h2>
          <label>
            Height (1-100)
            <input
              type="number"
              min="1"
              max="100"
              value={player1Height}
              onChange={(e) => setPlayer1Height(e.target.value)}
              disabled={isFlipping}
            />
          </label>
          <label>
            Distance (1-100)
            <input
              type="number"
              min="1"
              max="100"
              value={player1Distance}
              onChange={(e) => setPlayer1Distance(e.target.value)}
              disabled={isFlipping}
            />
          </label>
        </motion.div>

        <motion.div className="player-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2>Player 2</h2>
          <label>
            Height (1-100)
            <input
              type="number"
              min="1"
              max="100"
              value={player2Height}
              onChange={(e) => setPlayer2Height(e.target.value)}
              disabled={isFlipping}
            />
          </label>
          <label>
            Distance (1-100)
            <input
              type="number"
              min="1"
              max="100"
              value={player2Distance}
              onChange={(e) => setPlayer2Distance(e.target.value)}
              disabled={isFlipping}
            />
          </label>
        </motion.div>
      </div>

      <div className="action-zone">
        <motion.button
          className="casino-button"
          onClick={simulateCoinflip}
          disabled={isFlipping}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFlipping ? 'Flipping...' : 'Spin the Coin!'}
        </motion.button>
        <motion.button
          className="reset-button"
          onClick={resetGame}
          disabled={isFlipping}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>

      <AnimatePresence>
        {isFlipping && (
          <motion.div
            className="coin-animation"
            initial={{ y: -100, rotate: 0 }}
            animate={{
              y: [0, 50, -20, 30, 0],
              rotate: 360 * (Math.floor((player1Height + player2Height) / 40) + 1),
            }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 2 + Math.floor((player1Height + player2Height) / 40) * 0.5 }}
          >
            💰
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            className="result-zone"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>{result}</p>
            <h3 className="winner-text">Winner: {winner}</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
