import React from 'react';
import { soundSelectCharacter } from '../utils/sounds'; // Importa el sonido

function CharacterSelection({ onSelect }) {
  const handleCharacterSelect = (character) => {
    soundSelectCharacter(); // Reproduce el sonido cuando se selecciona un personaje
    onSelect(character);
  };

  return (
    <div className="character-selection-grid">
      <button type="button" className="character-card" onClick={() => handleCharacterSelect('robot')}>
        <img alt="Robot" src="/brucatkids/images/robot.png" />
        <p>Robot</p>
      </button>
      <button type="button" className="character-card" onClick={() => handleCharacterSelect('knight')}>
        <img alt="Knight" src="/brucatkids/images/knight.png" />
        <p>Knight</p>
      </button>
      <button type="button" className="character-card" onClick={() => handleCharacterSelect('unicorn')}>
        <img alt="Unicorn" src="/brucatkids/images/unicorn.png" />
        <p>Unicorn</p>
      </button>
      <button type="button" className="character-card" onClick={() => handleCharacterSelect('astronaut')}>
        <img alt="Astronaut" src="/brucatkids/images/astronaut.png" />
        <p>Astronaut</p>
      </button>
      <button type="button" className="character-card" onClick={() => handleCharacterSelect('cat')}>
        <img alt="Cat" src="/brucatkids/images/cat.png" />
        <p>Cat</p>
      </button>
    </div>
  );
}

export default CharacterSelection;