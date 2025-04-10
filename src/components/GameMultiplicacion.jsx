import React, { useState, useEffect } from 'react';
import SuccessModal from './SuccessModal';
import VillainBar from './VillainBar';
import VillainDefeatedModal from './VillainDefeatedModal';

const totalQuestions = 10;
const initialLives = 5;

// Modal simple de Game Over
const GameOverModal = ({ onGameOver }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>¡Game Over! ¡Bien Hecho!</h2>
      <p>No te rindas, sigue practicando la multiplicación.</p>
      <button onClick={onGameOver} className="modal-btn">
        Volver al inicio
      </button>
    </div>
  </div>
);

// Frases motivadoras
const motivationalMessages = {
  Aprendiz: [
    "¡Excelente! Estás dando tus primeros pasos en la multiplicación. ¡Sigue así!",
    "¡Maravilloso trabajo! Cada número te lleva a ser mejor.",
    "¡Multiplicación dominada! Eres un verdadero Aprendiz con gran potencial.",
  ],
  Osado: [
    "¡Genial! Te atreves con más dificultad y lo estás logrando.",
    "¡Fantástico! Tu osadía te está convirtiendo en un gran experto en la multiplicación.",
    "¡Increíble! Has resuelto multiplicaciones osadas y sigues avanzando. ¡Adelante!",
  ],
  Guerrero: [
    "¡Impresionante! Has librado la batalla de la multiplicación y has salido victorioso.",
    "¡Eres un verdadero Guerrero de las matemáticas! Multiplicaciones superadas con fuerza.",
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

const GameMultiplicacion = ({ onGameOver, score, setScore }) => {
  // Control de “learning” o “challenge”
  const [stage, setStage] = useState("learning");
  // Tabla seleccionada (1..13) o 14 => “Sorpresa”
  const [selectedTable, setSelectedTable] = useState(null);
  // Nivel de dificultad
  const [difficulty, setDifficulty] = useState(null);

  // Manejo de vidas
  const [lives, setLives] = useState(initialLives);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameOverState, setGameOverState] = useState(false);
  const [lifeLost, setLifeLost] = useState(false);

  // Villano
  const [villainHP, setVillainHP] = useState(0);
  const [villainMaxHP, setVillainMaxHP] = useState(0);
  const [villainDefeated, setVillainDefeated] = useState(false);

  // Modal final de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [randomMotivationalMessage, setRandomMotivationalMessage] = useState("");

  const wrongAnswerSound = new Audio("/brucatkids/sounds/life-lost.mp3");
  const correctSound = new Audio("/brucatkids/sounds/correct.mp3");

  const isSorpresaMode = (selectedTable === 14);

  // Selecciona mensaje motivador al azar
  function getRandomMotivationalMessage(diff) {
    const messages = motivationalMessages[diff] || motivationalMessages['Aprendiz'];
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }

  // Generar preguntas
  function generateQuestion() {
    if (!isSorpresaMode) {
      // Tablas 1..13
      const multiplicand = selectedTable || 1;
      let maxMultiplier = 10;
      if (difficulty === 'Osado') maxMultiplier = 20;
      if (difficulty === 'Guerrero') maxMultiplier = 30;

      const multiplier = Math.floor(Math.random() * maxMultiplier) + 1;
      const correctAnswer = multiplicand * multiplier;
      setCurrentQuestion({ multiplicand, multiplier, correctAnswer });
    } else {
      // Sorpresa
      let maxA = 50, maxB = 10;
      if (difficulty === 'Osado') { maxA = 100; maxB = 20; }
      if (difficulty === 'Guerrero') { maxA = 300; maxB = 50; }
      const multiplicand = Math.floor(Math.random() * maxA) + 1;
      const multiplier = Math.floor(Math.random() * maxB) + 1;
      const correctAnswer = multiplicand * multiplier;
      setCurrentQuestion({ multiplicand, multiplier, correctAnswer });
    }
  }

  // Definir HP del villano al iniciar challenge
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

  // Generar pregunta cada vez que questionNumber cambie
  useEffect(() => {
    if (stage === "challenge") {
      generateQuestion();
      setLifeLost(false);
      setSelectedOption(null);
    }
  }, [questionNumber, stage, difficulty]);

  // Manejo de respuesta
  function handleAnswer(option) {
    if (!currentQuestion) return;
    setSelectedOption(option);

    if (option === currentQuestion.correctAnswer) {
      correctSound.play();
      setScore(prev => prev + 1);

      // Daño al villano
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
      // Respuesta errónea
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

  // Cerrar modal de éxito
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    onGameOver();
  };

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

  /**
   * Obtiene las opciones BARAJADAS
   */
  function getShuffledOptions() {
    if (!currentQuestion) return [];
    const correctAnswer = currentQuestion.correctAnswer;
    const alt1 = correctAnswer + 1;
    const alt2 = correctAnswer - 1;

    let baseOptions = [correctAnswer, alt1, alt2];
    // Filtramos valores negativos (por si ocurre)
    baseOptions = baseOptions.filter(opt => opt >= 0);
    // Evitar duplicados
    baseOptions = Array.from(new Set(baseOptions));

    // Asegurarnos de 3 opciones
    while (baseOptions.length < 3) {
      baseOptions.push(correctAnswer + (Math.random() > 0.5 ? 2 : -2));
    }

    return shuffleArray(baseOptions);
  }

  let content;

  // ETAPA LEARNING
  if (stage === "learning") {
    if (selectedTable === null) {
      // Seleccionar tabla 1..13 y “Sorpresa”=14
      const tables = Array.from({ length: 13 }, (_, i) => i + 1);
      content = (
        <div className="learning-stage">
          <h2>Seleccionar Tabla o Modo Sorpresa</h2>
          <p className="learning-explanation">
            Elige una de las tablas del 1 al 13 o prueba la “Sorpresa Multiplicadora” para desafíos mayores.
          </p>
          <div className="table-options">
            {tables.map(num => (
              <button key={num} onClick={() => setSelectedTable(num)}>
                Tabla del {num}
              </button>
            ))}
            <button onClick={() => setSelectedTable(14)}>
              Sorpresa Multiplicadora
            </button>
          </div>
        </div>
      );
    } else if (!difficulty) {
      // (Se eliminó aquí el botón “Volver” local para evitar duplicados)
      content = (
        <div className="learning-stage">
          {isSorpresaMode ? (
            <h2>Sorpresa Multiplicadora</h2>
          ) : (
            <h2>Tabla del {selectedTable}</h2>
          )}
          <p className="learning-instruction">
            ¡Excelente! Elige tu nivel de dificultad:
          </p>
          <div className="table-options">
            <button onClick={() => setDifficulty('Aprendiz')}>Aprendiz</button>
            <button onClick={() => setDifficulty('Osado')}>Osado</button>
            <button onClick={() => setDifficulty('Guerrero')}>Guerrero</button>
          </div>
        </div>
      );
    } else {
      // Vista de aprendizaje (tabla o explicación Sorpresa)
      if (!isSorpresaMode) {
        const rows = Array.from({ length: 13 }, (_, i) => i + 1);
        content = (
          <div className="learning-stage">
            <h2>Tabla del {selectedTable}</h2>
            <p className="difficulty-label">Nivel: {difficulty}</p>
            <div className="table-grid">
              {rows.map(num => (
                <div key={num} className="table-cell">
                  <span className="table-expression">
                    {selectedTable} x {num} = {selectedTable * num}
                  </span>
                </div>
              ))}
            </div>
            <p className="learning-instruction">
              Observa la tabla antes de iniciar el desafío.
            </p>
            <button onClick={() => setStage("challenge")} className="next-button">
              ¡Listo, vamos a jugar!
            </button>
            <button onClick={() => { setSelectedTable(null); setDifficulty(null); }} className="back-button">
              Volver
            </button>
          </div>
        );
      } else {
        // Modo Sorpresa
        content = (
          <div className="learning-stage">
            <h2>Sorpresa Multiplicadora</h2>
            <p className="learning-instruction">
              Se generarán multiplicaciones con números mayores y al azar.
            </p>
            <button onClick={() => setStage("challenge")} className="next-button">
              ¡Listo, vamos a jugar!
            </button>
            <button onClick={() => { setSelectedTable(null); setDifficulty(null); }} className="back-button">
              Volver
            </button>
          </div>
        );
      }
    }
  }
  // ETAPA CHALLENGE
  else if (stage === "challenge") {
    if (gameOverState) {
      content = <GameOverModal onGameOver={onGameOver} />;
    } else if (!currentQuestion) {
      content = <div>Cargando pregunta...</div>;
    } else {
      // Obtenemos opciones barajadas
      const options = getShuffledOptions();

      content = (
        <div className="game-container">
          <h2 className="game-title">
            Desafío: Multiplicación
            {isSorpresaMode ? ' (Sorpresa)' : ` - Tabla del ${selectedTable}`} ({difficulty})
          </h2>

          {/* Villano */}
          <VillainBar villainHP={villainHP} villainMaxHP={villainMaxHP} villainNumber={2} />

          {/* Pregunta */}
          <div className="question">
            <p>
              {currentQuestion.multiplicand} x {currentQuestion.multiplier} = ?
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

      {/* Modal si el villano se derrotó antes de terminar */}
      {villainDefeated && !showSuccessModal && !gameOverState && (
        <VillainDefeatedModal
          onContinue={handleVillainDefeatedContinue}
          onEnd={handleVillainDefeatedEnd}
        />
      )}

      {/* Modal de éxito al final */}
      {showSuccessModal && (
        <SuccessModal
          message={randomMotivationalMessage}
          onConfirm={closeSuccessModal}
        />
      )}
    </div>
  );
};

export default GameMultiplicacion;