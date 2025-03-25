import React, { useState } from "react";

function ColorGame() {
  const colors = ["rojo", "verde", "azul", "amarillo", "naranja"];
  const correctColor = colors[Math.floor(Math.random() * colors.length)];
  const [selectedColor, setSelectedColor] = useState("");
  const [message, setMessage] = useState("");

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    if (color === correctColor) {
      setMessage("¡Correcto!");
    } else {
      setMessage("¡Inténtalo nuevamente!");
    }
  };

  return (
    <div>
      <h2>Juego de Colores</h2>
      <p>Elige el color: {correctColor}</p>
      <div>
        {colors.map((color) => (
          <button key={color} onClick={() => handleSelectColor(color)}>
            {color}
          </button>
        ))}
      </div>
      <p>{message}</p>
    </div>
  );
}

export default ColorGame;