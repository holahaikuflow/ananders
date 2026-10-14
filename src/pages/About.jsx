import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { Eyebrow, SectionTitle } from '../components/Section'
import { StarMark } from '../components/Logo'

const card = { background: 'white', border: '0.5px solid rgba(45,82,66,0.12)', boxShadow: '0 2px 10px rgba(26,48,40,0.05)' }

// El sitio publicado tenía estos textos en el diccionario pero ninguna ruta /about.
// La sección de etimología no se incluye: sus textos eran de otra marca.
export default function About() {
  const { t } = useLang()
  return (
    <main>
      <section style={{ background: '#1A3028' }} className="px-5 md:px-10 py-20 md:py-28 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <Eyebrow color="#C8A832" className="mb-4">{t('about_eyebrow')}</Eyebrow>
          <h1
            className="font-josefin font-thin mb-6"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.05 }}
          >
            {t('about_title')}
          </h1>
          <StarMark size={48} className="mb-6" />
          <p className="font-nunito font-extralight text-sm md:text-base italic leading-relaxed max-w-lg" style={{ color: '#BCCABF' }}>
            {t('about_hero_quote')}
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--an-alba)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>{t('about_history_eyebrow')}</Eyebrow>
            <SectionTitle>{t('about_history_title')}</SectionTitle>
          </div>
          <ol className="flex flex-col">
            {t('about_timeline').map((item, i, arr) => (
              <li key={item.title} className="grid gap-4 pb-8" style={{ gridTemplateColumns: '14px 1fr' }}>
                <div className="flex flex-col items-center">
                  <span className="w-3.5 h-3.5 rounded-full mt-1" style={{ background: '#C8A832' }} />
                  {i < arr.length - 1 && <div className="flex-1 mt-2" style={{ width: '1px', background: 'rgba(200,168,50,0.25)' }} />}
                </div>
                <div>
                  <p className="font-nunito font-semibold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8A832' }}>
                    {item.date}
                  </p>
                  <h3 className="font-josefin text-sm mb-2" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028', fontWeight: 400 }}>
                    {item.title}
                  </h3>
                  <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2D4A3E' }}>
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ background: 'var(--an-linen)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl mb-10">
            <Eyebrow>{t('about_mystery_eyebrow')}</Eyebrow>
            <SectionTitle className="mb-5">{t('about_mystery_title')}</SectionTitle>
            <p className="font-nunito font-light text-sm leading-relaxed mb-3" style={{ color: '#2D4A3E' }}>
              {t('about_mystery_p1')}
            </p>
            <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2D4A3E' }}>
              {t('about_mystery_p2')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t('about_candidates').map((c) => (
              <div key={c.name} className="p-5 rounded-xl" style={card}>
                <h3 className="font-josefin text-sm mb-1" style={{ letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1A3028', fontWeight: 400 }}>
                  {c.name}
                </h3>
                <p className="font-nunito text-xs italic mb-3" style={{ color: '#C8A832' }}>
                  {c.sci}
                </p>
                <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2D4A3E' }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--an-alba)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>{t('about_intention_eyebrow')}</Eyebrow>
            <SectionTitle>{t('about_intention_title')}</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {t('about_intention_cards').map((c) => (
              <div key={c.title} className="p-6 rounded-xl" style={card}>
                <h3 className="font-josefin text-sm mb-3" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028', fontWeight: 400 }}>
                  {c.title}
                </h3>
                <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2D4A3E' }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center px-5 py-10 rounded-xl" style={{ background: '#1A3028' }}>
            <p className="font-nunito font-extralight text-base md:text-lg italic leading-relaxed mx-auto" style={{ color: '#BCCABF', maxWidth: '560px' }}>
              {t('about_intention_quote')}
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--an-glow)' }} className="px-5 py-16 md:py-20 text-center flex flex-col items-center gap-6">
        <h2
          className="font-josefin font-thin"
          style={{ fontSize: 'clamp(1.6rem, 5vw, 2.6rem)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A3028', lineHeight: 1.2 }}
        >
          {t('about_cta_title')}
        </h2>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/explore"
            className="font-nunito font-semibold uppercase px-8 py-4 rounded-md"
            style={{ letterSpacing: '0.16em', background: '#1A3028', color: '#F0E498', fontSize: '0.72rem', minHeight: 'auto' }}
          >
            {t('about_cta_btn')}
          </Link>
          <Link
            to="/safety"
            className="font-nunito font-semibold uppercase px-7 py-4 rounded-md"
            style={{ letterSpacing: '0.16em', border: '0.5px solid rgba(26,48,40,0.3)', color: '#1A3028', fontSize: '0.72rem', minHeight: 'auto' }}
          >
            {t('about_safety_eyebrow')}
          </Link>
        </div>
      </section>
    </main>
  )
}
