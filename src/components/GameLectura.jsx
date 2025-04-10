import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';

// Ajusta la cantidad total de preguntas y las vidas si lo deseas
const totalQuestions = 3;
const initialLives = 3;

// Modal de Game Over, con diseño coherente a los otros juegos
const GameOverModal = ({ onGameOver }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>¡Game Over! ¡Bien Hecho!</h2>
      <p>No te rindas, sigue practicando la lectura.</p>
      <button onClick={onGameOver} className="modal-btn">
        Volver al inicio
      </button>
    </div>
  </div>
);

/**
 * Juego de Comprensión de Lectura
 * Etapa "learning": Se muestra un texto corto.
 * Etapa "challenge": Preguntas de opción múltiple para evaluar la comprensión.
 */
const GameLectura = ({ onGameOver, score, setScore }) => {
  // Etapas del juego: "learning" (lectura) o "challenge" (preguntas)
  const [stage, setStage] = useState("learning");

  // Estados para la etapa "challenge"
  const [lives, setLives] = useState(initialLives);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOverState, setGameOverState] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Almacena las preguntas y respuestas (aquí hay 3 de ejemplo)
  const readingQuestions = [
    {
      id: 1,
      question: "1. ¿Cómo se llama la protagonista del texto?",
      options: ["Carla", "Alicia", "Lucía"],
      correct: "Alicia",
    },
    {
      id: 2,
      question: "2. ¿Cuántos años tiene Alicia?",
      options: ["8 años", "10 años", "6 años"],
      correct: "8 años",
    },
    {
      id: 3,
      question: "3. ¿Qué hizo Alicia con su gato?",
      options: [
        "Lo llevó de paseo al parque",
        "Le dio de comer y jugó con él",
        "Lo regaló a su amiga"
      ],
      correct: "Le dio de comer y jugó con él",
    }
  ];

  // Texto corto que se muestra en la etapa "learning"
  // Puedes adaptarlo a la temática que quieras enseñar
  const readingText = `
    Alicia es una niña de 8 años a la que le encantan los gatos.
    Cada día, después de la escuela, Alicia llega a casa muy emocionada 
    porque su gato Misu la recibe con maullidos suaves.
    A veces, juegan juntos con una pelota o salen al patio.
    A Alicia le gusta darle un poco de comida a Misu, 
    asegurándose de que siempre esté feliz y bien cuidado.
  `;

  // Sonidos opcionales (ajusta las rutas si lo deseas)
  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // Pregunta actual basada en questionNumber
  const currentQuestion = readingQuestions[questionNumber];

  const handleAnswer = (option) => {
    setSelectedOption(option);
    // Comprueba si la opción es correcta
    if (option === currentQuestion.correct) {
      correctSound.play();
      setScore(prev => prev + 1);
      setTimeout(() => {
        if (questionNumber + 1 >= totalQuestions) {
          setShowSuccessModal(true);
        } else {
          setQuestionNumber(prev => prev + 1);
          setSelectedOption(null);
        }
      }, 800);
    } else {
      wrongAnswerSound.play();
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        if (newLives <= 0) {
          setGameOverState(true);
        } else {
          if (questionNumber + 1 >= totalQuestions) {
            setShowSuccessModal(true);
          } else {
            setQuestionNumber(prev => prev + 1);
            setSelectedOption(null);
          }
        }
      }, 800);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onGameOver(); 
  };

  let content;
  // Etapa "learning": se muestra el texto
  if (stage === "learning") {
    content = (
      <div className="learning-stage">
        <h2>Comprensión de Lectura</h2>
        <p className="learning-explanation">
          Lee con atención el siguiente texto:
        </p>
        <div className="text-container">
          <p>{readingText}</p>
        </div>
        <p className="learning-instruction">
          Cuando termines de leer, presiona el botón para responder las preguntas.
        </p>
        <button onClick={() => setStage("challenge")} className="next-button">
          ¡Listo, vamos a las preguntas!
        </button>
      </div>
    );
  }
  // Etapa "challenge": se muestran las preguntas
  else if (stage === "challenge") {
    if (gameOverState) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else if (!currentQuestion) {
      // Por si se excede la cantidad
      content = <div>No hay más preguntas.</div>;
    } else {
      content = (
        <div className="game-container">
          <h2 className="game-title">Desafío: Comprensión de Lectura</h2>
          <div className="reading-question">
            <p>{currentQuestion.question}</p>
            <div className="answer-buttons">
              {currentQuestion.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(opt)}
                  className={`answer-btn ${
                    selectedOption === opt
                      ? opt === currentQuestion.correct
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }`}
                  disabled={selectedOption !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="feedback">
            <div className="hearts">
              {Array.from({ length: lives }).map((_, i) => (
                <img
                  key={i}
                  src="/brucatkids/images/heart_full.png"
                  alt="Heart"
                  className="heart-icon"
                />
              ))}
            </div>
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
          message={`¡Excelente! Has completado la lectura con éxito. Sigue así y verás cómo cada día comprendes mejor los textos.`}
          onConfirm={closeSuccessModal}
        />
      )}
    </div>
  );
};

export default GameLectura;
