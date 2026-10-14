// Piezas tipográficas repetidas en todas las páginas.

export function Eyebrow({ children, color = '#C8A832', className = 'mb-3' }) {
  return (
    <p
      className={`font-nunito font-semibold ${className}`}
      style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color }}
    >
      {children}
    </p>
  )
}

// Respeta los saltos de línea ("\n") de los títulos del diccionario.
export function Lines({ text }) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

export function DarkHero({ eyebrow, title, children, background = '#1A3028', maxWidth = 'max-w-4xl', className = 'py-14' }) {
  return (
    <div style={{ background }} className={`px-5 md:px-10 ${className}`}>
      <div className={`${maxWidth} mx-auto`}>
        <Eyebrow color="#C8A832">{eyebrow}</Eyebrow>
        <h1
          className="font-josefin font-thin mb-4"
          style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F0D8', lineHeight: 1.1 }}
        >
          <Lines text={title} />
        </h1>
        {children}
      </div>
    </div>
  )
}

export function SectionTitle({ children, className = '', style }) {
  return (
    <h2
      className={`font-josefin font-light ${className}`}
      style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A3028', ...style }}
    >
      {typeof children === 'string' ? <Lines text={children} /> : children}
    </h2>
  )
}

export function ShieldIcon({ color = '#2D5242', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7L12 2z" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="rgba(168,196,180,0.6)" strokeWidth="1.5" />
      <path d="M21 21l-4.35-4.35" stroke="rgba(168,196,180,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
