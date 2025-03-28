import React, { useState, useEffect } from 'react';

const BonusGame = ({ onComplete }) => {
  const [bonusScore, setBonusScore] = useState(0);
  const [stars, setStars] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);

  // Al montar, generamos 5 estrellas en posiciones aleatorias dentro del área
  useEffect(() => {
    const generatedStars = Array.from({ length: 5 }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      top: Math.random() * 80 + 10, // Entre 10% y 90%
      left: Math.random() * 80 + 10, // Entre 10% y 90%
    }));
    setStars(generatedStars);
  }, []);

  // Contador de tiempo para el bonus (10 segundos)
  useEffect(() => {
    if (timeLeft === 0) {
      onComplete(bonusScore); // Se llama al callback para notificar la finalización y puntaje bonus
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, bonusScore, onComplete]);

  const handleStarClick = (id) => {
    setBonusScore(prev => prev + 1);
    // Eliminamos la estrella clickeada para que no se pueda volver a recoger
    setStars(stars.filter(star => star.id !== id));
  };

  return (
    <div className="bonus-game">
      <h2>¡Atrapa las Estrellas Bonus!</h2>
      <p>Tiempo restante: {timeLeft} segundos</p>
      <p>Puntos Bonus: {bonusScore}</p>
      <div className="bonus-area">
        {stars.map(star => (
          <div 
            key={star.id}
            className="star"
            style={{ top: `${star.top}%`, left: `${star.left}%` }}
            onClick={() => handleStarClick(star.id)}
          >
            ⭐
          </div>
        ))}
      </div>
    </div>
  );
};

export default BonusGame;