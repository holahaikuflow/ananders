import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { CONTINENT_KEYS, DURATION_BUCKETS, TYPE_KEYS } from '../data/experiences'
import { useExperiences } from '../lib/useExperiences'
import ExperienceCard from '../components/ExperienceCard'
import FilterChip from '../components/FilterChip'
import { SearchIcon } from '../components/Section'

function EmptyState() {
  const { t } = useLang()
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg width="36" height="45" viewBox="0 0 64 80" fill="none" className="mb-5 opacity-20" aria-hidden="true">
        <path d="M32 6 C32 6 23 18 23 26 C23 31.5 27 36 32 36 C37 36 41 31.5 41 26 C41 18 32 6 32 6Z" stroke="#2D5242" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M23 36 C14 40 12 52 14 60 C16 68 23 72 32 72 C41 72 48 68 50 60 C52 52 50 40 41 36" stroke="#2D5242" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <p className="font-josefin font-light text-lg mb-2" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028' }}>
        {t('explore_empty_title')}
      </p>
      <p className="font-nunito font-light text-sm" style={{ color: '#4A7560' }}>
        {t('explore_empty_sub')}
      </p>
    </div>
  )
}

function GroupTitle({ children }) {
  return (
    <p
      className="font-nunito font-semibold mb-2.5"
      style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7BA896' }}
    >
      {children}
    </p>
  )
}

export default function Explore() {
  const { t } = useLang()
  const [params, setParams] = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: all, loading, error } = useExperiences()

  // El estado de los filtros vive en la URL para que los links del footer y del buscador funcionen.
  const query = params.get('q') || ''
  const type = params.get('type') || ''
  const continent = params.get('continent') || ''
  const duration = params.get('duration') || ''

  function update(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  const toggle = (key, current, value) => update(key, current === value ? '' : value)

  const continentNames = t('continents')
  const continentLabel = (key) => continentNames[CONTINENT_KEYS.indexOf(key)] || key
  const typeLabel = (key) => all.find((e) => e.type_key === key)?.type || key
  const durationLabel = (key) => t(DURATION_BUCKETS.find((b) => b.key === key)?.labelKey || '')

  const types = TYPE_KEYS.filter((k) => all.some((e) => e.type_key === k))
  const continents = CONTINENT_KEYS.filter((k) => all.some((e) => e.continent === k))

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const bucket = DURATION_BUCKETS.find((b) => b.key === duration)
    return all.filter((e) => {
      const matchesQ =
        !q ||
        [e.title, e.location_country, e.location_city, e.type].some((v) => v && v.toLowerCase().includes(q))
      const matchesType = !type || e.type_key === type
      const matchesContinent = !continent || e.continent === continent
      const matchesDuration = !bucket || (e.duration_days_min >= bucket.min && e.duration_days_min < bucket.max)
      return matchesQ && matchesType && matchesContinent && matchesDuration
    })
  }, [all, query, type, continent, duration])

  const activeFilters = [
    type && { key: 'type', label: typeLabel(type) },
    continent && { key: 'continent', label: continentLabel(continent) },
    duration && { key: 'duration', label: durationLabel(duration) },
  ].filter(Boolean)

  function clearAll() {
    setParams({}, { replace: true })
  }

  const clearButton = activeFilters.length > 0 && (
    <button
      onClick={clearAll}
      className="font-nunito font-semibold"
      style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#4A7560', textDecoration: 'underline', minHeight: 'auto' }}
    >
      {t('explore_clear')}
    </button>
  )

  const filterGroups = (
    <>
      <div>
        <GroupTitle>{t('explore_filter_type')}</GroupTitle>
        <div className="flex flex-wrap md:flex-col gap-1.5">
          {types.map((k) => (
            <FilterChip key={k} label={typeLabel(k)} active={type === k} onClick={() => toggle('type', type, k)} />
          ))}
        </div>
      </div>
      <div>
        <GroupTitle>{t('explore_filter_continent')}</GroupTitle>
        <div className="flex flex-wrap md:flex-col gap-1.5">
          {continents.map((k) => (
            <FilterChip key={k} label={continentLabel(k)} active={continent === k} onClick={() => toggle('continent', continent, k)} />
          ))}
        </div>
      </div>
      <div>
        <GroupTitle>{t('explore_filter_duration')}</GroupTitle>
        <div className="flex flex-wrap md:flex-col gap-1.5">
          {DURATION_BUCKETS.map((b) => (
            <FilterChip key={b.key} label={t(b.labelKey)} active={duration === b.key} onClick={() => toggle('duration', duration, b.key)} />
          ))}
        </div>
      </div>
    </>
  )

  return (
    <main style={{ background: 'var(--an-alba)', minHeight: '100vh' }}>
      <div style={{ background: '#1A3028' }} className="px-5 md:px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <p
            className="font-nunito font-semibold mb-2"
            style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8A832' }}
          >
            {t('explore_eyebrow')}
          </p>
          <h1
            className="font-josefin font-thin mb-5"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.8rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.1 }}
          >
            {t('explore_title')}
          </h1>
          <div
            className="flex items-center gap-3 max-w-xl px-4 py-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(168,196,180,0.2)' }}
          >
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(e) => update('q', e.target.value)}
              placeholder={t('explore_search_ph')}
              aria-label={t('explore_search_ph')}
              className="flex-1 min-w-0 bg-transparent font-nunito font-light text-sm outline-none placeholder:text-[rgba(168,196,180,0.6)]"
              style={{ color: '#F5F0D8' }}
            />
            {query && (
              <button onClick={() => update('q', '')} aria-label="×" style={{ color: '#93A796', fontSize: '1rem', minHeight: 'auto' }}>
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-10 py-8">
        <div className="flex gap-8">
          <aside className="hidden md:flex flex-col gap-6 flex-shrink-0" style={{ width: '190px' }}>
            <div className="flex items-center justify-between">
              <p className="font-nunito font-semibold uppercase" style={{ letterSpacing: '0.16em', color: '#1A3028', fontSize: '0.72rem' }}>
                {t('explore_filters')}
              </p>
              {clearButton}
            </div>
            {filterGroups}
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="font-nunito font-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4A7560' }}>
                {results.length} {t('explore_results')}
                {activeFilters.length > 0 && (
                  <span style={{ color: '#C8A832' }}>
                    {' '}· {activeFilters.length} {t('explore_active_filters')}
                  </span>
                )}
              </p>
              <button
                className="md:hidden font-nunito font-semibold uppercase flex items-center gap-2"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                style={{ letterSpacing: '0.16em', color: '#2D5242', fontSize: '0.72rem', minHeight: 'auto' }}
              >
                {t('explore_filters')}
                {activeFilters.length > 0 && (
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: '#C8A832', color: '#1A3028', fontSize: '0.55rem' }}
                  >
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>

            {mobileOpen && (
              <div className="md:hidden mb-5 p-4 rounded-xl flex flex-col gap-4" style={{ border: '0.5px solid rgba(45,82,66,0.15)', background: 'white' }}>
                {filterGroups}
                <div>{clearButton}</div>
              </div>
            )}

            {activeFilters.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-2 mb-4">
                {activeFilters.map((f) => (
                  <span
                    key={f.key}
                    className="flex items-center gap-2 font-nunito font-semibold px-3 py-1 rounded-full"
                    style={{
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background: 'var(--an-linen)',
                      color: '#2D5242',
                      border: '0.5px solid rgba(45,82,66,0.2)',
                    }}
                  >
                    {f.label}
                    <button onClick={() => update(f.key, '')} aria-label="×" style={{ lineHeight: 1, fontSize: '0.8rem', color: '#4A7560', minHeight: 'auto' }}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <p className="font-nunito text-sm py-8 text-center" style={{ color: '#4A7560' }}>…</p>
            ) : error ? (
              <div className="flex flex-col items-center py-12 gap-3 text-center">
                <p className="font-nunito text-sm" style={{ color: '#C84A1A' }}>{t('explore_error')}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="font-nunito font-semibold uppercase text-xs"
                  style={{ letterSpacing: '0.16em', color: '#4A7560', textDecoration: 'underline', minHeight: 'auto' }}
                >
                  {t('explore_error_retry')}
                </button>
              </div>
            ) : results.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
