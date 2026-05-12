import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, CheckCircle, ChevronDown } from 'lucide-react'
import heroImg from '../assets/hero.jpg'

const ANGKATAN_LIST = Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i)

const inputStyle = {
  base: 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white',
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputStyle.base}
      onFocus={(e) => (e.target.style.borderColor = '#1A5C38')}
      onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
    />
  )
}

export default function DaftarPage() {
  const [form, setForm] = useState({ nama: '', email: '', hp: '', angkatan: '', bidang: '', password: '', konfirmasi: '' })
  const [showPass, setShowPass] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const isValid =
    form.nama && form.email && form.angkatan && form.bidang &&
    form.password.length >= 8 && form.password === form.konfirmasi

  function handleSubmit(e) {
    e.preventDefault()
    if (isValid) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A2415] mb-2">Pendaftaran Berhasil!</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Data Anda telah terkirim. Tim admin akan memverifikasi akun dalam <strong>1–3 hari kerja</strong>. Notifikasi dikirim ke{' '}
            <span className="font-semibold text-[#1A5C38]">{form.email}</span>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-bold text-amber-800 mb-0.5">Status: Menunggu Verifikasi</p>
            <p className="text-xs text-amber-700 leading-relaxed">Akun Anda akan aktif setelah disetujui oleh admin portal.</p>
          </div>
          <Link
            to="/masuk"
            className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white text-center hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A5C38' }}
          >
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-end w-[44%] relative overflow-hidden p-12 pb-14 flex-shrink-0">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(42,122,79,0.82) 0%, rgba(26,92,56,0.90) 50%, rgba(10,36,21,0.97) 100%)' }}
        />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0A500]" /> Bergabung Sekarang
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
            Gabung Komunitas<br />Alumni Daarul Mughni
          </h2>
          <p className="text-white/65 text-sm leading-relaxed mb-8">
            Daftarkan diri dan terhubung dengan ribuan alumni dari seluruh Indonesia. Bangun jejaring, temukan peluang karir, dan tetap dekat dengan almamater.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {['AZ', 'MR', 'SF', 'NI'].map((init) => (
                <div
                  key={init}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: '#2A7A4F' }}
                >
                  {init}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-xs">5.000+ alumni telah bergabung</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-12 lg:px-14 py-10 bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#F0A500] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#0A2415]" />
            </div>
            <span className="text-sm font-bold text-[#0A2415]">Portal Alumni Daarul Mughni</span>
          </Link>

          <h1 className="text-2xl font-extrabold text-[#0A2415] mb-1">Buat Akun Baru</h1>
          <p className="text-sm text-gray-400 mb-6">Lengkapi data diri Anda untuk mendaftar sebagai alumni.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nama Lengkap">
              <TextInput value={form.nama} onChange={set('nama')} placeholder="Sesuai KTP" />
            </Field>

            <Field label="Email">
              <TextInput value={form.email} onChange={set('email')} placeholder="email@contoh.com" type="email" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="No. HP / WhatsApp">
                <TextInput value={form.hp} onChange={set('hp')} placeholder="08xxxxxxxxxx" type="tel" />
              </Field>
              <Field label="Angkatan">
                <div className="relative">
                  <select
                    value={form.angkatan}
                    onChange={set('angkatan')}
                    className={inputStyle.base + ' appearance-none pr-8'}
                    onFocus={(e) => (e.target.style.borderColor = '#1A5C38')}
                    onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                  >
                    <option value="">Pilih tahun</option>
                    {ANGKATAN_LIST.map((y) => (
                      <option key={y} value={y}>{y} (Ke-{y - 2005})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </Field>
            </div>

            <Field label="Bidang / Profesi Saat Ini">
              <TextInput value={form.bidang} onChange={set('bidang')} placeholder="contoh: Teknik Informatika, Kedokteran..." />
            </Field>

            <Field label="Kata Sandi">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 karakter"
                  className={inputStyle.base + ' pr-11'}
                  onFocus={(e) => (e.target.style.borderColor = '#1A5C38')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>

            <Field label="Konfirmasi Kata Sandi">
              <div className="relative">
                <input
                  type={showKonfirmasi ? 'text' : 'password'}
                  value={form.konfirmasi}
                  onChange={set('konfirmasi')}
                  placeholder="Ulangi kata sandi"
                  className={inputStyle.base + ' pr-11'}
                  onFocus={(e) => (e.target.style.borderColor = '#1A5C38')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                />
                <button type="button" onClick={() => setShowKonfirmasi(!showKonfirmasi)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showKonfirmasi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.konfirmasi && form.password !== form.konfirmasi && (
                <p className="text-xs text-red-500 mt-1">Kata sandi tidak cocok</p>
              )}
            </Field>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40 mt-2"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Daftar Sekarang
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            Sudah punya akun?{' '}
            <Link to="/masuk" className="font-bold hover:underline" style={{ color: '#1A5C38' }}>
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
