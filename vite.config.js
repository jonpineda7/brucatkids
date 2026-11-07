import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/brucatkids/', // Asegura que los archivos se carguen con el prefijo correcto
});