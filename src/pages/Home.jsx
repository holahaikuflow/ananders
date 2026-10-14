import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { getExperiences } from '../data/experiences'
import { HERO_STATS, SHOW_HERO_STATS } from '../config'
import HeroSlides from '../components/HeroSlides'
import HeroSearch from '../components/HeroSearch'
import ExperienceCard from '../components/ExperienceCard'
import SmartImage from '../components/SmartImage'
import { Eyebrow, Lines } from '../components/Section'

export default function Home() {
  const { t, lang } = useLang()
  const featured = getExperiences(lang).slice(0, 6)
  const stats = [
    { n: HERO_STATS.exp, l: t('stat_experiences') },
    { n: HERO_STATS.countries, l: t('stat_countries') },
    { n: HERO_STATS.ananders, l: t('stat_ananders') },
    { n: HERO_STATS.guides, l: t('stat_guides') },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 overflow-hidden" style={{ minHeight: '100svh' }}>
        <HeroSlides />
        <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-2xl mx-auto py-20">
          <p
            className="font-josefin uppercase"
            style={{ fontSize: 'clamp(0.55rem, 2vw, 0.68rem)', letterSpacing: '0.45em', color: 'rgba(200,168,50,0.8)', fontWeight: 400 }}
          >
            {t('hero_eyebrow')}
          </p>
          <h1
            className="font-josefin font-thin leading-tight"
            style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F5F0D8' }}
          >
            <span style={{ color: '#F2C94C' }}>Ananders</span> — {t('exp_title_1')} {t('exp_title_2')}
          </h1>
          <p
            className="font-nunito font-light leading-relaxed max-w-md"
            style={{ color: 'rgba(220,240,230,0.88)', fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}
          >
            {t('hero_sub')}
          </p>
          <HeroSearch />
          <div className="flex gap-3 flex-wrap justify-center mt-1">
            <Link
              to="/join"
              className="font-josefin uppercase px-7 py-3.5 rounded-md"
              style={{ letterSpacing: '0.3em', background: 'var(--an-marigold)', color: '#1A3028', fontWeight: 400, fontSize: '0.72rem', minHeight: 'auto' }}
            >
              {t('cta_join')}
            </Link>
            <Link
              to="/for-guides"
              className="font-josefin uppercase px-6 py-3.5 rounded-md"
              style={{ letterSpacing: '0.28em', border: '1px solid rgba(240,228,152,0.45)', color: '#F0E498', fontWeight: 300, fontSize: '0.68rem', minHeight: 'auto' }}
            >
              {t('hero_guide_cta')}
            </Link>
          </div>
          {SHOW_HERO_STATS && (
            <div className="hidden md:flex md:gap-12 mt-2 pt-5 justify-center" style={{ borderTop: '0.5px solid rgba(168,196,180,0.2)' }}>
              {stats.map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-josefin font-thin" style={{ fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', color: '#F2C94C', letterSpacing: '0.05em' }}>
                    {s.n}
                  </div>
                  <div
                    className="font-josefin mt-1"
                    style={{ fontSize: '0.56rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(168,196,180,0.55)', fontWeight: 400 }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cómo funciona */}
      <section style={{ background: 'var(--an-alba)' }} className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <Eyebrow>{t('how_eyebrow')}</Eyebrow>
            <h2
              className="font-josefin font-light"
              style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028' }}
            >
              {t('how_title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t('how_steps').map((step) => (
              <div
                key={step.n}
                className="p-6 rounded-xl"
                style={{ border: '0.5px solid rgba(45,82,66,0.15)', background: 'white', boxShadow: '0 2px 12px rgba(26,48,40,0.05)' }}
              >
                <div className="font-josefin font-thin text-4xl mb-4" style={{ color: 'rgba(45,82,66,0.15)', letterSpacing: '0.05em' }}>
                  {step.n}
                </div>
                <h3
                  className="font-josefin text-sm mb-3"
                  style={{ letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1A3028', fontWeight: 400 }}
                >
                  {step.title}
                </h3>
                <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#3D5F50' }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiencias */}
      <section style={{ background: 'var(--an-linen)' }} className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-8 gap-4">
            <div>
              <Eyebrow className="mb-2" spacing="0.45em">{t('exp_eyebrow')}</Eyebrow>
              <h2
                className="font-josefin font-light"
                style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028' }}
              >
                {t('exp_title_1')} <span style={{ color: '#C8A832' }}>{t('exp_title_2')}</span>
              </h2>
            </div>
            <Link
              to="/explore"
              className="font-josefin uppercase flex-shrink-0"
              style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#2D5242', fontWeight: 400 }}
            >
              {t('exp_see_all')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featured.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(220px, 40vw, 360px)' }}>
        <SmartImage src="/images/community-drum.jpg" alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5" style={{ background: 'rgba(13,22,16,0.55)' }}>
          <p
            className="font-josefin font-thin mb-2"
            style={{ fontSize: 'clamp(1.3rem, 5vw, 2.5rem)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F5F0D8' }}
          >
            {t('banner_title')}
          </p>
          <p className="font-nunito font-light text-sm italic" style={{ color: 'rgba(220,240,230,0.82)' }}>
            {t('banner_sub')}
          </p>
        </div>
      </section>

      {/* Para Facilitadores */}
      <section style={{ background: 'var(--an-jungle)' }} className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Eyebrow color="rgba(240,228,152,0.6)">{t('guides_cta_eyebrow')}</Eyebrow>
            <h2
              className="font-josefin font-thin mb-4"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.2 }}
            >
              {t('guides_cta_title')}
            </h2>
            <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: 'rgba(220,240,230,0.78)' }}>
              {t('guides_cta_body')}
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link
              to="/for-guides"
              className="font-josefin uppercase px-8 py-4 rounded-md text-center"
              style={{ letterSpacing: '0.3em', background: '#E8D070', color: '#1A3028', fontWeight: 400, fontSize: '0.72rem', minHeight: 'auto' }}
            >
              {t('hero_guide_cta')} →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background: 'var(--an-glow)' }} className="py-16 md:py-24 px-4 flex flex-col items-center text-center gap-5">
        <h2
          className="font-josefin font-thin"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A3028', lineHeight: 1.2 }}
        >
          <Lines text={t('cta_title')} />
        </h2>
        <p className="font-nunito font-light text-sm italic max-w-sm" style={{ color: 'rgba(26,48,40,0.65)' }}>
          {t('cta_quote')}
        </p>
        <Link
          to="/join"
          className="font-josefin uppercase px-8 py-4 rounded-md mt-2"
          style={{ letterSpacing: '0.3em', background: '#1A3028', color: '#F0E498', fontWeight: 400, fontSize: '0.72rem', minHeight: 'auto' }}
        >
          {t('cta_join')}
        </Link>
      </section>
    </main>
  )
}
