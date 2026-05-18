import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_ROLES = ['super_admin', 'admin', 'editor']

/**
 * Melindungi route yang butuh login.
 * - Loading                    → spinner
 * - Tidak login                → /masuk
 * - Akun dinonaktifkan         → /akun-dinonaktifkan
 * - Registrasi belum selesai   → /daftar
 * - Status menunggu/ditolak    → /verifikasi-status
 * - Lolos                      → render children
 */
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
  </div>
)

export default function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth()

  // Tunggu auth selesai dimuat
  if (loading) return <Spinner />

  if (!user) return <Navigate to="/masuk" replace />

  // Profile belum tersedia (trigger Supabase belum selesai / fetch belum selesai)
  // Jangan redirect dulu — tunggu sampai profile ada
  if (!profile) return <Spinner />

  if (profile.is_active === false) {
    return <Navigate to="/akun-dinonaktifkan" replace />
  }

  // Registrasi belum selesai (no_hp kosong), kecuali admin tidak perlu isi /daftar
  if (!ADMIN_ROLES.includes(profile.role) && !profile.no_hp) {
    return <Navigate to="/daftar" replace />
  }

  const status = profile.status ?? null
  if (status === 'menunggu' || status === 'ditolak') {
    return <Navigate to={`/verifikasi-status?status=${status}`} replace />
  }

  return children
}
