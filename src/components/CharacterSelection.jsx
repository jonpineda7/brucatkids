import React from 'react';

function CharacterSelection({ onSelect }) {
  return (
    <div className="characters">
      <img alt="Robot" src="/brucatkids/images/robot.png" onClick={() => onSelect('robot')} />
      <img alt="Knight" src="/brucatkids/images/knight.png" onClick={() => onSelect('knight')} />
      <img alt="Fox" src="/brucatkids/images/fox.png" onClick={() => onSelect('fox')} />
      <img alt="Astronaut" src="/brucatkids/images/astronaut.png" onClick={() => onSelect('astronaut')} />
      <img alt="Cat" src="/brucatkids/images/cat.png" onClick={() => onSelect('cat')} />
    </div>
  );
}

export default CharacterSelection;