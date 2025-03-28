import React, { useState } from 'react';
import CharacterSelection from './components/CharacterSelection';
import CategorySelection from './components/CategorySelection';
import GamesList from './components/GamesList';
import Profile from './components/Profile';
import GameSumas from './components/GameSumas';
import GameRestas from './components/GameRestas';
import GameMultiplicacion from './components/GameMultiplicacion';
import GameDivision from './components/GameDivision';
import BonusGame from './components/BonusGame'; // Importamos el bonus

function App() {
  const [character, setCharacter] = useState(null);
  const [course, setCourse] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  // Estado para la racha de juegos ganados consecutivos
  const [streak, setStreak] = useState(0);
  // Estado para activar el BonusGame
  const [bonusActive, setBonusActive] = useState(false);

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
        <GameSumas onGameOver={handleGameOver} score={score} setScore={setScore} />
      );
    } else if (game === 'Resta') {
      setSelectedGame(
        <GameRestas onGameOver={handleGameOver} score={score} setScore={setScore}  />
      );
    } else if (game === 'Multiplicación') {
      setSelectedGame(
        <GameMultiplicacion onGameOver={handleGameOver} score={score} setScore={setScore}  />
      );
    } else if (game === 'División') {
      setSelectedGame(
        <GameDivision onGameOver={handleGameOver} score={score} setScore={setScore}  />
      );
    }
  };

  // Esta función se invoca cuando finaliza un juego
  // Puedes definir en el juego si fue ganado o no y, según eso, actualizar la racha.
  // Aquí supongamos que onGameOver se llama al finalizar el juego.
  const handleGameOver = () => {
    // Aquí podrías evaluar si el juego se ganó (por ejemplo, si score aumentó o si se cumplió cierto criterio)
    // Para simplificar, supongamos que si se terminó el juego sin game over interno, aumentamos la racha.
    setStreak(prev => prev + 1);
    setSelectedGame(null);

    // Si se alcanza la racha de 3 juegos ganados, activamos el bonus
    if (streak + 1 >= 3) {
      setBonusActive(true);
      setStreak(0); // Reiniciamos la racha
    }
  };

  // Función que se llama cuando finaliza el BonusGame y devuelve los puntos extra obtenidos
  const handleBonusComplete = (bonusPoints) => {
    setScore(prev => prev + bonusPoints);
    setBonusActive(false);
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
          <Profile character={character} score={score} />
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

          {bonusActive && (
            <BonusGame onComplete={handleBonusComplete} />
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