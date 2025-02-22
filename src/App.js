import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('main'); // main, matchmaking, betting, flipping, result
  const [player1, setPlayer1] = useState({ height: 50, distance: 50 });
  const [player2, setPlayer2] = useState({ height: 50, distance: 50 });
  const [averageHeight, setAverageHeight] = useState(50);
  const [averageDistance, setAverageDistance] = useState(50);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null); // null, {coinResult, winner}
  const [countdown, setCountdown] = useState(3);

  // Update averages when sliders change
  const updateAverages = () => {
    setAverageHeight((player1.height + player2.height) / 2);
    setAverageDistance((player1.distance + player2.distance) / 2);
  };

  // Handle "Join a Match" click
  const joinMatch = () => {
    setGameState('matchmaking');
    setTimeout(() => setGameState('betting'), 3000); // Simulates opponent found in 3s
  };

  // Confirm parameters and start countdown
  const confirmParameters = () => {
    setGameState('flipping');
    let timer = 3;
    const countdownInterval = setInterval(() => {
      setCountdown(timer);
      timer -= 1;
      if (timer < 0) {
        clearInterval(countdownInterval);
        startFlip();
      }
    }, 1000);
  };

  // Simulate coin flip with physics-based animation
  const startFlip = () => {
    setIsFlipping(true);
    const spins = Math.max(1, Math.floor(averageHeight / 20)); // More height = more spins
    const bounces = Math.floor(averageDistance / 33); // More distance = more bounces
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const winner = coinResult === 'Heads' ? 'Player 1' : 'Player 2';
      setResult({ coinResult, winner, spins, bounces });
      setIsFlipping(false);
      setGameState('result');
    }, 3000 + spins * 500); // Animation duration scales with spins
  };

  // Reset game for "Play Again"
  const playAgain = () => {
    setGameState('betting');
    setResult(null);
    setPlayer1({ height: 50, distance: 50 });
    setPlayer2({ height: 50, distance: 50 });
    setAverageHeight(50);
    setAverageDistance(50);
  };

  return (
    <div className="casino-app">
      <AnimatePresence>
        {/* Main Screen */}
        {gameState === 'main' && (
          <motion.div
            key="main"
            className="main-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="casino-title">Crypto Coinflip Royale</h1>
            <motion.button
              className="join-button"
              onClick={joinMatch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } }}
            >
              Join a Match
            </motion.button>
            <div className="menu">
              <button>Match History</button>
              <button>Profile</button>
              <button>Settings</button>
              <button>Withdraw Funds</button>
            </div>
          </motion.div>
        )}

        {/* Matchmaking Screen */}
        {gameState === 'matchmaking' && (
          <motion.div
            key="matchmaking"
            className="matchmaking-screen"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Finding Opponent...</h2>
            <motion.div
              className="chip-animation"
              animate={{ x: [-50, 50, -50], transition: { repeat: Infinity, duration: 2 } }}
            >
              💸💸💸
            </motion.div>
          </motion.div>
        )}

        {/* Betting Screen */}
        {gameState === 'betting' && (
          <motion.div
            key="betting"
            className="betting-screen"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Betting Table</h2>
            <motion.div
              className="pot"
              animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } }}
            >
              💰 $20 Pot
            </motion.div>
            <div className="player-zone">
              <div className="player-card">
                <h3>Player 1</h3>
                <label>
                  Height
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={player1.height}
                    onChange={(e) => {
                      setPlayer1({ ...player1, height: Number(e.target.value) });
                      updateAverages();
                    }}
                  />
                  <span>{player1.height}</span>
                </label>
                <label>
                  Distance
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={player1.distance}
                    onChange={(e) => {
                      setPlayer1({ ...player1, distance: Number(e.target.value) });
                      updateAverages();
                    }}
                  />
                  <span>{player1.distance}</span>
                </label>
              </div>
              <div className="player-card">
                <h3>Player 2</h3>
                <label>
                  Height
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={player2.height}
                    onChange={(e) => {
                      setPlayer2({ ...player2, height: Number(e.target.value) });
                      updateAverages();
                    }}
                  />
                  <span>{player2.height}</span>
                </label>
                <label>
                  Distance
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={player2.distance}
                    onChange={(e) => {
                      setPlayer2({ ...player2, distance: Number(e.target.value) });
                      updateAverages();
                    }}
                  />
                  <span>{player2.distance}</span>
                </label>
              </div>
            </div>
            <div className="average-display">
              Avg Height: {averageHeight.toFixed(1)} | Avg Distance: {averageDistance.toFixed(1)}
            </div>
            <motion.button
              className="confirm-button"
              onClick={confirmParameters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Confirm & Flip
            </motion.button>
          </motion.div>
        )}

        {/* Flipping Screen */}
        {gameState === 'flipping' && (
          <motion.div
            key="flipping"
            className="flipping-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {countdown > 0 ? (
              <motion.h2
                className="countdown"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {countdown}
              </motion.h2>
            ) : (
              <>
                <h2>Let’s Flip the Coin!</h2>
                <motion.div
                  className="coin"
                  animate={{
                    y: [0, -150, 0, -50, 0], // Coin rises and falls
                    rotate: 360 * Math.max(1, Math.floor(averageHeight / 20)), // Spins based on height
                    transition: { duration: 3 + Math.floor(averageHeight / 20) * 0.5, ease: 'easeInOut' },
                  }}
                >
                  💰
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* Result Screen */}
        {gameState === 'result' && result && (
          <motion.div
            key="result"
            className={`result-screen ${result.winner === 'Player 1' ? 'win' : 'lose'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>{result.winner} Wins!</h2>
            <p>Result: {result.coinResult}</p>
            <p>Spins: {result.spins} | Bounces: {result.bounces}</p>
            <div className="prize-distribution">
              <p>Winner получает $19</p>
              <p>House takes $1</p>
            </div>
            {result.winner === 'Player 1' && (
              <motion.div
                className="confetti"
                animate={{ opacity: [0, 1, 0], transition: { duration: 2, repeat: Infinity } }}
              >
                🎉🎉🎉
              </motion.div>
            )}
            <motion.button
              className="play-again-button"
              onClick={playAgain}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } }}
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
