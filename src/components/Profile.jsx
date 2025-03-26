import React from 'react';

function Profile({ character, score, lives }) {
  const characterImage = `/brucatkids/images/${character}.png`;

  return (
    <div className="profile">
      <img src={characterImage} alt={character} className={`character ${score >= 50 ? 'character-glow active' : ''}`} />
      <p>Puntaje: {score}</p>
      <p>Vidas restantes: {lives}</p>
    </div>
  );
}

export default Profile;