// src/components/GameView.jsx
import React, { useState } from 'react';
import { soundLifeLost } from '../utils/sounds'; // Para el sonido de vida perdida

function GameView({ game, lives }) {
  const [remainingLives, setRemainingLives] = useState(lives);

  const handleLifeLost = () => {
    soundLifeLost();
    setRemainingLives(remainingLives - 1);
  };

  return (
    <div>
      <h2>Jugando: {game}</h2>
      <p>Vidas restantes: {remainingLives}</p>
      <div className="lives">
        {Array.from({ length: remainingLives }).map((_, index) => (
          <img key={index} src="/brucatkids/images/heart.png" alt="Heart" />
        ))}
      </div>
      {remainingLives <= 0 ? (
        <div>Game Over</div>
      ) : (
        <button onClick={handleLifeLost}>Perder Vida</button> // Simula la pérdida de vida
      )}
    </div>
  );
}

export default GameView;