import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';

const totalQuestions = 10;
const initialLives = 5;

// Modal de Game Over, mismo estilo para mantener coherencia
const GameOverModal = ({ onGameOver }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>¡Game Over! ¡Bien Hecho!</h2>
      <p>No te rindas, sigue practicando la suma.</p>
      <button onClick={onGameOver} className="modal-btn">
        Volver al inicio
      </button>
    </div>
  </div>
);

const GameSumas = ({ onGameOver, score, setScore }) => {
  // Etapa actual: "learning" o "challenge"
  const [stage, setStage] = useState("learning");
  // Número base seleccionado para practicar la suma
  const [selectedBase, setSelectedBase] = useState(null);

  // Estados para la etapa de desafío ("challenge")
  const [lives, setLives] = useState(initialLives);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOverState, setGameOverState] = useState(false);
  // Controla la aparición del SuccessModal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Sonidos de feedback
  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // Genera una pregunta para la etapa de desafío
  const generateQuestion = () => {
    const base = selectedBase;
    const addend = Math.floor(Math.random() * 13) + 1; // Entre 1 y 13
    const correctAnswer = base + addend;
    setCurrentQuestion({ base, addend, correctAnswer });
  };

  // Mezcla un arreglo (para opciones de respuesta)
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

  // useEffect: al cambiar questionNumber o cambiar a stage "challenge", generamos una nueva pregunta
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
      setScore(prev => prev + 1);
      setTimeout(() => {
        // Si se alcanzó el total de preguntas, mostrar modal de éxito
        if (questionNumber + 1 >= totalQuestions) {
          setShowSuccessModal(true);
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

  // Renderiza los corazones para mostrar las vidas
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

  // Cierra el modal de éxito y llama a onGameOver para volver
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onGameOver();
  };

  let content;
  if (stage === "learning") {
    if (!selectedBase) {
      // Etapa de aprendizaje: explicación de la suma y selección del número base
      content = (
        <div className="learning-stage">
          <h2>Aprende a Sumar</h2>
          <p className="learning-explanation">
            La <strong>suma</strong> nos ayuda a saber cuántos elementos tenemos 
            cuando juntamos dos o más conjuntos. Por ejemplo, si tienes 3 manzanas 
            y obtienes 2 más, ahora tendrás 5 manzanas en total.
          </p>
          <p>Elige el número base para practicar la suma:</p>
          <div className="table-options">
            {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (
              <button key={num} onClick={() => setSelectedBase(num)}>
                Número {num}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      // Mostrar la "tabla" de suma con el número base
      const rows = Array.from({ length: 13 }, (_, i) => i + 1);
      content = (
        <div className="learning-stage">
          <h2>Suma con {selectedBase}</h2>
          <div className="table-grid">
            {rows.map((num) => (
              <div key={num} className="table-cell">
                <span className="table-expression">
                  {selectedBase} + {num} = {selectedBase + num}
                </span>
              </div>
            ))}
          </div>
          <p className="learning-instruction">
            ¡Mira cada operación, repítela en voz alta y conviértete en un experto en sumas!
          </p>
          <button onClick={() => setStage("challenge")} className="next-button">
            ¡Listo, vamos a jugar!
          </button>
          <button onClick={() => setSelectedBase(null)} className="back-button">
            Volver
          </button>
        </div>
      );
    }
  } else if (stage === "challenge") {
    if (!currentQuestion) {
      content = <div>Cargando...</div>;
    } else if (gameOverState) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else {
      content = (
        <div className="game-container">
          <h2 className="game-title">
            Desafío: Suma con {selectedBase}
          </h2>
          <div className="question">
            <p>
              {currentQuestion.base} + {currentQuestion.addend} = ?
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
          message={`¡Increíble trabajo! Has dominado la suma con ${selectedBase}. ¡Eres un verdadero campeón de las matemáticas! Sigue practicando y verás cómo cada día te vuelves más fuerte.`}
          onConfirm={closeSuccessModal}
        />
      )}
    </div>
  );
};

export default GameSumas;