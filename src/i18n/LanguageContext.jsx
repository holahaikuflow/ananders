import { createContext, useContext, useEffect, useState } from 'react'
import es, { seo as seoEs } from './es'
import en, { seo as seoEn } from './en'
import { CONTACT_EMAIL } from '../config'

const dictionaries = { es, en }
const seoByLang = { es: seoEs, en: seoEn }
const STORAGE_KEY = 'ananders.lang'
const EMAIL_PENDING = { es: '[email de contacto pendiente]', en: '[contact email pending]' }

const LanguageContext = createContext(null)

function readStoredLang() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return v === 'en' || v === 'es' ? v : 'es'
  } catch {
    return 'es'
  }
}

function fillTokens(value, lang) {
  if (typeof value === 'string') {
    return value.replaceAll('{{CONTACT_EMAIL}}', CONTACT_EMAIL || EMAIL_PENDING[lang])
  }
  if (Array.isArray(value)) return value.map((v) => fillTokens(v, lang))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillTokens(v, lang)]))
  }
  return value
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  function setLang(next) {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Sin almacenamiento disponible: el idioma vale solo para esta visita.
    }
  }

  function t(key) {
    const value = dictionaries[lang][key] ?? dictionaries.es[key]
    return value === undefined ? key : fillTokens(value, lang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, seo: seoByLang[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
