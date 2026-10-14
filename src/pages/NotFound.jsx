import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { StarMark } from '../components/Logo'
import { Lines } from '../components/Section'

export default function NotFound() {
  const { t } = useLang()
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: '#111111' }}>
      <StarMark size={48} className="mb-8" style={{ opacity: 0.4 }} />
      <p className="font-nunito font-semibold mb-3" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8620A' }}>
        Ananders · 404 · {t('notfound_eyebrow')}
      </p>
      <h1
        className="font-josefin font-thin mb-4"
        style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.1 }}
      >
        <Lines text={t('notfound_title')} />
      </h1>
      <p className="font-nunito font-light text-sm italic mb-8" style={{ color: '#93A796', maxWidth: '360px', lineHeight: 1.7 }}>
        {t('notfound_body')}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="font-nunito font-semibold uppercase px-6 py-3 rounded-md"
          style={{ letterSpacing: '0.16em', background: '#C2510A', color: '#ffffff', fontSize: '0.72rem', minHeight: 'auto' }}
        >
          {t('notfound_home')}
        </Link>
        <Link
          to="/explore"
          className="font-nunito font-semibold uppercase px-6 py-3 rounded-md"
          style={{ letterSpacing: '0.16em', border: '0.5px solid rgba(255,255,255,0.25)', color: '#F4EFE1', fontSize: '0.72rem', minHeight: 'auto' }}
        >
          {t('notfound_explore')}
        </Link>
      </div>
    </main>
  )
}
