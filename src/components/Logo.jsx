export const ORANGE = '#E8620A'
const STAR_POINTS = '50,5 58,30 85,30 63,47 71,72 50,56 29,72 37,47 15,30 42,30'

export function StarMark({ size = 22, color = ORANGE, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} style={style} aria-hidden="true">
      <polygon points={STAR_POINTS} fill={color} />
    </svg>
  )
}

export default function Logo({ dark = true, size = 'nav' }) {
  const isNav = size === 'nav'
  return (
    <div className={`flex items-center ${isNav ? 'gap-2.5' : 'gap-2 justify-center'}`}>
      <StarMark size={isNav ? 22 : 18} />
      <span
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 200,
          fontSize: isNav ? '1.1rem' : '1rem',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: dark ? '#1A1A1A' : '#ffffff',
        }}
      >
        Ananders
      </span>
    </div>
  )
}
