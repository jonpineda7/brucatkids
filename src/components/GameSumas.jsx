import React, { useState, useEffect } from 'react';

const totalQuestions = 10;
const initialLives = 5;

const GameOverModal = ({ onGameOver }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>¡Game Over! ¡Bien Hecho!</h2>
        <p>No te rindas, vuelve a intentarlo.</p>
        <button onClick={onGameOver} className="modal-btn">
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

const GameSumas = ({ onGameOver }) => {
  const [lives, setLives] = useState(initialLives);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Sonidos (verifica que las rutas sean correctas)
  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // Genera una nueva pregunta aleatoria
  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;
    setCurrentQuestion({ num1, num2, correctAnswer });
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

  // Genera opciones de respuesta y las mezcla
  const getAnswerOptions = () => {
    if (!currentQuestion) return [];
    const { correctAnswer } = currentQuestion;
    const options = [correctAnswer, correctAnswer + 1, correctAnswer - 1];
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
          alert('¡Ganaste! Felicitaciones por completar las sumas.');
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
      <h2 className="game-title">Sumas de 3º Básico</h2>
      <div className="question">
        <p>
          {currentQuestion.num1} + {currentQuestion.num2} = ?
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

export default GameSumas;