import { Link } from 'react-router-dom'

const TYPE_COLORS = {
  'ayahuasca':  '#1E3329',
  'psilocibina':'#2B4337',
  'yoga':       '#4A7560',
  'vipassana':  '#26382F',
  'sufismo':    '#5C5A3A',
  'otro':       '#35564A',
}
const DEFAULT_BLOCK_COLOR = '#2B4337'

export default function ExperienceCard({ exp }) {
  const blockColor = TYPE_COLORS[exp.type_key] || DEFAULT_BLOCK_COLOR

  return (
    <Link to={`/experience/${exp.slug}`} className="group block" style={{ display: 'block' }}>
      <div
        className="rounded-xl overflow-hidden transition-shadow duration-300 group-hover:shadow-lg h-full"
        style={{ border: '0.5px solid #D8D0B8', background: '#FAF6EA' }}
      >
        {/* Color block — siempre visible. La imagen lo cubre si existe y carga. */}
        <div className="relative" style={{ height: '168px', background: blockColor }}>
          {exp.image_url && (
            <img
              src={exp.image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.opacity = '0' }}
            />
          )}
          {/* País — abajo izquierda */}
          <p
            className="absolute bottom-3 left-4 font-josefin leading-none"
            style={{ fontWeight: 200, fontSize: '32px', letterSpacing: '0.14em', color: '#F4EFE1', textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
          >
            {exp.location_country}
          </p>
          {/* Duración — abajo derecha */}
          <p
            className="absolute bottom-4 right-4 font-josefin"
            style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(244,239,225,0.65)', textTransform: 'uppercase', fontWeight: 300, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
          >
            {exp.duration_label}
          </p>
        </div>

        {/* Info block */}
        <div className="p-4">
          <p
            className="font-nunito font-semibold mb-1.5"
            style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8A7A3E' }}
          >
            {exp.type}
          </p>
          <h3
            className="font-josefin mb-2"
            style={{ fontSize: '19px', fontWeight: 400, letterSpacing: '0.02em', color: '#101C17', lineHeight: 1.3 }}
          >
            {exp.title}
          </h3>
          <p className="font-nunito text-xs" style={{ color: '#5B6A5D' }}>
            {exp.location_city ? `${exp.location_city}, ${exp.location_country}` : exp.location_country}
          </p>
        </div>
      </div>
    </Link>
  )
}
