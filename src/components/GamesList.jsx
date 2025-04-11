import React from 'react';

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
      {/* Aquí agregamos la clase .games-list */}
      <ul className="games-list">
        {courseGames.map((game) => (
          <li key={game}>
            <button onClick={() => handleGameSelect(game)}>
              {game}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamesList;