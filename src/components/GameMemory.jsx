import React, { useState } from 'react';

function GameMemory({ onScoreUpdate }) {
  const [score, setScore] = useState(0);

  const handleCorrectAnswer = () => {
    const newScore = score + 1;
    setScore(newScore);
    onScoreUpdate(newScore);
  };

  return (
    <div className="game">
      <h2>Juego de Memoria</h2>
      <button onClick={handleCorrectAnswer}>Respuesta Correcta</button>
      <button onClick={() => onScoreUpdate(0)}>Reiniciar Puntaje</button>
      <p>Puntaje: {score}</p>
    </div>
  );
}

export default GameMemory;