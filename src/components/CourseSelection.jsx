import React from "react";

function CourseSelection({ onSelectCourse }) {
  return (
    <div>
      <h2>Selecciona el curso</h2>
      <button onClick={() => onSelectCourse("KINDER")}>KINDER</button>
      <button onClick={() => onSelectCourse("Tercero Básico")}>
        Tercero Básico
      </button>
      {/* Agregar más cursos aquí */}
    </div>
  );
}

export default CourseSelection;