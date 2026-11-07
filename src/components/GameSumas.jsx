import React, { useState, useEffect, useRef, useCallback } from 'react';
import VillainBar from './VillainBar';
import SuccessModal from './SuccessModal';
import VillainDefeatedModal from './VillainDefeatedModal';

const GameSumas = ({ character, lives, setLives, score, setScore, onGameOver }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [villainHP, setVillainHP] = useState(5);
  const [villainMaxHP] = useState(5);
  const [villainDefeated, setVillainDefeated] = useState(false);

  const answerTimer = useRef(null);

  useEffect(() => () => clearTimeout(answerTimer.current), []);

  const safeCharacter = character || "robot";

  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");


  const generateQuestion = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const correct = num1 + num2;

    const answers = [correct];
    while (answers.length < 4) {
      const wrong = Math.floor(Math.random() * 20);
      if (!answers.includes(wrong)) answers.push(wrong);
    }

    setCurrentQuestion({ num1, num2, correct });
    setOptions(shuffleArray(answers));
    setSelectedOption(null);
  }, []);

  useEffect(() => { generateQuestion(); }, [generateQuestion]);

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswer = (answer) => {
    if (selectedOption !== null) return;
    setSelectedOption(answer);

    if (answer === currentQuestion.correct) {
      setScore(prev => prev + 1);
      new Audio('/brucatkids/sounds/correct.mp3').play().catch(() => {});
      const nextHP = Math.max(0, villainHP - 1);
      setVillainHP(nextHP);
      if (nextHP === 0) {
        answerTimer.current = setTimeout(() => setVillainDefeated(true), 1000);
        return;
      }
    } else {
      wrongAnswerSound.play().catch(() => {});
      const nextLives = Math.max(0, lives - 1);
      setLives(nextLives);
      if (nextLives === 0) {
        answerTimer.current = setTimeout(() => onGameOver(false), 500);
        return;
      }
    }
    answerTimer.current = setTimeout(generateQuestion, 1000);
  };

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < 5; i++) {
      hearts.push(
        <img
          key={i}
          src={`/brucatkids/images/${i < lives ? 'heart_full' : 'heart_empty'}.png`}
          alt="heart"
          className="heart-icon"
        />
      );
    }
    return hearts;
  };

  function closeSuccessModal() {
    setShowSuccessModal(false);
    onGameOver(true);
  }

  if (!currentQuestion) return null;

  return (
    <div className="game-container p-4">
      {/* Vista VS estilo arcade */}
      <div className="versus-intro bg-gradient-to-r from-blue-100 to-pink-100 p-6 rounded-xl border-4 border-yellow-400 mb-6 flex items-center justify-between">
        <div className="versus-character text-center w-1/3">
          <img src={`/brucatkids/images/${safeCharacter}.png`} alt="Héroe" className="versus-img mb-2" />
          <h3 className="text-xl font-bold text-blue-800">{safeCharacter.toUpperCase()}</h3>
          <div className="flex justify-center mt-2">{renderHearts()}</div>
        </div>
        <div className="versus-center w-1/3 text-center">
          <span className="vs-icon inline-block" aria-label="contra">VS</span>
        </div>
        <div className="versus-character text-center w-1/3">
          <img src="/brucatkids/images/villano2.png" alt="Villano" className="versus-img mb-2" />
          <h3 className="text-xl font-bold text-red-800">VILLANO</h3>
          <div className="mt-2">
            <VillainBar villainNumber={2} villainHP={villainHP} villainMaxHP={villainMaxHP} />
          </div>
        </div>
      </div>

      {/* Pregunta y opciones */}
      <div className="question text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">
          ¿Cuánto es {currentQuestion.num1} + {currentQuestion.num2}?
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {options.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(opt)}
              disabled={selectedOption !== null || villainDefeated || showSuccessModal}
              className={`p-3 rounded-xl font-semibold ${
                selectedOption === opt
                  ? opt === currentQuestion.correct
                    ? 'bg-green-300'
                    : 'bg-red-300'
                  : 'bg-yellow-200 hover:bg-yellow-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Vidas y puntaje */}
      <div className="feedback text-center mt-4">
        <p className="font-bold text-lg">Puntaje: {score}</p>
      </div>

      {/* Modal de victoria */}
      {villainDefeated && !showSuccessModal && (
        <VillainDefeatedModal
          onContinue={() => {
            setVillainHP(villainMaxHP);
            setVillainDefeated(false);
            generateQuestion();
          }}
          onEnd={() => {
            setVillainDefeated(false);
            setShowSuccessModal(true);
          }}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          message="¡Buen trabajo, lo lograste!"
          onConfirm={closeSuccessModal}
        />
      )}
    </div>
  );
};

export default GameSumas;