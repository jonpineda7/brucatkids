import '../assets/BonusGame.css';
import { useState, useEffect, useRef } from 'react';
import ResultDialog from './ResultDialog';

const positions = [{ top: 22, left: 20 }, { top: 22, left: 75 }, { top: 50, left: 48 }, { top: 78, left: 22 }, { top: 78, left: 78 }];

export default function BonusGame({ onComplete }) {
  const [stars, setStars] = useState(() => positions.map((position, id) => ({ ...position, id })));
  const [timeLeft, setTimeLeft] = useState(10);
  const collected = useRef(new Set());
  const bonusScore = positions.length - stars.length;
  const finished = timeLeft === 0 || stars.length === 0;

  useEffect(() => {
    if (finished) return;
    const timer = setTimeout(() => setTimeLeft(previous => Math.max(0, previous - 1)), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, finished]);

  const collect = id => {
    if (finished || collected.current.has(id)) return;
    collected.current.add(id);
    setStars(previous => previous.filter(star => star.id !== id));
  };

  return (
    <section className="bonus-game" aria-labelledby="bonus-title">
      <span className="view-eyebrow">¡GANASTE UNA RONDA BONUS!</span>
      <h2 id="bonus-title">¡Lluvia de estrellas!</h2>
      <p className="bonus-instruction">Toca las estrellas para sumar energía extra a tu personaje.</p>
      <div className="bonus-hud"><span>⏱ {timeLeft} segundos</span><span role="status">⭐ {bonusScore} de {positions.length}</span></div>
      <div className="bonus-area">
        {stars.map(star => <button key={star.id} className="star" style={{ top: `${star.top}%`, left: `${star.left}%` }}
          onClick={() => collect(star.id)} disabled={finished} aria-label={`Atrapar estrella ${star.id + 1}`}>⭐</button>)}
      </div>
      {finished && <ResultDialog title={stars.length === 0 ? '¡Las atrapaste todas!' : '¡Estrellas conseguidas!'} icon="🌟">
        <p>Sumaste {bonusScore} puntos extra. ¡Tu personaje sigue creciendo!</p>
        <button onClick={() => onComplete(bonusScore)}>Continuar mi aventura →</button>
      </ResultDialog>}
    </section>
  );
}
