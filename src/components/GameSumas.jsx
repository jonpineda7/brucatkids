import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';
import VillainBar from './VillainBar';
import VillainDefeatedModal from './VillainDefeatedModal';

const totalQuestions = 10;
const initialLives = 5;

// Modal Game Over
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

// Frases motivadoras de ejemplo
const motivationalMessages = {
  Aprendiz: [
    "¡Excelente! Estás dando tus primeros pasos en la suma. ¡Sigue así!",
    "¡Maravilloso trabajo! Cada número suma a tu gran talento.",
    "¡Suma dominada! Eres un verdadero Aprendiz con gran potencial.",
  ],
  Osado: [
    "¡Genial! Te atreves con más dificultad y lo estás logrando.",
    "¡Fantástico! Tu osadía te está convirtiendo en un gran experto de la suma.",
    "¡Increíble! Has resuelto sumas osadas y sigues avanzando. ¡Adelante!",
  ],
  Guerrero: [
    "¡Impresionante! Has librado la batalla de la suma y has salido victorioso.",
    "¡Eres un verdadero Guerrero de las matemáticas! Sumas superadas con fuerza.",
    "¡Formidable! Nadie detiene tu poder con los números. ¡Sigue conquistando!",
  ],
};

// Función para barajar un array
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GameSumas = ({ onGameOver, score, setScore }) => {
  // Fases: learning o challenge
  const [stage, setStage] = useState("learning");
  // selectedBase=1..13 => base fija, 14 => modo Sorpresa
  const [selectedBase, setSelectedBase] = useState(null);
  // Dificultad
  const [difficulty, setDifficulty] = useState(null);

  // Vidas y estado de preguntas
  const [lives, setLives] = useState(initialLives);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [gameOverState, setGameOverState] = useState(false);

  // Éxito final
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [randomMotivationalMessage, setRandomMotivationalMessage] = useState("");

  // Villano
  const [villainHP, setVillainHP] = useState(0);
  const [villainMaxHP, setVillainMaxHP] = useState(0);
  const [villainDefeated, setVillainDefeated] = useState(false);

  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  // Determina si es “Sorpresa” (base=14)
  const isSorpresaMode = (selectedBase === 14);

  // Selecciona mensaje motivador al azar
  function getRandomMotivationalMessage(diff) {
    const msgs = motivationalMessages[diff] || motivationalMessages['Aprendiz'];
    const index = Math.floor(Math.random() * msgs.length);
    return msgs[index];
  }

  /**
   * Genera las preguntas
   * - si no es sorpresa => base + addend
   * - si es sorpresa => sum1 + sum2 aleatorio
   */
  function generateQuestion() {
    if (!isSorpresaMode) {
      // Suma base normal
      const base = selectedBase || 1;
      let maxAddend = 10;
      if (difficulty === 'Osado') maxAddend = 20;
      if (difficulty === 'Guerrero') maxAddend = 30;

      const addend = Math.floor(Math.random() * maxAddend) + 1;
      const correctAnswer = base + addend;
      setCurrentQuestion({ sum1: base, sum2: addend, correctAnswer });
    } else {
      // Sorpresa
      let maxA = 50, maxB = 10; 
      if (difficulty === 'Osado') { maxA = 100; maxB = 20; }
      if (difficulty === 'Guerrero') { maxA = 300; maxB = 50; }
      const sum1 = Math.floor(Math.random() * maxA) + 1;
      const sum2 = Math.floor(Math.random() * maxB) + 1;
      const correctAnswer = sum1 + sum2;
      setCurrentQuestion({ sum1, sum2, correctAnswer });
    }
  }

  // Asignar HP al villano al iniciar challenge
  useEffect(() => {
    if (stage === "challenge") {
      let baseHP;
      if (!isSorpresaMode) {
        // Modo normal
        switch (difficulty) {
          case 'Aprendiz': baseHP = 10; break;
          case 'Osado': baseHP = 15; break;
          case 'Guerrero': baseHP = 20; break;
          default: baseHP = 10;
        }
      } else {
        // Sorpresa
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

  // Cada vez que questionNumber cambie => generamos pregunta
  useEffect(() => {
    if (stage === "challenge") {
      generateQuestion();
      setLifeLost(false);
      setSelectedOption(null);
    }
  }, [questionNumber, stage, difficulty]);

  /**
   * Lógica para barajar respuestas
   */
  function getShuffledOptions() {
    if (!currentQuestion) return [];
    const correct = currentQuestion.correctAnswer;
    // 2 alternos: correct+1, correct-1
    const alt1 = correct + 1;
    const alt2 = correct - 1;

    // Montamos el array y filtramos si hay algo repetido o <0
    let baseOptions = [correct, alt1, alt2].filter((v) => v >= 0);
    // Evitar duplicados
    baseOptions = Array.from(new Set(baseOptions));

    // Si por lo que sea quedan 2, agregamos algo extra
    while (baseOptions.length < 3) {
      baseOptions.push(correct + (Math.random() > 0.5 ? 2 : -2));
    }

    // Barajamos
    return shuffleArray(baseOptions);
  }

  // Manejo de respuesta
  function handleAnswer(option) {
    if (!currentQuestion) return;
    setSelectedOption(option);

    if (option === currentQuestion.correctAnswer) {
      correctSound.play();
      setScore(prev => prev + 1);

      // Quitar HP al villano
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
      // Error
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

  // Renderizar corazoncitos
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

  // Etapa LEARNING
  if (stage === "learning") {
    if (selectedBase == null) {
      // Selección base + “Sorpresa”
      const bases = [...Array(13).keys()].map(x => x + 1);
      content = (
        <div className="learning-stage">
          <h2>Aprende la Suma</h2>
          <p className="learning-explanation">
            La <strong>suma</strong> nos ayuda a juntar cantidades.
            Elige un número base o prueba la “Sorpresa de Sumas.”
          </p>
          <div className="table-options">
            {bases.map(base => (
              <button key={base} onClick={() => setSelectedBase(base)}>
                Suma con {base}
              </button>
            ))}
            <button onClick={() => setSelectedBase(14)}>
              Sorpresa de Sumas
            </button>
          </div>
        </div>
      );
    }
    else if (!difficulty) {
      // Eliminamos el botón local “Volver” para no duplicar
      content = (
        <div className="learning-stage">
          {isSorpresaMode ? (
            <h2>Sorpresa de Sumas</h2>
          ) : (
            <h2>Suma con {selectedBase}</h2>
          )}
          <p className="learning-instruction">
            ¡Muy bien! Selecciona tu nivel de dificultad:
          </p>
          <div className="table-options">
            <button onClick={() => setDifficulty('Aprendiz')}>Aprendiz</button>
            <button onClick={() => setDifficulty('Osado')}>Osado</button>
            <button onClick={() => setDifficulty('Guerrero')}>Guerrero</button>
          </div>
        </div>
      );
    }
    else {
      // Modo normal => tabla
      if (!isSorpresaMode) {
        const rows = Array.from({ length: 13 }, (_, i) => i + 1);
        content = (
          <div className="learning-stage">
            <h2>Suma con {selectedBase}</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <div className="table-grid">
              {rows.map(num => (
                <div key={num} className="table-cell">
                  <span className="table-expression">
                    {selectedBase} + {num} = {selectedBase + num}
                  </span>
                </div>
              ))}
            </div>
            <p className="learning-instruction">
              ¡Observa estas sumas, repítelas en voz alta y conviértete en un experto!
            </p>
            <button
              onClick={() => setStage("challenge")}
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
        // Sorpresa
        content = (
          <div className="learning-stage">
            <h2>Sorpresa de Sumas</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <p className="learning-instruction">
              Aquí no hay base fija. Se generarán sumas con números al azar.
            </p>
            <button
              onClick={() => setStage("challenge")}
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
  // Etapa CHALLENGE
  else if (stage === "challenge") {
    if (gameOverState) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else if (!currentQuestion) {
      content = <div>Cargando...</div>;
    } else {
      // Barajamos las opciones
      const correct = currentQuestion.correctAnswer;
      const alt1 = correct + 1;
      const alt2 = correct - 1;
      let baseOptions = [correct, alt1, alt2].filter((v) => v >= 0);
      // Evitar duplicados
      baseOptions = Array.from(new Set(baseOptions));
      // Si por lo que sea hay 2, agregamos algo
      while (baseOptions.length < 3) {
        baseOptions.push(correct + (Math.random() > 0.5 ? 2 : -2));
      }
      const options = shuffleArray(baseOptions);

      content = (
        <div className="game-container">
          <h2 className="game-title">
            {isSorpresaMode 
              ? `Desafío: Sorpresa de Sumas (${difficulty})`
              : `Desafío: Suma con ${selectedBase} (${difficulty})`
            }
          </h2>

          {/* Villano */}
          <VillainBar
            villainNumber={2} /* Ajusta: 1..5 => villanos normales, 6..7 => boss */
            villainHP={villainHP}
            villainMaxHP={villainMaxHP}
          />

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

      {/* Si el villano se derrota antes de terminar */}
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

export default GameSumas;