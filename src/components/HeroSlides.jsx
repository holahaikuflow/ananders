import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import SmartImage from './SmartImage'

export default function HeroSlides() {
  const { t } = useLang()
  const [current, setCurrent] = useState(0)
  const slides = [
    { img: '/images/hero-door.jpg', caption: t('hero_slide1') },
    { img: '/images/exp-yoga-beach.jpg', caption: t('hero_slide2') },
    { img: '/images/about-spiral.jpg', caption: t('hero_slide3') },
  ]

  useEffect(() => {
    const id = setInterval(() => setCurrent((i) => (i + 1) % slides.length), 5500)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <div className="absolute inset-0">
      {slides.map((s, i) => (
        <div key={s.img} className="absolute inset-0" style={{ opacity: i === current ? 1 : 0, transition: 'opacity 1.2s ease-in-out' }}>
          <SmartImage src={s.img} alt={s.caption} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(13,22,16,0.58)' }} />
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 gap-2 z-10 hidden md:flex">
        {slides.map((s, i) => (
          <button
            key={s.img}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              height: '5px',
              borderRadius: '3px',
              minHeight: 'auto',
              width: i === current ? '24px' : '5px',
              background: i === current ? 'var(--an-dew)' : 'rgba(240,228,152,0.35)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
