import React from "react";

function CategorySelection({ course, onSelectCategory }) {
  return (
    <div>
      <h2>Selecciona la categoría para {course}</h2>
      {course === "KINDER" && (
        <>
          <button onClick={() => onSelectCategory("Matemáticas")}>
            Matemáticas
          </button>
          <button onClick={() => onSelectCategory("Colores")}>Colores</button>
          <button onClick={() => onSelectCategory("Memoria")}>Memoria</button>
        </>
      )}
      {course === "Primero Básico" && (
        <>
          <button onClick={() => onSelectCategory("Matemáticas")}>
            Matemáticas
          </button>
          <button onClick={() => onSelectCategory("Lenguaje")}>Lenguaje</button>
          <button onClick={() => onSelectCategory("Ciencias")}>Ciencias</button>
        </>
      )}
    </div>
  );
}

export default CategorySelection;