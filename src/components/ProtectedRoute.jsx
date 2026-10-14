import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { StarMark } from './Logo'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center bg-jungle">
        <StarMark size={32} style={{ opacity: 0.4, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </main>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}
