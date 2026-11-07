// src/utils/tts.js
/**
 * speakText(text)
 * Usa la Web Speech API para convertir texto a voz.
 * Asegúrate de que el navegador sea compatible.
 */

export function speakText(text) {
    // Verificamos soporte de la API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Ajusta idioma, velocidad, tono
      utterance.lang = 'es-ES'; // idioma español
      utterance.rate = 1.0;     // velocidad
      utterance.pitch = 1.0;    // tono
      speechSynthesis.speak(utterance);
    } else {
      console.warn('Este navegador no soporta la API de síntesis de voz.');
      // Podrías mostrar un mensaje en la interfaz
    }
  }