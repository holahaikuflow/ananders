import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Eyebrow } from '../components/Section'

const EXP_TYPES = ['ayahuasca', 'vipassana', 'yoga', 'sufismo', 'psilocibina', 'otro']
const MAX_SIZE = 2 * 1024 * 1024

const INPUT_CLASS = 'w-full font-nunito rounded-md px-4 py-3 text-sm outline-none transition-all border text-jungle placeholder-moss/60 focus:border-gold focus:ring-1 focus:ring-gold bg-white'
const LABEL_CLASS = 'block font-josefin uppercase text-xs tracking-widest text-forest mb-1.5'
const TEXTAREA_CLASS = INPUT_CLASS + ' resize-none leading-relaxed'
const SECTION_TITLE = 'font-josefin uppercase text-sm tracking-widest text-forest mb-5 pt-6 border-t border-linen'

function getInitials(nombre) {
  const parts = (nombre || '?').trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

function extractStoragePath(url) {
  if (!url) return null
  const marker = '/object/public/avatars/'
  const idx = url.indexOf(marker)
  return idx === -1 ? null : url.slice(idx + marker.length)
}

export default function Perfil() {
  const { t } = useLang()
  const { profile, user, refreshProfile } = useAuth()
  const fileInputRef = useRef(null)

  const [base, setBase] = useState({ nombre: '', pais: '', idiomas: '', foto: '' })
  const [roleData, setRoleData] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)

  const [pendingFile, setPendingFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [fotoError, setFotoError] = useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!profile) return
    setBase({
      nombre: profile.nombre ?? '',
      pais: profile.pais ?? '',
      idiomas: (profile.idiomas ?? []).join(', '),
      foto: profile.foto ?? '',
    })
  }, [profile])

  useEffect(() => {
    if (!user || !profile) return
    const table = profile.rol === 'facilitator' ? 'facilitators' : 'seekers'
    setRoleLoading(true)
    supabase
      .from(table)
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (profile.rol === 'facilitator') {
          setRoleData({
            nombre_centro: data?.nombre_centro ?? '',
            ubicacion: data?.ubicacion ?? '',
            tradicion: data?.tradicion ?? '',
            historia: data?.historia ?? '',
          })
        } else {
          setRoleData({
            sobre_mi: data?.sobre_mi ?? '',
            que_busco: data?.que_busco ?? [],
            que_ofrezco: data?.que_ofrezco ?? '',
          })
        }
        setRoleLoading(false)
      })
  }, [user?.id, profile?.rol])

  // Limpia el object URL al desmontar o cuando cambia
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoError('')
    if (!file.type.startsWith('image/')) {
      setFotoError(t('prof_foto_error_type'))
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE) {
      setFotoError(t('prof_foto_error_size'))
      e.target.value = ''
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setSaved(false)
    setSaveError('')
  }

  async function uploadAvatar() {
    if (!pendingFile) return base.foto

    const ext = pendingFile.name.split('.').pop().toLowerCase() || 'jpg'
    const path = `${user.id}/${Date.now()}.${ext}`

    setUploading(true)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, pendingFile, { upsert: false })
    setUploading(false)

    if (uploadError) {
      setFotoError(t('prof_foto_error_upload'))
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    // Borrar el avatar anterior para no acumular basura
    const oldPath = extractStoragePath(base.foto)
    if (oldPath) {
      await supabase.storage.from('avatars').remove([oldPath])
    }

    return publicUrl
  }

  function setRoleField(field, value) {
    setRoleData((prev) => ({ ...prev, [field]: value }))
    setSaveError('')
    setSaved(false)
  }

  function toggleQueBusco(type) {
    setRoleData((prev) => {
      const current = prev.que_busco ?? []
      return {
        ...prev,
        que_busco: current.includes(type)
          ? current.filter((x) => x !== type)
          : [...current, type],
      }
    })
    setSaveError('')
    setSaved(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (fotoError) return

    setSaving(true)
    setSaveError('')
    setSaved(false)

    const fotoUrl = await uploadAvatar()
    if (pendingFile && fotoUrl === null) {
      setSaving(false)
      return
    }

    const idiomasArr = base.idiomas
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const table = profile.rol === 'facilitator' ? 'facilitators' : 'seekers'

    const [r1, r2] = await Promise.all([
      supabase
        .from('profiles')
        .update({
          nombre: base.nombre.trim() || profile.nombre,
          foto: fotoUrl || null,
          pais: base.pais.trim() || null,
          idiomas: idiomasArr,
        })
        .eq('id', user.id),
      supabase.from(table).update(roleData).eq('id', user.id),
    ])

    setSaving(false)

    if (r1.error || r2.error) {
      setSaveError(t('prof_error'))
      return
    }

    setPendingFile(null)
    setPreviewUrl(null)
    await refreshProfile()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!profile || roleLoading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-alba">
        <span className="font-josefin uppercase text-xs tracking-widest text-moss">…</span>
      </main>
    )
  }

  const isSeeker = profile.rol === 'seeker'
  const displayPhoto = previewUrl || base.foto

  return (
    <main className="min-h-screen bg-alba py-14 px-6">
      <div className="max-w-xl mx-auto">

        <div className="mb-10">
          <Eyebrow color="#C8A832">{t('prof_eyebrow')}</Eyebrow>
          <h1
            className="font-josefin font-thin text-jungle"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.15 }}
          >
            {t('prof_title')}
          </h1>
        </div>

        <form onSubmit={handleSave} noValidate className="flex flex-col gap-5">

          {/* Sección base */}
          <p className={SECTION_TITLE} style={{ borderTopWidth: 0, paddingTop: 0 }}>
            {t('prof_section_base')}
          </p>

          {/* Avatar */}
          <div>
            <label className={LABEL_CLASS}>{t('prof_field_foto')}</label>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="relative flex-shrink-0 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                style={{ width: 80, height: 80 }}
                aria-label={t(displayPhoto ? 'prof_foto_change' : 'prof_foto_upload')}
              >
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center bg-jungle">
                    <span
                      className="font-josefin text-cream"
                      style={{ fontSize: '1.25rem', letterSpacing: '0.1em' }}
                    >
                      {getInitials(base.nombre || profile.nombre)}
                    </span>
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-jungle/60 opacity-0 hover:opacity-100 transition-opacity">
                  <span className="font-josefin uppercase text-cream text-xs tracking-widest text-center px-1" style={{ fontSize: '0.55rem' }}>
                    {uploading ? t('prof_foto_uploading') : t(displayPhoto ? 'prof_foto_change' : 'prof_foto_upload')}
                  </span>
                </span>
              </button>

              <div className="flex flex-col gap-1">
                <p className="font-nunito text-sm text-jungle">
                  {displayPhoto
                    ? (pendingFile ? pendingFile.name : t('prof_foto_change'))
                    : t('prof_foto_upload')}
                </p>
                <p className="font-nunito text-xs text-moss">{t('dash_profile_hint_photo')}</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {fotoError && (
              <p className="font-nunito text-xs text-orange mt-2">{fotoError}</p>
            )}
          </div>

          <div>
            <label className={LABEL_CLASS}>{t('prof_field_nombre')}</label>
            <input
              type="text"
              value={base.nombre}
              onChange={(e) => { setBase((p) => ({ ...p, nombre: e.target.value })); setSaveError(''); setSaved(false) }}
              placeholder={t('prof_ph_nombre')}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{t('prof_field_pais')}</label>
            <input
              type="text"
              value={base.pais}
              onChange={(e) => { setBase((p) => ({ ...p, pais: e.target.value })); setSaveError(''); setSaved(false) }}
              placeholder={t('prof_ph_pais')}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>{t('prof_field_idiomas')}</label>
            <input
              type="text"
              value={base.idiomas}
              onChange={(e) => { setBase((p) => ({ ...p, idiomas: e.target.value })); setSaveError(''); setSaved(false) }}
              placeholder={t('prof_ph_idiomas')}
              className={INPUT_CLASS}
            />
            <p className="font-nunito text-xs text-moss mt-1.5">{t('prof_hint_idiomas')}</p>
          </div>

          <div>
            <label className={LABEL_CLASS}>{t('prof_field_rol')}</label>
            <p
              className="font-josefin uppercase px-4 py-3 rounded-md text-sm border border-linen bg-linen text-forest"
              style={{ letterSpacing: '0.15em' }}
            >
              {t(isSeeker ? 'join_role_seeker' : 'join_role_facilitator')}
            </p>
          </div>

          {/* Sección del rol */}
          {isSeeker ? (
            <>
              <p className={SECTION_TITLE}>{t('prof_seeker_title')}</p>

              <div>
                <label className={LABEL_CLASS}>{t('prof_field_sobre_mi')}</label>
                <textarea
                  rows={4}
                  value={roleData.sobre_mi}
                  onChange={(e) => setRoleField('sobre_mi', e.target.value)}
                  placeholder={t('prof_ph_sobre_mi')}
                  className={TEXTAREA_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>{t('prof_field_que_busco')}</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {EXP_TYPES.map((type) => {
                    const checked = (roleData.que_busco ?? []).includes(type)
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleQueBusco(type)}
                        className="font-josefin uppercase py-2.5 px-3 rounded-md text-xs text-left transition-all"
                        style={{
                          letterSpacing: '0.15em',
                          background: checked ? '#1A3028' : 'transparent',
                          color: checked ? '#F5F0D8' : '#2D5242',
                          border: checked ? '1.5px solid #1A3028' : '1.5px solid #C8D8C0',
                        }}
                      >
                        {t(`exp_type_${type}`)}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className={LABEL_CLASS}>{t('prof_field_que_ofrezco')}</label>
                <textarea
                  rows={3}
                  value={roleData.que_ofrezco}
                  onChange={(e) => setRoleField('que_ofrezco', e.target.value)}
                  placeholder={t('prof_ph_que_ofrezco')}
                  className={TEXTAREA_CLASS}
                />
              </div>
            </>
          ) : (
            <>
              <p className={SECTION_TITLE}>{t('prof_facilitator_title')}</p>

              <div>
                <label className={LABEL_CLASS}>{t('prof_field_nombre_centro')}</label>
                <input
                  type="text"
                  value={roleData.nombre_centro}
                  onChange={(e) => setRoleField('nombre_centro', e.target.value)}
                  placeholder={t('prof_ph_nombre_centro')}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>{t('prof_field_ubicacion')}</label>
                <input
                  type="text"
                  value={roleData.ubicacion}
                  onChange={(e) => setRoleField('ubicacion', e.target.value)}
                  placeholder={t('prof_ph_ubicacion')}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>{t('prof_field_tradicion')}</label>
                <input
                  type="text"
                  value={roleData.tradicion}
                  onChange={(e) => setRoleField('tradicion', e.target.value)}
                  placeholder={t('prof_ph_tradicion')}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label className={LABEL_CLASS}>{t('prof_field_historia')}</label>
                <textarea
                  rows={5}
                  value={roleData.historia}
                  onChange={(e) => setRoleField('historia', e.target.value)}
                  placeholder={t('prof_ph_historia')}
                  className={TEXTAREA_CLASS}
                />
              </div>
            </>
          )}

          {saveError && (
            <p className="font-nunito text-sm text-orange text-center py-2 px-4 rounded-md bg-orange/10">
              {saveError}
            </p>
          )}

          {saved && (
            <p className="font-nunito text-sm text-forest text-center py-2 px-4 rounded-md bg-moss/10">
              {t('dash_profile_saved')}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || uploading || !!fotoError}
            className="font-josefin uppercase py-4 rounded-md text-cream bg-jungle hover:bg-forest transition-colors disabled:opacity-60"
            style={{ letterSpacing: '0.25em', fontSize: '0.72rem', minHeight: 'auto' }}
          >
            {uploading
              ? t('prof_foto_uploading')
              : saving
                ? t('dash_profile_saving')
                : t('dash_profile_save')}
          </button>

        </form>
      </div>
    </main>
  )
}
