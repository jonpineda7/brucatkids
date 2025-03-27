// src/components/CategorySelection.jsx
import React from 'react';

const categories = {
    KINDER: ['Matemáticas', 'Colores', 'Memoria'],
    'Tercero Básico': ['Matemáticas', 'Lenguaje', 'Ciencias'],
  };
  

const CategorySelection = ({ course, onSelectCategory }) => {
  return (
    <div>
      <h2>Categorías de {course}</h2>
      <ul>
        {categories[course].map((category) => (
          <li key={category}>
            <button onClick={() => onSelectCategory(category)}>{category}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelection;