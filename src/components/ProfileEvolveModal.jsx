import React, { useEffect } from 'react';

/**
 * Modal que muestra en grande la nueva apariencia del personaje
 * @param {string} image - La ruta de la nueva imagen
 * @param {function} onClose - Función para cerrar el modal
 */
const ProfileEvolveModal = ({ image, onClose }) => {
  useEffect(() => {
    // Cierra automáticamente tras 2.5s
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="evolve-overlay">
      <div className="evolve-content">
        <h2>¡Evolución!</h2>
        <img src={image} alt="Nueva Evolución" className="evolve-image" />
      </div>
    </div>
  );
};

export default ProfileEvolveModal;