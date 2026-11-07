import React from 'react';

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const GamesList = ({ category, course, onSelectGame }) => {
  const games = {
    KINDER: {
      Matemáticas: ['BalloonPopMaths', 'PuzzleNumbers'],
      Colores: ['ColorMatch', 'ColorPop'],
      Memoria: ['MemoryGame', 'MatchThePair'],
    },
    'Tercero Básico': {
      Lenguaje: ['WordPuzzle', 'LetterMatch'],
      Ciencias: ['ScienceQuiz', 'PlantGrowth'],
      Matemáticas: ['Suma', 'Resta', 'Multiplicación', 'División', 'Comparaciones', 'Fracciones'],
    },
  };

  const courseGames = games[course] && games[course][category];

  if (!courseGames) {
    return <p>No hay juegos disponibles para esta categoría.</p>;
  }

  const handleGameSelect = (game) => {
    onSelectGame(game);
  };

  return (
    <div>
      <h2>Juegos de {category} en {course}</h2>
      <div className="games-grid">
        {courseGames.map((game) => (
          <button type="button" key={game} className="game-card" onClick={() => handleGameSelect(game)}>
            <img src={`/brucatkids/images/icon_${removeAccents(game.toLowerCase())}.png`} alt={game} className="game-icon" />
            <span>{game}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GamesList;