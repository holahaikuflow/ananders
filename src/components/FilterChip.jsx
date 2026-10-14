export default function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="font-josefin px-3 py-1.5 rounded-full transition-all text-left"
      style={{
        fontSize: '0.65rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        minHeight: 'auto',
        justifyContent: 'flex-start',
        border: `0.5px solid ${active ? '#2D5242' : 'rgba(45,82,66,0.18)'}`,
        background: active ? '#2D5242' : 'transparent',
        color: active ? '#F0E498' : '#4A7560',
        fontWeight: active ? 400 : 300,
      }}
    >
      {label}
    </button>
  )
}
