import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Eyebrow } from '../components/Section'

const EXP_TYPES = ['ayahuasca', 'vipassana', 'yoga', 'sufismo', 'psilocibina', 'otro']
const MODALITIES = ['voluntariado', 'pago', 'ambas']
const FORMATS = ['con_fecha', 'permanente']

const INPUT = 'w-full font-nunito rounded-md px-4 py-3 text-sm outline-none transition-all border text-jungle placeholder-moss/60 focus:border-gold focus:ring-1 focus:ring-gold bg-white'
const LABEL = 'block font-nunito font-semibold uppercase text-xs text-forest mb-1.5'
const TEXTAREA = INPUT + ' resize-none leading-relaxed'

const STATUS_COLORS = {
  enviada:    { bg: '#F4F1EA', color: '#5C8A72' },
  aceptada:   { bg: '#EAFAF0', color: '#1A6B3C' },
  rechazada:  { bg: '#FEF0EB', color: '#C84A1A' },
  concretada: { bg: '#EAF0FA', color: '#1A3C6B' },
}

const EMPTY_FORM = {
  titulo: '', tipo: '', pais: '', modalidad: '', formato: '',
  fecha_inicio: '', fecha_fin: '', cupos: '',
  duracion_min_dias: '', duracion_max_dias: '', disponibilidad: '',
  que_incluye: '', que_se_espera: '',
}

function expToForm(exp) {
  return {
    titulo: exp.titulo ?? '',
    tipo: exp.tipo ?? '',
    pais: exp.pais ?? '',
    modalidad: exp.modalidad ?? '',
    formato: exp.formato ?? '',
    fecha_inicio: exp.fecha_inicio ?? '',
    fecha_fin: exp.fecha_fin ?? '',
    cupos: exp.cupos != null ? String(exp.cupos) : '',
    duracion_min_dias: exp.duracion_min_dias != null ? String(exp.duracion_min_dias) : '',
    duracion_max_dias: exp.duracion_max_dias != null ? String(exp.duracion_max_dias) : '',
    disponibilidad: exp.disponibilidad ?? '',
    que_incluye: exp.que_incluye ?? '',
    que_se_espera: exp.que_se_espera ?? '',
  }
}

// ─── Subcomponente: card de experiencia ─────────────────────────────────────

function ExpCard({ exp, t, appCount, onEdit, onTogglePublish, onViewApps, toggling }) {
  const isPublished = exp.publicada
  return (
    <div className="bg-white rounded-xl border border-linen p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-josefin uppercase text-jungle font-normal truncate" style={{ letterSpacing: '0.08em', fontSize: '0.9rem' }}>
            {exp.titulo}
          </p>
          <p className="font-nunito text-xs text-moss mt-0.5">
            {t(`exp_type_${exp.tipo}`)} · {exp.pais ?? '—'} · {t(`exp_fmt_${exp.formato}`)}
          </p>
        </div>
        <span
          className="flex-shrink-0 font-nunito font-semibold uppercase text-xs px-2.5 py-1 rounded-full"
          style={{ letterSpacing: '0.15em', fontSize: '0.72rem', background: isPublished ? '#1A3028' : '#F4F1EA', color: isPublished ? '#F5F0D8' : '#5C8A72' }}
        >
          {t(isPublished ? 'exp_list_published_label' : 'exp_list_draft_label')}
        </span>
      </div>

      <p className="font-nunito text-xs" style={{ color: isPublished ? '#4A7560' : '#9FB8A8' }}>
        {t(isPublished ? 'exp_list_published_note' : 'exp_list_draft_note')}
      </p>

      <div className="flex items-center gap-3 pt-1 border-t border-linen flex-wrap">
        <button
          type="button"
          onClick={() => onEdit(exp)}
          className="font-nunito font-semibold uppercase text-xs transition-colors text-forest hover:text-jungle"
          style={{ letterSpacing: '0.2em', minHeight: 'auto' }}
        >
          {t('exp_list_edit')}
        </button>
        <span className="text-linen">·</span>
        <button
          type="button"
          onClick={() => onTogglePublish(exp)}
          disabled={toggling === exp.id}
          className="font-nunito font-semibold uppercase text-xs transition-colors disabled:opacity-50"
          style={{ letterSpacing: '0.16em', minHeight: 'auto', color: isPublished ? '#E8620A' : '#1A3028' }}
        >
          {toggling === exp.id ? '…' : t(isPublished ? 'exp_list_unpublish' : 'exp_list_publish')}
        </button>
        <span className="text-linen">·</span>
        <button
          type="button"
          onClick={() => onViewApps(exp)}
          className="font-nunito font-semibold uppercase text-xs transition-colors"
          style={{
            letterSpacing: '0.16em',
            minHeight: 'auto',
            color: appCount > 0 ? '#C8A832' : '#9FB8A8',
          }}
        >
          {appCount > 0
            ? t('exp_apps_count_label').replace('{{n}}', appCount)
            : t('exp_apps_none')}
        </button>
      </div>
    </div>
  )
}

// ─── Subcomponente: lista de postulaciones ───────────────────────────────────

function ApplicationsView({ t, exp, applications, appsLoading, updatingApp, onUpdateStatus, onBack }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="font-nunito font-semibold uppercase text-xs text-moss hover:text-jungle transition-colors mb-4"
          style={{ letterSpacing: '0.16em', minHeight: 'auto' }}
        >
          {t('exp_apps_back')}
        </button>
        <p className="font-josefin uppercase text-sm text-forest mb-1" style={{ letterSpacing: '0.1em' }}>
          {exp.titulo}
        </p>
        <p className="font-josefin uppercase text-jungle font-thin" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', letterSpacing: '0.1em' }}>
          {t('exp_apps_title')}
        </p>
      </div>

      {appsLoading ? (
        <p className="font-nunito text-sm text-moss">…</p>
      ) : applications.length === 0 ? (
        <div className="py-10 text-center">
          <p className="font-josefin uppercase text-sm text-moss" style={{ letterSpacing: '0.1em' }}>
            {t('exp_apps_no_apps')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => {
            const colors = STATUS_COLORS[app.estado] ?? STATUS_COLORS.enviada
            const seekerName = app.profiles?.nombre ?? '—'
            const isTerminal = app.estado === 'rechazada' || app.estado === 'concretada'
            return (
              <div key={app.id} className="bg-white rounded-xl border border-linen p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-josefin uppercase text-jungle text-sm" style={{ letterSpacing: '0.08em' }}>
                    {seekerName}
                  </p>
                  <span
                    className="flex-shrink-0 font-nunito font-semibold uppercase px-2.5 py-1 rounded-full"
                    style={{ letterSpacing: '0.15em', fontSize: '0.72rem', background: colors.bg, color: colors.color }}
                  >
                    {t(`apply_status_${app.estado}`)}
                  </span>
                </div>

                <div>
                  <p className="font-nunito font-semibold uppercase text-moss mb-1" style={{ letterSpacing: '0.16em', fontSize: '0.72rem' }}>
                    {t('exp_apps_message')}
                  </p>
                  <p className="font-nunito text-sm text-jungle/80 leading-relaxed whitespace-pre-wrap">
                    {app.mensaje_inicial ?? '—'}
                  </p>
                </div>

                {!isTerminal && (
                  <div className="flex gap-3 pt-2 border-t border-linen">
                    {app.estado !== 'aceptada' && (
                      <button
                        type="button"
                        disabled={updatingApp === app.id}
                        onClick={() => onUpdateStatus(app.id, 'aceptada')}
                        className="font-nunito font-semibold uppercase text-xs transition-colors disabled:opacity-50"
                        style={{ letterSpacing: '0.16em', minHeight: 'auto', color: '#1A6B3C' }}
                      >
                        {updatingApp === app.id ? t('exp_apps_updating') : t('exp_apps_accept')}
                      </button>
                    )}
                    {app.estado !== 'aceptada' && <span className="text-linen">·</span>}
                    <button
                      type="button"
                      disabled={updatingApp === app.id}
                      onClick={() => onUpdateStatus(app.id, 'rechazada')}
                      className="font-nunito font-semibold uppercase text-xs transition-colors disabled:opacity-50"
                      style={{ letterSpacing: '0.16em', minHeight: 'auto', color: '#C84A1A' }}
                    >
                      {updatingApp === app.id ? t('exp_apps_updating') : t('exp_apps_reject')}
                    </button>
                  </div>
                )}
                <div className="pt-2 border-t border-linen">
                  <Link
                    to={`/postulacion/${app.id}`}
                    className="font-nunito font-semibold uppercase text-xs transition-colors"
                    style={{ letterSpacing: '0.16em', color: '#E8620A' }}
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
  )
}

// ─── Subcomponente: formulario ───────────────────────────────────────────────

function ExpForm({ t, initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const isEditing = !!initial
  const isFecha = form.formato === 'con_fecha'

  function set(field) {
    return (e) => {
      setForm((p) => ({ ...p, [field]: e.target.value }))
      setErrors((p) => ({ ...p, [field]: '' }))
      setSaveError('')
      setSaved(false)
    }
  }

  function validate() {
    const e = {}
    if (!form.titulo.trim()) e.titulo = t('exp_form_error_required')
    if (!form.tipo) e.tipo = t('exp_form_error_required')
    if (!form.pais.trim()) e.pais = t('exp_form_error_required')
    if (!form.modalidad) e.modalidad = t('exp_form_error_required')
    if (!form.formato) e.formato = t('exp_form_error_required')
    if (isFecha) {
      if (form.fecha_inicio && form.fecha_fin && form.fecha_fin < form.fecha_inicio)
        e.fecha_fin = t('exp_form_error_dates')
      const c = parseInt(form.cupos, 10)
      if (form.cupos !== '' && (isNaN(c) || c <= 0))
        e.cupos = t('exp_form_error_cupos')
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setSaveError('')
    const payload = {
      titulo: form.titulo.trim(),
      tipo: form.tipo,
      pais: form.pais.trim() || null,
      modalidad: form.modalidad,
      formato: form.formato,
      fecha_inicio: isFecha && form.fecha_inicio ? form.fecha_inicio : null,
      fecha_fin: isFecha && form.fecha_fin ? form.fecha_fin : null,
      cupos: isFecha && form.cupos ? parseInt(form.cupos, 10) : null,
      duracion_min_dias: !isFecha && form.duracion_min_dias ? parseInt(form.duracion_min_dias, 10) : null,
      duracion_max_dias: !isFecha && form.duracion_max_dias ? parseInt(form.duracion_max_dias, 10) : null,
      disponibilidad: !isFecha && form.disponibilidad.trim() ? form.disponibilidad.trim() : null,
      que_incluye: form.que_incluye.trim() || null,
      que_se_espera: form.que_se_espera.trim() || null,
    }
    const err = await onSave(payload)
    setSaving(false)
    if (err) { setSaveError(t('exp_form_error')); return }
    setSaved(true)
    setTimeout(() => { setSaved(false); onCancel() }, 1200)
  }

  const fieldCls = (f) => INPUT + (errors[f] ? ' border-orange' : ' border-linen')

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <p className="font-josefin uppercase text-sm tracking-widest text-forest">
        {t(isEditing ? 'exp_form_title_edit' : 'exp_form_title_create')}
      </p>

      <div>
        <label className={LABEL}>{t('exp_form_field_titulo')} *</label>
        <input type="text" value={form.titulo} onChange={set('titulo')} placeholder={t('exp_form_ph_titulo')} className={fieldCls('titulo')} />
        {errors.titulo && <p className="font-nunito text-xs text-orange mt-1">{errors.titulo}</p>}
      </div>

      <div>
        <label className={LABEL}>{t('exp_form_field_tipo')} *</label>
        <select value={form.tipo} onChange={set('tipo')} className={fieldCls('tipo')}>
          <option value="">—</option>
          {EXP_TYPES.map((v) => <option key={v} value={v}>{t(`exp_type_${v}`)}</option>)}
        </select>
        {errors.tipo && <p className="font-nunito text-xs text-orange mt-1">{errors.tipo}</p>}
      </div>

      <div>
        <label className={LABEL}>{t('exp_form_field_pais')} *</label>
        <input type="text" value={form.pais} onChange={set('pais')} placeholder={t('exp_form_ph_pais')} className={fieldCls('pais')} />
        {errors.pais && <p className="font-nunito text-xs text-orange mt-1">{errors.pais}</p>}
      </div>

      <div>
        <label className={LABEL}>{t('exp_form_field_modalidad')} *</label>
        <select value={form.modalidad} onChange={set('modalidad')} className={fieldCls('modalidad')}>
          <option value="">—</option>
          {MODALITIES.map((v) => <option key={v} value={v}>{t(`exp_mod_${v}`)}</option>)}
        </select>
        {errors.modalidad && <p className="font-nunito text-xs text-orange mt-1">{errors.modalidad}</p>}
      </div>

      <div>
        <label className={LABEL}>{t('exp_form_field_formato')} *</label>
        <div className="grid grid-cols-2 gap-3">
          {FORMATS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => { setForm((p) => ({ ...p, formato: v })); setErrors((p) => ({ ...p, formato: '' })) }}
              className="font-nunito font-semibold uppercase py-3 rounded-md text-xs transition-all"
              style={{ letterSpacing: '0.15em', background: form.formato === v ? '#1A3028' : 'transparent', color: form.formato === v ? '#F5F0D8' : '#2D5242', border: form.formato === v ? '1.5px solid #1A3028' : '1.5px solid #C8D8C0' }}
            >
              {t(`exp_fmt_${v}`)}
            </button>
          ))}
        </div>
        {errors.formato && <p className="font-nunito text-xs text-orange mt-1">{errors.formato}</p>}
      </div>

      {isFecha && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>{t('exp_form_field_fecha_inicio')}</label>
              <input type="date" value={form.fecha_inicio} onChange={set('fecha_inicio')} className={fieldCls('fecha_inicio')} />
            </div>
            <div>
              <label className={LABEL}>{t('exp_form_field_fecha_fin')}</label>
              <input type="date" value={form.fecha_fin} onChange={set('fecha_fin')} className={fieldCls('fecha_fin')} />
              {errors.fecha_fin && <p className="font-nunito text-xs text-orange mt-1">{errors.fecha_fin}</p>}
            </div>
          </div>
          <div>
            <label className={LABEL}>{t('exp_form_field_cupos')}</label>
            <input type="number" min="1" value={form.cupos} onChange={set('cupos')} className={fieldCls('cupos')} />
            {errors.cupos && <p className="font-nunito text-xs text-orange mt-1">{errors.cupos}</p>}
          </div>
        </>
      )}

      {!isFecha && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>{t('exp_form_field_duracion_min')}</label>
              <input type="number" min="1" value={form.duracion_min_dias} onChange={set('duracion_min_dias')} className={fieldCls('duracion_min_dias')} />
            </div>
            <div>
              <label className={LABEL}>{t('exp_form_field_duracion_max')}</label>
              <input type="number" min="1" value={form.duracion_max_dias} onChange={set('duracion_max_dias')} className={fieldCls('duracion_max_dias')} />
            </div>
          </div>
          <div>
            <label className={LABEL}>{t('exp_form_field_disponibilidad')}</label>
            <input type="text" value={form.disponibilidad} onChange={set('disponibilidad')} placeholder={t('exp_form_ph_disponibilidad')} className={INPUT} />
          </div>
        </>
      )}

      <div>
        <label className={LABEL}>{t('exp_form_field_que_incluye')}</label>
        <textarea rows={3} value={form.que_incluye} onChange={set('que_incluye')} placeholder={t('exp_form_ph_que_incluye')} className={TEXTAREA} />
      </div>

      <div>
        <label className={LABEL}>{t('exp_form_field_que_se_espera')}</label>
        <textarea rows={3} value={form.que_se_espera} onChange={set('que_se_espera')} placeholder={t('exp_form_ph_que_se_espera')} className={TEXTAREA} />
      </div>

      {saveError && <p className="font-nunito text-sm text-orange text-center py-2 px-4 rounded-md bg-orange/10">{saveError}</p>}
      {saved && <p className="font-nunito text-sm text-forest text-center py-2 px-4 rounded-md bg-moss/10">{t('exp_form_saved')}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 font-nunito font-semibold uppercase py-3.5 rounded-md border border-linen text-forest hover:border-moss transition-colors" style={{ letterSpacing: '0.16em', fontSize: '0.72rem', minHeight: 'auto' }}>
          {t('exp_form_cancel')}
        </button>
        <button type="submit" disabled={saving} className="flex-1 font-nunito font-semibold uppercase py-3.5 rounded-md text-cream bg-jungle hover:bg-forest transition-colors disabled:opacity-60" style={{ letterSpacing: '0.16em', fontSize: '0.72rem', minHeight: 'auto' }}>
          {saving ? t('exp_form_saving') : t('exp_form_save')}
        </button>
      </div>
    </form>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function MisExperiencias() {
  const { t } = useLang()
  const { profile, user } = useAuth()

  const [experiences, setExperiences] = useState([])
  const [appCounts, setAppCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list')        // 'list' | 'form' | 'applications'
  const [editing, setEditing] = useState(null)
  const [toggling, setToggling] = useState(null)

  const [viewingExp, setViewingExp] = useState(null)
  const [applications, setApplications] = useState([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [updatingApp, setUpdatingApp] = useState(null)

  async function loadExperiences() {
    if (!user) return
    const { data } = await supabase
      .from('experiences')
      .select('id, titulo, tipo, pais, formato, publicada, modalidad')
      .eq('facilitator_id', user.id)
      .order('created_at', { ascending: false })
    const exps = data ?? []
    setExperiences(exps)
    setLoading(false)

    if (exps.length > 0) {
      const { data: apps } = await supabase
        .from('applications')
        .select('experience_id')
        .in('experience_id', exps.map((e) => e.id))
      const counts = {}
      for (const a of (apps ?? [])) {
        counts[a.experience_id] = (counts[a.experience_id] ?? 0) + 1
      }
      setAppCounts(counts)
    }
  }

  async function loadApplications(expId) {
    setAppsLoading(true)
    const { data } = await supabase
      .from('applications')
      .select('id, estado, mensaje_inicial, created_at, profiles:seeker_id(nombre)')
      .eq('experience_id', expId)
      .order('created_at', { ascending: false })
    setApplications(data ?? [])
    setAppsLoading(false)
  }

  useEffect(() => { loadExperiences() }, [user?.id])

  if (profile && profile.rol !== 'facilitator') {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-jungle">
        <h2 className="font-josefin font-thin text-cream mb-4" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {t('exp_seeker_denied_title')}
        </h2>
        <p className="font-nunito text-cream/70 max-w-sm mb-8">{t('exp_seeker_denied_body')}</p>
        <Link to="/explore" className="font-nunito font-semibold uppercase px-7 py-3.5 rounded-md bg-cta text-white text-xs" style={{ letterSpacing: '0.16em' }}>
          {t('nav_explore')}
        </Link>
      </main>
    )
  }

  async function handleSave(payload) {
    if (editing) {
      const { error } = await supabase.from('experiences').update(payload).eq('id', editing.id)
      if (error) return error
    } else {
      const { error } = await supabase.from('experiences').insert({ ...payload, facilitator_id: user.id })
      if (error) return error
    }
    await loadExperiences()
    return null
  }

  async function handleTogglePublish(exp) {
    setToggling(exp.id)
    await supabase.from('experiences').update({ publicada: !exp.publicada }).eq('id', exp.id)
    await loadExperiences()
    setToggling(null)
  }

  async function handleUpdateStatus(appId, newEstado) {
    setUpdatingApp(appId)
    await supabase.from('applications').update({ estado: newEstado }).eq('id', appId)
    await loadApplications(viewingExp.id)
    setUpdatingApp(null)
  }

  function startEdit(exp) { setEditing(exp); setView('form') }
  function startCreate() { setEditing(null); setView('form') }
  function cancelForm() { setEditing(null); setView('list') }

  function openApps(exp) {
    setViewingExp(exp)
    setView('applications')
    loadApplications(exp.id)
  }

  function backToList() {
    setViewingExp(null)
    setApplications([])
    setView('list')
  }

  return (
    <main className="min-h-screen bg-alba py-14 px-6">
      <div className="max-w-xl mx-auto">

        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <Eyebrow color="#C8A832">{t('exp_list_eyebrow')}</Eyebrow>
            <h1 className="font-josefin font-thin text-jungle" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.15 }}>
              {t('exp_list_title')}
            </h1>
          </div>
          {view === 'list' && (
            <button
              type="button"
              onClick={startCreate}
              className="flex-shrink-0 font-nunito font-semibold uppercase px-5 py-3 rounded-md text-cream bg-jungle hover:bg-forest transition-colors mt-1"
              style={{ letterSpacing: '0.16em', fontSize: '0.72rem', minHeight: 'auto' }}
            >
              {t('exp_list_create')}
            </button>
          )}
        </div>

        {view === 'form' ? (
          <ExpForm t={t} initial={editing ? expToForm(editing) : null} onSave={handleSave} onCancel={cancelForm} />
        ) : view === 'applications' ? (
          <ApplicationsView
            t={t}
            exp={viewingExp}
            applications={applications}
            appsLoading={appsLoading}
            updatingApp={updatingApp}
            onUpdateStatus={handleUpdateStatus}
            onBack={backToList}
          />
        ) : loading ? (
          <p className="font-nunito text-sm text-moss">…</p>
        ) : experiences.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 gap-4">
            <p className="font-josefin uppercase text-jungle" style={{ letterSpacing: '0.1em', fontSize: '1rem' }}>{t('exp_list_empty_title')}</p>
            <p className="font-nunito text-sm text-moss max-w-xs">{t('exp_list_empty_body')}</p>
            <button type="button" onClick={startCreate} className="font-nunito font-semibold uppercase mt-2 px-6 py-3 rounded-md bg-cta text-white text-xs hover:bg-cta/90 transition-colors" style={{ letterSpacing: '0.16em', minHeight: 'auto' }}>
              {t('exp_list_create')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => (
              <ExpCard
                key={exp.id}
                exp={exp}
                t={t}
                appCount={appCounts[exp.id] ?? 0}
                onEdit={startEdit}
                onTogglePublish={handleTogglePublish}
                onViewApps={openApps}
                toggling={toggling}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
