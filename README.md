# BruCat Kids

Aplicación educativa en React 19 y Vite, con estilos CSS y juegos de matemáticas para Tercero Básico.

## Desarrollo

```sh
npm ci
npm run dev
```

## Comprobaciones y producción

```sh
npm run lint
npm run build
npm run preview
```

Elige un personaje, el curso y Matemáticas para acceder a suma, resta, multiplicación, división, comparaciones y fracciones. El puntaje permite evolucionar al personaje. Cada tres partidas completadas se activa un juego de estrellas durante diez segundos; perder o abandonar una partida interrumpe la racha.

Las categorías Lenguaje y Ciencias y los juegos de KINDER aún no están disponibles en el flujo principal. Algunos componentes antiguos permanecen como prototipos.

## Despliegue

El código fuente se mantiene en `main`. Para publicar desde esa rama:

```sh
git switch main
npm run deploy
```

`npm run deploy` compila automáticamente el proyecto y publica únicamente `dist/` en `gh-pages`, con `.nojekyll`. No se debe fusionar `main` en `gh-pages` ni fusionar los archivos publicados de vuelta a `main`.

En GitHub, Pages debe publicar desde la rama `gh-pages`, carpeta `/ (root)`. El sitio se sirve en https://jonpineda7.github.io/brucatkids/.

La configuración actual usa `/brucatkids/` como ruta base. Los recursos estáticos también usan ese prefijo; ambos deben ajustarse si se cambia la ruta de publicación.
