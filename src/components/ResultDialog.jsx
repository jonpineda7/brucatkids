import { useEffect, useId, useRef } from 'react';

export default function ResultDialog({ title, icon = '✨', children }) {
  const dialog = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  return (
    <dialog ref={dialog} className="result-dialog" aria-labelledby={titleId} onCancel={event => event.preventDefault()}>
      <span className="result-icon" aria-hidden="true">{icon}</span>
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  );
}
