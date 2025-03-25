import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/style.css';

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Elemento con id 'app' no encontrado");
}