import React, { useState } from 'react';
import CharacterSelection from './components/CharacterSelection';
import CategorySelection from './components/CategorySelection';
import GamesList from './components/GamesList';
import GameView from './components/GameView';
import Profile from './components/Profile';

function App() {
  const [character, setCharacter] = useState(null);
  const [course, setCourse] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);

  const handleCharacterSelect = (selectedCharacter) => {
    setCharacter(selectedCharacter);
  };

  const handleCourseSelect = (selectedCourse) => {
    setCourse(selectedCourse);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const handleGameSelect = (selectedGame) => {
    setSelectedGame(selectedGame);
  };

  return (
    <div id="app">
      {character === null ? (
        <div className="welcome-screen">
          <h1>¡Bienvenidos a BruCat Kids!</h1>
          <p>Selecciona tu personaje</p>
          <CharacterSelection onSelect={handleCharacterSelect} />
        </div>
      ) : (
        <>
          <Profile character={character} score={score} lives={lives} />
          {course === null ? (
            <div>
              <button onClick={() => handleCourseSelect('KINDER')}>KINDER</button>
              <button onClick={() => handleCourseSelect('Primero Básico')}>Primero Básico</button>
            </div>
          ) : category === null ? (
            <CategorySelection course={course} onSelectCategory={handleCategorySelect} />
          ) : selectedGame === null ? (
            <GamesList category={category} onSelectGame={handleGameSelect} />
          ) : (
            <GameView game={selectedGame} lives={lives} />
          )}
        </>
      )}
    </div>
  );
}

export default App;