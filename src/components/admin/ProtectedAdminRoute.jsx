import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Guards an admin route by role.
 * - Loading → tampilkan spinner
 * - Not logged in → redirect to /masuk
 * - Logged in but not admin role → redirect to /dashboard
 */
export default function ProtectedAdminRoute({ children }) {
  const { user, isAdminUser, loading, profileReady } = useAuth()

  // Tunggu sampai auth selesai DAN profile sudah di-fetch
  if (loading || !profileReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/masuk" replace />
  if (!isAdminUser) return <Navigate to="/dashboard" replace />

  return children
}
