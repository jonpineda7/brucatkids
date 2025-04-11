import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';
import VillainBar from './VillainBar';
import VillainDefeatedModal from './VillainDefeatedModal';

const totalQuestions = 10;
const initialLives = 5;

const motivationalMessages = {
  Aprendiz: [
    "¡Excelente! Estás dando tus primeros pasos en las comparaciones. ¡Sigue así!",
    "¡Gran trabajo! Distinguir mayor, menor e igual te ayudará muchísimo.",
    "¡Comparaciones dominadas! Eres un verdadero Aprendiz con gran potencial.",
  ],
  Osado: [
    "¡Genial! Te atreves con comparaciones más avanzadas (≥, ≤) y lo estás logrando.",
    "¡Fantástico! Tu osadía te convierte en un experto de las comparaciones numéricas.",
    "¡Increíble! Has resuelto comparaciones osadas y sigues avanzando. ¡Adelante!",
  ],
  Guerrero: [
    "¡Impresionante! Has librado la batalla de las comparaciones y has salido victorioso.",
    "¡Eres un verdadero Guerrero de las matemáticas! Comparaciones superadas con fuerza.",
    "¡Formidable! Nadie detiene tu poder con los números. ¡Sigue conquistando!",
  ],
};

// Modal Game Over
const GameOverModal = ({ onGameOver }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>¡Game Over! ¡Bien Hecho!</h2>
      <p>No te rindas, sigue practicando las comparaciones.</p>
      <button onClick={onGameOver} className="modal-btn">
        Volver al inicio
      </button>
    </div>
  </div>
);

/**
 * Escoge un símbolo válido según la dificultad:
 *  - Aprendiz => símbolos = [">", "<", "="] 
 *  - Osado y Guerrero => [">", "<", "=", "≥", "≤"] (≥ y ≤ son para niveles avanzados)
 */
function getSymbolsByDifficulty(difficulty) {
  if (difficulty === 'Aprendiz') {
    return ['>', '<', '='];
  }
  // Osado y Guerrero
  return ['>', '<', '=', '≥', '≤'];
}

/**
 * Genera un número aleatorio en [1, range]
 */
function getRandomInt(range) {
  return Math.floor(Math.random() * range) + 1;
}

const GameComparaciones = ({ onGameOver, score, setScore }) => {
  // Fases: learning o challenge
  const [stage, setStage] = useState('learning');
  // Simulando un “selectedBase” para coherencia con la UI (1..13 => no real base, 14 => “Sorpresa”)
  const [selectedBase, setSelectedBase] = useState(null);
  // Dificultad
  const [difficulty, setDifficulty] = useState(null);

  // Vidas y villano
  const [lives, setLives] = useState(initialLives);
  const [villainHP, setVillainHP] = useState(0);
  const [villainMaxHP, setVillainMaxHP] = useState(0);
  const [villainDefeated, setVillainDefeated] = useState(false);

  // Preguntas
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  // currentQuestion => { a, b, symbol, isTrueCorrect: boolean }
  const [selectedOption, setSelectedOption] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [gameOverState, setGameOverState] = useState(false);

  // Modal final
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [randomMotivationalMessage, setRandomMotivationalMessage] = useState("");

  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  const isSorpresaMode = (selectedBase === 14);

  useEffect(() => {
    if (stage === 'challenge') {
      // Definir HP del villano
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

  useEffect(() => {
    if (stage === 'challenge') {
      generateQuestion();
      setLifeLost(false);
      setSelectedOption(null);
    }
  }, [questionNumber, stage, difficulty]);

  /**
   * Genera una pregunta de comparaciones
   * La pregunta es: \"¿a symbol b es VERDADERO?\" => el niño escoge \"VERDADERO\" o \"FALSO\".
   */
  function generateQuestion() {
    // Determinar rango de a y b según la dificultad
    let maxRangeA = 20;
    let maxRangeB = 20;
    switch (difficulty) {
      case 'Aprendiz':
        maxRangeA = 1000; 
        maxRangeB = 1000; 
        break;
      case 'Osado':
        maxRangeA = 1000; 
        maxRangeB = 2000; 
        break;
      case 'Guerrero':
        maxRangeA = 2000; 
        maxRangeB = 2000; 
        break;
      default:
        // Aprendiz
        maxRangeA = 1000; 
        maxRangeB = 1000; 
    }
    if (isSorpresaMode) {
      // Aumentamos más si es Sorpresa
      maxRangeA *= 2;
      maxRangeB *= 2;
    }

    const a = getRandomInt(maxRangeA);
    const b = getRandomInt(maxRangeB);

    // El símbolo se elige de la lista que corresponde a la dificultad
    const symbols = getSymbolsByDifficulty(difficulty);
    const randomIndex = Math.floor(Math.random() * symbols.length);
    const symbol = symbols[randomIndex];

    // Evaluar si a symbol b es en verdad (true) o no
    const isTrue = evaluateComparison(a, b, symbol);

    setCurrentQuestion({
      a, 
      b, 
      symbol, 
      // Este boolean indica si la afirmación \"a symbol b\" es verdadera
      isTrueCorrect: isTrue
    });
  }

  // Evalúa si \"a (symbol) b\" es cierto
  function evaluateComparison(a, b, symbol) {
    switch (symbol) {
      case '>':  return a > b;
      case '<':  return a < b;
      case '=':  return a === b;
      case '≥':  return a >= b;
      case '≤':  return a <= b;
      default:   return false;
    }
  }

  function handleAnswer(userSaysTrue) {
    if (!currentQuestion) return;
    setSelectedOption(userSaysTrue ? 'VERDADERO' : 'FALSO');

    const isCorrect = (currentQuestion.isTrueCorrect === userSaysTrue);

    if (isCorrect) {
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

  // Construct content
  let content;

  // Fase LEARNING
  if (stage === 'learning') {
    // 1) Seleccionar \"base\" (1..13) o 14 => Sorpresa
    if (selectedBase == null) {
      content = (
        <div className="learning-stage">
          <h2>Aprende las Comparaciones</h2>
          <p className="learning-explanation">
            Conoce los símbolos:<br />
            <strong>&gt;</strong> (mayor), 
            <strong>&lt;</strong> (menor), 
            <strong>=</strong> (igual), 
            <strong>≥</strong> (mayor o igual), 
            <strong>≤</strong> (menor o igual).
          </p>
          <p className="learning-instruction">
            Elige "Comparaciones con Base" o prueba la "Sorpresa de Comparaciones"
          </p>
          <div className="table-options">
            {/* Simulamos 1..13, solo para mantener coherencia con la interfaz */}
            {[...Array(13).keys()].map(x => x + 1).map(num => (
              <button key={num} onClick={() => setSelectedBase(num)}>
                Comparaciones {num}
              </button>
            ))}
            <button onClick={() => setSelectedBase(14)}>
              Sorpresa de Comparaciones
            </button>
          </div>
        </div>
      );
    }
    // 2) Seleccionar dificultad
    else if (!difficulty) {
      content = (
        <div className="learning-stage">
          {isSorpresaMode ? (
            <h2>Sorpresa de Comparaciones</h2>
          ) : (
            <h2>Comparaciones con {selectedBase}</h2>
          )}
          <p className="learning-instruction">
            Selecciona tu nivel de dificultad:
          </p>
          <div className="table-options">
            <button onClick={() => setDifficulty('Aprendiz')}>Aprendiz</button>
            <button onClick={() => setDifficulty('Osado')}>Osado</button>
            <button onClick={() => setDifficulty('Guerrero')}>Guerrero</button>
          </div>
        </div>
      );
    }
    // 3) Muestra \"tabla\" o \"explicación\" + Botón para challenge
    else {
      if (!isSorpresaMode) {
        content = (
          <div className="learning-stage">
            <h2>Comparaciones con {selectedBase}</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <p className="learning-instruction">
              Aquí repasaremos <strong>&gt;</strong>, <strong>&lt;</strong>, <strong>=</strong> (y <strong>≥, ≤</strong> en dificultad avanzada).
            </p>
            <button
              onClick={() => setStage('challenge')}
              className="next-button"
            >
              ¡Listo, vamos a jugar!
            </button>
            <button
              onClick={() => {
                setSelectedBase(null);
                setDifficulty(null);
              }}
              className="back-button"
            >
              Volver
            </button>
          </div>
        );
      } else {
        content = (
          <div className="learning-stage">
            <h2>Sorpresa de Comparaciones</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <p className="learning-instruction">
              Se generarán comparaciones con números al azar y símbolos &gt;, &lt;, =, ≥, ≤.
            </p>
            <button
              onClick={() => setStage('challenge')}
              className="next-button"
            >
              ¡Listo, vamos a jugar!
            </button>
            <button
              onClick={() => {
                setSelectedBase(null);
                setDifficulty(null);
              }}
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
      // Affirmation: \"a (symbol) b\" => ¿VERDADERO o FALSO?
      content = (
        <div className="game-container">
          <h2 className="game-title">
            {isSorpresaMode
              ? `Desafío: Sorpresa de Comparaciones (${difficulty})`
              : `Desafío: Comparaciones (${selectedBase}) - ${difficulty}`
            }
          </h2>
          {/* Villano */}
          <VillainBar 
            villainNumber={4} 
            villainHP={villainHP} 
            villainMaxHP={villainMaxHP} 
          />
          <div className="question">
            <p>
              {currentQuestion.a} {currentQuestion.symbol} {currentQuestion.b} ¿Es correcto?
            </p>
            <div className="answer-buttons">
              <button
                onClick={() => handleAnswer(true)}
                className="answer-btn"
                disabled={selectedOption !== null}
              >
                VERDADERO
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="answer-btn"
                disabled={selectedOption !== null}
              >
                FALSO
              </button>
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

      {/* Si el villano se derrotó */}
      {villainDefeated && !showSuccessModal && !gameOverState && (
        <VillainDefeatedModal
          onContinue={handleVillainDefeatedContinue}
          onEnd={handleVillainDefeatedEnd}
        />
      )}

      {/* Modal de éxito al terminar */}
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

export default GameComparaciones;