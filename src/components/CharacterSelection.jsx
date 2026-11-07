import { soundSelectCharacter } from '../utils/sounds';

const companions = [
  { id: 'robot', name: 'Robot', description: '¡Recarga tus ideas!', color: 'mint' },
  { id: 'knight', name: 'Caballero', description: 'Valiente ante cada reto', color: 'peach' },
  { id: 'unicorn', name: 'Unicornio', description: 'Imagina lo imposible', color: 'lavender' },
  { id: 'astronaut', name: 'Astronauta', description: 'Explora nuevos mundos', color: 'sky' },
  { id: 'cat', name: 'Gatito', description: 'Curioso como tú', color: 'rose' },
];

export default function CharacterSelection({ onSelect }) {
  return (
    <div className="character-selection-grid">
      {companions.map(({ id, name, description, color }) => (
        <button type="button" className={`character-card companion-${color}`} key={id}
          onClick={() => { soundSelectCharacter(); onSelect(id); }} aria-label={`Elegir ${name}`}>
          <img alt="" src={`${import.meta.env.BASE_URL}images/${id}.png`} />
          <strong>{name}</strong><small>{description}</small>
          <span className="companion-choose" aria-hidden="true">¡Vamos! →</span>
        </button>
      ))}
    </div>
  );
}
