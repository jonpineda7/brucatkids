import React, { useState, useEffect } from 'react';

const totalQuestions = 10;
const initialLives = 5;

const GameOverModal = ({ onGameOver }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>¡Game Over! ¡Bien Hecho!</h2>
      <p>No te rindas, sigue practicando la división.</p>
      <button onClick={onGameOver} className="modal-btn">
        Volver al inicio
      </button>
    </div>
  </div>
);

const GameDivision = ({ onGameOver }) => {
  // Etapa: "learning" o "challenge"
  const [stage, setStage] = useState("learning");
  // Estado para el divisor seleccionado (para aprender a dividir)
  const [selectedDivisor, setSelectedDivisor] = useState(null);

  // Estados para la etapa de desafío ("challenge")
  const [lives, setLives] = useState(initialLives);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Sonidos para feedback (verifica que las rutas sean correctas)
  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // En la etapa de challenge, se genera una pregunta de división.
  // Para evitar fracciones, se genera un cociente aleatorio y se calcula el dividendo.
  const generateQuestion = () => {
    const divisor = selectedDivisor;
    const quotient = Math.floor(Math.random() * 13) + 1; // Cociente entre 1 y 13
    const dividend = divisor * quotient;
    setCurrentQuestion({ dividend, divisor, correctAnswer: quotient });
  };

  // Función para mezclar un arreglo (para las opciones de respuesta)
  const shuffleArray = (array) => {
    let newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Genera las opciones de respuesta
  const getAnswerOptions = () => {
    if (!currentQuestion) return [];
    const { correctAnswer } = currentQuestion;
    let option1 = correctAnswer;
    let option2 = correctAnswer + 1;
    let option3 = correctAnswer - 1;
    if (option3 < 0) option3 = correctAnswer + 2;
    const options = [option1, option2, option3];
    return shuffleArray(options);
  };

  // Cada vez que se inicia la etapa challenge o se actualiza el número de pregunta, se genera una nueva pregunta.
  useEffect(() => {
    if (stage === "challenge") {
      generateQuestion();
      setLifeLost(false);
      setSelectedOption(null);
    }
  }, [questionNumber, stage]);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      correctSound.play();
      setScore(score + 1);
      setTimeout(() => {
        if (questionNumber + 1 >= totalQuestions) {
          alert(`¡Excelente! Has dominado la división con el divisor ${selectedDivisor}. ¡Felicidades!`);
          onGameOver();
        } else {
          setQuestionNumber(questionNumber + 1);
        }
      }, 1000);
    } else {
      wrongAnswerSound.play();
      const newLives = lives - 1;
      setLives(newLives);
      setLifeLost(true);
      setTimeout(() => {
        if (newLives <= 0) {
          setGameOver(true);
        } else {
          setQuestionNumber(questionNumber + 1);
        }
      }, 1000);
    }
  };

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < lives; i++) {
      hearts.push(
        <img
          key={i}
          src="/brucatkids/images/heart_full.png"
          alt="Heart"
          className={`heart-icon ${lifeLost && i === lives - 1 ? 'lost' : ''}`}
        />
      );
    }
    return hearts;
  };

  let content;
  if (stage === "learning") {
    if (!selectedDivisor) {
      // Pantalla para seleccionar el divisor (por ejemplo, de 2 a 13)
      content = (
        <div className="learning-stage">
          <h2>Aprende a Dividir</h2>
          <p>Elige el divisor que quieres aprender:</p>
          <div className="table-options">
            {Array.from({ length: 12 }, (_, i) => i + 2).map((num) => (
              <button key={num} onClick={() => setSelectedDivisor(num)}>
                Divisor {num}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      // Mostrar la lección: se muestra una grilla con la tabla de división para el divisor seleccionado.
      // Se generan operaciones donde el dividendo es el divisor multiplicado por un número (de 1 a 13) y el cociente es ese número.
      const rows = Array.from({ length: 13 }, (_, i) => i + 1);
      content = (
        <div className="learning-stage">
          <h2>División con {selectedDivisor}</h2>
          <div className="table-grid">
            {rows.map((num) => (
              <div key={num} className="table-cell">
                <span className="table-expression">
                  {selectedDivisor * num} ÷ {selectedDivisor} = {num}
                </span>
              </div>
            ))}
          </div>
          <p className="learning-instruction">
            ¡Mira cómo se reparten los objetos de forma equitativa, repítelo en voz alta y conviértete en un experto repartidor!
          </p>
          <button onClick={() => setStage("challenge")} className="next-button">
            ¡Listo, vamos a jugar!
          </button>
          <button onClick={() => setSelectedDivisor(null)} className="back-button">
            Volver
          </button>
        </div>
      );
    }
  } else if (stage === "challenge") {
    if (!currentQuestion) {
      content = <div>Cargando...</div>;
    } else if (gameOver) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else {
      content = (
        <div className="game-container">
          <h2 className="game-title">
            Desafío: División con {selectedDivisor}
          </h2>
          <div className="question">
            <p>
              {currentQuestion.dividend} ÷ {currentQuestion.divisor} = ?
            </p>
            <div className="answer-buttons">
              {getAnswerOptions().map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`answer-btn ${
                    selectedOption === option
                      ? option === currentQuestion.correctAnswer
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }`}
                  disabled={selectedOption !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="feedback">
            <div className="hearts">{renderHearts()}</div>
            <p>Puntaje: {score}</p>
          </div>
        </div>
      );
    }
  }

  return <div>{content}</div>;
};

export default GameDivision;