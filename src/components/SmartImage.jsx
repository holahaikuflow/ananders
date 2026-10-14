import { useState } from 'react'

// Las fotos no venían en la descarga; mientras falten se muestra un degradado de la paleta.
const FALLBACK = 'linear-gradient(135deg, #1A3028 0%, #2D5242 55%, #4A7560 100%)'

export default function SmartImage({ src, alt, className = '', style }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div role="img" aria-label={alt} className={className} style={{ ...style, background: FALLBACK }} />
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setFailed(true)} />
}
