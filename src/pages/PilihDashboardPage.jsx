import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, GraduationCap, ChevronRight, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import logoUrl from '@/assets/Logo DM Fix.jpg'

const ADMIN_ROLES = ['super_admin', 'admin', 'editor']

export default function PilihDashboardPage() {
  const { user, profile, loading, profileReady, signOut } = useAuth()
  const navigate = useNavigate()

  // Kalau bukan admin, langsung ke dashboard alumni
  useEffect(() => {
    if (!loading && profileReady && profile && !ADMIN_ROLES.includes(profile.role)) {
      navigate('/dashboard', { replace: true })
    }
  }, [loading, profileReady, profile, navigate])

  // Tampilkan spinner sampai profile selesai di-fetch
  if (loading || !profileReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  async function handleLogout() {
    await signOut()
    window.location.href = '/masuk'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#F1F5F9' }}>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-10"
      >
        <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
        <span className="font-bold text-gray-800 text-base">Portal Alumni Daarul Mughni</span>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-lg font-bold"
            style={{ backgroundColor: '#0A2415' }}
          >
            {user?.initials ?? 'A'}
          </div>
          <p className="text-base font-bold text-gray-900">{user?.name ?? 'Halo!'}</p>
          <p className="text-sm text-gray-400 mt-0.5">Pilih dashboard yang ingin dibuka</p>
        </div>

        <div className="space-y-3">
          {/* Admin */}
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent hover:border-green-200 hover:bg-green-50/60 transition-all group text-left"
            style={{ backgroundColor: '#F0FDF4' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#1A5C38' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">Dashboard Admin</p>
              <p className="text-xs text-gray-500 mt-0.5">Kelola konten, pengguna & data portal</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-700 transition-colors flex-shrink-0" />
          </button>

          {/* Alumni */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent hover:border-amber-200 hover:bg-amber-50/60 transition-all group text-left"
            style={{ backgroundColor: '#FFFBEB' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#F0A500' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">Dashboard Alumni</p>
              <p className="text-xs text-gray-500 mt-0.5">Lihat profil, lowongan & komunitas</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors flex-shrink-0" />
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari akun
        </button>
      </motion.div>
    </div>
  )
}
