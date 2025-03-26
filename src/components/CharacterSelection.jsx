import React from 'react';
import { soundSelectCharacter } from '../utils/sounds'; // Importa el sonido

function CharacterSelection({ onSelect }) {
  const handleCharacterSelect = (character) => {
    soundSelectCharacter(); // Reproduce el sonido cuando se selecciona un personaje
    onSelect(character);
  };

  return (
    <div className="characters">
      <img
        alt="Robot"
        src="/brucatkids/images/robot.png"
        onClick={() => handleCharacterSelect('robot')}
      />
      <img
        alt="Knight"
        src="/brucatkids/images/knight.png"
        onClick={() => handleCharacterSelect('knight')}
      />
      <img
        alt="Fox"
        src="/brucatkids/images/fox.png"
        onClick={() => handleCharacterSelect('fox')}
      />
      <img
        alt="Astronaut"
        src="/brucatkids/images/astronaut.png"
        onClick={() => handleCharacterSelect('astronaut')}
      />
      <img
        alt="Cat"
        src="/brucatkids/images/cat.png"
        onClick={() => handleCharacterSelect('cat')}
      />
    </div>
  );
}

export default CharacterSelection;