import React, { useState, useEffect } from 'react';

const SumasJuego = ({ lives, setLives, score, setScore }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3"); // Ruta del sonido de error

  const generateQuestion = () => {
    const level = questionNumber + 1;
    const num1 = Math.floor(Math.random() * (level * 10));
    const num2 = Math.floor(Math.random() * (level * 10));
    const correctAnswer = num1 + num2;

    setCurrentQuestion({ num1, num2, correctAnswer });
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
      setCorrectAnswers(prevCorrectAnswers => prevCorrectAnswers + 1);
    } else {
      setLives(prevLives => prevLives - 1);
      wrongAnswerSound.play();  // Reproducir sonido al equivocarse
    }

    if (lives > 1) {
      setQuestionNumber(prevNumber => prevNumber + 1);
      setAnswer('');
      generateQuestion();
    } else {
      alert('¡Game Over! Has perdido todas tus vidas');
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [questionNumber]);

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < lives; i++) {
      hearts.push(<span key={i} role="img" aria-label="heart">❤️</span>);
    }
    return hearts;
  };

  if (!currentQuestion) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Sumas de 3º Básico</h2>
      <div className="question">
        <p>{currentQuestion.num1} + {currentQuestion.num2} = ?</p>
        <div className="answer-buttons">
          {[currentQuestion.correctAnswer, currentQuestion.correctAnswer + 1, currentQuestion.correctAnswer - 1].map((option, index) => (
            <button key={index} onClick={() => handleAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="feedback">
        {lives > 0 ? (
          <>
            <p>Vidas: {renderHearts()}</p>
            <p>Puntaje: {score}</p>
          </>
        ) : (
          <p>¡Game Over!</p>
        )}
      </div>
    </div>
  );
};

export default SumasJuego;