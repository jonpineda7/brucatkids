import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';
import VillainBar from './VillainBar';
import VillainDefeatedModal from './VillainDefeatedModal';

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const totalQuestions = 10;
const initialLives = 5;

// Frases motivadoras para la suma
const motivationalMessages = {
  Aprendiz: [
    "¡Excelente! Estás dando tus primeros pasos en la suma.",
    "¡Maravilloso trabajo! Cada número suma a tu gran habilidad.",
    "¡Suma dominada! Eres un verdadero Aprendiz con gran potencial.",
  ],
  Osado: [
    "¡Genial! Te enfrentas a desafíos mayores y lo estás logrando.",
    "¡Fantástico! Tu osadía te convierte en un experto en sumas.",
    "¡Increíble! Has superado sumas difíciles, ¡sigue adelante!",
  ],
  Guerrero: [
    "¡Impresionante! Has conquistado las sumas más grandes.",
    "¡Eres un verdadero Guerrero de las matemáticas! Sumas de alto nivel dominadas.",
    "¡Formidable! Tu habilidad con los números te hace invencible.",
  ],
};

// Opciones de modo para hacer la experiencia más dinámica
// Aquí, "Sorpresa" se usará para generar problemas con números un poco más amplios.
const modes = {
  NORMAL: 'normal',
  SORPRESA: 'sorpresa'
};

const GameSumas = ({ onGameOver, score, setScore }) => {
  // Fases: "learning" o "challenge"
  const [stage, setStage] = useState("learning");
  // Selección de modo: normal o sorpresa (en esta versión, el usuario solo escoge la dificultad)
  const [mode, setMode] = useState(modes.NORMAL);
  // Dificultad: Aprendiz, Osado, Guerrero
  const [difficulty, setDifficulty] = useState(null);

  // Manejo de vidas y preguntas
  const [lives, setLives] = useState(initialLives);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [gameOverState, setGameOverState] = useState(false);

  // Modal de éxito final
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [randomMotivationalMessage, setRandomMotivationalMessage] = useState("");

  // Villano (mismo manejo que en otros juegos)
  const [villainHP, setVillainHP] = useState(0);
  const [villainMaxHP, setVillainMaxHP] = useState(0);
  const [villainDefeated, setVillainDefeated] = useState(false);

  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // Determinar si estamos en modo Sorpresa
  const isSorpresaMode = (mode === modes.SORPRESA);

  /**
   * Retorna un mensaje motivador aleatorio según la dificultad.
   */
  function getRandomMotivationalMessage(diff) {
    const msgs = motivationalMessages[diff] || motivationalMessages['Aprendiz'];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  /**
   * Genera una pregunta de suma con resultado hasta un máximo definido según la dificultad.
   * Para modo NORMAL, se limita a un máximo: 
   *   - Aprendiz: 500, Osado: 700, Guerrero: 1000.
   * Para modo SORPRESA, se usan rangos un poco más amplios.
   */
  function generateQuestion() {
    let maxResult;
    if (isSorpresaMode) {
      switch (difficulty) {
        case 'Osado':
          maxResult = 700;
          break;
        case 'Guerrero':
          maxResult = 1000;
          break;
        default:
          maxResult = 600;
      }
    } else {
      // Modo normal
      switch (difficulty) {
        case 'Osado':
          maxResult = 700;
          break;
        case 'Guerrero':
          maxResult = 1000;
          break;
        default:
          maxResult = 500;
      }
    }
    // Para asegurar un mínimo de suma, elegimos sum1 entre 50 y (maxResult - 100)
    const sum1 = Math.floor(Math.random() * (maxResult - 100)) + 50;
    const addendMax = maxResult - sum1;
    // El segundo sumando es al menos 1
    const sum2 = Math.floor(Math.random() * addendMax) + 1;
    const correctAnswer = sum1 + sum2;
    setCurrentQuestion({ sum1, sum2, correctAnswer });
  }

  // Cada vez que cambiemos a la fase "challenge", definimos la HP del villano según la dificultad
  useEffect(() => {
    if (stage === "challenge") {
      let baseHP;
      if (isSorpresaMode) {
        switch (difficulty) {
          case 'Aprendiz': baseHP = 12; break;
          case 'Osado': baseHP = 18; break;
          case 'Guerrero': baseHP = 25; break;
          default: baseHP = 12;
        }
      } else {
        switch (difficulty) {
          case 'Aprendiz': baseHP = 10; break;
          case 'Osado': baseHP = 15; break;
          case 'Guerrero': baseHP = 20; break;
          default: baseHP = 10;
        }
      }
      setVillainHP(baseHP);
      setVillainMaxHP(baseHP);
      setVillainDefeated(false);
    }
  }, [stage, difficulty, isSorpresaMode]);

  // Generamos una nueva pregunta cada vez que questionNumber cambie en fase "challenge"
  useEffect(() => {
    if (stage === "challenge") {
      generateQuestion();
      setLifeLost(false);
      setSelectedOption(null);
    }
  }, [questionNumber, stage, difficulty]);

  useEffect(() => {
    if (difficulty) {
      setStage("challenge");
    }
  }, [difficulty]);

  /**
   * Baraja las opciones de respuesta para que la correcta no aparezca siempre en la misma posición
   */
  function getShuffledOptions() {
    if (!currentQuestion) return [];
    const correct = currentQuestion.correctAnswer;
    const alt1 = correct + 1;
    const alt2 = correct - 1;
    let options = [correct, alt1, alt2].filter(val => val >= 0);
    // Aseguramos 3 opciones sin duplicados
    options = Array.from(new Set(options));
    while (options.length < 3) {
      options.push(correct + (Math.random() > 0.5 ? 2 : -2));
    }
    return shuffleArray(options);
  }

  /**
   * Maneja la respuesta seleccionada
   */
  function handleAnswer(option) {
    if (!currentQuestion) return;
    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      correctSound.play();
      setScore(prev => prev + 1);
      // Resta 1 HP al villano
      setVillainHP(prev => {
        const newHP = prev - 1;
        if (newHP <= 0) {
          setVillainDefeated(true);
          return 0;
        }
        return newHP;
      });
      setTimeout(() => {
        if (questionNumber + 1 >= totalQuestions) {
          const msg = getRandomMotivationalMessage(difficulty || 'Aprendiz');
          setRandomMotivationalMessage(msg);
          setShowSuccessModal(true);
        } else {
          setQuestionNumber(prev => prev + 1);
        }
      }, 800);
    } else {
      wrongAnswerSound.play();
      const newLives = lives - 1;
      setLives(newLives);
      setLifeLost(true);
      setTimeout(() => {
        if (newLives <= 0) {
          setGameOverState(true);
        } else {
          if (questionNumber + 1 >= totalQuestions) {
            const msg = getRandomMotivationalMessage(difficulty || 'Aprendiz');
            setRandomMotivationalMessage(msg);
            setShowSuccessModal(true);
          } else {
            setQuestionNumber(prev => prev + 1);
          }
        }
      }, 800);
    }
  }

  function closeSuccessModal() {
    setShowSuccessModal(false);
    onGameOver();
  }

  // Función para renderizar los corazones (vidas)
  function renderHearts() {
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
  }

  let content;
  // Fase LEARNING
  if (stage === "learning") {
    // En esta etapa solo explicamos brevemente y se selecciona la dificultad y el modo
    content = (
      <div className="learning-stage">
        <h2>Aprende la Suma hasta 1 000</h2>
        <p className="learning-explanation">
          En este juego practicarás sumas con números grandes, hasta 1 000. ¡Ponte el casco y prepárate!
        </p>
        <form>
          <div className="table-options">
            <button type="button" onClick={() => setDifficulty('Aprendiz')}>Aprendiz</button>
            <button type="button" onClick={() => setDifficulty('Osado')}>Osado</button>
            <button type="button" onClick={() => setDifficulty('Guerrero')}>Guerrero</button>
          </div>
          <div className="table-options" style={{ marginTop: '20px' }}>
            <button type="button" onClick={() => setMode(modes.NORMAL)}>Modo Normal</button>
            <button type="button" onClick={() => setMode(modes.SORPRESA)}>Modo Sorpresa</button>
          </div>
        </form>
      </div>
    );
  }
  // Fase CHALLENGE
  else if (stage === "challenge") {
    if (gameOverState) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else if (!currentQuestion) {
      content = <div>Cargando...</div>;
    } else {
      const options = getShuffledOptions();
      content = (
        <div className="game-container">
          <h2 className="game-title">
            {isSorpresaMode 
              ? `Desafío: Sorpresa de Sumas (${difficulty})`
              : `Desafío: Suma (${difficulty})`
            }
          </h2>
          {/* Renderizamos la barra de energía del villano */}
          <VillainBar villainNumber={2} villainHP={villainHP} villainMaxHP={villainMaxHP} />
          <div className="question">
            <p>
              {currentQuestion.sum1} + {currentQuestion.sum2} = ?
            </p>
            <div className="answer-buttons">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="answer-btn"
                  disabled={selectedOption !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="feedback">
            <div className="hearts">
              {renderHearts()}
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

      {/* Si el villano se derrota antes de finalizar */}
      {villainDefeated && !showSuccessModal && !gameOverState && (
        <VillainDefeatedModal
          onContinue={() => setVillainDefeated(false)}
          onEnd={() => {
            setVillainDefeated(false);
            setShowSuccessModal(true);
          }}
        />
      )}

      {/* Modal de éxito final */}
      {showSuccessModal && (
        <SuccessModal
          message={randomMotivationalMessage}
          onConfirm={() => {
            setShowSuccessModal(false);
            onGameOver();
          }}
        />
      )}
    </div>
  );
};

export default GameSumas;