import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { OG_IMAGE, SITE_URL } from '../config'

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [, name, key] = selector.match(/\[(.+?)="(.+?)"\]/)
    el.setAttribute(name, key)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

// Meta tags por ruta e idioma. Rutas sin entrada propia usan las del Home; `title` permite sobrescribir.
export default function Seo({ title: titleOverride }) {
  const { pathname } = useLocation()
  const { lang, seo } = useLang()
  const entry = seo[pathname] || seo['/']
  const title = titleOverride || entry.title
  const description = entry.description
  const url = `${SITE_URL}${pathname}`

  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[name="theme-color"]', 'content', '#1A3028')
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:image"]', 'content', OG_IMAGE)
    setMeta('meta[property="og:site_name"]', 'content', 'Ananders')
    setMeta('meta[property="og:locale"]', 'content', lang === 'es' ? 'es_ES' : 'en_US')
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('meta[name="twitter:image"]', 'content', OG_IMAGE)
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, url, lang])

  return null
}
