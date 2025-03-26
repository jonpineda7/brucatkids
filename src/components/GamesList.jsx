// src/components/GamesList.jsx
import React from 'react';

function GamesList({ category, onSelectGame }) {
  const games = {
    Matemáticas: ['BalloonPopMaths', 'MathQuiz'],
    Colores: ['ColorMatching', 'ColorSorter'],
    Memoria: ['MemoryGame', 'PatternMemory'],
  };

  return (
    <div>
      <h2>Juegos de {category}</h2>
      <ul>
        {games[category].map((game, index) => (
          <li key={index}>
            <button onClick={() => onSelectGame(game)}>{game}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GamesList;