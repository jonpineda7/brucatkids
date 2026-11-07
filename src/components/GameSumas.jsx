import Profile from './Profile';
import VillainBar from './VillainBar';
import VillainDefeatedModal from './VillainDefeatedModal';
import { useState, useEffect, useRef } from 'react';
import '../assets/GameSumas.css';

const BRIDGE_PARTS = 5;
const asset = (name) => `${import.meta.env.BASE_URL}${name}`;

function createQuestion() {
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const correct = num1 + num2;
  const answers = new Set([correct]);
  while (answers.size < 4) answers.add(Math.floor(Math.random() * 19) + 1);
  const options = [...answers];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { num1, num2, correct, options };
}

const GameSumas = ({ character, lives, setLives, score, setScore, onGameOver }) => {
  const [question, setQuestion] = useState(createQuestion);
  const [selected, setSelected] = useState(null);
  const [parts, setParts] = useState(0);
  const [status, setStatus] = useState('playing');
  const [defeated, setDefeated] = useState(false);
  const timer = useRef(null);
  const locked = useRef(false);
  useEffect(() => () => clearTimeout(timer.current), []);

  const playSound = (name) => {
    new Audio(asset(`sounds/${name}.mp3`)).play().catch(() => {});
  };

  const answer = (value) => {
    if (locked.current || status !== 'playing') return;
    locked.current = true;
    setSelected(value);
    const correct = value === question.correct;
    if (correct) {
      setScore(previous => previous + 1);
      setParts(previous => previous + 1);
      playSound('correct');
    } else {
      setLives(previous => Math.max(0, previous - 1));
      playSound('life-lost');
    }
    timer.current = setTimeout(() => {
      if (correct && parts + 1 === BRIDGE_PARTS) {
        setStatus('won');
        setDefeated(true);
      } else if (!correct && lives <= 1) {
        setStatus('lost');
      } else {
        setQuestion(createQuestion());
        setSelected(null);
        locked.current = false;
      }
    }, correct ? 1400 : 2400);
  };

  const correct = selected === question.correct;
  return (
    <section className="sum-adventure" aria-labelledby="sum-title">
      <header>
        <span className="sum-badge">MISIÓN · SUMAS</span>
        <h2 id="sum-title">¡Enciende el puente!</h2>
        <p>Junta las dos cargas de energía. Cada suma correcta construye una parte del puente.</p>
      </header>

      <div className="battle-arena">
        <Profile character={character} score={score} compact />
        <span className="battle-vs" aria-hidden="true">VS</span>
        <VillainBar villainNumber={2} villainHP={BRIDGE_PARTS - parts} villainMaxHP={BRIDGE_PARTS} />
      </div>
      <div className="sum-hud">
        <span aria-label={`${lives} vidas restantes`}>❤️ {lives}</span>
        <span>⭐ Puntaje: {score}</span>
        <span>🌉 {parts} de {BRIDGE_PARTS} partes</span>
      </div>

      <div className={`sum-scene ${selected !== null && correct ? 'sum-powered' : ''} ${status === 'won' ? 'sum-complete' : ''}`}
        role="img" aria-label={`Robot construyendo un puente sobre el río: ${parts} de ${BRIDGE_PARTS} partes listas.`}>
        <span className="sum-sun" aria-hidden="true">☀️</span>
        <div className="sum-bank sum-bank-left" />
        <div className="sum-bank sum-bank-right" />
        <div className="sum-river" />
        <div className="sum-bridge" aria-hidden="true">
          {Array.from({ length: BRIDGE_PARTS }, (_, index) => (
            <span key={index} className={`sum-plank ${index < parts ? 'built' : ''}`} />
          ))}
        </div>
        <img className="sum-builder" src={asset('images/robot.png')} alt="" />
        <img className="sum-traveler" src={asset(`images/${character || 'robot'}.png`)} alt="" />
        <span className="sum-destination" aria-hidden="true">🏡</span>
        <span className="sum-spark" aria-hidden="true">⚡</span>
      </div>
      <div className="sum-energy" role="progressbar" aria-label="Puente construido"
        aria-valuemin={0} aria-valuemax={BRIDGE_PARTS} aria-valuenow={parts}>
        <span style={{ width: `${parts / BRIDGE_PARTS * 100}%` }} />
      </div>

      {status === 'playing' ? (
        <div className="sum-workshop">
          <h3>¿Cuánta energía tenemos en total?</h3>
          <div className="sum-packs">
            {[question.num1, question.num2].map((amount, index) => (
              <div className="sum-pack-pair" key={index}>
                {index === 1 && <span className="sum-plus" aria-hidden="true">+</span>}
                <div className={`sum-pack sum-pack-${index}`} aria-label={`${amount} unidades de energía`}>
                  <strong>{amount}</strong>
                  <div aria-hidden="true">{Array.from({ length: amount }, (_, i) => <span key={i}>⚡</span>)}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="sum-equation">{question.num1} + {question.num2} = ?</p>
          <div className="sum-answers" aria-label="Elige la energía total">
            {question.options.map(value => (
              <button key={value} onClick={() => answer(value)} disabled={selected !== null}
                className={selected === value ? (correct ? 'is-correct' : 'is-wrong') : ''}
                aria-label={`Cargar ${value} unidades de energía`}>
                <span aria-hidden="true">⚡ </span>{value}
              </button>
            ))}
          </div>
          <p className="sum-message" role="status" aria-live="polite">
            {selected === null ? 'Cuenta los rayos y elige la carga para el robot.' : correct
              ? `¡Energía lista! Construiste la parte ${parts} de ${BRIDGE_PARTS}.`
              : `Sigamos practicando: ${question.num1} + ${question.num2} = ${question.correct}. Puedes contar los rayos de las dos cargas.`}
          </p>
        </div>
      ) : (
        <div className="sum-result" role="status">
          <h3>{status === 'won' ? '¡Puente encendido! 🎉' : '¡Buen esfuerzo, constructor!'}</h3>
          <p>{status === 'won' ? '¡Tu compañero ya puede cruzar y llegar a casa! Lo lograste sumando energía.'
            : `Construiste ${parts} de ${BRIDGE_PARTS} partes. Podemos volver a practicar.`}</p>
          <button onClick={() => onGameOver(status === 'won')}>
            {status === 'won' ? '¡Misión completada!' : 'Volver a los juegos'}
          </button>
        </div>
      )}
      {defeated && <VillainDefeatedModal onEnd={() => setDefeated(false)} onContinue={() => {
        setDefeated(false);
        setParts(0);
        setStatus('playing');
        setSelected(null);
        setQuestion(createQuestion());
        locked.current = false;
      }} />}
    </section>
  );
};

export default GameSumas;
