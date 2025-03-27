import React, { useState } from 'react';
import CharacterSelection from './components/CharacterSelection';
import CategorySelection from './components/CategorySelection';
import GamesList from './components/GamesList';
import Profile from './components/Profile';
import GameSumas from './components/GameSumas';
import GameRestas from './components/GameRestas';
import GameMultiplicacion from './components/GameMultiplicacion';
import GameDivision from './components/GameDivision';

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

  const handleGameSelect = (game) => {
    if (game === 'Suma') {
      setSelectedGame(
        <GameSumas onGameOver={handleBack} />
      );
    } else if (game === 'Resta') {
      setSelectedGame(
        <GameRestas onGameOver={handleBack} />
      );
    } else if (game === 'Multiplicación') {
      setSelectedGame(
        <GameMultiplicacion onGameOver={handleBack} />
      );
    } else if (game === 'División') {
      setSelectedGame(
        <GameDivision onGameOver={handleBack} />
      );
    }
    // Puedes agregar otros juegos aquí...
  };

  const handleBack = () => {
    if (selectedGame) {
      setSelectedGame(null);
    } else if (category) {
      setCategory(null);
    } else if (course) {
      setCourse(null);
    } else if (character) {
      setCharacter(null);
    }
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
          <Profile character={character} />
          {course === null ? (
            <div>
              <button onClick={() => handleCourseSelect('KINDER')}>KINDER</button>
              <button onClick={() => handleCourseSelect('Tercero Básico')}>Tercero Básico</button>
            </div>
          ) : category === null ? (
            <CategorySelection course={course} onSelectCategory={handleCategorySelect} />
          ) : selectedGame === null ? (
            <GamesList category={category} course={course} onSelectGame={handleGameSelect} />
          ) : (
            <div>{selectedGame}</div>
          )}

          {character && (course || category || selectedGame) && (
            <button onClick={handleBack} className="back-button">Volver</button>
          )}
        </>
      )}
    </div>
  );
}

export default App;