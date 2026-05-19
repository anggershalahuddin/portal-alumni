import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldOff, Mail, LogOut } from 'lucide-react'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import { useAuth } from '@/context/AuthContext'

export default function AkunDinonaktifkanPage() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  // Auto-redirect ketika admin mengaktifkan kembali akun (poll 30 detik di AuthContext)
  useEffect(() => {
    if (profile && profile.is_active !== false) {
      navigate('/dashboard', { replace: true })
    }
  }, [profile, navigate])

  async function handleSignOut() {
    await signOut()
    window.location.href = '/masuk'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] px-4">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img src={logoUrl} alt="Logo Daarul Mughni" className="w-10 h-10 object-contain rounded" />
          <div className="text-left">
            <p className="text-sm font-extrabold text-[#0A2415] leading-tight">Portal Alumni</p>
            <p className="text-[11px] font-semibold text-[#1A5C38] leading-tight">Daarul Mughni</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5">
            <ShieldOff className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-xl font-extrabold text-[#0A2415] mb-2">Akun Dinonaktifkan</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-1">
            Akun Anda sementara dinonaktifkan oleh administrator portal.
          </p>
          {user?.email && (
            <p className="text-xs text-gray-400 mb-6">
              Email terdaftar: <span className="font-semibold text-gray-600">{user.email}</span>
            </p>
          )}

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
            <p className="text-xs font-bold text-amber-800 mb-1">Apa yang harus dilakukan?</p>
            <ul className="text-xs text-amber-700 space-y-1 leading-relaxed list-disc list-inside">
              <li>Hubungi administrator portal untuk informasi lebih lanjut</li>
              <li>Pastikan data profil Anda sudah lengkap dan valid</li>
              <li>Akun akan kembali aktif setelah admin mengaktifkannya kembali</li>
            </ul>
          </div>

          {/* Contact admin */}
          <a
            href="mailto:admin@daaarlmughni.com"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#1A5C38] text-sm font-semibold text-[#1A5C38] hover:bg-[#1A5C38] hover:text-white transition-colors mb-3"
          >
            <Mail className="w-4 h-4" />
            Hubungi Admin
          </a>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  )
}
