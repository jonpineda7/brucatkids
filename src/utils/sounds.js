// src/utils/sounds.js
export const soundSelectCharacter = () => {
    const audio = new Audio('/brucatkids/sounds/select-character.mp3');
    audio.play();
  };
  
  export const soundSelectGame = () => {
    const audio = new Audio('/brucatkids/sounds/select-game.mp3');
    audio.play();
  };
  
  export const soundCorrectAnswer = () => {
    const audio = new Audio('/brucatkids/sounds/correct-answer.mp3');
    audio.play();
  };
  
  export const soundEvolution = () => {
    const audio = new Audio('/brucatkids/sounds/evolution.mp3');
    audio.play();
  };
  
  export const soundLifeLost = () => {
    const audio = new Audio('/brucatkids/sounds/life-lost.mp3');
    audio.play();
  };