import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Shield, GraduationCap } from 'lucide-react'
import heroImg from '@/assets/hero.jpg'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: Supabase auth
    navigate('/')
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-end w-[46%] relative overflow-hidden p-10">
        {/* Background foto */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        {/* Overlay hijau vibrant */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(42,122,79,0.82) 0%, rgba(26,92,56,0.90) 50%, rgba(10,36,21,0.97) 100%)',
          }}
        />

        {/* Semua konten di bawah */}
        <div className="relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
            style={{ border: '1.5px solid rgba(240,165,0,0.7)', backgroundColor: 'rgba(240,165,0,0.1)' }}
          >
            <Shield className="w-3.5 h-3.5" style={{ color: '#F0A500' }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: '#F0A500' }}>
              RESMI &amp; TERVERIFIKASI
            </span>
          </div>

          <h1 className="text-[2.6rem] font-extrabold text-white leading-tight mb-4">
            Kembali ke Rumah,<br />
            Terhubung dengan Umat.
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-sm mb-7">
            Portal Alumni Daarul Mughni adalah wadah resmi untuk merajut kembali silaturahim,
            berbagi peluang karir, dan berkontribusi bagi almamater tercinta.
          </p>

          {/* Avatars */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=48&h=48&q=80&crop=faces',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=48&h=48&q=80&crop=faces',
                'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=48&h=48&q=80&crop=faces',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="text-white/85 text-sm">
              Bergabung dengan{' '}
              <span className="font-extrabold" style={{ color: '#F0A500' }}>5,000+</span>{' '}
              alumni lainnya.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative">
        {/* Mobile background (shown only on small screens) */}
        <div className="lg:hidden absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(10,36,21,0.80) 0%, rgba(10,36,21,0.88) 100%)' }} />
        </div>
        <div className="w-full max-w-[420px] relative z-10 bg-white rounded-2xl p-7 shadow-2xl lg:shadow-none lg:rounded-none lg:p-0 lg:bg-transparent">
          <h2 className="text-[1.9rem] font-extrabold text-gray-900 mb-1 leading-tight">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-500 text-sm mb-7">
            Silakan masuk ke akun Anda untuk melihat update terbaru.
          </p>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-sm transition-all hover:brightness-95 mb-5"
            style={{ backgroundColor: '#F0A500', color: '#0A2415' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.18em]">ATAU DENGAN EMAIL</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all placeholder:text-gray-400"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1A5C38'
                    e.target.style.backgroundColor = '#fff'
                    e.target.style.boxShadow = '0 0 0 3px rgba(26,92,56,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.backgroundColor = '#f9fafb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Kata Sandi</label>
                <button type="button" className="text-xs font-semibold" style={{ color: '#F0A500' }}>
                  Lupa sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all placeholder:text-gray-400"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1A5C38'
                    e.target.style.backgroundColor = '#fff'
                    e.target.style.boxShadow = '0 0 0 3px rgba(26,92,56,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.backgroundColor = '#f9fafb'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110 mt-1"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Masuk Sekarang
            </button>
          </form>

          {/* Info box */}
          <div
            className="mt-5 flex gap-3 p-4 rounded-xl"
            style={{ backgroundColor: '#F8FAF9', border: '1px solid #d1e7da' }}
          >
            <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#1A5C38' }} />
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Penting:</span> Seluruh akun baru akan
              melalui proses verifikasi manual oleh Admin Pesantren. Profil Anda baru akan tampil
              di direktori publik setelah status verifikasi disetujui.
            </p>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun alumni?{' '}
            <Link to="/daftar" className="font-bold" style={{ color: '#F0A500' }}>
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
