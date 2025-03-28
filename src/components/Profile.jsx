import React, { useEffect, useState } from 'react';
import '/src/assets/Profile.css';

// Evoluciones de todos los personajes
const allEvolutionLevels = {
  robot: [
    { threshold: 0, image: '/brucatkids/images/robot.png' },
    { threshold: 10, image: '/brucatkids/images/robot2.png' },
    { threshold: 20, image: '/brucatkids/images/robot3.png' },
    { threshold: 30, image: '/brucatkids/images/robot4.png' },
  ],
  knight: [
    { threshold: 0, image: '/brucatkids/images/knight.png' },
    // Podrías añadir knight2, knight3... si tienes
  ],
  unicorn: [
    { threshold: 0, image: '/brucatkids/images/unicorn.png' },
    // ...
  ],
  astronaut: [
    { threshold: 0, image: '/brucatkids/images/astronaut.png' },
    // ...
  ],
  cat: [
    { threshold: 0, image: '/brucatkids/images/cat.png' },
    // ...
  ],
};

const Profile = ({ character, score }) => {
  // Buscamos el array de evolución según el personaje. 
  // Si no existe, usamos robot como fallback:
  const evolutionLevels = allEvolutionLevels[character] || allEvolutionLevels.robot;
  
  const [currentImage, setCurrentImage] = useState(evolutionLevels[0].image);
  const [evolved, setEvolved] = useState(false);

  useEffect(() => {
    // Determinamos cuál imagen corresponde al puntaje
    let newImage = evolutionLevels[0].image;
    evolutionLevels.forEach(level => {
      if (score >= level.threshold) {
        newImage = level.image;
      }
    });
    // Si la imagen cambia, activamos el efecto de brillo
    if (newImage !== currentImage) {
      setCurrentImage(newImage);
      setEvolved(true);
      const timer = setTimeout(() => {
        setEvolved(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [score, currentImage, evolutionLevels]);

  return (
    <div className="profile-container">
      {/* 
        'character' es un string (e.g. 'knight' o 'unicorn'). 
        Si quieres mostrarlo con mayúscula, haz character.charAt(0).toUpperCase() + character.slice(1)
      */}
      <h2>{character}</h2>

      <div className={`profile-image ${evolved ? 'shining' : ''}`}>
        <img src={currentImage} alt="Personaje Evolutivo" />
      </div>
      <p>Puntaje: {score}</p>
    </div>
  );
};

export default Profile;
