import Profile from './Profile';
import React, { useState, useRef, useEffect } from 'react';
import SuccessModal from './SuccessModal';

const initialLives = 5;
const fraccionesSimples = [
  { label: '1/2', value: 0.5 },
  { label: '1/3', value: 1 / 3 },
  { label: '1/4', value: 0.25 },
  { label: '3/4', value: 0.75 },
];

const totalQuestions = 6;

const GameFracciones = ({ character, score: totalScore, onGameOver, setScore: setTotalScore }) => {
  const answerTimer = useRef(null);
  useEffect(() => () => clearTimeout(answerTimer.current), []);
  const [stage, setStage] = useState('learning');
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives);
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion);
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
    if (selected || showSuccessModal || showGameOver) return;
    setSelected(selectedOption);
    const isCorrect = selectedOption.label === currentQuestion.correct.label;
    const nextLives = lives - (isCorrect ? 0 : 1);
    if (isCorrect) {
      setScore(prev => prev + 1);
      setTotalScore(prev => prev + 1);
    }
    setLives(nextLives);
    answerTimer.current = setTimeout(() => {
      if (nextLives <= 0) setShowGameOver(true);
      else if (questionNumber + 1 >= totalQuestions) setShowSuccessModal(true);
      else {
        setQuestionNumber(prev => prev + 1);
        setCurrentQuestion(generateQuestion());
        setSelected(null);
      }
    }, 800);
  };

  if (showSuccessModal) {
    return <SuccessModal message={"¡Felicidades! Eres un maestro de las fracciones."} onConfirm={() => onGameOver(true)} />;
  }

  if (showGameOver) {
    return <div className="learning-stage"><h2>¡Sigue practicando!</h2><p>Se terminaron las vidas.</p><button onClick={() => onGameOver(false)}>Volver a los juegos</button></div>;
  }

  if (stage === 'learning') {
    return (
      <div className="learning-stage">
        <h2>Repartiendo la Pizza</h2>
        <p>Las fracciones representan partes de un todo. Por ejemplo:</p>
        <ul className="fraction-examples">
          <li><span aria-hidden="true">🍕</span><strong>1/2</strong><span>Una mitad</span></li>
          <li><span aria-hidden="true">🍕</span><strong>1/4</strong><span>Un cuarto</span></li>
          <li><span aria-hidden="true">🍕</span><strong>3/4</strong><span>Tres cuartos</span></li>
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
      <h2 className="game-title">¡Descubre la porción!</h2>
      <div className="fraction-hud"><Profile character={character} score={totalScore} compact /><span>🍕 Pregunta {questionNumber + 1} de {totalQuestions}</span></div>
      <p>¿Qué fracción representa esta pizza?</p>
      <img
        src={`/brucatkids/images/pizza_${currentQuestion.correct.label.replace('/', '-')}.png`}
        alt="Pizza"
        className="fraction-pizza"
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