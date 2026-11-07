import ResultDialog from './ResultDialog';

export default function VillainDefeatedModal({ onContinue, onEnd }) {
  return (
    <ResultDialog title="¡Villano derrotado!" icon="🎉">
      <p>¡Tus conocimientos ganaron la batalla! Cada desafío te hace más fuerte.</p>
      <div className="result-actions">
        <button onClick={onEnd}>Completar misión ✓</button>
        <button className="secondary-action" onClick={onContinue}>Jugar otra ronda →</button>
      </div>
    </ResultDialog>
  );
}
