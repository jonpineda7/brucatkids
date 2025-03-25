import React, { useState } from 'react';
import { soundCorrectAnswer } from '../utils/sounds';

function GameMath({ onScoreUpdate }) {
  const [score, setScore] = useState(0);

  const handleCorrectAnswer = () => {
    const newScore = score + 1;
    setScore(newScore);
    onScoreUpdate(newScore);
    soundCorrectAnswer();  // Reproducir sonido cuando la respuesta es correcta
  };

  return (
    <div className="game">
      <h2>Juego de Matemáticas</h2>
      <button onClick={handleCorrectAnswer}>Respuesta Correcta</button>
      <p>Puntaje: {score}</p>
    </div>
  );
}

export default GameMath;