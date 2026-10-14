import { useLang } from '../i18n/LanguageContext'
import { ORANGE } from './Logo'

export default function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex items-center rounded-sm overflow-hidden" style={{ border: '0.5px solid rgba(232,98,10,0.3)' }}>
      {['es', 'en'].map((code, i) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className="font-josefin uppercase px-2.5 py-1.5 transition-all"
          style={{
            letterSpacing: '0.18em',
            fontSize: '0.62rem',
            minHeight: 'auto',
            color: lang === code ? '#ffffff' : '#6B6B6B',
            background: lang === code ? ORANGE : 'transparent',
            borderRight: i === 0 ? '0.5px solid rgba(232,98,10,0.2)' : 'none',
            fontWeight: lang === code ? 400 : 300,
          }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
