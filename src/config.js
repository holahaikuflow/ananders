// Valores que el sitio publicado obtenía de Supabase o que no existen todavía para Ananders.

export const SITE_URL = 'https://ananders.com'
export const OG_IMAGE = `${SITE_URL}/images/hero-door.jpg`

// Correo de contacto de los textos legales. El bundle solo traía el correo de la otra marca,
// así que queda vacío hasta que exista uno real.
export const CONTACT_EMAIL = ''

// Cifras del hero: el bundle las mostraba solo si Supabase lo habilitaba (por defecto, ocultas).
export const SHOW_HERO_STATS = false
export const HERO_STATS = { exp: '1.200+', countries: '84', ananders: '3.400+', guides: '620+' }

// Fondo del hero. Cambiar `mode` a 'video' o 'carousel' cuando existan los archivos.
export const HERO_MEDIA = {
  mode: 'gradient',             // 'gradient' | 'video' | 'carousel'
  video: '/media/hero.mp4',
  poster: '/media/hero-poster.jpg',
  images: [
    '/media/hero-1.jpg',
    '/media/hero-2.jpg',
    '/media/hero-3.jpg',
  ],
}
