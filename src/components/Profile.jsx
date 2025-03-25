import React from 'react';

function Profile({ character, score, evolutionLevel }) {
  return (
    <div className="profile">
      <h3>Perfil del Niño</h3>
      <p>Personaje seleccionado: {character}</p>
      <p>Puntaje: {score}</p>
      {evolutionLevel > 0 && <p>¡Tu personaje ha evolucionado!</p>}
    </div>
  );
}

export default Profile;