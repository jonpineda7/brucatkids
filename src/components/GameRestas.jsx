import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';

const GameOverModal = ({ onGameOver }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>¡Game Over! ¡Bien Hecho!</h2>
      <p>No te rindas, sigue practicando la resta.</p>
      <button onClick={onGameOver} className="modal-btn">
        Volver al inicio
      </button>
    </div>
  </div>
);

const initialLives = 5;
const totalQuestions = 10;

const GameRestas = ({ onGameOver, score, setScore }) => {
  // Controla la etapa: "learning" o "challenge"
  const [stage, setStage] = useState('learning');
  // Número base (minuendo) seleccionado
  const [selectedBase, setSelectedBase] = useState(null);

  // Estados para la etapa challenge
  const [lives, setLives] = useState(initialLives);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOverState, setGameOverState] = useState(false);
  // Controla si mostramos el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sonidos de feedback
  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // Genera una pregunta de resta
  // Usamos "selectedBase" como minuendo y elegimos un sustraendo aleatorio [1, selectedBase]
  const generateQuestion = () => {
    const subtrahend = Math.floor(Math.random() * selectedBase) + 1;
    const correctAnswer = selectedBase - subtrahend;
    setCurrentQuestion({ minuendo: selectedBase, subtrahend, correctAnswer });
  };

  // Mezcla un arreglo para las opciones de respuesta
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

  // Cada vez que cambia el número de pregunta o la etapa es "challenge", se genera una nueva pregunta
  useEffect(() => {
    if (stage === 'challenge') {
      generateQuestion();
      setLifeLost(false);
      setSelectedOption(null);
    }
  }, [questionNumber, stage]);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      correctSound.play();
      setScore(prev => prev + 1);
      setTimeout(() => {
        if (questionNumber + 1 >= totalQuestions) {
          setShowSuccessModal(true);  // Mostramos el SuccessModal
        } else {
          setQuestionNumber(prev => prev + 1);
        }
      }, 1000);
    } else {
      wrongAnswerSound.play();
      const newLives = lives - 1;
      setLives(newLives);
      setLifeLost(true);
      setTimeout(() => {
        if (newLives <= 0) {
          setGameOverState(true);
        } else {
          setQuestionNumber(prev => prev + 1);
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

  // Cierra el modal de éxito y llama a onGameOver (para volver al home o listado de juegos)
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onGameOver();
  };

  let content;

  // Etapa "learning"
  if (stage === 'learning') {
    if (!selectedBase) {
      content = (
        <div className="learning-stage">
          <h2>Aprende a Restar</h2>
          {/* Resumen breve de la operación Resta */}
          <p className="learning-explanation">
            La <strong>resta</strong> nos ayuda a saber cuántos elementos quedan 
            cuando quitamos parte de un conjunto. Por ejemplo, si tienes 5 manzanas 
            y regalas 2, te quedan 3.
          </p>
          <p>Elige el número mayor (minuendo) para practicar la resta:</p>
          <div className="table-options">
            {Array.from({ length: 12 }, (_, i) => i + 2).map((num) => (
              <button key={num} onClick={() => setSelectedBase(num)}>
                Número {num}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      // Mostrar la "tabla" de resta: para cada i [1..selectedBase], mostramos "selectedBase - i = X"
      const rows = Array.from({ length: selectedBase }, (_, i) => i + 1);
      content = (
        <div className="learning-stage">
          <h2>Resta con {selectedBase}</h2>
          <div className="table-grid">
            {rows.map((num) => (
              <div key={num} className="table-cell">
                <span className="table-expression">
                  {selectedBase} - {num} = {selectedBase - num}
                </span>
              </div>
            ))}
          </div>
          <p className="learning-instruction">
            ¡Observa cada operación, repítela en voz alta y conviértete en un experto en restas!
          </p>
          <button onClick={() => setStage('challenge')} className="next-button">
            ¡Listo, vamos a jugar!
          </button>
          <button onClick={() => setSelectedBase(null)} className="back-button">
            Volver
          </button>
        </div>
      );
    }
  }

  // Etapa "challenge"
  else if (stage === 'challenge') {
    if (!currentQuestion) {
      content = <div>Cargando...</div>;
    } else if (gameOverState) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else {
      content = (
        <div className="game-container">
          <h2 className="game-title">
            Desafío: Resta con {selectedBase}
          </h2>
          <div className="question">
            <p>
              {currentQuestion.minuendo} - {currentQuestion.subtrahend} = ?
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

  return (
    <div>
      {content}
      {showSuccessModal && (
        <SuccessModal
          message={`¡Increíble trabajo! Has dominado la resta con ${selectedBase}. ¡Eres una verdadera estrella de las matemáticas! Sigue practicando y verás cómo cada día te vuelves más fuerte.`}
          onConfirm={closeSuccessModal}
        />
      )}
    </div>
  );
};

export default GameRestas;