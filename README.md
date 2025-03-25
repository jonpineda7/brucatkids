Brucatkids

Brucatkids es una página web educativa y colorida diseñada para niños de 3 a 8 años. El proyecto está desarrollado en React con Vite y se despliega en GitHub Pages.

Tecnologías utilizadas

React (Framework principal)

Vite (Entorno de desarrollo rápido)

React Router (Navegación entre vistas)

Tailwind CSS (Estilos rápidos y personalizables)

Howler.js (Sonidos y efectos de audio)

React Confetti (Animaciones para premios y recompensas)

GitHub Pages (Despliegue de la página web)

Instalación y configuración

1. Clonar el repositorio

 git clone https://github.com/tuusuario/brucatkids.git
 cd brucatkids

2. Instalar dependencias

npm install

3. Ejecutar en modo desarrollo

npm run dev

4. Construir para producción

npm run build

5. Previsualizar el build

npm run preview

6. Desplegar en GitHub Pages

npm run deploy

Características del Proyecto

Selección de personaje: Siempre visible con puntaje y evolución.

Selección de curso: "KINDER" y "Primero Básico" (posibilidad de agregar más en el futuro).

Categorías de juego: Matemáticas, Colores, Memoria (dinámico según curso seleccionado).

Sistema de vidas: 5 vidas por juego, pierde una con cada error.

Sistema de premios y recompensas:

Evolución del personaje con accesorios.

Cofres sorpresa con stickers y efectos visuales.

Medallas y trofeos coleccionables.

"Modo Súper Niño" con efectos especiales tras tres victorias consecutivas.

Personalización del personaje con accesorios desbloqueables.

Estructura del proyecto

brucatkids/
│── public/               # Recursos estáticos (imágenes, sonidos, etc.)
│── src/
│   │── assets/          # Archivos estáticos y estilos CSS
│   │── components/      # Componentes reutilizables
│   │── pages/          # Vistas de la aplicación (selección de personaje, juegos, etc.)
│   │── games/          # Juegos individuales
│   │── App.jsx         # Componente principal
│   │── main.jsx        # Punto de entrada de la aplicación
│── index.html           # HTML principal
│── vite.config.js       # Configuración de Vite
│── package.json         # Dependencias y scripts
│── README.md            # Documentación del proyecto

Consideraciones

Si los estilos o imágenes no se cargan en GitHub Pages, verifica que las rutas sean relativas a /brucatkids/ modificando vite.config.js:

export default defineConfig({
  base: "/brucatkids/",
  plugins: [react()],
});

Contribuciones

Si quieres contribuir al proyecto, realiza un fork, crea una rama y envía un pull request.

Contacto

Para dudas o sugerencias, puedes escribirme a jonpineda.7@gmail.com.