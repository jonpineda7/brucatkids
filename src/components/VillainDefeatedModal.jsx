import React from 'react';

const VillainDefeatedModal = ({ onContinue, onEnd }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>¡Villano Derrotado!</h2>
        <p>¡Felicidades! Has acabado con la energía del villano.</p>
        <button onClick={onContinue} className="modal-btn">
          Seguir Respondiendo
        </button>
        <button onClick={onEnd} className="modal-btn">
          Terminar Ahora
        </button>
      </div>
    </div>
  );
};

export default VillainDefeatedModal;