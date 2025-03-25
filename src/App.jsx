import React, { useState } from "react";
import "./App.css";
import MathGame from "./games/MathGame";  // Juego de matemáticas
import ColorGame from "./games/ColorGame";  // Juego de colores

// Lista de personajes con imágenes y sus versiones evolucionadas
const characters = [
  { name: "Robot", image: "/images/robot.png", evolution: "/images/robot-evolved.png" },
  { name: "Knight", image: "/images/knight.png", evolution: "/images/knight-evolved.png" },
  { name: "Fox", image: "/images/fox.png", evolution: "/images/fox-evolved.png" },
  { name: "Astronaut", image: "/images/astronaut.png", evolution: "/images/astronaut-evolved.png" },
  { name: "Scientist", image: "/images/scientist.png", evolution: "/images/scientist-evolved.png" },
];

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [game, setGame] = useState(null);  // Estado para los juegos

  // Función para seleccionar un personaje
  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setScore(0); // Reinicia el puntaje cuando el niño elige un personaje
    setLevel(0); // Reinicia el nivel al seleccionar un nuevo personaje
    setGame(null); // Reinicia el juego
  };

  // Función para incrementar el puntaje y hacer evolucionar el personaje
  const handleScoreIncrement = () => {
    setScore(score + 1);
    if (score >= 5 && level === 0) {
      setLevel(1); // Evoluciona al personaje cuando alcanza 5 puntos
    }
  };

  // Mostrar el juego dependiendo de la edad (basado en el puntaje o edad seleccionada)
  const handleStartGame = (gameType) => {
    setGame(gameType);
  };

  return (
    <div className="App">
      <h1>¡Elige tu personaje AHORA!</h1>
      <div className="character-selection">
        {characters.map((character) => (
          <div key={character.name} onClick={() => handleCharacterClick(character)}>
            <img src={character.image} alt={character.name} className="character-image" />
            <p>{character.name}</p>
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <div className="character-details">
          <h2>¡Bienvenido, {selectedCharacter.name}!</h2>
          <p>Puntaje: {score}</p>
          <p>Nivel: {level}</p>
          <img
            src={level === 0 ? selectedCharacter.image : selectedCharacter.evolution}
            alt={selectedCharacter.name}
            className="character-evolution"
          />
          <button onClick={handleScoreIncrement}>Ganar 1 punto</button>

          {/* Botones para empezar los juegos */}
          <div>
            <button onClick={() => handleStartGame("math")}>Jugar Matemáticas</button>
            <button onClick={() => handleStartGame("colors")}>Jugar Colores</button>
          </div>
        </div>
      )}

      {/* Condicional para mostrar los juegos */}
      {game === "math" && <MathGame />}
      {game === "colors" && <ColorGame />}
    </div>
  );
}

export default App;