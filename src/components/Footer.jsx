import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import Logo from './Logo'

// En el sitio publicado los links legales apuntaban a "/" + texto en minúsculas (404).
// Se enlazan a las rutas reales; el tercero ("Legal") no tenía destino y se omite.
const LEGAL_ROUTES = ['/privacy', '/terms']

export default function Footer() {
  const { t } = useLang()
  const cols = t('footer_cols')
  const legal = t('footer_legal').slice(0, LEGAL_ROUTES.length)
  const dim = 'rgba(255,255,255,0.25)'

  return (
    <footer style={{ background: '#111111' }} className="px-6 md:px-12 pt-14 pb-7">
      <div className="max-w-5xl mx-auto">
        <div
          className="flex flex-col items-center text-center mb-10 pb-8"
          style={{ borderBottom: '0.5px solid rgba(232,98,10,0.15)' }}
        >
          <Logo dark={false} size="footer" />
          <p
            className="font-josefin text-xs mt-3 mb-4"
            style={{ letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(232,98,10,0.45)', fontWeight: 300 }}
          >
            {t('footer_tagline')}
          </p>
          <p className="font-nunito font-light text-xs leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
            {t('footer_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center md:text-left">
          {cols.map((col) => (
            <div key={col.title}>
              <p
                className="font-josefin text-xs mb-4"
                style={{ letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(232,98,10,0.4)', fontWeight: 400 }}
              >
                {col.title}
              </p>
              <div className="flex flex-col items-center md:items-start gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    className="font-nunito font-light text-xs transition-colors inline-block hover:!text-white/60"
                    style={{ color: dim, minHeight: 'auto' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col items-center gap-3 text-center"
          style={{ borderTop: '0.5px solid rgba(232,98,10,0.1)', paddingTop: '20px' }}
        >
          <span
            className="font-josefin text-xs"
            style={{ letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.15)' }}
          >
            © {new Date().getFullYear()} Ananders · {t('footer_copy')}
          </span>
          <div className="flex gap-5">
            {legal.map((label, i) => (
              <Link
                key={label}
                to={LEGAL_ROUTES[i]}
                className="font-josefin text-xs transition-colors hover:!text-white/40"
                style={{ letterSpacing: '0.2em', color: 'rgba(255,255,255,0.15)', minHeight: 'auto' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
