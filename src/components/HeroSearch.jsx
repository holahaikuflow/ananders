import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { CONTINENT_KEYS } from '../data/experiences'

// Los 6 rangos de duración del buscador se llevan a los 3 buckets de Explorar.
const DURATION_TO_BUCKET = ['short', 'short', 'medium', 'long', 'long', 'long']

export default function HeroSearch() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [experience, setExperience] = useState('')
  const [place, setPlace] = useState('')
  const [duration, setDuration] = useState('')

  const fields = [
    { label: t('search_label_experience'), value: experience, setter: setExperience, ph: t('search_ph_experience'), options: t('exp_types') },
    { label: t('search_label_place'), value: place, setter: setPlace, ph: t('search_ph_place'), options: t('continents') },
    { label: t('search_label_duration'), value: duration, setter: setDuration, ph: t('search_ph_duration'), options: t('durations') },
  ]

  function search() {
    const params = new URLSearchParams()
    if (experience) params.set('q', experience)
    if (place !== '') params.set('continent', CONTINENT_KEYS[Number(place)])
    if (duration !== '') params.set('duration', DURATION_TO_BUCKET[Number(duration)])
    const qs = params.toString()
    navigate(qs ? `/explore?${qs}` : '/explore')
  }

  return (
    <div
      className="w-full max-w-2xl rounded-xl overflow-hidden text-left"
      style={{ background: 'white', border: '1px solid rgba(200,168,50,0.35)', boxShadow: '0 4px 24px rgba(13,22,16,0.25)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3">
        {fields.map((f, i) => (
          <label key={f.label} className="block px-4 py-3" style={{ borderBottom: i < 2 ? '0.5px solid rgba(200,168,50,0.1)' : 'none' }}>
            <span
              className="block font-josefin mb-1.5"
              style={{ fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#C8A832', fontWeight: 400 }}
            >
              {f.label}
            </span>
            <select
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
              className="w-full font-nunito font-light text-sm"
              style={{ color: f.value !== '' ? '#1A3028' : '#5C8A72' }}
            >
              <option value="">{f.ph}</option>
              {f.options.map((opt, idx) => (
                // Experiencia se busca por texto; lugar y duración por posición en la lista.
                <option key={opt} value={f.setter === setExperience ? opt : String(idx)}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div
        className="px-3 py-2.5 flex items-center justify-between gap-2 flex-wrap"
        style={{ background: 'var(--an-alba)', borderTop: '0.5px solid rgba(200,168,50,0.15)' }}
      >
        <div className="flex gap-1.5 flex-wrap">
          {t('quick_tags').slice(0, 4).map((tag) => {
            const active = experience === tag
            return (
              <button
                key={tag}
                onClick={() => setExperience((v) => (v === tag ? '' : tag))}
                aria-pressed={active}
                className="font-josefin px-2.5 py-1 rounded-full transition-all"
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  minHeight: 'auto',
                  border: '0.5px solid rgba(92,138,114,0.4)',
                  color: active ? '#2D5242' : '#4A7560',
                  background: active ? 'var(--an-linen)' : 'transparent',
                  fontWeight: active ? 400 : 300,
                }}
              >
                {tag}
              </button>
            )
          })}
        </div>
        <button
          onClick={search}
          className="font-josefin uppercase px-4 py-2 rounded-md flex-shrink-0"
          style={{ letterSpacing: '0.25em', background: 'var(--an-jungle)', color: 'var(--an-dew)', minHeight: 'auto', fontSize: '0.65rem', fontWeight: 400 }}
        >
          {t('search_btn')}
        </button>
      </div>
    </div>
  )
}
