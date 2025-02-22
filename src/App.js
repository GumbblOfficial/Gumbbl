import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import coinHeads from './assets/coin-heads.png'; // Imagen para "cara"
import coinTails from './assets/coin-tails.png'; // Imagen para "cruz"
import './App.css';

const GRAVITY = 9.8; // m/s²
const SCALE_FACTOR = 10; // Escala para convertir metros a píxeles

function App() {
  const [gameState, setGameState] = useState('bet-selection'); // Estados: bet-selection, main, betting, flipping, result
  const [betAmount, setBetAmount] = useState(null); // Cantidad apostada
  const [playerChoice, setPlayerChoice] = useState(null); // 'Heads' o 'Tails'
  const [botChoice, setBotChoice] = useState(null); // Elección del bot
  const [playerParams, setPlayerParams] = useState({ height: 50, distance: 50 }); // Parámetros del jugador
  const [botParams, setBotParams] = useState({ height: 50, distance: 50 }); // Parámetros del bot
  const [isFlipping, setIsFlipping] = useState(false); // Estado de lanzamiento
  const [result, setResult] = useState(null); // Resultado: {coinResult, winner}
  const [trajectory, setTrajectory] = useState([]); // Puntos de la trayectoria para la línea discontinua
  const [finalTrajectory, setFinalTrajectory] = useState([]); // Trayectoria final para el lanzamiento

  // Opciones de apuesta
  const betOptions = [1, 5, 10, 20, 50, 100, 200, 500, 1000];

  // Calcular la trayectoria parabólica basada en parámetros
  const calculateTrajectory = (params) => {
    const vy = (params.height / 100) * 20; // Velocidad inicial en Y (m/s)
    const vx = (params.distance / 100) * 10; // Velocidad inicial en X (m/s)
    const tTotal = (2 * vy) / GRAVITY; // Tiempo total de vuelo
    const points = [];
    for (let t = 0; t <= tTotal; t += 0.1) {
      const x = vx * t * SCALE_FACTOR;
      const y = (vy * t - 0.5 * GRAVITY * t * t) * SCALE_FACTOR;
      points.push({ x, y: -y }); // Invertir Y para que suba en la pantalla
    }
    return points;
  };

  // Actualizar la trayectoria visual según los parámetros del jugador
  useEffect(() => {
    const points = calculateTrajectory(playerParams);
    setTrajectory(points);
  }, [playerParams]);

  // Seleccionar apuesta
  const selectBet = (amount) => {
    setBetAmount(amount);
    setGameState('main');
  };

  // Elegir Cara o Cruz
  const chooseSide = (side) => {
    setPlayerChoice(side);
    setBotChoice(side === 'Heads' ? 'Tails' : 'Heads');
    setGameState('betting');
  };

  // Generar parámetros aleatorios para el bot
  const generateBotParams = () => {
    const height = Math.floor(Math.random() * 100) + 1;
    const distance = Math.floor(Math.random() * 100) + 1;
    setBotParams({ height, distance });
  };

  // Calcular la trayectoria final basada en la media de parámetros
  const calculateFinalTrajectory = () => {
    const avgHeight = (playerParams.height + botParams.height) / 2;
    const avgDistance = (playerParams.distance + botParams.distance) / 2;
    const avgParams = { height: avgHeight, distance: avgDistance };
    const points = calculateTrajectory(avgParams);
    setFinalTrajectory(points);
  };

  // Iniciar el lanzamiento
  const startFlip = () => {
    generateBotParams();
    calculateFinalTrajectory();
    setIsFlipping(true);
    setGameState('flipping');
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const winner = coinResult === playerChoice ? 'You' : 'Bot';
      setResult({ coinResult, winner });
      setIsFlipping(false);
      setGameState('result');
    }, 3000); // Duración fija para simplificar
  };

  // Reiniciar el juego
  const playAgain = () => {
    setGameState('bet-selection');
    setBetAmount(null);
    setPlayerChoice(null);
    setBotChoice(null);
    setPlayerParams({ height: 50, distance: 50 });
    setBotParams({ height: 50, distance: 50 });
    setResult(null);
    setTrajectory([]);
    setFinalTrajectory([]);
  };

  return (
    <div className="casino-app">
      <AnimatePresence>
        {/* Pantalla de Selección de Apuesta */}
        {gameState === 'bet-selection' && (
          <motion.div
            key="bet-selection"
            className="bet-selection-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Selecciona tu apuesta</h2>
            <div className="bet-options">
              {betOptions.map((amount) => (
                <motion.button
                  key={amount}
                  onClick={() => selectBet(amount)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ${amount}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pantalla Principal: Elegir Cara o Cruz */}
        {gameState === 'main' && (
          <motion.div
            key="main"
            className="main-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Crypto Coinflip Royale</h1>
            <h3>Apuesta: ${betAmount}</h3>
            <p>Elige tu lado:</p>
            <div className="choice-buttons">
              <motion.button onClick={() => chooseSide('Heads')} whileHover={{ scale: 1.05 }}>
                Cara (Heads)
              </motion.button>
              <motion.button onClick={() => chooseSide('Tails')} whileHover={{ scale: 1.05 }}>
                Cruz (Tails)
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Pantalla de Parámetros */}
        {gameState === 'betting' && (
          <motion.div
            key="betting"
            className="betting-screen"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Ajusta tu lanzamiento</h2>
            <div className="player-zone">
              <div className="player-card">
                <h3>Tú ({playerChoice})</h3>
                <label>
                  Altura
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={playerParams.height}
                    onChange={(e) => setPlayerParams({ ...playerParams, height: Number(e.target.value) })}
                  />
                  <span>{playerParams.height}</span>
                </label>
                <label>
                  Distancia
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={playerParams.distance}
                    onChange={(e) => setPlayerParams({ ...playerParams, distance: Number(e.target.value) })}
                  />
                  <span>{playerParams.distance}</span>
                </label>
              </div>
            </div>
            <div className="coinflip-field">
              <svg className="trajectory-svg">
                <polyline
                  points={trajectory.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="white"
                  strokeDasharray="5,5"
                />
              </svg>
              <div className="coin-start">🪙</div>
            </div>
            <motion.button
              className="confirm-button"
              onClick={startFlip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lanzar moneda
            </motion.button>
          </motion.div>
        )}

        {/* Pantalla de Lanzamiento */}
        {gameState === 'flipping' && (
          <motion.div
            key="flipping"
            className="flipping-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>¡Lanzando la moneda!</h2>
            <motion.img
              src={coinHeads}
              alt="Coin"
              className="coin"
              animate={{
                x: finalTrajectory.map((p) => p.x),
                y: finalTrajectory.map((p) => p.y),
                rotate: [0, 360 * 5], // Giros durante el vuelo
              }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </motion.div>
        )}

        {/* Pantalla de Resultado */}
        {gameState === 'result' && result && (
          <motion.div
            key="result"
            className={`result-screen ${result.winner === 'You' ? 'win' : 'lose'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>¡{result.winner === 'You' ? 'Tú' : 'Bot'} ganas!</h2>
            <p>Resultado: {result.coinResult === 'Heads' ? 'Cara' : 'Cruz'}</p>
            <div className="prize-distribution">
              <p>Ganador recibe: ${betAmount * 1.9}</p>
              <p>Casa se lleva: ${betAmount * 0.1}</p>
            </div>
            {result.winner === 'You' && (
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
            >
              Jugar de nuevo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
