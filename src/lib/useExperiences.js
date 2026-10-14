import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useLang } from '../i18n/LanguageContext'

// Derivación de continente desde nombre de país.
// Si un país no aparece aquí, la experiencia sigue visible pero no filtra por continente.
const COUNTRY_TO_CONTINENT = {
  // África
  'Marruecos': 'africa', 'Morocco': 'africa',
  'Egipto': 'africa', 'Egypt': 'africa',
  'Tanzania': 'africa',
  'Sudáfrica': 'africa', 'South Africa': 'africa',
  'Kenia': 'africa', 'Kenya': 'africa',
  'Ghana': 'africa',
  'Etiopía': 'africa', 'Ethiopia': 'africa',
  'Senegal': 'africa',
  'Nigeria': 'africa',
  // Asia
  'India': 'asia',
  'Nepal': 'asia',
  'Tailandia': 'asia', 'Thailand': 'asia',
  'Indonesia': 'asia',
  'Bali': 'asia',
  'Japón': 'asia', 'Japan': 'asia',
  'Myanmar': 'asia',
  'Sri Lanka': 'asia',
  'Turquía': 'asia', 'Turkey': 'asia',
  'Israel': 'asia',
  'Irán': 'asia', 'Iran': 'asia',
  'Jordania': 'asia', 'Jordan': 'asia',
  // Centroamérica
  'Guatemala': 'central-america',
  'Costa Rica': 'central-america',
  'Panamá': 'central-america', 'Panama': 'central-america',
  'Honduras': 'central-america',
  'El Salvador': 'central-america',
  'Nicaragua': 'central-america',
  'Belice': 'central-america', 'Belize': 'central-america',
  // Europa
  'Portugal': 'europe',
  'España': 'europe', 'Spain': 'europe',
  'Francia': 'europe', 'France': 'europe',
  'Italia': 'europe', 'Italy': 'europe',
  'Alemania': 'europe', 'Germany': 'europe',
  'Grecia': 'europe', 'Greece': 'europe',
  'Reino Unido': 'europe', 'United Kingdom': 'europe',
  'Países Bajos': 'europe', 'Netherlands': 'europe',
  'Suiza': 'europe', 'Switzerland': 'europe',
  'Austria': 'europe',
  'Irlanda': 'europe', 'Ireland': 'europe',
  'República Checa': 'europe', 'Czech Republic': 'europe',
  'Polonia': 'europe', 'Poland': 'europe',
  'Hungría': 'europe', 'Hungary': 'europe',
  'Croacia': 'europe', 'Croatia': 'europe',
  // Norteamérica
  'México': 'north-america', 'Mexico': 'north-america',
  'Estados Unidos': 'north-america', 'United States': 'north-america',
  'Canadá': 'north-america', 'Canada': 'north-america',
  // Oceanía
  'Australia': 'oceania',
  'Nueva Zelanda': 'oceania', 'New Zealand': 'oceania',
  // Sudamérica
  'Perú': 'south-america', 'Peru': 'south-america',
  'Colombia': 'south-america',
  'Brasil': 'south-america', 'Brazil': 'south-america',
  'Argentina': 'south-america',
  'Chile': 'south-america',
  'Bolivia': 'south-america',
  'Ecuador': 'south-america',
  'Venezuela': 'south-america',
  'Uruguay': 'south-america',
  'Paraguay': 'south-america',
}

function buildDurationLabel(row, t) {
  if (row.formato === 'con_fecha') {
    const parts = []
    if (row.fecha_inicio) parts.push(row.fecha_inicio)
    if (row.fecha_fin) parts.push(`→ ${row.fecha_fin}`)
    if (row.cupos) parts.push(`${row.cupos} cupos`)
    return parts.join(' ') || t('exp_fmt_con_fecha')
  }
  if (row.duracion_min_dias) {
    const range = row.duracion_max_dias
      ? `${row.duracion_min_dias}–${row.duracion_max_dias}`
      : `${row.duracion_min_dias}+`
    return `${range} días`
  }
  return t('exp_fmt_permanente')
}

function normalize(row, t) {
  return {
    id: row.id,
    slug: row.id,
    type_key: row.tipo,
    type: t(`exp_type_${row.tipo}`),
    continent: COUNTRY_TO_CONTINENT[row.pais] ?? '',
    duration_days_min: row.duracion_min_dias ?? 0,
    image_url: null,
    title: row.titulo,
    location_country: row.pais ?? '—',
    location_city: null,
    duration_label: buildDurationLabel(row, t),
    // campos extra para ExperienceDetail
    facilitator_id: row.facilitator_id,
    facilitator_name: row.profiles?.nombre ?? null,
    tipo: row.tipo,
    modalidad: row.modalidad,
    formato: row.formato,
    fecha_inicio: row.fecha_inicio,
    fecha_fin: row.fecha_fin,
    cupos: row.cupos,
    que_incluye: row.que_incluye,
    que_se_espera: row.que_se_espera,
  }
}

export function useExperiences() {
  const { t } = useLang()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    supabase
      .from('experiences')
      .select(`
        id, titulo, tipo, pais, modalidad, formato,
        fecha_inicio, fecha_fin, cupos,
        duracion_min_dias, duracion_max_dias,
        que_incluye, que_se_espera,
        publicada, facilitator_id,
        profiles:facilitator_id ( nombre )
      `)
      .eq('publicada', true)
      .order('created_at', { ascending: false })
      .then(({ data: rows, error: err }) => {
        if (cancelled) return
        if (err) {
          setError(err)
          setLoading(false)
          return
        }
        setData((rows ?? []).map((r) => normalize(r, t)))
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [t])

  return { data, loading, error }
}
