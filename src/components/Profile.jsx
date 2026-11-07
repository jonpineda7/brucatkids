import React, { useState, useEffect, useRef } from 'react';
import '/src/assets/Profile.css';

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
    { thresholdMin: 30, thresholdMax: Infinity, image: '/brucatkids/images/cat5.png' },
  ],
};

const Profile = ({ character, score, compact = false }) => {
  const evolutionLevels = allEvolutionLevels[character] || allEvolutionLevels.robot;
  const level = evolutionLevels.find(level => score >= level.thresholdMin && score <= level.thresholdMax) || evolutionLevels[0];
  const currentImage = level.image;
  const previousImage = useRef(currentImage);
  const [evolved, setEvolved] = useState(false);

  useEffect(() => {
    if (previousImage.current === currentImage) return;
    previousImage.current = currentImage;
    setEvolved(level.thresholdMin === 30 ? 'max' : true);
    const timer = setTimeout(() => setEvolved(false), level.thresholdMin === 30 ? 3000 : 2000);
    return () => clearTimeout(timer);
  }, [currentImage, level.thresholdMin]);

  return (
    <div className={`profile-container ${compact ? 'compact-profile' : 'highlight-profile'}`}>
      {!compact && <h3 className="profile-label">PERSONAJE</h3>}
      {!compact && (
        <h2 className="profile-name">
          {character.charAt(0).toUpperCase() + character.slice(1)}
        </h2>
      )}
      <div className={`profile-image ${evolved === 'max' ? 'max-shining' : evolved ? 'shining' : ''}`}>
        <img src={currentImage} alt="Personaje Evolutivo" />
      </div>

      <div className="profile-score-bubble">
        <span className="score-label">Puntaje:</span>
        <span className="score-value">{score}</span>
      </div>
    </div>
  );
};

export default Profile;