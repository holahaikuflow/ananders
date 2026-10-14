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

// Valores del enum `experience_type` de Supabase.
export const TYPE_KEYS = ['ayahuasca', 'psilocibina', 'yoga', 'vipassana', 'sufismo', 'otro']

// Buckets de duración de Explorar, según duration_days_min.
export const DURATION_BUCKETS = [
  { key: 'short', labelKey: 'dur_short', min: 0, max: 7 },
  { key: 'medium', labelKey: 'dur_medium', min: 7, max: 21 },
  { key: 'long', labelKey: 'dur_long', min: 21, max: Infinity },
]
