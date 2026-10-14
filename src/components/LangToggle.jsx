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
          className="font-nunito font-semibold uppercase px-2.5 py-1.5 transition-all"
          style={{
            letterSpacing: '0.16em',
            fontSize: '0.72rem',
            minHeight: 'auto',
            color: lang === code ? '#ffffff' : '#4C5A4E',
            background: lang === code ? ORANGE : 'transparent',
            borderRight: i === 0 ? '0.5px solid rgba(232,98,10,0.2)' : 'none',
          }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
