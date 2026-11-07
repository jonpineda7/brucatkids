import ResultDialog from './ResultDialog';
import Profile from './Profile';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import SuccessModal from './SuccessModal';
import VillainBar from './VillainBar';
import VillainDefeatedModal from './VillainDefeatedModal';

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
  <ResultDialog title="¡Sigamos practicando!" icon="🌱">
    <p>Cada intento te ayuda a aprender. Tu próxima aventura te espera.</p>
    <button onClick={onGameOver}>Volver a los juegos →</button>
  </ResultDialog>
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

const GameComparaciones = ({ character, onGameOver, score, setScore }) => {
  function getRandomMotivationalMessage(diff) {
    const messages = motivationalMessages[diff] || motivationalMessages.Aprendiz;
    return messages[Math.floor(Math.random() * messages.length)];
  }
  const answerTimer = useRef(null);
  useEffect(() => () => clearTimeout(answerTimer.current), []);
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

  const generateQuestion = useCallback(() => {
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
  }, [difficulty, isSorpresaMode]);

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
  }, [questionNumber, stage, generateQuestion]);

  /**
   * Genera una pregunta de comparaciones
   * La pregunta es: \"¿a symbol b es VERDADERO?\" => el niño escoge \"VERDADERO\" o \"FALSO\".
   */


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
    if (!currentQuestion || selectedOption !== null || gameOverState || showSuccessModal || villainDefeated) return;
    setSelectedOption(userSaysTrue ? 'VERDADERO' : 'FALSO');

    const isCorrect = (currentQuestion.isTrueCorrect === userSaysTrue);

    if (isCorrect) {
      correctSound.play().catch(() => {});
      setScore(prev => prev + 1);
      // Quitar HP al villano
      const nextHP = Math.max(0, villainHP - 1);
      setVillainHP(nextHP);
      if (nextHP === 0) {
        answerTimer.current = setTimeout(() => setVillainDefeated(true), 900);
        return;
      }

      answerTimer.current = setTimeout(() => {
        setQuestionNumber(prev => prev + 1);
      }, 800);
    } else {
      wrongAnswerSound.play().catch(() => {});
      const newLives = lives - 1;
      setLives(newLives);
      setLifeLost(true);

      answerTimer.current = setTimeout(() => {
        if (newLives <= 0) {
          setGameOverState(true);
        } else {
          setQuestionNumber(prev => prev + 1);
        }
      }, 800);
    }
  }



  // Villano derrotado
  const handleVillainDefeatedContinue = () => {
    setVillainHP(villainMaxHP);
    setQuestionNumber(prev => prev + 1);
    setVillainDefeated(false);
  };
  const handleVillainDefeatedEnd = () => {
    setRandomMotivationalMessage(getRandomMotivationalMessage(difficulty || 'Aprendiz'));
    setVillainDefeated(false);
    setShowSuccessModal(true);
  };

  // Render corazones


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
          <div className="table-options difficulty-options">
            <button onClick={() => setDifficulty('Aprendiz')}><span>🌱 Aprendiz</span><small>Paso a paso</small></button>
            <button onClick={() => setDifficulty('Osado')}><span>⚡ Osado</span><small>Un nuevo desafío</small></button>
            <button onClick={() => setDifficulty('Guerrero')}><span>🛡️ Guerrero</span><small>Supera tus límites</small></button>
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
              ← Cambiar selección
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
              ← Cambiar selección
            </button>
          </div>
        );
      }
    }
  }
  // Fase CHALLENGE
  else if (stage === 'challenge') {
    if (gameOverState) {
      content = <GameOverModal onGameOver={() => onGameOver(false)} />;
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
          <div className="battle-arena"><Profile character={character} score={score} compact /><span className="battle-vs" aria-hidden="true">VS</span><VillainBar
            villainNumber={4}
            villainHP={villainHP}
            villainMaxHP={villainMaxHP}
          /></div>
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
