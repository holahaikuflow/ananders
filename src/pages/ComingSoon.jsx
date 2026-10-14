import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { StarMark } from '../components/Logo'
import { Eyebrow } from '../components/Section'

// Rutas que en el sitio publicado dependían de cuentas y base de datos (registro, ingreso, postulación).
export default function ComingSoon({ eyebrowKey, titleKey }) {
  const { t } = useLang()
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20" style={{ background: '#1A3028' }}>
      <StarMark size={40} className="mb-6" style={{ opacity: 0.6 }} />
      <Eyebrow color="#C8A832">{t(eyebrowKey)}</Eyebrow>
      <h1
        className="font-josefin font-thin mb-6"
        style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.15 }}
      >
        {t(titleKey)}
      </h1>
      <p className="font-nunito font-semibold uppercase mb-8" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', color: '#F0E498' }}>
        {t('coming_soon')}
      </p>
      <Link
        to="/explore"
        className="font-nunito font-semibold uppercase px-7 py-3.5 rounded-md"
        style={{ letterSpacing: '0.16em', background: '#C2510A', color: '#FFFFFF', fontSize: '0.72rem', minHeight: 'auto' }}
      >
        {t('notfound_explore')}
      </Link>
    </main>
  )
}
