import React, { useState } from "react";

function MathGame() {
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(null);
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const correctAnswer = num1 + num2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(answer) === correctAnswer) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
  };

  return (
    <div>
      <h2>Juego de Matemáticas</h2>
      <p>¿Cuánto es {num1} + {num2}?</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button type="submit">Responder</button>
      </form>

      {correct !== null && (
        <p>{correct ? "¡Correcto!" : "¡Inténtalo nuevamente!"}</p>
      )}
    </div>
  );
}

export default MathGame;