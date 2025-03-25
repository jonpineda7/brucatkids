// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/brucatkids/',  // Asegúrate de configurar la ruta base para GitHub Pages
  plugins: [react()],
});