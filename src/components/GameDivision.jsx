import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';
import VillainBar from './VillainBar';
import VillainDefeatedModal from './VillainDefeatedModal';
import { speakText } from '../utils/tts'; // Para la explicación TTS

/**
 * Banco de frases motivadoras para la División, clasificadas por nivel de dificultad.
 */
const motivationalMessages = {
  Aprendiz: [
    "¡Excelente! Estás dando tus primeros pasos en la división. ¡Sigue así!",
    "¡Maravilloso trabajo! Repartir en partes no fue problema para ti.",
    "¡División dominada! Eres un verdadero Aprendiz con gran potencial.",
  ],
  Osado: [
    "¡Genial! Te atreves con más dificultad y lo estás logrando en la división.",
    "¡Fantástico! Tu osadía te está convirtiendo en un gran experto de la división.",
    "¡Increíble! Has resuelto divisiones osadas y sigues avanzando. ¡Adelante!",
  ],
  Guerrero: [
    "¡Impresionante! Has librado la batalla de la división y has salido victorioso.",
    "¡Eres un verdadero Guerrero de las matemáticas! Divisiones superadas con fuerza.",
    "¡Formidable! Nadie detiene tu poder con los números. ¡Sigue conquistando!",
  ],
};

/**
 * Banco de frases contextuales para problemas de división.
 * Usa los placeholders {dividend}, {divisor} y {correctAnswer} para insertar valores.
 */
const contextTemplates = [
  "Imagina que tienes {dividend} caramelos y los repartes entre {divisor} amigos. ¿Cuántos recibe cada uno? La respuesta es {correctAnswer}.",
  "Si divides {dividend} manzanas en {divisor} cestas de forma equitativa, cada cesta tendrá {correctAnswer} manzanas.",
  "Tienes {dividend} libros y quieres organizarlos en {divisor} estantes iguales. ¿Cuántos libros irán en cada estante? La respuesta es {correctAnswer}.",
];

const initialLives = 5;
const totalQuestions = 10;

// Modal de Game Over
const GameOverModal = ({ onGameOver }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>¡Game Over! ¡Bien Hecho!</h2>
      <p>No te rindas, sigue practicando la división.</p>
      <button onClick={onGameOver} className="modal-btn">
        Volver al inicio
      </button>
    </div>
  </div>
);

/**
 * Baraja un array, evitando que la respuesta correcta siempre salga primero
 */
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GameDivision = ({ onGameOver, score, setScore }) => {
  // Fases: learning o challenge
  const [stage, setStage] = useState("learning");
  // Divisor seleccionado (2..13) o 14 => modo Sorpresa
  const [selectedDivisor, setSelectedDivisor] = useState(null);
  // Dificultad
  const [difficulty, setDifficulty] = useState(null);

  // Vidas, preguntas, etc.
  const [lives, setLives] = useState(initialLives);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [lifeLost, setLifeLost] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOverState, setGameOverState] = useState(false);

  // Modal final
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [randomMotivationalMessage, setRandomMotivationalMessage] = useState("");

  // Villano
  const [villainHP, setVillainHP] = useState(0);
  const [villainMaxHP, setVillainMaxHP] = useState(0);
  const [villainDefeated, setVillainDefeated] = useState(false);

  // Sonidos
  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  const isSorpresaMode = (selectedDivisor === 14);

  // Selecciona frase motivadora al azar
  function getRandomMotivationalMessage(diff) {
    const msgs = motivationalMessages[diff] || motivationalMessages['Aprendiz'];
    const index = Math.floor(Math.random() * msgs.length);
    return msgs[index];
  }

  /**
   * Genera una pregunta de división
   */
  function generateQuestion() {
    if (!isSorpresaMode) {
      // Modo normal
      const divisor = selectedDivisor || 2;
      let maxQuotient = 10;
      switch (difficulty) {
        case 'Osado':
          maxQuotient = 20;
          break;
        case 'Guerrero':
          maxQuotient = 30;
          break;
        default:
          maxQuotient = 10;
      }
      const quotient = Math.floor(Math.random() * maxQuotient) + 1;
      const dividend = divisor * quotient;

      const question = {
        dividend,
        divisor,
        correctAnswer: quotient
      };

      // Insertar problema contextual si el divisor está entre 2 y 10
      if (divisor >= 2 && divisor <= 10) {
        const randomTemplate = contextTemplates[Math.floor(Math.random() * contextTemplates.length)];
        question.context = randomTemplate
          .replace('{dividend}', dividend)
          .replace('{divisor}', divisor)
          .replace('{correctAnswer}', quotient);
      }

      setCurrentQuestion(question);
    } else {
      // Modo Sorpresa
      let maxDivisor = 12;
      let maxQuotient = 10;
      switch (difficulty) {
        case 'Osado':
          maxDivisor = 20;
          maxQuotient = 20;
          break;
        case 'Guerrero':
          maxDivisor = 30;
          maxQuotient = 30;
          break;
        default:
          maxDivisor = 12;
          maxQuotient = 10;
      }
      const divisor = Math.floor(Math.random() * maxDivisor) + 2; // Evitar divisor=1
      const quotient = Math.floor(Math.random() * maxQuotient) + 1;
      const dividend = divisor * quotient;

      setCurrentQuestion({
        dividend,
        divisor,
        correctAnswer: quotient
      });
    }
  }

  // Al entrar a challenge => definimos HP villano
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

  // Cada vez que questionNumber cambie => generamos pregunta
  useEffect(() => {
    if (stage === "challenge") {
      generateQuestion();
      setLifeLost(false);
      setSelectedOption(null);
    }
  }, [questionNumber, stage, difficulty]);

  /**
   * Baraja opciones
   */
  function getShuffledOptions() {
    if (!currentQuestion) return [];
    const correct = currentQuestion.correctAnswer;
    const alt1 = correct + 1;
    const alt2 = correct - 1;
    let baseOptions = [correct, alt1, alt2].filter(v => v > 0);

    // Evitar duplicados
    baseOptions = Array.from(new Set(baseOptions));
    // Asegurarnos de 3
    while (baseOptions.length < 3) {
      baseOptions.push(correct + (Math.random() > 0.5 ? 2 : -2));
    }

    return shuffleArray(baseOptions);
  }

  /**
   * Manejo de la respuesta
   */
  function handleAnswer(option) {
    if (!currentQuestion) return;
    setSelectedOption(option);

    if (option === currentQuestion.correctAnswer) {
      correctSound.play();
      setScore(prev => prev + 1);

      // Villano - quitar 1 HP
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

  // Render vidas (corazones)
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
    if (!selectedDivisor) {
      // Seleccionar el divisor
      content = (
        <div className="learning-stage">
          <h2>Aprende la División</h2>
          <p className="learning-explanation">
            La <strong>división</strong> es una forma de repartir en partes iguales. 
            Si tienes 12 caramelos y los repartes entre 3 amigos, cada uno recibe 4.
          </p>

          <button
            style={{ margin: '10px' }}
            onClick={() =>
              speakText(
                'La división es una forma de repartir en partes iguales. Si tienes doce caramelos y los repartes entre tres amigos, cada uno recibe cuatro.'
              )
            }
          >
            Escuchar Explicación
          </button>

          <p>Elige el divisor que quieres aprender (2..13) o prueba Sorpresa:</p>
          <div className="table-options">
            {Array.from({ length: 12 }, (_, i) => i + 2).map(num => (
              <button key={num} onClick={() => setSelectedDivisor(num)}>
                Divisor {num}
              </button>
            ))}
            <button onClick={() => setSelectedDivisor(14)}>
              Sorpresa de División
            </button>
          </div>
        </div>
      );
    } else if (!difficulty) {
      // Selección de dificultad, sin botón “Volver” duplicado
      if (isSorpresaMode) {
        content = (
          <div className="learning-stage">
            <h2>Sorpresa de División</h2>
            <p className="learning-instruction">
              ¡Excelente! Ahora elige tu nivel de dificultad para practicar.
            </p>
            <div className="table-options">
              <button onClick={() => setDifficulty('Aprendiz')}>Aprendiz</button>
              <button onClick={() => setDifficulty('Osado')}>Osado</button>
              <button onClick={() => setDifficulty('Guerrero')}>Guerrero</button>
            </div>
            {/* Se omite un segundo botón \"Volver\" aquí para evitar duplicar */}
            {/* Queda el \"Volver\" final en la otra subpantalla si la user ya eligió dificultad */}
          </div>
        );
      } else {
        content = (
          <div className="learning-stage">
            <h2>División con {selectedDivisor}</h2>
            <p className="learning-instruction">
              ¡Excelente! Ahora elige tu nivel de dificultad para practicar.
            </p>
            <div className="table-options">
              <button onClick={() => setDifficulty('Aprendiz')}>Aprendiz</button>
              <button onClick={() => setDifficulty('Osado')}>Osado</button>
              <button onClick={() => setDifficulty('Guerrero')}>Guerrero</button>
            </div>
            {/* Igualmente aquí, no insertamos un \"Volver\" extra */}
          </div>
        );
      }
    } else {
      // Muestra la “tabla” o la sorpresa, con un botón “Volver”
      if (!isSorpresaMode) {
        const rows = Array.from({ length: 13 }, (_, i) => i + 1);
        content = (
          <div className="learning-stage">
            <h2>División con {selectedDivisor}</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <div className="table-grid">
              {rows.map(i => (
                <div key={i} className="table-cell">
                  <span className="table-expression">
                    {selectedDivisor * i} ÷ {selectedDivisor} = {i}
                  </span>
                </div>
              ))}
            </div>
            <p className="learning-instruction">
              Observa cómo se reparte equitativamente y repítelo en voz alta para entender mejor la división.
            </p>
            <button
              onClick={() => setStage("challenge")}
              className="next-button"
            >
              ¡Listo, vamos a jugar!
            </button>
            <button
              onClick={() => {
                setSelectedDivisor(null);
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
            <h2>Sorpresa de División</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <p className="learning-instruction">
              Aquí no hay un divisor fijo. Se generarán divisiones con números al azar. ¡Prepárate!
            </p>
            <button
              onClick={() => setStage("challenge")}
              className="next-button"
            >
              ¡Listo, vamos a jugar!
            </button>
            <button
              onClick={() => {
                setSelectedDivisor(null);
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
  else if (stage === "challenge") {
    if (gameOverState) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else if (!currentQuestion) {
      content = <div>Cargando...</div>;
    } else {
      const correct = currentQuestion.correctAnswer;
      const alt1 = correct + 1;
      const alt2 = correct - 1;
      let baseOptions = [correct, alt1, alt2].filter((val) => val > 0);

      baseOptions = Array.from(new Set(baseOptions));
      while (baseOptions.length < 3) {
        baseOptions.push(correct + (Math.random() > 0.5 ? 2 : -2));
      }
      const options = shuffleArray(baseOptions);

      content = (
        <div className="game-container">
          <h2 className="game-title">
            {isSorpresaMode 
              ? `Desafío: Sorpresa de División (${difficulty})`
              : `Desafío: División con ${selectedDivisor} (${difficulty})`
            }
          </h2>
          {/* Villano */}
          <VillainBar
            villainNumber={3}
            villainHP={villainHP}
            villainMaxHP={villainMaxHP}
          />
          <div className="question">
            {currentQuestion.context && <p className="context">{currentQuestion.context}</p>}
            <p>
              {currentQuestion.dividend} ÷ {currentQuestion.divisor} = ?
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

      {/* Modal si el villano cae a 0 antes de finalizar */}
      {villainDefeated && !showSuccessModal && !gameOverState && (
        <VillainDefeatedModal
          onContinue={handleVillainDefeatedContinue}
          onEnd={handleVillainDefeatedEnd}
        />
      )}

      {/* Modal de éxito */}
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

export default GameDivision;