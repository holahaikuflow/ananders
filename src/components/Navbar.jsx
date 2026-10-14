import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import Logo, { ORANGE } from './Logo'
import LangToggle from './LangToggle'

const INK = '#1A1A1A'
const GRAY = '#6B6B6B'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { t } = useLang()
  const { session, user, profile, loading: authLoading, signOut } = useAuth()
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || ''
  const isFacilitator = profile?.rol === 'facilitator'
  const isSeeker = profile?.rol === 'seeker'
  const links = [
    { to: '/explore', label: t('nav_explore') },
    { to: '/guides', label: t('nav_guides') },
    { to: '/membership', label: t('nav_ananders') },
  ]

  return (
    <nav
      className="sticky top-0 z-50 px-5 md:px-10 py-3 flex items-center justify-between"
      style={{ background: '#ffffff', borderBottom: '0.5px solid rgba(232,98,10,0.15)' }}
    >
      <Link to="/" aria-label="Ananders" onClick={() => setOpen(false)}>
        <Logo />
      </Link>

      <div className="hidden md:flex items-center gap-7">
        {links.map(({ to, label }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className="font-josefin uppercase transition-colors"
              style={{
                letterSpacing: '0.25em',
                fontSize: '0.68rem',
                color: active ? ORANGE : GRAY,
                borderBottom: active ? `1.5px solid ${ORANGE}` : 'none',
                paddingBottom: active ? '2px' : '0',
                fontWeight: active ? 400 : 300,
                minHeight: 'auto',
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <LangToggle />
        {!authLoading && session ? (
          <>
            <span
              className="font-josefin uppercase"
              style={{ letterSpacing: '0.2em', color: GRAY, fontSize: '0.68rem', maxWidth: '9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              title={displayName}
            >
              {displayName}
            </span>
            <NavLink
              to="/perfil"
              className="font-josefin uppercase transition-colors"
              style={({ isActive }) => ({ letterSpacing: '0.25em', color: isActive ? ORANGE : GRAY, fontSize: '0.68rem', minHeight: 'auto', fontWeight: 300 })}
            >
              {t('nav_profile')}
            </NavLink>
            {isFacilitator && (
              <NavLink
                to="/mis-experiencias"
                className="font-josefin uppercase transition-colors"
                style={({ isActive }) => ({ letterSpacing: '0.25em', color: isActive ? ORANGE : GRAY, fontSize: '0.68rem', minHeight: 'auto', fontWeight: 300 })}
              >
                {t('nav_mis_exp')}
              </NavLink>
            )}
            {isSeeker && (
              <NavLink
                to="/mis-postulaciones"
                className="font-josefin uppercase transition-colors"
                style={({ isActive }) => ({ letterSpacing: '0.25em', color: isActive ? ORANGE : GRAY, fontSize: '0.68rem', minHeight: 'auto', fontWeight: 300 })}
              >
                {t('nav_mis_apps')}
              </NavLink>
            )}
            <button
              onClick={() => signOut()}
              className="font-josefin uppercase transition-colors"
              style={{ letterSpacing: '0.25em', color: GRAY, fontSize: '0.68rem', minHeight: 'auto', fontWeight: 300 }}
            >
              {t('nav_logout')}
            </button>
          </>
        ) : !authLoading && (
          <>
            <Link
              to="/login"
              className="font-josefin uppercase transition-colors"
              style={{ letterSpacing: '0.25em', color: GRAY, fontSize: '0.68rem', minHeight: 'auto', fontWeight: 300 }}
            >
              {t('nav_login')}
            </Link>
            <Link
              to="/join"
              className="font-josefin uppercase px-4 py-2 rounded-md transition-all"
              style={{ letterSpacing: '0.25em', background: ORANGE, color: '#ffffff', fontSize: '0.68rem', fontWeight: 400, minHeight: 'auto' }}
            >
              {t('nav_join')}
            </Link>
          </>
        )}
      </div>

      <div className="flex md:hidden items-center gap-3">
        <LangToggle />
        <button
          className="flex flex-col gap-1.5 p-1"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          style={{ minHeight: 'auto' }}
        >
          <span style={{ display: 'block', width: '22px', height: '1.5px', background: INK, transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(3px,3px)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '1.5px', background: INK, transition: 'all 0.2s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: open ? '22px' : '14px', height: '1.5px', background: INK, transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </div>

      {open && (
        <div
          className="absolute top-full left-0 w-full flex flex-col gap-5 py-7 px-8 md:hidden"
          style={{ background: '#ffffff', borderBottom: '0.5px solid rgba(232,98,10,0.15)' }}
        >
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="font-josefin uppercase"
              style={{ letterSpacing: '0.3em', color: INK, fontSize: '0.85rem', minHeight: 'auto', fontWeight: 300, justifyContent: 'flex-start' }}
            >
              {label}
            </Link>
          ))}
          <div style={{ height: '0.5px', background: 'rgba(232,98,10,0.15)' }} />
          {!authLoading && session ? (
            <>
              <span
                className="font-josefin uppercase"
                style={{ letterSpacing: '0.3em', color: GRAY, fontSize: '0.78rem', fontWeight: 300 }}
              >
                {displayName}
              </span>
              <Link
                to="/perfil"
                onClick={() => setOpen(false)}
                className="font-josefin uppercase"
                style={{ letterSpacing: '0.3em', color: GRAY, fontSize: '0.85rem', minHeight: 'auto', fontWeight: 300, justifyContent: 'flex-start' }}
              >
                {t('nav_profile')}
              </Link>
              {isFacilitator && (
                <Link
                  to="/mis-experiencias"
                  onClick={() => setOpen(false)}
                  className="font-josefin uppercase"
                  style={{ letterSpacing: '0.3em', color: GRAY, fontSize: '0.85rem', minHeight: 'auto', fontWeight: 300, justifyContent: 'flex-start' }}
                >
                  {t('nav_mis_exp')}
                </Link>
              )}
              {isSeeker && (
                <Link
                  to="/mis-postulaciones"
                  onClick={() => setOpen(false)}
                  className="font-josefin uppercase"
                  style={{ letterSpacing: '0.3em', color: GRAY, fontSize: '0.85rem', minHeight: 'auto', fontWeight: 300, justifyContent: 'flex-start' }}
                >
                  {t('nav_mis_apps')}
                </Link>
              )}
              <button
                onClick={() => { signOut(); setOpen(false) }}
                className="font-josefin uppercase text-left"
                style={{ letterSpacing: '0.3em', color: GRAY, fontSize: '0.85rem', minHeight: 'auto', fontWeight: 300, justifyContent: 'flex-start' }}
              >
                {t('nav_logout')}
              </button>
            </>
          ) : !authLoading && (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="font-josefin uppercase"
                style={{ letterSpacing: '0.3em', color: GRAY, fontSize: '0.85rem', minHeight: 'auto', fontWeight: 300, justifyContent: 'flex-start' }}
              >
                {t('nav_login')}
              </Link>
              <Link
                to="/join"
                onClick={() => setOpen(false)}
                className="font-josefin uppercase px-5 py-3 rounded-md text-center"
                style={{ letterSpacing: '0.3em', background: ORANGE, color: '#ffffff', fontSize: '0.8rem', fontWeight: 400, minHeight: 'auto' }}
              >
                {t('nav_join')}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
