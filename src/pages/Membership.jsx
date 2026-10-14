import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { StarMark } from '../components/Logo'
import SmartImage from '../components/SmartImage'
import { Eyebrow, Lines, SectionTitle } from '../components/Section'

const card = { background: 'white', border: '0.5px solid rgba(45,82,66,0.12)', boxShadow: '0 2px 10px rgba(26,48,40,0.05)' }

export default function Membership() {
  const { t } = useLang()
  return (
    <main>
      <section style={{ background: '#1A3028' }} className="px-5 md:px-10 py-20 md:py-28 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <Eyebrow color="rgba(200,168,50,0.65)" spacing="0.55em" className="mb-4">
            {t('an_eyebrow')}
          </Eyebrow>
          <h1
            className="font-josefin font-thin mb-5"
            style={{ fontSize: 'clamp(3rem, 12vw, 6rem)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.05 }}
          >
            Anander
          </h1>
          <StarMark size={64} className="mb-8" />
          <Link
            to="/join"
            className="font-josefin uppercase px-8 py-4 rounded-md"
            style={{ letterSpacing: '0.32em', background: '#C8A832', color: '#1A3028', fontWeight: 400, fontSize: '0.72rem', minHeight: 'auto' }}
          >
            {t('an_hero_cta')}
          </Link>
        </div>
      </section>

      <section style={{ background: 'var(--an-alba)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>{t('an_who_eyebrow')}</Eyebrow>
            <SectionTitle>{t('an_who_title')}</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {t('an_who_cards').map((c, i) => (
              <div key={c.title} className="p-6 rounded-xl" style={card}>
                <div className="font-josefin font-thin text-4xl mb-4" style={{ color: 'rgba(200,168,50,0.2)', letterSpacing: '0.05em' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
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
            <p className="font-nunito font-extralight text-base md:text-lg italic leading-relaxed mx-auto" style={{ color: 'rgba(240,228,152,0.75)', maxWidth: '560px' }}>
              {t('an_who_quote')}
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--an-linen)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <Eyebrow>{t('an_do_eyebrow')}</Eyebrow>
            <SectionTitle className="mb-4" style={{ letterSpacing: '0.1em', lineHeight: 1.3 }}>{t('an_do_title')}</SectionTitle>
            <p className="font-nunito font-light text-sm leading-relaxed mb-5" style={{ color: '#2D4A3E' }}>
              {t('an_do_body')}
            </p>
            <SmartImage src="/images/about-spiral.jpg" alt="" className="rounded-xl w-full object-cover hidden md:block" style={{ height: '180px' }} />
          </div>
          <div className="flex flex-col gap-3">
            {t('an_do_items').map((item) => (
              <div key={item.title} className="flex gap-4 items-start px-4 py-4 rounded-xl" style={{ ...card, boxShadow: '0 1px 8px rgba(26,48,40,0.04)' }}>
                <span style={{ color: '#C8A832', flexShrink: 0, fontSize: '0.9rem', marginTop: '1px' }}>→</span>
                <div>
                  <p className="font-josefin text-xs mb-1" style={{ letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028', fontWeight: 400 }}>
                    {item.title}
                  </p>
                  <p className="font-nunito font-light text-xs leading-relaxed" style={{ color: '#3D6154' }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--an-alba)' }} className="px-5 md:px-10 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>{t('mem_eyebrow')}</Eyebrow>
            <SectionTitle>{t('an_plans_title')}</SectionTitle>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-xl" style={{ border: '0.5px solid rgba(45,82,66,0.15)', background: 'white' }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-josefin font-light" style={{ fontSize: '1rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#1A3028' }}>
                  {t('plan_explorer')}
                </h3>
                <div className="text-right">
                  <span className="font-josefin font-thin text-xl" style={{ color: '#2D5242' }}>{t('plan_explorer_price')}</span>
                  <span className="block font-nunito" style={{ fontSize: '0.62rem', color: '#4A7560' }}>{t('plan_explorer_period')}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2 mb-4">
                {t('plan_explorer_items').map(([mark, label, included]) => (
                  <li key={label} className="flex gap-2.5 items-start">
                    <span style={{ color: included ? '#4A7560' : 'rgba(45,82,66,0.25)', fontSize: '0.7rem', marginTop: '1px' }}>{mark}</span>
                    <span className="font-nunito font-light text-xs" style={{ color: included ? '#2D5242' : 'rgba(45,82,66,0.35)' }}>{label}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/join"
                className="w-full text-center font-josefin uppercase py-2.5 rounded-md"
                style={{ letterSpacing: '0.28em', border: '0.5px solid rgba(45,82,66,0.25)', color: '#2D5242', fontSize: '0.65rem', fontWeight: 400, minHeight: 'auto' }}
              >
                {t('plan_explorer_cta')}
              </Link>
            </div>

            <div className="p-5 rounded-xl" style={{ border: '1.5px solid #2D5242', background: 'rgba(45,82,66,0.03)' }}>
              <span
                className="font-josefin px-2.5 py-1 rounded-sm mb-3 inline-block"
                style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C8A832', background: 'rgba(200,168,50,0.1)', fontWeight: 400 }}
              >
                {t('plan_anander_badge')}
              </span>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-josefin font-light" style={{ fontSize: '1rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#1A3028' }}>
                  {t('plan_anander')}
                </h3>
                <div className="text-right">
                  <span className="font-josefin font-thin text-2xl" style={{ color: '#2D5242' }}>{t('plan_anander_price')}</span>
                  <span className="block font-nunito" style={{ fontSize: '0.62rem', color: '#4A7560' }}>{t('plan_anander_period')}</span>
                </div>
              </div>
              <ul className="flex flex-col gap-2 mb-5">
                {t('plan_anander_items').map((item) => (
                  <li key={item} className="flex gap-2.5 items-start">
                    <span style={{ color: '#2D5242', fontSize: '0.7rem', marginTop: '1px' }}>✓</span>
                    <span className="font-nunito font-light text-xs" style={{ color: '#1A3028' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/join"
                className="w-full text-center font-josefin uppercase py-3 rounded-md"
                style={{ letterSpacing: '0.28em', background: '#2D5242', color: '#F0E498', fontSize: '0.68rem', fontWeight: 400, minHeight: 'auto' }}
              >
                {t('plan_anander_cta')}
              </Link>
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg" style={{ border: '0.5px dashed rgba(45,82,66,0.2)' }}>
              <span className="font-josefin" style={{ fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(45,82,66,0.4)', fontWeight: 300 }}>
                {t('plan_pro_label')}
              </span>
              <span
                className="font-josefin px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(45,82,66,0.3)', border: '0.5px solid rgba(45,82,66,0.15)' }}
              >
                {t('plan_pro_badge')}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#2D5242' }} className="px-5 md:px-10 py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <Eyebrow color="rgba(240,228,152,0.5)" className="mb-4">{t('an_community_eyebrow')}</Eyebrow>
          <h2
            className="font-josefin font-thin mb-5"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.8rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.2 }}
          >
            <Lines text={t('an_community_title')} />
          </h2>
          <p className="font-nunito font-light text-sm leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'rgba(200,230,215,0.72)' }}>
            {t('an_community_body')}
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              to="/join"
              className="font-josefin uppercase px-7 py-4 rounded-md"
              style={{ letterSpacing: '0.32em', background: 'var(--an-glow)', color: '#1A3028', fontWeight: 400, fontSize: '0.7rem', minHeight: 'auto' }}
            >
              {t('an_hero_cta')}
            </Link>
            <Link
              to="/explore"
              className="font-josefin uppercase px-7 py-4 rounded-md"
              style={{ letterSpacing: '0.3em', border: '0.5px solid rgba(240,228,152,0.3)', color: '#F0E498', fontWeight: 300, fontSize: '0.68rem', minHeight: 'auto' }}
            >
              {t('nav_explore')} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
