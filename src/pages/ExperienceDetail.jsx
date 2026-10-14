import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { getExperience } from '../data/experiences'
import Seo from '../components/Seo'
import SmartImage from '../components/SmartImage'
import { ShieldIcon } from '../components/Section'

const ORANGE = '#E8620A'
const INK = '#1A1A1A'

function Block({ title, children }) {
  return (
    <div className="mb-8">
      <p
        className="font-josefin mb-3"
        style={{ fontSize: '0.6rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: ORANGE, fontWeight: 400 }}
      >
        {title}
      </p>
      {children}
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="mb-3">
      <p className="font-josefin mb-0.5" style={{ fontSize: '0.55rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A8A8A8' }}>
        {label}
      </p>
      <p className="font-nunito font-light text-sm" style={{ color: INK }}>
        {value}
      </p>
    </div>
  )
}

export default function ExperienceDetail() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const [copied, setCopied] = useState(false)
  const exp = getExperience(slug, lang)

  if (!exp) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-5">
        <Seo />
        <p className="font-josefin text-lg uppercase" style={{ letterSpacing: '0.15em', color: INK }}>
          {t('exp_not_found')}
        </p>
        <Link to="/explore" className="font-josefin uppercase text-sm" style={{ letterSpacing: '0.25em', color: ORANGE, textDecoration: 'underline' }}>
          ← {t('nav_explore')}
        </Link>
      </main>
    )
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main style={{ background: '#fafaf8', minHeight: '100vh' }}>
      <Seo title={`${exp.title} · Ananders`} />
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(240px, 45vw, 480px)', background: INK }}>
        <SmartImage src={exp.image_url} alt={exp.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.45)' }} />
        <div className="absolute top-5 left-5">
          <Link
            to="/explore"
            className="font-josefin uppercase flex items-center gap-2"
            style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)', minHeight: 'auto' }}
          >
            ← {t('nav_explore')}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p
              className="font-josefin mb-2"
              style={{ fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: ORANGE, fontWeight: 400 }}
            >
              {exp.location_country}
              {exp.location_city ? ` · ${exp.location_city}` : ''}
              {exp.type ? ` · ${exp.type}` : ''}
            </p>
            <h1
              className="font-josefin font-light mb-8"
              style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '0.06em', color: INK, lineHeight: 1.25 }}
            >
              {exp.title}
            </h1>

            <Block title={t('exp_detail_about')}>
              <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#2A2A2A', lineHeight: 1.9, fontStyle: exp.description ? 'normal' : 'italic' }}>
                {exp.description || t('exp_detail_no_description')}
              </p>
            </Block>

            <Block title={t('exp_detail_expect')}>
              <ul className="flex flex-col gap-2">
                {t('exp_expect_items').map((item) => (
                  <li key={item} className="flex gap-2.5 font-nunito font-light text-sm" style={{ color: '#2A2A2A', lineHeight: 1.7 }}>
                    <span style={{ color: ORANGE, flexShrink: 0 }}>·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <div className="flex gap-3 p-5 rounded-xl mb-8" style={{ background: 'rgba(200,168,50,0.04)', border: '0.5px solid rgba(200,168,50,0.2)' }}>
              <ShieldIcon color="#C8A832" size={16} />
              <p className="font-nunito font-light text-sm leading-relaxed" style={{ color: '#4A7560' }}>
                <span style={{ color: '#1A3028', fontWeight: 400 }}>{t('exp_safety_label')} </span>
                {t('exp_safety_body')}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap pt-4" style={{ borderTop: '0.5px solid rgba(45,82,66,0.1)' }}>
              <p className="font-josefin" style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6B6B6B' }}>
                {t('exp_share')}
              </p>
              <button
                onClick={copyLink}
                className="font-josefin uppercase px-3 py-1.5 rounded-full"
                style={{ fontSize: '0.58rem', letterSpacing: '0.2em', border: '0.5px solid rgba(232,98,10,0.3)', color: ORANGE, minHeight: 'auto' }}
              >
                {t('exp_copy_link')}
                {copied ? ' ✓' : ''}
              </button>
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <div className="p-5 rounded-xl mb-4" style={{ border: '0.5px solid rgba(232,98,10,0.15)', background: '#ffffff' }}>
                <DetailRow label={t('exp_detail_type')} value={exp.type} />
                <DetailRow label={t('exp_detail_duration')} value={exp.duration_label} />
              </div>
              <div className="p-5 rounded-xl" style={{ border: `1px solid ${ORANGE}`, background: 'rgba(232,98,10,0.03)' }}>
                <p
                  className="font-josefin mb-3"
                  style={{ fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: ORANGE, fontWeight: 400 }}
                >
                  {t('exp_contact_title')}
                </p>
                <p className="font-josefin text-sm mb-2" style={{ letterSpacing: '0.08em', color: INK }}>
                  {t('exp_contact_login_title')}
                </p>
                <p className="font-nunito font-light text-xs mb-4" style={{ color: '#6B6B6B', lineHeight: 1.7 }}>
                  {t('exp_contact_login_body')}
                </p>
                <Link
                  to="/join"
                  className="w-full text-center font-josefin uppercase py-3 rounded-md mb-3"
                  style={{ letterSpacing: '0.28em', background: ORANGE, color: '#ffffff', fontSize: '0.65rem', fontWeight: 400, minHeight: 'auto' }}
                >
                  {t('nav_join')}
                </Link>
                <p className="font-nunito font-light text-xs" style={{ color: '#A8A8A8', lineHeight: 1.6 }}>
                  {t('exp_contact_note')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
