// src/components/GameMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameMenu = ({ character }) => {
  const navigate = useNavigate();

  const handleGameSelect = (game) => {
    navigate(`/${game}`); // Redirige a cada juego
  };

  return (
    <div className="game-menu-container">
      <h2>{`¡Hola, ${character}! Elige un juego para jugar`}</h2>
      <button onClick={() => handleGameSelect('game-math')}>Juego de Matemáticas</button>
      <button onClick={() => handleGameSelect('game-colors')}>Juego de Colores</button>
      <button onClick={() => handleGameSelect('game-memory')}>Juego de Memoria</button>
    </div>
  );
};

export default GameMenu;