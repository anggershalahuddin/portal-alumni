import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_ROLES = ['super_admin', 'admin', 'editor']

/**
 * Route khusus tamu (belum login).
 * Jika sudah login → redirect ke halaman yang sesuai.
 */
export default function GuestRoute({ children }) {
  const { user, profile, loading, profileReady } = useAuth()

  if (loading || !profileReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return children

  // User baru login tapi profile belum selesai di-fetch (gap ~800ms di AuthContext)
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const role   = profile?.role   ?? null
  const status = profile?.status ?? null

  // Admin: langsung ke pilih-dashboard
  if (ADMIN_ROLES.includes(role)) return <Navigate to="/pilih-dashboard" replace />

  // Registrasi belum selesai (Google OAuth belum isi form /daftar)
  if (!profile?.no_hp) return <Navigate to="/daftar" replace />

  if (status === 'menunggu' || status === 'ditolak') {
    return <Navigate to={`/verifikasi-status?status=${status}`} replace />
  }
  return <Navigate to="/dashboard" replace />
}
