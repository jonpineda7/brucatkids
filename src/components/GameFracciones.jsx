import React, { useState } from 'react';
import SuccessModal from './SuccessModal';

const initialLives = 5;
const fraccionesSimples = [
  { label: '1/2', value: 0.5 },
  { label: '1/3', value: 1 / 3 },
  { label: '1/4', value: 0.25 },
  { label: '2/3', value: 2 / 3 },
  { label: '3/4', value: 0.75 },
];

const totalQuestions = 6;

const GameFracciones = ({ onGameOver }) => {
  const [stage, setStage] = useState('learning');
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives);
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
  const [selected, setSelected] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  function generateQuestion() {
    const correct = fraccionesSimples[Math.floor(Math.random() * fraccionesSimples.length)];
    const options = shuffleArray([
      correct,
      ...fraccionesSimples.filter(f => f.label !== correct.label).sort(() => 0.5 - Math.random()).slice(0, 2),
    ]);
    return { correct, options };
  }

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const handleAnswer = (selectedOption) => {
    setSelected(selectedOption);
    const isCorrect = selectedOption.label === currentQuestion.correct.label;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setTimeout(() => {
        if (questionNumber + 1 >= totalQuestions) {
          setShowSuccessModal(true);
        } else {
          setQuestionNumber(prev => prev + 1);
          setCurrentQuestion(generateQuestion());
          setSelected(null);
        }
      }, 800);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        if (newLives <= 0) {
          setShowGameOver(true);
        } else {
          setQuestionNumber(prev => prev + 1);
          setCurrentQuestion(generateQuestion());
          setSelected(null);
        }
      }, 800);
    }
  };

  if (showSuccessModal) {
    return <SuccessModal message={"¡Felicidades! Eres un maestro de las fracciones."} onConfirm={onGameOver} />;
  }

  if (showGameOver) {
    return <GameOverModal onGameOver={onGameOver} />;
  }

  if (stage === 'learning') {
    return (
      <div className="learning-stage">
        <h2>Repartiendo la Pizza</h2>
        <p>Las fracciones representan partes de un todo. Por ejemplo:</p>
        <ul>
          <li><strong>1/2</strong> = mitad</li>
          <li><strong>1/4</strong> = un cuarto</li>
          <li><strong>3/4</strong> = tres cuartos</li>
        </ul>
        <p className="learning-instruction">¿Estás listo para jugar?</p>
        <button className="next-button" onClick={() => setStage('challenge')}>
          ¡Sí, vamos a repartir pizza!
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h2 className="game-title">¿Qué fracción representa esta pizza?
      </h2>
      <img
        src={`/brucatkids/images/pizza_${currentQuestion.correct.label.replace('/', '-')}.png`}
        alt="Pizza"
        style={{ width: '200px', margin: '20px auto' }}
      />
      <div className="answer-buttons">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`answer-btn ${selected?.label === option.label ? (option.label === currentQuestion.correct.label ? 'correct' : 'incorrect') : ''}`}
            onClick={() => handleAnswer(option)}
            disabled={!!selected}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="feedback">
        <div className="hearts">
          {Array.from({ length: lives }, (_, i) => (
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
};

export default GameFracciones;