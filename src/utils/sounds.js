// src/utils/sounds.js
export const soundSelectCharacter = () => {
    const audio = new Audio('/brucatkids/sounds/select-character.mp3');
    audio.play().catch(() => {});
  };
  
  export const soundSelectGame = () => {
    const audio = new Audio('/brucatkids/sounds/select-character.mp3');
    audio.play().catch(() => {});
  };
  
  export const soundCorrectAnswer = () => {
    const audio = new Audio('/brucatkids/sounds/correct.mp3');
    audio.play().catch(() => {});
  };
  
  export const soundEvolution = () => {
    const audio = new Audio('/brucatkids/sounds/correct.mp3');
    audio.play().catch(() => {});
  };
  
  export const soundLifeLost = () => {
    const audio = new Audio('/brucatkids/sounds/life-lost.mp3');
    audio.play().catch(() => {});
  };