import { Link } from 'react-router-dom'
import SmartImage from './SmartImage'

export default function ExperienceCard({ exp }) {
  return (
    <Link to={`/experience/${exp.slug}`} className="group block" style={{ display: 'block' }}>
      <div
        className="rounded-xl overflow-hidden transition-all duration-300 h-full"
        style={{ border: '0.5px solid rgba(45,82,66,0.15)', background: 'white', boxShadow: '0 2px 12px rgba(26,48,40,0.06)' }}
      >
        <div className="relative overflow-hidden" style={{ height: '180px' }}>
          <SmartImage
            src={exp.image_url}
            alt={exp.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <p
            className="font-josefin mb-1.5"
            style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#4A7560', fontWeight: 400 }}
          >
            {exp.location_country}
            {exp.location_city ? ` · ${exp.location_city}` : ''}
          </p>
          <h3 className="font-josefin font-light text-sm mb-2" style={{ letterSpacing: '0.06em', color: '#1A3028' }}>
            {exp.title}
          </h3>
          <p className="font-nunito font-light text-xs italic" style={{ color: '#4A7560' }}>
            {exp.type}
          </p>
        </div>
        <div className="px-4 pb-4 pt-3" style={{ borderTop: '0.5px solid rgba(45,82,66,0.1)' }}>
          <span className="font-josefin" style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: '#5C8A72', fontWeight: 400 }}>
            {exp.duration_label}
          </span>
        </div>
      </div>
    </Link>
  )
}
