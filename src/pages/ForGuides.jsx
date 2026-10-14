import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { DarkHero, Eyebrow, Lines, SectionTitle } from '../components/Section'

const card = { background: 'white', border: '0.5px solid rgba(45,82,66,0.12)', boxShadow: '0 2px 10px rgba(26,48,40,0.05)' }

export default function ForGuides() {
  const { t } = useLang()
  return (
    <main>
      <DarkHero eyebrow={t('fg_eyebrow')} title={t('fg_title')} maxWidth="max-w-3xl" className="py-20 md:py-28">
        <p className="font-nunito font-light text-sm leading-relaxed mb-8 max-w-xl" style={{ color: '#BCCABF' }}>
          {t('fg_hero_body')}
        </p>
        <Link
          to="/for-guides/apply"
          className="font-nunito font-semibold uppercase px-7 py-4 rounded-md"
          style={{ letterSpacing: '0.16em', background: '#C2510A', color: '#FFFFFF', fontSize: '0.72rem', minHeight: 'auto' }}
        >
          {t('fg_hero_cta')}
        </Link>
      </DarkHero>

      <section style={{ background: 'var(--an-alba)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>{t('fg_what_eyebrow')}</Eyebrow>
            <SectionTitle>{t('fg_what_title')}</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {t('fg_pillars').map((p, i) => (
              <div key={p.title} className="p-6 rounded-xl" style={card}>
                <div className="font-josefin font-thin text-4xl mb-4" style={{ color: '#2D5242' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-josefin text-sm mb-3" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028', fontWeight: 400 }}>
                  {p.title}
                </h3>
                <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2D4A3E' }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center px-5 py-10 rounded-xl" style={{ background: '#1A3028' }}>
            <p className="font-nunito font-extralight text-base md:text-lg italic leading-relaxed mx-auto" style={{ color: '#BCCABF', maxWidth: '560px' }}>
              {t('fg_quote')}
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--an-linen)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <Eyebrow>{t('fg_resp_eyebrow')}</Eyebrow>
            <SectionTitle className="mb-4" style={{ lineHeight: 1.3 }}>{t('fg_resp_title')}</SectionTitle>
            <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2D4A3E' }}>
              {t('fg_resp_body')}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {t('fg_resp_items').map((item) => (
              <div key={item} className="flex gap-3 items-start px-4 py-3 rounded-xl" style={card}>
                <span style={{ color: '#C8A832', flexShrink: 0 }}>✓</span>
                <p className="font-nunito font-light text-sm" style={{ color: '#2D4A3E' }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--an-alba)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>{t('fg_process_eyebrow')}</Eyebrow>
            <SectionTitle>{t('fg_process_title')}</SectionTitle>
          </div>
          <ol className="flex flex-col">
            {t('fg_process_steps').map((step, i, arr) => (
              <li key={step.title} className="grid gap-4 pb-8" style={{ gridTemplateColumns: '32px 1fr' }}>
                <div className="flex flex-col items-center">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-nunito font-semibold text-xs"
                    style={{ background: '#C8A832', color: '#1A3028' }}
                  >
                    {i + 1}
                  </span>
                  {i < arr.length - 1 && <div className="flex-1 mt-2" style={{ width: '1px', background: 'rgba(200,168,50,0.2)' }} />}
                </div>
                <div>
                  <h3 className="font-josefin text-sm mb-2 mt-1.5" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028', fontWeight: 400 }}>
                    {step.title}
                  </h3>
                  <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2D4A3E' }}>
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ background: '#1A3028' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow color="#C8A832">{t('fg_benefits_eyebrow')}</Eyebrow>
            <SectionTitle style={{ color: '#F5F0D8' }}>{t('fg_benefits_title')}</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t('fg_benefits').map((b) => (
              <div key={b} className="flex gap-3 items-start px-4 py-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(240,228,152,0.12)' }}>
                <span style={{ color: '#C8A832', flexShrink: 0 }}>→</span>
                <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#BCCABF' }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--an-glow)' }} className="px-5 py-16 md:py-20 text-center">
        <Eyebrow color="#8A7A3E">{t('fg_cta_eyebrow')}</Eyebrow>
        <h2
          className="font-josefin font-thin mb-3"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2.4rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1A3028' }}
        >
          <Lines text={t('fg_cta_title')} />
        </h2>
        <p className="font-nunito font-light text-sm mb-6 max-w-md mx-auto" style={{ color: '#4C5A4E' }}>
          {t('fg_cta_body')}
        </p>
        <Link
          to="/for-guides/apply"
          className="font-nunito font-semibold uppercase px-7 py-4 rounded-md"
          style={{ letterSpacing: '0.16em', background: '#1A3028', color: '#F0E498', fontSize: '0.72rem', minHeight: 'auto' }}
        >
          {t('fg_cta_btn')}
        </Link>
        <p className="font-nunito font-light text-xs mt-4" style={{ color: '#6F7F70' }}>
          {t('fg_cta_note')}
        </p>
      </section>
    </main>
  )
}
