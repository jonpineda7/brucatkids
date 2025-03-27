import React, { useState, useEffect } from 'react';

const totalQuestions = 10;
const initialLives = 5;

const GameOverModal = ({ onGameOver }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>¡Game Over! ¡Bien Hecho!</h2>
        <p>No te rindas, sigue practicando las tablas.</p>
        <button onClick={onGameOver} className="modal-btn">
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

const GameMultiplicacion = ({ onGameOver }) => {
  const [lives, setLives] = useState(initialLives);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Rutas de sonidos (asegúrate de que los archivos existan)
  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // Genera una pregunta de multiplicación utilizando factores del 1 al 13
  const generateQuestion = () => {
    const factor1 = Math.floor(Math.random() * 13) + 1;
    const factor2 = Math.floor(Math.random() * 13) + 1;
    const correctAnswer = factor1 * factor2;
    setCurrentQuestion({ factor1, factor2, correctAnswer });
  };

  // Función para mezclar un arreglo
  const shuffleArray = (array) => {
    let newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Genera opciones de respuesta basadas en el resultado correcto
  const getAnswerOptions = () => {
    if (!currentQuestion) return [];
    const { correctAnswer } = currentQuestion;
    let option1 = correctAnswer;
    let option2 = correctAnswer + 1;
    let option3 = correctAnswer - 1;
    if (option3 < 0) {
      option3 = correctAnswer + 2;
    }
    const options = [option1, option2, option3];
    return shuffleArray(options);
  };

  useEffect(() => {
    generateQuestion();
    setLifeLost(false);
    setSelectedOption(null);
  }, [questionNumber]);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      correctSound.play();
      setScore(score + 1);
      setTimeout(() => {
        if (questionNumber + 1 >= totalQuestions) {
          alert('¡Genial! Has aprendido muy bien las tablas. ¡Felicidades!');
          onGameOver(); // Vuelve al home
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

  if (!currentQuestion) {
    return <div>Cargando...</div>;
  }

  if (gameOver) {
    return <GameOverModal onGameOver={onGameOver} />;
  }

  return (
    <div className="game-container">
      <h2 className="game-title">Multiplicación - Aprende las Tablas</h2>
      <div className="question">
        <p>
          {currentQuestion.factor1} x {currentQuestion.factor2} = ?
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
};

export default GameMultiplicacion;