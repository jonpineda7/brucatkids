import React, { useState, useEffect } from "react";

function BalloonPopMaths({ score, lives, onIncrementScore, onDecrementLives }) {
  const [balloons, setBalloons] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);

  const popBalloon = (isCorrect) => {
    if (isCorrect) {
      onIncrementScore();
    } else {
      onDecrementLives();
    }
  };

  return (
    <div>
      <h3>Balloon Pop Maths</h3>
      {!gameOver ? (
        <div>
          <div className="balloons">
            {/* Lógica para generar y mostrar los globos */}
            <button onClick={() => popBalloon(true)}>Correct Balloon</button>
            <button onClick={() => popBalloon(false)}>Wrong Balloon</button>
          </div>
          <div>
            <p>Puntaje: {score}</p>
            <p>Vidas: {lives}</p>
          </div>
        </div>
      ) : (
        <p>¡Juego terminado! Puntaje final: {score}</p>
      )}
    </div>
  );
}

export default BalloonPopMaths;