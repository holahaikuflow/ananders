import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { StarMark } from '../components/Logo'
import { Eyebrow } from '../components/Section'

function mapSignUpError(msg) {
  const m = msg?.toLowerCase() ?? ''
  if (m.includes('already registered') || m.includes('already in use') || m.includes('already exists')) return 'join_error_exists'
  if (m.includes('at least 6') || m.includes('password should be')) return 'join_error_password'
  return 'join_error_generic'
}

const INPUT_CLASS = 'w-full font-nunito rounded-md px-4 py-3 text-sm outline-none transition-all bg-forest border border-moss text-cream placeholder-moss focus:border-gold focus:ring-1 focus:ring-gold'
const LABEL_CLASS = 'block font-josefin uppercase text-xs tracking-widest text-dew mb-1.5'

export default function Join() {
  const { t } = useLang()
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState(null)

  function set(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setFieldErrors((prev) => ({ ...prev, [field]: '' }))
      setSubmitError('')
    }
  }

  function validate() {
    const errors = {}
    if (!form.name.trim()) errors.name = t('join_error_name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t('join_error_email')
    if (!form.role) errors.role = t('join_error_name')
    if (form.password.length < 6) errors.password = t('join_error_password')
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setSubmitError('')
    const { data, error } = await signUp(form)
    setLoading(false)
    if (error) {
      setSubmitError(t(mapSignUpError(error.message)))
      return
    }
    if (data.user && !data.session) {
      setConfirmedEmail(form.email)
      return
    }
    navigate('/')
  }

  if (confirmedEmail) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-jungle">
        <StarMark size={36} className="mb-6" style={{ opacity: 0.6 }} />
        <Eyebrow color="rgba(200,168,50,0.65)">{t('join_confirm_eyebrow')}</Eyebrow>
        <h1
          className="font-josefin font-thin mb-6 text-cream"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 2.6rem)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.15 }}
        >
          {t('join_confirm_title')}
        </h1>
        <p className="font-nunito text-cream/80 max-w-sm leading-relaxed mb-8">
          {t('join_confirm_body').replace('{{email}}', confirmedEmail)}
        </p>
        <Link
          to="/explore"
          className="font-josefin uppercase px-7 py-3.5 rounded-md bg-gold text-jungle text-xs tracking-widest"
        >
          {t('join_success_cta')}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16 bg-jungle">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Eyebrow color="rgba(200,168,50,0.65)">{t('join_eyebrow_account')}</Eyebrow>
          <h1
            className="font-josefin font-thin text-cream"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.15 }}
          >
            {t('join_title_account')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div>
            <label className={LABEL_CLASS}>{t('join_field_name')}</label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder={t('join_ph_name')}
              autoComplete="name"
              className={INPUT_CLASS}
            />
            {fieldErrors.name && <p className="font-nunito text-xs text-orange mt-1.5">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className={LABEL_CLASS}>{t('join_field_email')}</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder={t('join_ph_email')}
              autoComplete="email"
              className={INPUT_CLASS}
            />
            {fieldErrors.email && <p className="font-nunito text-xs text-orange mt-1.5">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className={LABEL_CLASS}>{t('join_role_label')}</label>
            <div className="grid grid-cols-2 gap-3">
              {['seeker', 'facilitator'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setForm((prev) => ({ ...prev, role: r })); setFieldErrors((prev) => ({ ...prev, role: '' })) }}
                  className="font-josefin uppercase py-3 rounded-md text-xs tracking-widest transition-all"
                  style={{
                    letterSpacing: '0.2em',
                    background: form.role === r ? '#C8A832' : 'transparent',
                    color: form.role === r ? '#1A3028' : '#F5F0D8',
                    border: form.role === r ? '1.5px solid #C8A832' : '1.5px solid rgba(90,138,114,0.6)',
                  }}
                >
                  {t(r === 'seeker' ? 'join_role_seeker' : 'join_role_facilitator')}
                </button>
              ))}
            </div>
            {fieldErrors.role && <p className="font-nunito text-xs text-orange mt-1.5">{t('join_error_name').replace('nombre', 'rol')}</p>}
          </div>

          <div>
            <label className={LABEL_CLASS}>{t('join_field_password')}</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder={t('join_ph_password')}
                autoComplete="new-password"
                className={INPUT_CLASS + ' pr-16'}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 font-josefin uppercase text-xs text-moss hover:text-dew transition-colors"
                style={{ letterSpacing: '0.15em', minHeight: 'auto' }}
              >
                {showPwd ? t('join_hide') : t('join_show')}
              </button>
            </div>
            <p className="font-nunito text-xs text-moss mt-1.5">{t('join_password_hint')}</p>
            {fieldErrors.password && <p className="font-nunito text-xs text-orange mt-0.5">{fieldErrors.password}</p>}
          </div>

          {submitError && (
            <p className="font-nunito text-sm text-orange text-center py-2 px-4 rounded-md bg-orange/10">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-josefin uppercase py-4 rounded-md text-jungle bg-gold hover:bg-dew transition-colors disabled:opacity-60"
            style={{ letterSpacing: '0.25em', fontSize: '0.72rem', minHeight: 'auto' }}
          >
            {loading ? t('join_loading') : t('join_submit_explorer')}
          </button>
        </form>

        <p className="font-nunito text-center text-sm text-moss mt-8">
          {t('join_already')}{' '}
          <Link to="/login" className="text-dew hover:text-cream transition-colors underline underline-offset-2">
            {t('nav_login')}
          </Link>
        </p>
      </div>
    </main>
  )
}
