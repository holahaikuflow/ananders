import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { Eyebrow } from '../components/Section'

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2
        className="font-josefin font-light text-base mb-4"
        style={{ letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--an-night)' }}
      >
        {title}
      </h2>
      <div className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#3D6154' }}>
        {children}
      </div>
    </div>
  )
}

function Bullets({ items }) {
  return (
    <ul className="flex flex-col gap-2 ml-4">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span style={{ color: 'var(--an-marigold)', flexShrink: 0 }}>·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

// Cada bloque: [título, [párrafo | lista, ...]]. Las claves vienen del diccionario.
const DOCS = {
  privacy: {
    title: 'privacy_title',
    intro: 'privacy_intro',
    other: { to: '/terms', label: 1 },
    sections: [
      ['privacy_s1_title', ['privacy_s1_body1', ['privacy_s1_items']]],
      ['privacy_s2_title', ['privacy_s2_body1', ['privacy_s2_items']]],
      ['privacy_s3_title', ['privacy_s3_body']],
      ['privacy_s4_title', ['privacy_s4_body1', 'privacy_s4_body2']],
      ['privacy_s5_title', ['privacy_s5_body']],
      ['privacy_s6_title', ['privacy_s6_body']],
    ],
  },
  terms: {
    title: 'terms_title',
    intro: 'terms_intro',
    other: { to: '/privacy', label: 0 },
    sections: [
      ['terms_s1_title', ['terms_s1_body1', 'terms_s1_body2']],
      ['terms_s2_title', ['terms_s2_body1', ['terms_s2_items']]],
      ['terms_s3_title', ['terms_s3_body1', 'terms_s3_body2']],
      ['terms_s4_title', ['terms_s4_body1', ['terms_s4_items']]],
      ['terms_s5_title', ['terms_s5_body']],
      ['terms_s6_title', ['terms_s6_body1', 'terms_s6_body2']],
      ['terms_s7_title', ['terms_s7_body']],
    ],
  },
}

export default function Legal({ doc }) {
  const { t } = useLang()
  const d = DOCS[doc]
  return (
    <main style={{ background: 'var(--an-alba)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--an-night)' }} className="px-6 md:px-10 py-16">
        <div className="max-w-3xl mx-auto">
          <Eyebrow color="#C8A832">{t('legal_eyebrow')}</Eyebrow>
          <h1
            className="font-josefin font-thin"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--an-cream)' }}
          >
            {t(d.title)}
          </h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-14">
        <p
          className="font-nunito font-light text-sm leading-relaxed mb-10"
          style={{ color: '#3D6154', fontStyle: 'italic', borderLeft: '2px solid var(--an-marigold)', paddingLeft: '16px' }}
        >
          {t(d.intro)}
        </p>
        {d.sections.map(([titleKey, parts]) => (
          <Section key={titleKey} title={t(titleKey)}>
            {parts.map((part, i) =>
              Array.isArray(part) ? (
                <Bullets key={part[0]} items={t(part[0])} />
              ) : (
                <p key={part} className={i < parts.length - 1 ? 'mb-3' : ''}>
                  {t(part)}
                </p>
              ),
            )}
          </Section>
        ))}
        <div className="flex gap-6 flex-wrap" style={{ borderTop: '0.5px solid rgba(45,82,66,0.12)', paddingTop: '32px', marginTop: '8px' }}>
          <Link to={d.other.to} className="font-nunito font-semibold text-xs uppercase" style={{ letterSpacing: '0.16em', color: '#3D6154', textDecoration: 'underline', minHeight: 'auto' }}>
            {t('footer_legal')[d.other.label]}
          </Link>
          <Link to="/" className="font-nunito font-semibold text-xs uppercase" style={{ letterSpacing: '0.16em', color: '#3D6154', textDecoration: 'underline', minHeight: 'auto' }}>
            ← {t('notfound_home')}
          </Link>
        </div>
      </div>
    </main>
  )
}
