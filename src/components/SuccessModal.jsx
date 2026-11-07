import ResultDialog from './ResultDialog';

export default function SuccessModal({ message, onConfirm }) {
  return (
    <ResultDialog title="¡Increíble trabajo!" icon="🏆">
      <p>{message}</p>
      <button onClick={onConfirm}>¡Elegir otra aventura! →</button>
    </ResultDialog>
  );
}
