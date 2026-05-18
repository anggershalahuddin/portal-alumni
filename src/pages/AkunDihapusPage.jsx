import { useEffect } from 'react'
import { UserX, Mail } from 'lucide-react'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import { useAuth } from '@/context/AuthContext'
import { useSiteConfig } from '@/context/SiteConfigContext'

export default function AkunDihapusPage() {
  const { signOut } = useAuth()
  const { config } = useSiteConfig()

  // Pastikan sesi bersih saat halaman ini dimuat
  useEffect(() => { signOut() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] px-4">
      <div className="w-full max-w-md text-center">

        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img src={logoUrl} alt="Logo Daarul Mughni" className="w-10 h-10 object-contain rounded" />
          <div className="text-left">
            <p className="text-sm font-extrabold text-[#0A2415] leading-tight">Portal Alumni</p>
            <p className="text-[11px] font-semibold text-[#1A5C38] leading-tight">Daarul Mughni</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-5">
            <UserX className="w-8 h-8 text-red-400" />
          </div>

          <h1 className="text-xl font-extrabold text-[#0A2415] mb-2">Akun Telah Dihapus</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Akun Anda telah dihapus oleh administrator portal. Jika Anda merasa ini adalah kesalahan, silakan hubungi admin.
          </p>

          <a
            href={`mailto:${config.emailKontak || 'ppdaaarulmughni@gmail.com'}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#1A5C38] text-sm font-semibold text-[#1A5C38] hover:bg-[#1A5C38] hover:text-white transition-colors mb-3"
          >
            <Mail className="w-4 h-4" />
            Hubungi Admin
          </a>

          <a
            href="/masuk"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Kembali ke Halaman Login
          </a>
        </div>
      </div>
    </div>
  )
}
