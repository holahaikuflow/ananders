import { useEffect, useMemo, useState } from 'react'
import { HERO_MEDIA } from '../config'

const GRADIENT = 'linear-gradient(180deg, #16281F 0%, #1A3028 50%, #16281F 100%)'
const TINT = 'rgba(16,28,23,0.55)'
const VIGNETTE = 'linear-gradient(to bottom, #101C17 0%, transparent 28%, transparent 72%, #101C17 100%)'

export default function HeroMedia() {
  const [failed, setFailed] = useState(false)
  const [current, setCurrent] = useState(0)

  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    []
  )

  const { mode, video, poster, images } = HERO_MEDIA

  const effectiveMode = useMemo(() => {
    if (failed || !mode) return 'gradient'
    if (mode === 'video' && (isMobile || prefersReducedMotion)) return 'poster'
    if (mode === 'carousel' && prefersReducedMotion) return 'first-image'
    return mode
  }, [failed, mode, isMobile, prefersReducedMotion])

  useEffect(() => {
    if (effectiveMode !== 'carousel' || !images || images.length <= 1) return
    const id = setInterval(() => setCurrent((i) => (i + 1) % images.length), 6000)
    return () => clearInterval(id)
  }, [effectiveMode, images])

  const renderContent = () => {
    switch (effectiveMode) {
      case 'poster':
      case 'first-image': {
        const src = effectiveMode === 'poster' ? poster : (images && images[0])
        if (!src) return <div style={{ position: 'absolute', inset: 0, background: GRADIENT }} />
        return (
          <img
            src={src}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setFailed(true)}
          />
        )
      }

      case 'video':
        return (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setFailed(true)}
          >
            <source src={video} />
          </video>
        )

      case 'carousel':
        if (!images || images.length === 0) return <div style={{ position: 'absolute', inset: 0, background: GRADIENT }} />
        return images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: i === current ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
            onError={i === 0 ? () => setFailed(true) : undefined}
          />
        ))

      default:
        return <div style={{ position: 'absolute', inset: 0, background: GRADIENT }} />
    }
  }

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      {renderContent()}
      <div style={{ position: 'absolute', inset: 0, background: TINT }} />
      <div style={{ position: 'absolute', inset: 0, background: VIGNETTE }} />
    </div>
  )
}
