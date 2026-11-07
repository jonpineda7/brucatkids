import '../assets/GameSelection.css';
import React from 'react';

const gameDetails = {
  Suma: { symbol: '+', color: 'mint', description: '¡Construye con energía!', tag: 'Juntar' },
  Resta: { symbol: '−', color: 'peach', description: 'Descubre cuánto queda', tag: 'Quitar' },
  Multiplicación: { symbol: '×', color: 'lavender', description: '¡El poder de los grupos!', tag: 'Agrupar' },
  División: { symbol: '÷', color: 'sky', description: 'Reparte y comparte', tag: 'Repartir' },
  Comparaciones: { symbol: '≷', color: 'rose', description: '¿Cuál es el mayor?', tag: 'Comparar' },
  Fracciones: { symbol: '½', color: 'lemon', description: 'Explora las partes', tag: 'Descubrir' },
};

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
    <section className="game-picker" aria-labelledby="game-picker-title">
      <header className="game-picker-heading">
        <div>
          <p className="game-picker-eyebrow">TU PRÓXIMA AVENTURA</p>
          <h2 id="game-picker-title">¿A qué jugamos hoy?</h2>
          <p>Elige un desafío y haz crecer a tu personaje.</p>
        </div>
        <span className="game-picker-course">{category} · {course}</span>
      </header>
      <div className="game-picker-grid">
        {courseGames.map((game) => {
          const detail = gameDetails[game];
          return (
            <button type="button" key={game} className={`game-picker-card theme-${detail?.color || 'sky'}`}
              onClick={() => handleGameSelect(game)} aria-label={`Jugar ${game}`}>
              <span className="game-picker-symbol" aria-hidden="true">
                {detail ? detail.symbol : <img src={`${import.meta.env.BASE_URL}images/icon_${removeAccents(game.toLowerCase())}.png`} alt="" />}
              </span>
              <span className="game-picker-copy">
                <span className="game-picker-name">{game}</span>
                <span className="game-picker-description">{detail?.description || '¡Vamos a explorar!'}</span>
              </span>
              <span className="game-picker-footer" aria-hidden="true">
                <span>{detail?.tag || 'Explorar'}</span><span className="game-picker-play">Jugar <span>→</span></span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default GamesList;