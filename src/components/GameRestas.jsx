import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';
import VillainBar from './VillainBar'; 
import VillainDefeatedModal from './VillainDefeatedModal';

const totalQuestions = 10;
const initialLives = 5;

// Mensajes motivadores para la resta
const motivationalMessages = {
  Aprendiz: [
    "¡Excelente! Estás dando tus primeros pasos en la resta. ¡Sigue así!",
    "¡Maravilloso trabajo! Quitar un número nunca fue tan fácil.",
    "¡Resta dominada! Eres un verdadero Aprendiz con gran potencial.",
  ],
  Osado: [
    "¡Genial! Te atreves con más dificultad y lo estás logrando en la resta.",
    "¡Fantástico! Tu osadía te está convirtiendo en un gran experto de la resta.",
    "¡Increíble! Has resuelto restas osadas y sigues avanzando. ¡Adelante!",
  ],
  Guerrero: [
    "¡Impresionante! Has librado la batalla de la resta y has salido victorioso.",
    "¡Eres un verdadero Guerrero de las matemáticas! Resta superada con fuerza.",
    "¡Formidable! Nadie detiene tu poder con los números. ¡Sigue conquistando!",
  ],
};

// Modal Game Over
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

// Función para barajar un array
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GameRestas = ({ onGameOver, score, setScore }) => {
  // Fases: learning o challenge
  const [stage, setStage] = useState("learning");
  // selectedBase = 1..13 => base normal, 14 => modo Sorpresa
  const [selectedBase, setSelectedBase] = useState(null);
  // Dificultad: Aprendiz, Osado, Guerrero
  const [difficulty, setDifficulty] = useState(null);

  // Manejo de vidas
  const [lives, setLives] = useState(initialLives);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOverState, setGameOverState] = useState(false);

  // Modal de éxito y mensaje motivador
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [randomMotivationalMessage, setRandomMotivationalMessage] = useState("");

  // Villano
  const [villainHP, setVillainHP] = useState(0);
  const [villainMaxHP, setVillainMaxHP] = useState(0);
  const [villainDefeated, setVillainDefeated] = useState(false);

  // Sonidos
  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // Verifica si es modo Sorpresa
  const isSorpresaMode = (selectedBase === 14);

  // Mensaje motivador al azar
  function getRandomMotivationalMessage(diff) {
    const msgs = motivationalMessages[diff] || motivationalMessages['Aprendiz'];
    const index = Math.floor(Math.random() * msgs.length);
    return msgs[index];
  }

  /**
   * Genera una pregunta de resta
   */
  function generateQuestion() {
    if (!isSorpresaMode) {
      // base normal
      const base = selectedBase || 2;
      // Rango según dificultad
      let maxSubtrahend;
      if (difficulty === 'Aprendiz') {
        maxSubtrahend = Math.max(1, Math.floor(base / 2));
      } else if (difficulty === 'Osado') {
        maxSubtrahend = Math.max(1, Math.floor((base * 3) / 4));
      } else if (difficulty === 'Guerrero') {
        maxSubtrahend = base;
      } else {
        maxSubtrahend = Math.max(1, Math.floor(base / 2));
      }

      const sub = Math.floor(Math.random() * maxSubtrahend) + 1;
      const correctAnswer = base - sub;
      setCurrentQuestion({ minuendo: base, subtrahend: sub, correctAnswer });
    } else {
      // Sorpresa => generamos 2 operandos
      let maxA = 30, maxB = 20; 
      if (difficulty === 'Osado') {
        maxA = 50; 
        maxB = 40; 
      } else if (difficulty === 'Guerrero') {
        maxA = 100; 
        maxB = 80; 
      }
      let minuendo, subtrahend;

      do {
        minuendo = Math.floor(Math.random() * (maxA - 10)) + 10; 
        subtrahend = Math.floor(Math.random() * (maxB - 10)) + 10;

        // Asegura que el minuendo sea menor en las unidades o decenas
        if (difficulty === 'Osado' || difficulty === 'Guerrero') {
          const minuendoStr = minuendo.toString();
          const subtrahendStr = subtrahend.toString();
          if (minuendoStr[minuendoStr.length - 1] >= subtrahendStr[subtrahendStr.length - 1]) {
            continue;
          }
        }
      } while (minuendo - subtrahend < 0);

      // Asegura que no salga negativo
      const correctAnswer = minuendo - subtrahend;
      setCurrentQuestion({ minuendo, subtrahend, correctAnswer });
    }
  }

  // Define HP del villano al entrar en challenge
  useEffect(() => {
    if (stage === "challenge") {
      let baseHP;
      if (!isSorpresaMode) {
        // Modo base normal
        switch (difficulty) {
          case 'Aprendiz': baseHP = 10; break;
          case 'Osado': baseHP = 15; break;
          case 'Guerrero': baseHP = 20; break;
          default: baseHP = 10;
        }
      } else {
        // Modo Sorpresa
        switch (difficulty) {
          case 'Aprendiz': baseHP = 12; break;
          case 'Osado': baseHP = 18; break;
          case 'Guerrero': baseHP = 25; break;
          default: baseHP = 12;
        }
      }
      setVillainHP(baseHP);
      setVillainMaxHP(baseHP);
      setVillainDefeated(false);
    }
  }, [stage, difficulty, isSorpresaMode]);

  // Cada vez que questionNumber cambie => generamos una pregunta nueva
  useEffect(() => {
    if (stage === 'challenge') {
      generateQuestion();
      setLifeLost(false);
      setSelectedOption(null);
    }
  }, [questionNumber, stage, difficulty]);

  /**
   * Baraja las opciones
   */
  function getShuffledOptions() {
    if (!currentQuestion) return [];
    const correct = currentQuestion.correctAnswer;
    const alt1 = correct + 1;
    const alt2 = correct - 1;

    let options = [correct, alt1, alt2].filter((v) => v >= 0);
    // Si, por ejemplo, uno sale negativo, lo eliminamos => podemos perder slots
    while (options.length < 3) {
      options.push(correct + (Math.random() > 0.5 ? 2 : -2));
    }
    // Quita duplicados
    options = Array.from(new Set(options));

    return shuffleArray(options);
  }

  /**
   * Manejo de respuesta
   */
  function handleAnswer(option) {
    if (!currentQuestion) return;
    setSelectedOption(option);

    if (option === currentQuestion.correctAnswer) {
      correctSound.play();
      setScore(prev => prev + 1);

      // Villano
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
      // Incorrect
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

  // Villano derrotado
  const handleVillainDefeatedContinue = () => {
    setVillainDefeated(false);
  };
  const handleVillainDefeatedEnd = () => {
    setVillainDefeated(false);
    setShowSuccessModal(true);
  };

  // Render corazones
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
  if (stage === 'learning') {
    if (selectedBase == null) {
      // Elección de base 1..13 + “Sorpresa”=14
      const bases = Array.from({ length: 12 }, (_, i) => i + 2);
      content = (
        <div className="learning-stage">
          <h2>Aprende la Resta</h2>
          <p className="learning-explanation">
            La <strong>resta</strong> nos ayuda a saber cuántos elementos quedan al quitar parte de un conjunto.
          </p>
          <div className="table-options">
            {bases.map(num => (
              <button key={num} onClick={() => setSelectedBase(num)}>
                Resta con {num}
              </button>
            ))}
            <button onClick={() => setSelectedBase(14)}>
              Sorpresa de Restas
            </button>
          </div>
        </div>
      );
    } else if (!difficulty) {
      // Selección de dificultad (eliminamos el botón local “Volver”)
      content = (
        <div className="learning-stage">
          {isSorpresaMode
            ? <h2>Sorpresa de Restas</h2>
            : <h2>Resta con {selectedBase}</h2>
          }
          <p className="learning-instruction">
            ¡Muy bien! Selecciona tu nivel de dificultad.
          </p>
          <div className="table-options">
            <button onClick={() => setDifficulty('Aprendiz')}>Aprendiz</button>
            <button onClick={() => setDifficulty('Osado')}>Osado</button>
            <button onClick={() => setDifficulty('Guerrero')}>Guerrero</button>
          </div>
        </div>
      );
    } else {
      if (!isSorpresaMode) {
        // Tabla de restas
        const rows = Array.from({ length: selectedBase }, (_, i) => i + 1);
        content = (
          <div className="learning-stage">
            <h2>Resta con {selectedBase}</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <div className="table-grid">
              {rows.map(num => (
                <div key={num} className="table-cell">
                  <span className="table-expression">
                    {selectedBase} - {num} = {selectedBase - num}
                  </span>
                </div>
              ))}
            </div>
            <p className="learning-instruction">
              ¡Observa estas restas y practícalas en voz alta!
            </p>
            <button
              onClick={() => setStage('challenge')}
              className="next-button"
            >
              ¡Listo, vamos a jugar!
            </button>
            <button
              onClick={() => { setSelectedBase(null); setDifficulty(null); }}
              className="back-button"
            >
              Volver
            </button>
          </div>
        );
      } else {
        // Modo Sorpresa
        content = (
          <div className="learning-stage">
            <h2>Sorpresa de Restas</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <p className="learning-instruction">
              Aquí no hay base fija. Se generarán restas con números al azar.
            </p>
            <button
              onClick={() => setStage('challenge')}
              className="next-button"
            >
              ¡Listo, vamos a jugar!
            </button>
            <button
              onClick={() => { setSelectedBase(null); setDifficulty(null); }}
              className="back-button"
            >
              Volver
            </button>
          </div>
        );
      }
    }
  }
  // Fase CHALLENGE
  else if (stage === 'challenge') {
    if (gameOverState) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else if (!currentQuestion) {
      content = <div>Cargando...</div>;
    } else {
      // Obtenemos las opciones barajadas
      const options = getShuffledOptions();

      content = (
        <div className="game-container">
          <h2 className="game-title">
            {isSorpresaMode 
              ? `Desafío: Sorpresa de Restas (${difficulty})`
              : `Desafío: Resta con ${selectedBase} (${difficulty})`
            }
          </h2>
          {/* Se renderiza el villano */}
          <VillainBar
            villainNumber={1} /* Ajusta: 1..5 => villanos normales, 6..7 => boss */
            villainHP={villainHP}
            villainMaxHP={villainMaxHP}
          />
          <div className="question">
            <p>
              {currentQuestion.minuendo} - {currentQuestion.subtrahend} = ?
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
              {Array.from({ length: lives }, (_, i) => (
                <img
                  key={i}
                  src="/brucatkids/images/heart_full.png"
                  alt="Heart"
                  className={`heart-icon ${lifeLost && i === lives - 1 ? 'lost' : ''}`}
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

      {/* Villano se derrotó antes de terminar */}
      {villainDefeated && !showSuccessModal && !gameOverState && (
        <VillainDefeatedModal
          onContinue={handleVillainDefeatedContinue}
          onEnd={handleVillainDefeatedEnd}
        />
      )}

      {/* Éxito final */}
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

export default GameRestas;