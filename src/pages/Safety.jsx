import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { Eyebrow, ShieldIcon } from '../components/Section'

export default function Safety() {
  const { t } = useLang()
  return (
    <main style={{ background: 'var(--an-alba)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--an-night)' }} className="px-5 md:px-10 py-16">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color="#C8A832">{t('about_safety_eyebrow')}</Eyebrow>
          <h1
            className="font-josefin font-thin mb-4"
            style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--an-cream)', lineHeight: 1.1 }}
          >
            {t('about_safety_title')}
          </h1>
          <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#BCCABF', maxWidth: '520px' }}>
            {t('about_safety_body')}
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-14 flex flex-col gap-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {t('about_safety_steps').map((s) => (
            <div key={s.n} className="p-5 rounded-xl text-center" style={{ border: '0.5px solid rgba(45,82,66,0.12)', background: 'white' }}>
              <div className="font-josefin font-thin text-3xl mb-2" style={{ color: '#2D5242', letterSpacing: '0.05em' }}>
                {s.n}
              </div>
              <h3 className="font-nunito font-semibold text-xs mb-2" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--an-night)' }}>
                {s.title}
              </h3>
              <p className="font-nunito font-light text-xs leading-relaxed" style={{ color: 'var(--an-moss)' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 p-5 rounded-xl" style={{ background: 'rgba(200,168,50,0.04)', border: '0.5px solid rgba(200,168,50,0.2)' }}>
          <ShieldIcon color="#C8A832" size={16} />
          <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: 'var(--an-moss)' }}>
            <span style={{ color: 'var(--an-night)', fontWeight: 400 }}>{t('about_safety_note_label')} </span>
            {t('about_safety_note')}
          </p>
        </div>
        <div className="flex flex-wrap gap-6 pt-4" style={{ borderTop: '0.5px solid rgba(45,82,66,0.1)' }}>
          <Link to="/about" className="font-nunito font-semibold text-xs uppercase" style={{ letterSpacing: '0.16em', color: 'var(--an-moss)', textDecoration: 'underline', minHeight: 'auto' }}>
            {t('nav_about')}
          </Link>
          <Link to="/for-guides" className="font-nunito font-semibold text-xs uppercase" style={{ letterSpacing: '0.16em', color: 'var(--an-moss)', textDecoration: 'underline', minHeight: 'auto' }}>
            {t('fg_eyebrow')}
          </Link>
        </div>
      </div>
    </main>
  )
}
