// Experiencias de Ananders tal como venían en los datos de respaldo del sitio publicado.
// Campos sin material en el origen (descripción, qué esperar, consejos, precio, modalidad) quedan en null:
// el detalle muestra los textos genéricos del diccionario en su lugar.

// Orden igual al de la lista `continents` del diccionario, para traducir con t('continents')[i].
export const CONTINENT_KEYS = [
  'africa',
  'asia',
  'central-america',
  'europe',
  'north-america',
  'oceania',
  'south-america',
]

// Slugs de tipo tomados de los links del footer (/explore?type=…).
export const TYPE_KEYS = ['plant-medicine', 'yoga', 'meditation']

// Buckets de duración de Explorar, según duration_days_min.
export const DURATION_BUCKETS = [
  { key: 'short', labelKey: 'dur_short', min: 0, max: 7 },
  { key: 'medium', labelKey: 'dur_medium', min: 7, max: 21 },
  { key: 'long', labelKey: 'dur_long', min: 21, max: Infinity },
]

export const experiences = [
  {
    id: '1',
    slug: 'ayahuasca-peru',
    continent: 'south-america',
    type: 'plant-medicine',
    duration_days_min: 7,
    image_url: '/images/exp-ceremony.jpg',
    description: null,
    es: {
      title: 'Ceremonia de ayahuasca',
      location_country: 'Perú',
      location_city: 'Amazonía',
      type: 'Medicina de plantas',
      duration_label: '7–14 días',
    },
    en: {
      title: 'Ayahuasca ceremony',
      location_country: 'Peru',
      location_city: 'Amazon rainforest',
      type: 'Plant medicine',
      duration_label: '7–14 days',
    },
  },
  {
    id: '2',
    slug: 'yoga-rishikesh',
    continent: 'asia',
    type: 'yoga',
    duration_days_min: 21,
    image_url: '/images/exp-india.jpg',
    description: null,
    es: {
      title: 'Inmersión de yoga y Vedanta',
      location_country: 'India',
      location_city: 'Rishikesh',
      type: 'Yoga',
      duration_label: '21–90 días',
    },
    en: {
      title: 'Yoga & Vedanta immersion',
      location_country: 'India',
      location_city: 'Rishikesh',
      type: 'Yoga',
      duration_label: '21–90 days',
    },
  },
  {
    id: '3',
    slug: 'yoga-coastal-retreat',
    continent: 'europe',
    type: 'yoga',
    duration_days_min: 7,
    image_url: '/images/exp-yoga-beach.jpg',
    description: null,
    es: {
      title: 'Retiro de yoga costero',
      location_country: 'Portugal',
      location_city: 'Costa del Alentejo',
      type: 'Yoga',
      duration_label: '7 días',
    },
    en: {
      title: 'Coastal yoga retreat',
      location_country: 'Portugal',
      location_city: 'Alentejo coast',
      type: 'Yoga',
      duration_label: '7 days',
    },
  },
  {
    id: '4',
    slug: 'psilocybin-oaxaca',
    continent: 'north-america',
    type: 'plant-medicine',
    duration_days_min: 5,
    image_url: '/images/exp-ceremony.jpg',
    description: null,
    es: {
      title: 'Retiro de psilocibina',
      location_country: 'México',
      location_city: 'Oaxaca',
      type: 'Medicina de plantas',
      duration_label: '5 días',
    },
    en: {
      title: 'Psilocybin retreat',
      location_country: 'Mexico',
      location_city: 'Oaxaca',
      type: 'Plant medicine',
      duration_label: '5 days',
    },
  },
  {
    id: '5',
    slug: 'vipassana-nepal',
    continent: 'asia',
    type: 'meditation',
    duration_days_min: 10,
    image_url: '/images/about-spiral.jpg',
    description: null,
    es: {
      title: 'Retiro de meditación Vipassana',
      location_country: 'Nepal',
      location_city: 'Valle de Katmandú',
      type: 'Meditación',
      duration_label: '10 días',
    },
    en: {
      title: 'Vipassana meditation retreat',
      location_country: 'Nepal',
      location_city: 'Kathmandu Valley',
      type: 'Meditation',
      duration_label: '10 days',
    },
  },
  {
    id: '6',
    slug: 'sufi-morocco',
    continent: 'africa',
    type: 'meditation',
    duration_days_min: 14,
    image_url: '/images/community-drum.jpg',
    description: null,
    es: {
      title: 'Retiro sufí y zikr',
      location_country: 'Marruecos',
      location_city: 'Montañas del Atlas',
      type: 'Meditación',
      duration_label: '14 días',
    },
    en: {
      title: 'Sufi retreat & zikr',
      location_country: 'Morocco',
      location_city: 'Atlas Mountains',
      type: 'Meditation',
      duration_label: '14 days',
    },
  },
]

function localize(exp, lang) {
  const { es, en, ...rest } = exp
  return { ...rest, ...(lang === 'en' ? en : es), type_key: exp.type }
}

export function getExperiences(lang) {
  return experiences.map((e) => localize(e, lang))
}

export function getExperience(slug, lang) {
  const exp = experiences.find((e) => e.slug === slug)
  return exp ? localize(exp, lang) : null
}
