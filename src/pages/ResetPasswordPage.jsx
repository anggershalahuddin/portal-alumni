import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle2 } from 'lucide-react'
import heroImg from '@/assets/hero.jpg'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase JS v2 auto-exchanges the recovery code from URL and fires PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    // Also check existing session (in case event already fired)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.')
      return
    }
    if (password !== confirm) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setLoading(false)
      setError(err.message)
      return
    }
    await supabase.auth.signOut()
    setLoading(false)
    setDone(true)
    setTimeout(() => navigate('/masuk', { replace: true }), 3000)
  }

  const inputFocus = (e) => {
    e.target.style.borderColor = '#1A5C38'
    e.target.style.backgroundColor = '#fff'
    e.target.style.boxShadow = '0 0 0 3px rgba(26,92,56,0.1)'
  }
  const inputBlur = (e) => {
    e.target.style.borderColor = '#e5e7eb'
    e.target.style.backgroundColor = '#f9fafb'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-end w-[46%] relative overflow-hidden p-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(42,122,79,0.82) 0%, rgba(26,92,56,0.90) 50%, rgba(10,36,21,0.97) 100%)' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5" style={{ border: '1.5px solid rgba(240,165,0,0.7)', backgroundColor: 'rgba(240,165,0,0.1)' }}>
            <Shield className="w-3.5 h-3.5" style={{ color: '#F0A500' }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: '#F0A500' }}>KEAMANAN AKUN</span>
          </div>
          <h1 className="text-[2.6rem] font-extrabold text-white leading-tight mb-4">
            Buat Kata Sandi<br />yang Kuat & Aman.
          </h1>
          <p className="text-white/75 text-base leading-relaxed max-w-sm">
            Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk kata sandi yang lebih aman.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative">
        <div className="lg:hidden absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(10,36,21,0.80) 0%, rgba(10,36,21,0.88) 100%)' }} />
        </div>
        <div className="w-full max-w-[420px] relative z-10 bg-white rounded-2xl p-7 shadow-2xl lg:shadow-none lg:rounded-none lg:p-0 lg:bg-transparent">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logoUrl} alt="Logo Daarul Mughni" className="w-9 h-9 object-contain rounded flex-shrink-0" />
              <div>
                <p className="text-sm font-extrabold text-[#0A2415] leading-tight">Portal Alumni</p>
                <p className="text-[10px] font-semibold text-[#1A5C38] leading-tight">Daarul Mughni</p>
              </div>
            </Link>
          </div>

          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#E8F5EE' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: '#1A5C38' }} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Kata Sandi Berhasil Diubah!</h2>
              <p className="text-sm text-gray-500 mb-6">Anda akan dialihkan ke halaman login dalam beberapa detik...</p>
              <Link to="/masuk" className="w-full block py-3 rounded-xl font-bold text-sm text-white text-center" style={{ backgroundColor: '#1A5C38' }}>
                Masuk Sekarang
              </Link>
            </div>
          ) : !ready ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 border-4 border-[#1A5C38] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-500">Memverifikasi link reset...</p>
              <p className="text-xs text-gray-400 mt-2">Pastikan Anda membuka link langsung dari email.</p>
            </div>
          ) : (
            <>
              <h2 className="text-[1.9rem] font-extrabold text-gray-900 mb-1 leading-tight">Buat Kata Sandi Baru</h2>
              <p className="text-gray-500 text-sm mb-7">Masukkan kata sandi baru untuk akun Anda.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kata Sandi Baru</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 karakter"
                      required
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all placeholder:text-gray-400"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Konfirmasi Kata Sandi</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      required
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all placeholder:text-gray-400"
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#1A5C38' }}
                >
                  {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
