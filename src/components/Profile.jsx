import React, { useEffect, useState } from 'react';
import '/src/assets/Profile.css';

// Definición de niveles de evolución para cada personaje
const allEvolutionLevels = {
  robot: [
    { thresholdMin: 0, thresholdMax: 9, image: '/brucatkids/images/robot.png' },
    { thresholdMin: 10, thresholdMax: 19, image: '/brucatkids/images/robot2.png' },
    { thresholdMin: 20, thresholdMax: 29, image: '/brucatkids/images/robot3.png' },
    { thresholdMin: 30, thresholdMax: Infinity, image: '/brucatkids/images/robot4.png' },
  ],
  knight: [
    { thresholdMin: 0, thresholdMax: 9, image: '/brucatkids/images/knight.png' },
    { thresholdMin: 10, thresholdMax: 19, image: '/brucatkids/images/knight2.png' },
    { thresholdMin: 20, thresholdMax: 29, image: '/brucatkids/images/knight3.png' },
    { thresholdMin: 30, thresholdMax: Infinity, image: '/brucatkids/images/knight4.png' },
  ],
  unicorn: [
    { thresholdMin: 0, thresholdMax: 9, image: '/brucatkids/images/unicorn.png' },
    { thresholdMin: 10, thresholdMax: 19, image: '/brucatkids/images/unicorn2.png' },
    { thresholdMin: 20, thresholdMax: 29, image: '/brucatkids/images/unicorn3.png' },
    { thresholdMin: 30, thresholdMax: Infinity, image: '/brucatkids/images/unicorn4.png' },
  ],
  astronaut: [
    { thresholdMin: 0, thresholdMax: 9, image: '/brucatkids/images/astronaut.png' },
    { thresholdMin: 10, thresholdMax: 19, image: '/brucatkids/images/astronaut2.png' },
    { thresholdMin: 20, thresholdMax: 29, image: '/brucatkids/images/astronaut3.png' },
    { thresholdMin: 30, thresholdMax: Infinity, image: '/brucatkids/images/astronaut4.png' },
  ],
  cat: [
    { thresholdMin: 0, thresholdMax: 9, image: '/brucatkids/images/cat.png' },
    { thresholdMin: 10, thresholdMax: 19, image: '/brucatkids/images/cat2.png' },
    { thresholdMin: 20, thresholdMax: 29, image: '/brucatkids/images/cat3.png' },
    { thresholdMin: 30, thresholdMax: Infinity, image: '/brucatkids/images/cat4.png' },
  ],
};

const Profile = ({ character, score }) => {
  // Seleccionamos el conjunto de evoluciones basado en el personaje.
  const evolutionLevels = allEvolutionLevels[character] || allEvolutionLevels.robot;

  // Estado para la imagen actual y para el efecto de evolución.
  // Usamos "evolved" para controlar si se aplica el efecto extra cuando se alcanza el nivel máximo.
  const [currentImage, setCurrentImage] = useState(evolutionLevels[0].image);
  const [evolved, setEvolved] = useState(false);

  useEffect(() => {
    let newImage = evolutionLevels[0].image;
    let isMax = false;
    evolutionLevels.forEach(level => {
      if (score >= level.thresholdMin && score <= level.thresholdMax) {
        newImage = level.image;
        if (level.thresholdMin === 30) {
          isMax = true;
        }
      }
    });
    if (newImage !== currentImage) {
      setCurrentImage(newImage);
      setEvolved(isMax ? 'max' : true);
      const timer = setTimeout(() => {
        setEvolved(false);
      }, isMax ? 3000 : 2000);
      return () => clearTimeout(timer);
    }
  }, [score, currentImage, evolutionLevels]);

  return (
    <div className="profile-container">
      <h2>{character.charAt(0).toUpperCase() + character.slice(1)}</h2>
      <div className={`profile-image ${evolved === 'max' ? 'max-shining' : evolved ? 'shining' : ''}`}>
        <img src={currentImage} alt="Personaje Evolutivo" />
      </div>
      <p>Puntaje: {score}</p>
    </div>
  );
};

export default Profile;
