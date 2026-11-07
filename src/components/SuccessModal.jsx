import React from 'react';

const SuccessModal = ({ message, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content success">
        <h2>¡Increíble trabajo!</h2>
        <p>{message}</p>
        <button onClick={onConfirm} className="modal-btn">
          ¡Sigue brillando!
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;