# Ananders

Sitio de Ananders (Vite + React + Tailwind), reconstruido a partir del sitio publicado.
El inventario completo del material está en `~/Desktop/Haiku_Flow/ANANDERS-EXTRAIDO.md`.

## Uso

```bash
npm install
npm run dev      # http://localhost:5106 (puerto fijo)
npm run build
```

## Estructura

- `src/i18n/es.js`, `src/i18n/en.js`: textos y meta tags por ruta, ES/EN. ES por defecto; el idioma elegido se guarda en el navegador.
- `src/data/experiences.js`: las 6 experiencias (sin base de datos por ahora).
- `src/config.js`: correo de contacto (vacío), cifras del hero (ocultas).
- `src/pages/`: Home, Explorar, Detalle de experiencia, Facilitadores, Para Facilitadores, Buscadores, Nuestra historia, Seguridad, Privacidad, Términos, 404. Registro, ingreso y postulación muestran "Próximamente".

## Pendiente

- Imágenes en `public/images/` (mientras falten, se ve un degradado):
  `hero-door.jpg`, `exp-yoga-beach.jpg`, `about-spiral.jpg`, `exp-ceremony.jpg`, `exp-india.jpg`, `community-drum.jpg`.
- Descripciones, "qué esperar", precio y modalidad de cada experiencia (el origen no las traía).
- Perfiles de facilitadores.
- Correo de contacto para los textos legales (`CONTACT_EMAIL` en `src/config.js`).
- Cuentas, registro, mensajería y postulación (antes dependían de Supabase).
