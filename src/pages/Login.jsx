import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { Eyebrow } from '../components/Section'

function mapLoginError(msg) {
  const m = msg?.toLowerCase() ?? ''
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'login_error_invalid'
  if (m.includes('email not confirmed') || m.includes('not confirmed')) return 'login_error_not_confirmed'
  return 'login_error_generic'
}

const INPUT_CLASS = 'w-full font-nunito rounded-md px-4 py-3 text-sm outline-none transition-all bg-forest border border-moss text-cream placeholder-moss focus:border-gold focus:ring-1 focus:ring-gold'
const LABEL_CLASS = 'block font-josefin uppercase text-xs tracking-widest text-dew mb-1.5'

export default function Login() {
  const { t } = useLang()
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setError('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await signIn(form)
    setLoading(false)
    if (err) {
      setError(t(mapLoginError(err.message)))
      return
    }
    navigate('/')
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16 bg-jungle">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Eyebrow color="rgba(200,168,50,0.65)">{t('login_eyebrow')}</Eyebrow>
          <h1
            className="font-josefin font-thin text-cream"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.15 }}
          >
            {t('login_title')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
          </div>

          <div>
            <label className={LABEL_CLASS}>{t('join_field_password')}</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder={t('join_ph_password')}
                autoComplete="current-password"
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
          </div>

          {error && (
            <p className="font-nunito text-sm text-orange text-center py-2 px-4 rounded-md bg-orange/10">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-josefin uppercase py-4 rounded-md text-jungle bg-gold hover:bg-dew transition-colors disabled:opacity-60"
            style={{ letterSpacing: '0.25em', fontSize: '0.72rem', minHeight: 'auto' }}
          >
            {loading ? t('login_loading') : t('login_submit')}
          </button>
        </form>

        <p className="font-nunito text-center text-sm text-moss mt-8">
          {t('join_already').replace('?', '')} ·{' '}
          <Link to="/join" className="text-dew hover:text-cream transition-colors underline underline-offset-2">
            {t('login_create_account')}
          </Link>
        </p>
      </div>
    </main>
  )
}
