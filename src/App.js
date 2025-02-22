import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [player1Height, setPlayer1Height] = useState(50);
  const [player1Distance, setPlayer1Distance] = useState(50);
  const [player2Height, setPlayer2Height] = useState(50);
  const [player2Distance, setPlayer2Distance] = useState(50);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null); // Cambié a null para mejor control con AnimatePresence
  const [winner, setWinner] = useState('');

  const simulateCoinflip = () => {
    if (isFlipping) return; // Evita múltiples clics
    setIsFlipping(true);
    const avgHeight = (Number(player1Height) + Number(player2Height)) / 2;
    const avgDistance = (Number(player1Distance) + Number(player2Distance)) / 2;

    const spins = Math.max(1, Math.floor(avgHeight / 20)); // Mínimo 1 spin
    const bounces = Math.floor(avgDistance / 33);

    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const gameWinner = coinResult === 'Heads' ? 'Player 1' : 'Player 2';
      setResult({ spins, bounces, coinResult });
      setWinner(gameWinner);
      setIsFlipping(false);
    }, 2000 + spins * 500); // Tiempo dinámico basado en spins
  };

  const resetGame = () => {
    if (isFlipping) return; // Evita reset durante flip
    setPlayer1Height(50);
    setPlayer1Distance(50);
    setPlayer2Height(50);
    setPlayer2Distance(50);
    setResult(null);
    setWinner('');
  };

  return (
    <div className="casino-app">
      <motion.h1
        className="casino-title"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Crypto Coinflip Royale
      </motion.h1>

      <div className="player-zone">
        <motion.div
          className="player-card"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Player 1</h2>
          <label>
            Height (1-100)
            <input
              type="number"
              min="1"
              max="100"
              value={player1Height}
              onChange={(e) => setPlayer1Height(Math.min(100, Math.max(1, e.target.value)))}
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
              onChange={(e) => setPlayer1Distance(Math.min(100, Math.max(1, e.target.value)))}
              disabled={isFlipping}
            />
          </label>
        </motion.div>

        <motion.div
          className="player-card"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2>Player 2</h2>
          <label>
            Height (1-100)
            <input
              type="number"
              min="1"
              max="100"
              value={player2Height}
              onChange={(e) => setPlayer2Height(Math.min(100, Math.max(1, e.target.value)))}
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
              onChange={(e) => setPlayer2Distance(Math.min(100, Math.max(1, e.target.value)))}
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
          transition={{ duration: 0.2 }}
        >
          {isFlipping ? 'Flipping...' : 'Spin the Coin!'}
        </motion.button>
        <motion.button
          className="reset-button"
          onClick={resetGame}
          disabled={isFlipping}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Reset
        </motion.button>
      </div>

      <AnimatePresence>
        {isFlipping && (
          <motion.div
            className="coin-animation"
            initial={{ y: -100, rotate: 0, opacity: 1 }}
            animate={{
              y: [0, 50, -20, 30, 0],
              rotate: 360 * Math.max(1, Math.floor((player1Height + player2Height) / 40)),
              opacity: 1,
            }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              duration: 2 + Math.floor((player1Height + player2Height) / 40) * 0.5,
              ease: 'easeInOut',
            }}
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
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <p>Spins: {result.spins} | Bounces: {result.bounces} | Result: {result.coinResult}</p>
            <h3 className="winner-text">Winner: {winner}</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
