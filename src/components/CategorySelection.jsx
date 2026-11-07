const categories = {
  KINDER: ['Matemáticas', 'Colores', 'Memoria'],
  'Tercero Básico': ['Matemáticas'],
};

export default function CategorySelection({ course, onSelectCategory }) {
  return (
    <section className="path-selection" aria-labelledby="category-title">
      <span className="view-eyebrow">PASO 2 · EXPLORA</span>
      <h2 id="category-title">¿Qué descubrimos hoy?</h2>
      <p>Tu mundo de aprendizaje en {course}.</p>
      <div className="path-options">
        {(categories[course] || []).map(category => (
          <button className="path-card" key={category} onClick={() => onSelectCategory(category)}>
            <span className="path-symbol" aria-hidden="true">{category === 'Matemáticas' ? '✦' : '🎨'}</span>
            <span><strong>{category}</strong><small>Juega, practica y haz crecer a tu compañero</small></span>
            <span className="path-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </section>
  );
}
