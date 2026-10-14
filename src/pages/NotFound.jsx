import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { StarMark } from '../components/Logo'
import { Lines } from '../components/Section'

export default function NotFound() {
  const { t } = useLang()
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: '#111111' }}>
      <StarMark size={48} className="mb-8" style={{ opacity: 0.4 }} />
      <p className="font-josefin mb-3" style={{ fontSize: '0.6rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(232,98,10,0.6)' }}>
        Ananders · 404 · {t('notfound_eyebrow')}
      </p>
      <h1
        className="font-josefin font-thin mb-4"
        style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.1 }}
      >
        <Lines text={t('notfound_title')} />
      </h1>
      <p className="font-nunito font-light text-sm italic mb-8" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '360px', lineHeight: 1.7 }}>
        {t('notfound_body')}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="font-josefin uppercase px-6 py-3 rounded-md"
          style={{ letterSpacing: '0.28em', background: '#E8620A', color: '#ffffff', fontSize: '0.7rem', minHeight: 'auto' }}
        >
          {t('notfound_home')}
        </Link>
        <Link
          to="/explore"
          className="font-josefin uppercase px-6 py-3 rounded-md"
          style={{ letterSpacing: '0.28em', border: '0.5px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', minHeight: 'auto' }}
        >
          {t('notfound_explore')}
        </Link>
      </div>
    </main>
  )
}
