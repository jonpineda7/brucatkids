import React, { useState } from 'react';
import './App.css';
import CharacterSelection from './components/CharacterSelection';
import GameSelection from './components/GameSelection';
import GameMath from './components/GameMath';
import GameColors from './components/GameColors';
import GameMemory from './components/GameMemory';
import Profile from './components/Profile';
import { soundSelectCharacter, soundSelectGame, soundCorrectAnswer, soundEvolution } from './utils/sounds';

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [score, setScore] = useState(0);
  const [evolutionLevel, setEvolutionLevel] = useState(0); // Controla la evolución del personaje

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setSelectedGame(null);
    setScore(0);
    setEvolutionLevel(0);
    soundSelectCharacter();  // Reproducir sonido cuando el personaje es seleccionado
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    soundSelectGame(); // Sonido cuando selecciona un juego
  };

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    if (newScore >= 10 && evolutionLevel === 0) {
      setEvolutionLevel(1);  // Evolución del personaje al llegar a un puntaje específico
      soundEvolution();  // Reproducir sonido cuando el personaje evoluciona
    }
  };

  return (
    <div className="App">
      <h1>¡Bienvenidos a BruCat Kids!</h1>
      {!selectedCharacter ? (
        <section>
          <h2>Selecciona tu personaje</h2>
          <CharacterSelection onSelect={handleCharacterSelect} />
        </section>
      ) : !selectedGame ? (
        <section>
          <h2>Selecciona un juego</h2>
          <GameSelection onSelect={handleGameSelect} />
        </section>
      ) : (
        <>
          <section>
            {selectedGame === 'math' && <GameMath onScoreUpdate={handleScoreUpdate} />}
            {selectedGame === 'colors' && <GameColors onScoreUpdate={handleScoreUpdate} />}
            {selectedGame === 'memory' && <GameMemory onScoreUpdate={handleScoreUpdate} />}
          </section>
          <section>
            <button onClick={() => setSelectedGame(null)}>Volver a los juegos</button>
          </section>
        </>
      )}
      <section>
        <Profile character={selectedCharacter} score={score} evolutionLevel={evolutionLevel} />
      </section>
    </div>
  );
}

export default App;