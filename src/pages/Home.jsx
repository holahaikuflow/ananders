import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useExperiences } from '../lib/useExperiences'
import HeroMedia from '../components/HeroMedia'
import HeroSearch from '../components/HeroSearch'
import ExperienceCard from '../components/ExperienceCard'
import { Eyebrow, Lines } from '../components/Section'

export default function Home() {
  const { t } = useLang()
  const { data: experiences, loading: expLoading } = useExperiences()
  const featured = experiences.slice(0, 6)

  const modelStats = [
    { n: t('model_stat_1_n'), label: t('model_stat_1_label') },
    { n: t('model_stat_2_n'), label: t('model_stat_2_label') },
    { n: t('model_stat_3_n'), label: t('model_stat_3_label') },
  ]

  return (
    <main>
      {/* 1 — Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{ minHeight: '100svh', background: '#101C17' }}
      >
        <HeroMedia />
        <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-2xl mx-auto py-20">
          {t('hero_eyebrow') && (
            <p
              className="font-nunito font-semibold uppercase"
              style={{ fontSize: '0.72rem', letterSpacing: '0.16em', color: '#C8A832' }}
            >
              {t('hero_eyebrow')}
            </p>
          )}
          <h1
            className="font-josefin font-thin"
            style={{ fontSize: 'clamp(2rem, 7vw, 4rem)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F4EFE1', lineHeight: 1.25 }}
          >
            <Lines text={t('hero_title_1')} />
          </h1>
          <p
            className="font-nunito font-light leading-relaxed max-w-md"
            style={{ color: '#BCCABF', fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}
          >
            {t('hero_sub')}
          </p>
          <HeroSearch />
          <div className="flex gap-3 flex-wrap justify-center mt-1">
            <Link
              to="/join"
              className="font-nunito font-semibold uppercase px-7 py-3.5 rounded-md"
              style={{ letterSpacing: '0.16em', background: '#C2510A', color: '#FFFFFF', fontSize: '0.72rem', minHeight: 'auto' }}
            >
              {t('cta_join')}
            </Link>
            <Link
              to="/for-guides"
              className="font-nunito font-semibold uppercase px-6 py-3.5 rounded-md"
              style={{ letterSpacing: '0.16em', border: '1px solid rgba(244,239,225,0.3)', color: '#F4EFE1', fontSize: '0.72rem', minHeight: 'auto' }}
            >
              {t('hero_guide_cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — Cómo funciona */}
      <section style={{ background: '#F4EFE1' }} className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <Eyebrow color="#8A7A3E">{t('how_eyebrow')}</Eyebrow>
            <h2
              className="font-josefin font-light"
              style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#101C17' }}
            >
              {t('how_title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-px" style={{ background: 'rgba(21,36,30,0.12)' }}>
            {t('how_steps').map((step) => (
              <div
                key={step.n}
                className="p-6 md:p-8"
                style={{ background: '#F4EFE1', borderTop: '2px solid #15241E' }}
              >
                <div
                  className="font-josefin mb-5 leading-none"
                  style={{ fontSize: '46px', color: '#C2510A', fontWeight: 300 }}
                >
                  {step.n}
                </div>
                <h3
                  className="font-josefin text-sm mb-3"
                  style={{ letterSpacing: '0.18em', textTransform: 'uppercase', color: '#101C17', fontWeight: 400 }}
                >
                  {step.title}
                </h3>
                <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#3D5A4A' }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Experiencias */}
      <section style={{ background: '#EBE4D0' }} className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-8 gap-4">
            <div>
              <Eyebrow color="#8A7A3E" className="mb-2">{t('exp_eyebrow')}</Eyebrow>
              <h2
                className="font-josefin font-light"
                style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#101C17' }}
              >
                {t('exp_title_1')} <span style={{ color: '#8A7A3E' }}>{t('exp_title_2')}</span>
              </h2>
            </div>
            <Link
              to="/explore"
              className="font-nunito font-semibold uppercase flex-shrink-0"
              style={{ fontSize: '0.72rem', letterSpacing: '0.16em', color: '#3D5A4A' }}
            >
              {t('exp_see_all')}
            </Link>
          </div>
          {expLoading ? (
            <p className="font-nunito text-sm py-8 text-center" style={{ color: '#4A7560' }}>…</p>
          ) : featured.length === 0 ? (
            <p className="font-nunito text-sm py-8 text-center" style={{ color: '#6B8A7A' }}>{t('exp_empty_home')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featured.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 — El Modelo */}
      <section style={{ background: '#101C17' }} className="py-16 md:py-28 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Izquierda */}
          <div>
            <Eyebrow color="#C8A832">{t('model_eyebrow')}</Eyebrow>
            <h2
              className="font-josefin mb-5"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.625rem)', fontWeight: 300, letterSpacing: '0.06em', color: '#F4EFE1', lineHeight: 1.25, textTransform: 'uppercase' }}
            >
              <Lines text={t('model_title')} />
            </h2>
            <p className="font-nunito font-light leading-relaxed" style={{ color: '#BCCABF', fontSize: '0.95rem' }}>
              {t('model_body')}
            </p>
          </div>
          {/* Derecha — 3 filas */}
          <div style={{ background: '#16281F', borderRadius: '12px', overflow: 'hidden' }}>
            {modelStats.map((item, i) => (
              <div
                key={i}
                className="px-6 py-6 flex items-center gap-5"
                style={{ borderBottom: i < modelStats.length - 1 ? '1px solid #22382E' : 'none' }}
              >
                <span
                  className="font-josefin flex-shrink-0 leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.625rem)', fontWeight: 300, color: '#E8620A', letterSpacing: '0.04em' }}
                >
                  {item.n}
                </span>
                <span className="font-nunito font-light" style={{ fontSize: '0.9rem', color: '#F4EFE1', lineHeight: 1.4 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Para Facilitadores */}
      <section style={{ background: '#F4EFE1' }} className="py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Eyebrow color="#8A7A3E">{t('guides_cta_eyebrow')}</Eyebrow>
            <h2
              className="font-josefin font-thin mb-4"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#101C17', lineHeight: 1.2 }}
            >
              {t('guides_cta_title')}
            </h2>
            <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#3D5A4A' }}>
              {t('guides_cta_body')}
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link
              to="/for-guides"
              className="font-nunito font-semibold uppercase px-8 py-4 rounded-md text-center"
              style={{ letterSpacing: '0.16em', background: '#C2510A', color: '#FFFFFF', fontSize: '0.72rem', minHeight: 'auto' }}
            >
              {t('hero_guide_cta')} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
