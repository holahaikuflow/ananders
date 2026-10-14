import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Seo from '../components/Seo'
import { ShieldIcon } from '../components/Section'

const ORANGE = '#E8620A'
const INK = '#1A1A1A'

function Block({ title, children }) {
  return (
    <div className="mb-8">
      <p className="font-nunito font-semibold mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="mb-3">
      <p className="font-nunito font-semibold mb-0.5" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5B6A5D' }}>
        {label}
      </p>
      <p className="font-nunito font-light text-sm" style={{ color: INK }}>
        {value}
      </p>
    </div>
  )
}

// ─── Panel lateral: sin sesión ───────────────────────────────────────────────

function NoSessionPanel({ t }) {
  return (
    <div className="p-5 rounded-xl" style={{ border: `1px solid ${ORANGE}`, background: 'rgba(232,98,10,0.03)' }}>
      <p className="font-nunito font-semibold mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE }}>
        {t('apply_panel_title')}
      </p>
      <p className="font-nunito font-light text-xs mb-4" style={{ color: '#4C5A4E', lineHeight: 1.7 }}>
        {t('apply_no_session_body')}
      </p>
      <Link
        to="/join"
        className="w-full block text-center font-nunito font-semibold uppercase py-3 rounded-md mb-2"
        style={{ letterSpacing: '0.16em', background: ORANGE, color: '#ffffff', fontSize: '0.72rem' }}
      >
        {t('apply_btn_join')}
      </Link>
      <p className="font-nunito font-light text-xs text-center mb-2" style={{ color: '#6F7F70' }}>
        {t('apply_or')}
      </p>
      <Link
        to="/login"
        className="w-full block text-center font-nunito font-semibold uppercase py-3 rounded-md"
        style={{ letterSpacing: '0.16em', border: `1px solid ${ORANGE}`, color: ORANGE, fontSize: '0.72rem' }}
      >
        {t('apply_btn_login')}
      </Link>
    </div>
  )
}

// ─── Panel lateral: facilitador dueño de la experiencia ──────────────────────

function OwnExpPanel({ t }) {
  return (
    <div className="p-5 rounded-xl" style={{ border: '1px solid rgba(200,168,50,0.3)', background: 'rgba(200,168,50,0.03)' }}>
      <p className="font-nunito font-semibold mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8A832' }}>
        {t('apply_facilitator_own')}
      </p>
      <p className="font-nunito font-light text-xs" style={{ color: '#4C5A4E', lineHeight: 1.7 }}>
        {t('apply_facilitator_own_note')}
      </p>
    </div>
  )
}

// ─── Panel lateral: estado de postulación existente ─────────────────────────

const STATUS_COLORS = {
  enviada:    { bg: '#F4F1EA', color: '#5C8A72' },
  aceptada:   { bg: '#EAFAF0', color: '#1A6B3C' },
  rechazada:  { bg: '#FEF0EB', color: '#C84A1A' },
  concretada: { bg: '#EAF0FA', color: '#1A3C6B' },
}

function StatusPanel({ t, app }) {
  const colors = STATUS_COLORS[app.estado] ?? STATUS_COLORS.enviada
  return (
    <div className="p-5 rounded-xl" style={{ border: '1px solid rgba(45,82,66,0.15)', background: '#ffffff' }}>
      <p className="font-nunito font-semibold mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE }}>
        {t('apply_status_label')}
      </p>
      <span
        className="inline-block font-nunito font-semibold uppercase px-3 py-1.5 rounded-full"
        style={{ fontSize: '0.72rem', letterSpacing: '0.16em', background: colors.bg, color: colors.color }}
      >
        {t(`apply_status_${app.estado}`)}
      </span>
    </div>
  )
}

// ─── Panel lateral: formulario de postulación ────────────────────────────────

function ApplyForm({ t, expId, userId, onSuccess }) {
  const [mensaje, setMensaje] = useState('')
  const [msgError, setMsgError] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  async function handleApply() {
    if (!mensaje.trim()) { setMsgError(t('apply_error_empty')); return }
    if (mensaje.trim().length < 30) { setMsgError(t('apply_error_min')); return }
    setSending(true)
    setSendError('')
    const { error } = await supabase.from('applications').insert({
      seeker_id: userId,
      experience_id: expId,
      mensaje_inicial: mensaje.trim(),
    })
    setSending(false)
    if (error) {
      if (error.code === '23505') setSendError(t('apply_error_duplicate'))
      else setSendError(t('apply_error_generic'))
      return
    }
    onSuccess()
  }

  return (
    <div className="p-5 rounded-xl" style={{ border: `1px solid ${ORANGE}`, background: 'rgba(232,98,10,0.03)' }}>
      <p className="font-nunito font-semibold mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE }}>
        {t('apply_panel_title')}
      </p>
      <label className="block font-nunito font-semibold uppercase text-forest mb-1.5" style={{ fontSize: '0.72rem', letterSpacing: '0.16em' }}>
        {t('apply_label')}
      </label>
      <textarea
        rows={4}
        value={mensaje}
        onChange={(e) => { setMensaje(e.target.value); setMsgError('') }}
        placeholder={t('apply_placeholder')}
        className="w-full font-nunito text-sm rounded-md px-4 py-3 outline-none transition-all resize-none leading-relaxed"
        style={{
          border: msgError ? '1.5px solid #E8620A' : '1px solid rgba(45,82,66,0.2)',
          color: '#1A3028',
        }}
      />
      {msgError && <p className="font-nunito text-xs mt-1" style={{ color: ORANGE }}>{msgError}</p>}
      <p className="font-nunito text-xs mt-1.5 mb-4" style={{ color: '#6F7F70', lineHeight: 1.6 }}>{t('apply_hint')}</p>
      {sendError && (
        <p className="font-nunito text-xs mb-3 px-3 py-2 rounded-md text-center" style={{ background: 'rgba(232,98,10,0.08)', color: ORANGE }}>{sendError}</p>
      )}
      <button
        type="button"
        onClick={handleApply}
        disabled={sending}
        className="w-full font-nunito font-semibold uppercase py-3 rounded-md transition-colors disabled:opacity-60"
        style={{ letterSpacing: '0.16em', background: '#1A3028', color: '#F5F0D8', fontSize: '0.72rem', minHeight: 'auto' }}
      >
        {sending ? t('apply_sending') : t('apply_btn')}
      </button>
    </div>
  )
}

// ─── Panel lateral: postulación enviada con éxito ────────────────────────────

function SentPanel({ t }) {
  return (
    <div className="p-5 rounded-xl text-center" style={{ border: '1px solid rgba(45,82,66,0.2)', background: 'rgba(74,117,96,0.04)' }}>
      <p className="font-nunito font-semibold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#1A3028' }}>{t('apply_success_title')}</p>
      <p className="font-nunito font-light text-xs" style={{ color: '#5C8A72', lineHeight: 1.7 }}>{t('apply_success_body')}</p>
    </div>
  )
}

// ─── Panel lateral principal ─────────────────────────────────────────────────

function ApplicationPanel({ t, expId, facilitatorId, session, user, profile }) {
  const [existingApp, setExistingApp] = useState(undefined)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!user || !expId) { setExistingApp(null); return }
    let cancelled = false
    supabase
      .from('applications')
      .select('id, estado, created_at')
      .eq('seeker_id', user.id)
      .eq('experience_id', expId)
      .maybeSingle()
      .then(({ data }) => { if (!cancelled) setExistingApp(data ?? null) })
    return () => { cancelled = true }
  }, [user?.id, expId])

  function onSuccess() {
    setSent(true)
    supabase
      .from('applications')
      .select('id, estado, created_at')
      .eq('seeker_id', user.id)
      .eq('experience_id', expId)
      .maybeSingle()
      .then(({ data }) => setExistingApp(data ?? null))
  }

  // Caso 1: sin sesión
  if (!session) return <NoSessionPanel t={t} />

  // Caso 2: facilitador (no muestra botón de postulación)
  if (profile?.rol === 'facilitator') {
    if (user?.id === facilitatorId) return <OwnExpPanel t={t} />
    return null
  }

  // Cargando postulación
  if (existingApp === undefined) {
    return (
      <div className="p-5 rounded-xl" style={{ border: '1px solid rgba(45,82,66,0.1)' }}>
        <p className="font-nunito text-xs" style={{ color: '#6F7F70' }}>…</p>
      </div>
    )
  }

  // Caso 4: postulación existente
  if (existingApp) return <StatusPanel t={t} app={existingApp} />

  // Enviada en este render
  if (sent) return <SentPanel t={t} />

  // Caso 3: seeker sin postulación
  return <ApplyForm t={t} expId={expId} userId={user.id} onSuccess={onSuccess} />
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function ExperienceDetail() {
  const { slug } = useParams()
  const { t } = useLang()
  const { session, user, profile } = useAuth()
  const [copied, setCopied] = useState(false)
  const [dbExp, setDbExp] = useState(null)
  const [dbLoading, setDbLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setDbLoading(true)
    supabase
      .from('experiences')
      .select('id, titulo, tipo, pais, formato, modalidad, fecha_inicio, fecha_fin, cupos, duracion_min_dias, duracion_max_dias, que_incluye, que_se_espera, publicada, facilitator_id, profiles:facilitator_id(nombre)')
      .eq('id', slug)
      .single()
      .then(({ data }) => {
        if (!cancelled) { setDbExp(data ?? null); setDbLoading(false) }
      })
    return () => { cancelled = true }
  }, [slug])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { setCopied(false) }
  }

  if (dbLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#fafaf8' }}>
        <p className="font-nunito font-semibold uppercase text-sm" style={{ letterSpacing: '0.16em', color: '#6F7F70' }}>…</p>
      </main>
    )
  }

  if (!dbExp) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-5">
        <Seo />
        <p className="font-josefin text-lg uppercase" style={{ letterSpacing: '0.15em', color: INK }}>{t('exp_not_found')}</p>
        <Link to="/explore" className="font-nunito font-semibold uppercase text-sm" style={{ letterSpacing: '0.16em', color: ORANGE, textDecoration: 'underline' }}>
          ← {t('nav_explore')}
        </Link>
      </main>
    )
  }

  const facilitatorName = dbExp.profiles?.nombre ?? '—'
  const typeLabel = t(`exp_type_${dbExp.tipo}`)
  const fmtLabel = t(`exp_fmt_${dbExp.formato}`)
  let durationLabel = fmtLabel
  if (dbExp.formato === 'con_fecha') {
    if (dbExp.fecha_inicio) durationLabel = `${dbExp.fecha_inicio}${dbExp.fecha_fin ? ` → ${dbExp.fecha_fin}` : ''}`
    if (dbExp.cupos) durationLabel += ` · ${dbExp.cupos} cupos`
  } else {
    if (dbExp.duracion_min_dias) durationLabel += ` · ${dbExp.duracion_min_dias}${dbExp.duracion_max_dias ? `–${dbExp.duracion_max_dias}` : '+'} días`
  }

  return (
    <main style={{ background: '#fafaf8', minHeight: '100vh' }}>
      <Seo title={`${dbExp.titulo} · Ananders`} />
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(240px, 45vw, 480px)', background: INK }}>
        <div className="absolute inset-0" style={{ background: '#1A3028' }} />
        <div className="absolute top-5 left-5">
          <Link to="/explore" className="font-nunito font-semibold uppercase flex items-center gap-2" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', color: '#F4EFE1', minHeight: 'auto' }}>
            ← {t('nav_explore')}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="font-nunito font-semibold mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ORANGE }}>
              {dbExp.pais ?? '—'} · {typeLabel}
            </p>
            <h1 className="font-josefin font-light mb-8" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.06em', color: INK, lineHeight: 1.25 }}>
              {dbExp.titulo}
            </h1>

            {dbExp.que_incluye && (
              <Block title={t('exp_form_field_que_incluye')}>
                <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2A2A2A', lineHeight: 1.9 }}>{dbExp.que_incluye}</p>
              </Block>
            )}
            {dbExp.que_se_espera && (
              <Block title={t('exp_form_field_que_se_espera')}>
                <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2A2A2A', lineHeight: 1.9 }}>{dbExp.que_se_espera}</p>
              </Block>
            )}

            <div className="flex gap-3 p-5 rounded-xl mb-8" style={{ background: 'rgba(200,168,50,0.04)', border: '0.5px solid rgba(200,168,50,0.2)' }}>
              <ShieldIcon color="#C8A832" size={16} />
              <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#4A7560' }}>
                <span style={{ color: '#1A3028', fontWeight: 400 }}>{t('exp_safety_label')} </span>
                {t('exp_safety_body')}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap pt-4" style={{ borderTop: '0.5px solid rgba(45,82,66,0.1)' }}>
              <p className="font-nunito font-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4C5A4E' }}>{t('exp_share')}</p>
              <button onClick={copyLink} className="font-nunito font-semibold uppercase px-3 py-1.5 rounded-full" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', border: '0.5px solid rgba(232,98,10,0.3)', color: ORANGE, minHeight: 'auto' }}>
                {t('exp_copy_link')}{copied ? ' ✓' : ''}
              </button>
            </div>
          </div>

          <div>
            <div className="sticky top-24 flex flex-col gap-4">
              <div className="p-5 rounded-xl" style={{ border: '0.5px solid rgba(232,98,10,0.15)', background: '#ffffff' }}>
                <DetailRow label={t('exp_detail_type')} value={typeLabel} />
                <DetailRow label={t('exp_form_field_modalidad')} value={t(`exp_mod_${dbExp.modalidad}`)} />
                <DetailRow label={t('exp_detail_duration')} value={durationLabel} />
                <DetailRow label={t('prof_field_pais')} value={dbExp.pais ?? '—'} />
                <DetailRow label="Facilitador" value={facilitatorName} />
              </div>
              <ApplicationPanel
                t={t}
                expId={dbExp.id}
                facilitatorId={dbExp.facilitator_id}
                session={session}
                user={user}
                profile={profile}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
