import React from 'react';

function GameSelection({ onSelect }) {
  return (
    <div className="game-container">
      <button onClick={() => onSelect('math')}>Matemáticas</button>
      <button onClick={() => onSelect('colors')}>Colores</button>
      <button onClick={() => onSelect('memory')}>Memoria</button>
    </div>
  );
}

export default GameSelection;