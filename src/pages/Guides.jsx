import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { DarkHero, Eyebrow, ShieldIcon } from '../components/Section'

// El sitio publicado cargaba los perfiles desde la base de datos; no hay ninguno de respaldo,
// así que la página muestra su estado vacío hasta que existan datos.
export default function Guides() {
  const { t } = useLang()
  return (
    <main style={{ background: 'var(--an-alba)', minHeight: '100vh' }}>
      <DarkHero eyebrow={t('guides_eyebrow')} title={t('guides_title')}>
        <p className="font-nunito font-light text-sm leading-relaxed max-w-lg" style={{ color: 'rgba(200,230,215,0.78)' }}>
          {t('guides_body')}
        </p>
      </DarkHero>

      <div style={{ background: 'var(--an-linen)', borderBottom: '0.5px solid rgba(45,82,66,0.1)' }} className="px-5 md:px-10 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <ShieldIcon />
          <p className="font-nunito font-light text-xs" style={{ color: '#2D4A3E' }}>
            <span style={{ color: '#1A3028', fontWeight: 400 }}>{t('guides_verified_label')} </span>
            {t('guides_verified_body')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-20 text-center">
        <p className="font-josefin font-light text-xl" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028' }}>
          {t('guides_empty_title')}
        </p>
      </div>

      <div style={{ background: 'var(--an-glow)' }} className="px-5 py-14 text-center">
        <Eyebrow color="rgba(26,48,40,0.5)">{t('guides_cta_eyebrow')}</Eyebrow>
        <h2
          className="font-josefin font-thin mb-3"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3028' }}
        >
          {t('guides_cta_title')}
        </h2>
        <p className="font-nunito font-light text-sm mb-6 max-w-md mx-auto" style={{ color: 'rgba(26,48,40,0.65)' }}>
          {t('guides_cta_body')}
        </p>
        <Link
          to="/for-guides"
          className="font-josefin uppercase px-7 py-3.5 rounded-md"
          style={{ letterSpacing: '0.3em', background: '#1A3028', color: '#F0E498', fontSize: '0.7rem', fontWeight: 400, minHeight: 'auto' }}
        >
          {t('guides_cta_btn')}
        </Link>
      </div>
    </main>
  )
}
