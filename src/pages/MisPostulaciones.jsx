import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Eyebrow } from '../components/Section'

const STATUS_COLORS = {
  enviada:    { bg: '#F4F1EA', color: '#5C8A72' },
  aceptada:   { bg: '#EAFAF0', color: '#1A6B3C' },
  rechazada:  { bg: '#FEF0EB', color: '#C84A1A' },
  concretada: { bg: '#EAF0FA', color: '#1A3C6B' },
}

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function MisPostulaciones() {
  const { t } = useLang()
  const { profile, user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    supabase
      .from('applications')
      .select(`
        id, estado, created_at,
        experiences:experience_id (
          titulo, pais, tipo,
          profiles:facilitator_id ( nombre )
        )
      `)
      .eq('seeker_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) { setApplications(data ?? []); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [user?.id])

  // Facilitators don't have applications
  if (profile && profile.rol === 'facilitator') {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-jungle">
        <p className="font-josefin uppercase text-cream mb-4" style={{ fontSize: '1rem', letterSpacing: '0.1em' }}>
          {t('exp_seeker_denied_title')}
        </p>
        <Link to="/mis-experiencias" className="font-josefin uppercase px-6 py-3 rounded-md bg-gold text-jungle text-xs tracking-widest">
          {t('nav_mis_exp')}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-alba py-14 px-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <Eyebrow color="#C8A832">{t('myapps_eyebrow')}</Eyebrow>
          <h1 className="font-josefin font-thin text-jungle" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.15 }}>
            {t('myapps_title')}
          </h1>
        </div>

        {loading ? (
          <p className="font-nunito text-sm text-moss">…</p>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 gap-4">
            <p className="font-josefin uppercase text-jungle" style={{ letterSpacing: '0.1em', fontSize: '1rem' }}>
              {t('myapps_empty_title')}
            </p>
            <p className="font-nunito text-sm text-moss max-w-xs">{t('myapps_empty_body')}</p>
            <Link
              to="/explore"
              className="font-josefin uppercase mt-2 px-6 py-3 rounded-md bg-gold text-jungle text-xs tracking-widest hover:bg-dew transition-colors"
            >
              {t('nav_explore')} →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {applications.map((app) => {
              const exp = app.experiences
              const facilitatorName = exp?.profiles?.nombre ?? '—'
              const colors = STATUS_COLORS[app.estado] ?? STATUS_COLORS.enviada
              return (
                <div key={app.id} className="bg-white rounded-xl border border-linen p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-josefin uppercase text-jungle font-normal truncate" style={{ letterSpacing: '0.08em', fontSize: '0.9rem' }}>
                        {exp?.titulo ?? '—'}
                      </p>
                      <p className="font-nunito text-xs text-moss mt-0.5">
                        {exp?.pais ?? '—'} · {exp?.tipo ? t(`exp_type_${exp.tipo}`) : '—'}
                      </p>
                    </div>
                    <span
                      className="flex-shrink-0 font-josefin uppercase px-2.5 py-1 rounded-full"
                      style={{ letterSpacing: '0.15em', fontSize: '0.6rem', background: colors.bg, color: colors.color }}
                    >
                      {t(`apply_status_${app.estado}`)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-1 border-t border-linen">
                    <p className="font-nunito text-xs text-moss">
                      <span className="font-josefin uppercase" style={{ fontSize: '0.55rem', letterSpacing: '0.2em' }}>{t('myapps_col_facilitator')}: </span>
                      {facilitatorName}
                    </p>
                    <p className="font-nunito text-xs text-moss ml-auto">
                      {formatDate(app.created_at)}
                    </p>
                  </div>
                  <div className="pt-1 border-t border-linen">
                    <Link
                      to={`/postulacion/${app.id}`}
                      className="font-josefin uppercase text-xs transition-colors"
                      style={{ letterSpacing: '0.2em', color: '#E8620A' }}
                    >
                      {t('chat_open')}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
