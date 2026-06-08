import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye, EyeOff, CheckCircle,
  ChevronDown, Upload, X, Camera, AlertCircle, Lock, ArrowLeft,
} from 'lucide-react'
import heroImg from '../assets/hero.jpg'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/toast'
import CitySelect from '@/components/ui/CitySelect'

const DOMISILI_GROUPS = [
  { label: 'DKI Jakarta', cities: ['Jakarta Pusat', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Utara'] },
  { label: 'Jawa Barat', cities: ['Bandung', 'Bekasi', 'Bogor', 'Cimahi', 'Cirebon', 'Depok', 'Garut', 'Indramayu', 'Karawang', 'Purwakarta', 'Sukabumi', 'Tasikmalaya'] },
  { label: 'Banten', cities: ['Cilegon', 'Serang', 'Tangerang', 'Tangerang Selatan'] },
  { label: 'Jawa Tengah', cities: ['Magelang', 'Pekalongan', 'Salatiga', 'Semarang', 'Surakarta', 'Tegal'] },
  { label: 'DI Yogyakarta', cities: ['Bantul', 'Gunungkidul', 'Kulon Progo', 'Sleman', 'Yogyakarta'] },
  { label: 'Jawa Timur', cities: ['Banyuwangi', 'Blitar', 'Gresik', 'Jember', 'Kediri', 'Madiun', 'Malang', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Sidoarjo', 'Surabaya'] },
  { label: 'Aceh', cities: ['Banda Aceh', 'Lhokseumawe', 'Sabang'] },
  { label: 'Sumatera Utara', cities: ['Binjai', 'Medan', 'Padangsidimpuan', 'Pematangsiantar', 'Sibolga', 'Tanjungbalai', 'Tebing Tinggi'] },
  { label: 'Sumatera Barat', cities: ['Bukittinggi', 'Padang', 'Padangpanjang', 'Pariaman', 'Payakumbuh', 'Sawahlunto', 'Solok'] },
  { label: 'Riau', cities: ['Dumai', 'Pekanbaru'] },
  { label: 'Kepulauan Riau', cities: ['Batam', 'Tanjungpinang'] },
  { label: 'Jambi', cities: ['Jambi', 'Sungai Penuh'] },
  { label: 'Sumatera Selatan', cities: ['Lubuklinggau', 'Pagar Alam', 'Palembang', 'Prabumulih'] },
  { label: 'Bengkulu', cities: ['Bengkulu'] },
  { label: 'Lampung', cities: ['Bandar Lampung', 'Metro'] },
  { label: 'Kepulauan Bangka Belitung', cities: ['Pangkalpinang'] },
  { label: 'Bali', cities: ['Denpasar'] },
  { label: 'Nusa Tenggara Barat', cities: ['Bima', 'Mataram'] },
  { label: 'Nusa Tenggara Timur', cities: ['Kupang'] },
  { label: 'Kalimantan Barat', cities: ['Pontianak', 'Singkawang'] },
  { label: 'Kalimantan Tengah', cities: ['Palangkaraya'] },
  { label: 'Kalimantan Selatan', cities: ['Banjarbaru', 'Banjarmasin'] },
  { label: 'Kalimantan Timur', cities: ['Balikpapan', 'Bontang', 'Samarinda'] },
  { label: 'Kalimantan Utara', cities: ['Tarakan'] },
  { label: 'Gorontalo', cities: ['Gorontalo'] },
  { label: 'Sulawesi Utara', cities: ['Bitung', 'Kotamobagu', 'Manado', 'Tomohon'] },
  { label: 'Sulawesi Tengah', cities: ['Palu'] },
  { label: 'Sulawesi Selatan', cities: ['Makassar', 'Palopo', 'Parepare'] },
  { label: 'Sulawesi Tenggara', cities: ['Bau-Bau', 'Kendari'] },
  { label: 'Sulawesi Barat', cities: ['Mamuju'] },
  { label: 'Maluku', cities: ['Ambon', 'Tual'] },
  { label: 'Maluku Utara', cities: ['Ternate', 'Tidore Kepulauan'] },
  { label: 'Papua', cities: ['Jayapura'] },
  { label: 'Papua Barat', cities: ['Manokwari', 'Sorong'] },
  { label: 'Luar Negeri', cities: ['Luar Negeri'] },
]

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white'
const focusStyle = { borderColor: '#1A5C38' }
const blurStyle  = { borderColor: '#E5E7EB' }

function Field({ label, required, badge, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400">*</span>}
        {badge && (
          <span className="flex items-center gap-0.5 text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full normal-case tracking-normal ml-auto">
            <Lock className="w-2.5 h-2.5" /> Admin
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={inputCls}
      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
      onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
    />
  )
}

function SelectInput({ value, onChange, required, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={inputCls + ' appearance-none pr-8'}
        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
        onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
      <span className="flex-1 h-px bg-gray-100" />
      {children}
      <span className="flex-1 h-px bg-gray-100" />
    </p>
  )
}

const DOC_SLOTS = [
  {
    key: 'bukti',
    icon: Camera,
    label: 'Foto Bukti Alumni',
    desc: 'Memegang ijazah/raport pesantren atau berseragam Daarul Mughni',
    accept: 'image/jpeg,image/webp',
    maxMB: 2,
    required: true,
  },
]

function DocSlot({ slot, file, onSelect, onRemove }) {
  const ref = useRef()
  const Icon = slot.icon
  const hasFile = !!file

  return (
    <div
      className={`relative rounded-xl border-2 transition-all ${
        hasFile
          ? 'border-green-400 bg-green-50'
          : 'border-dashed border-gray-200 bg-gray-50 hover:border-[#1A5C38] hover:bg-green-50/30'
      }`}
    >
      {slot.required && (
        <span className="absolute -top-2 right-3 text-[9px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
          Wajib
        </span>
      )}
      <div className="p-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: hasFile ? '#D1FAE5' : '#F3F4F6' }}
          >
            {hasFile
              ? <CheckCircle className="w-4 h-4 text-green-600" />
              : <Icon className="w-4 h-4 text-gray-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{slot.label}</p>
            {hasFile ? (
              <p className="text-xs text-green-700 font-medium truncate mt-0.5">{file.name}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{slot.desc}</p>
            )}
          </div>
          {hasFile ? (
            <button
              type="button"
              onClick={onRemove}
              className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-3 h-3 text-red-500" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => ref.current.click()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0"
              style={{ borderColor: '#1A5C38', color: '#1A5C38' }}
            >
              <Upload className="w-3 h-3" /> Pilih
            </button>
          )}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept={slot.accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (!f) return
          const maxBytes = (slot.maxMB ?? 2) * 1024 * 1024
          if (f.size > maxBytes) {
            toast(`Ukuran file melebihi batas ${slot.maxMB ?? 2} MB. Kompres foto terlebih dahulu.`, 'warning')
          } else {
            onSelect(f)
          }
          e.target.value = ''
        }}
      />
    </div>
  )
}

export default function DaftarPage() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle, supaUser, loading: authLoading, profileReady, profile, refreshProfile } = useAuth()

  // Google OAuth mode: user already authenticated
  const isGoogleMode = !!supaUser

  async function handleGoogleDaftar() {
    await signInWithGoogle({
      redirectTo: `${window.location.origin}/auth/callback?mode=daftar`,
    })
  }

  const [angkatanList, setAngkatanList] = useState([])

  useEffect(() => {
    supabase
      .from('angkatan')
      .select('id, tahun_lulus, nama_angkatan')
      .order('tahun_lulus', { ascending: true })
      .then(({ data }) => { if (data) setAngkatanList(data) })
  }, [])

  const [form, setForm] = useState({
    nama: '', email: '', hp: '', angkatan: '',
    tempatLahir: '', tanggalLahir: '',
    domisili: '', alamat: '',
    password: '', konfirmasi: '',
  })
  const [docs, setDocs] = useState({ bukti: null })
  const [showPass, setShowPass] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Pre-fill form from Google metadata once session loads
  useEffect(() => {
    if (supaUser) {
      const googleName = supaUser.user_metadata?.full_name ?? supaUser.user_metadata?.name ?? ''
      setForm(f => ({ ...f, nama: googleName, email: supaUser.email ?? '' }))
    }
  }, [supaUser])

  // Redirect authenticated user who has already completed registration
  // (skip after form submission to avoid overriding the success screen)
  useEffect(() => {
    if (submitted) return
    if (!authLoading && profileReady && supaUser && profile?.no_hp) {
      const status = profile?.status ?? 'menunggu'
      if (status === 'disetujui') navigate('/dashboard', { replace: true })
      else navigate(`/verifikasi-status?status=${status}`, { replace: true })
    }
  }, [authLoading, profileReady, supaUser, profile, navigate, submitted])

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const passwordOk   = form.password.length >= 8
  const konfirmasiOk = form.password === form.konfirmasi
  const docsOk       = !!docs.bukti

  const isValid = isGoogleMode
    ? form.nama && form.hp && form.angkatan &&
      form.tempatLahir && form.tanggalLahir &&
      form.domisili && form.alamat && docsOk
    : form.nama && form.email && form.hp && form.angkatan &&
      form.tempatLahir && form.tanggalLahir &&
      form.domisili && form.alamat &&
      passwordOk && konfirmasiOk && docsOk

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError('')

    if (isGoogleMode) {
      // Google mode: update existing profile row
      try {
        const { error: updateErr } = await supabase.from('profiles').update({
          nama_lengkap:   form.nama,
          no_hp:          form.hp,
          angkatan:       Number(form.angkatan),
          tempat_lahir:   form.tempatLahir,
          tanggal_lahir:  form.tanggalLahir,
          domisili:       form.domisili,
          alamat_lengkap: form.alamat,
          status:         'menunggu',
        }).eq('id', supaUser.id)

        if (updateErr) throw updateErr

        if (docs.bukti) {
          const ext      = docs.bukti.name.split('.').pop().toLowerCase()
          const filePath = `${supaUser.id}/foto_bukti.${ext}`
          const { error: uploadErr } = await supabase.storage
            .from('documents')
            .upload(filePath, docs.bukti, { contentType: docs.bukti.type, upsert: true })
          if (!uploadErr) {
            await supabase.from('dokumen_verifikasi').insert({
              user_id:    supaUser.id,
              jenis:      'foto_bukti',
              file_url:   filePath,
              auto_hapus: true,
            })
          }
        }

        setLoading(false)
        setSubmitted(true)
      } catch (err) {
        setLoading(false)
        setError(err.message)
      }
      return
    }

    // Email/password mode: create new account
    const { data, error: signUpErr } = await signUp({
      email:        form.email,
      password:     form.password,
      namaLengkap:  form.nama,
      noHp:         form.hp,
      angkatan:     form.angkatan,
      tempatLahir:  form.tempatLahir,
      tanggalLahir: form.tanggalLahir,
      domisili:     form.domisili,
      alamat:       form.alamat,
    })

    if (signUpErr) {
      setLoading(false)
      setError(
        signUpErr.message === 'User already registered'
          ? 'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.'
          : signUpErr.message,
      )
      return
    }

    const userId  = data.user?.id
    const session = data.session

    if (session && userId && docs.bukti) {
      const ext      = docs.bukti.name.split('.').pop().toLowerCase()
      const filePath = `${userId}/foto_bukti.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(filePath, docs.bukti, { contentType: docs.bukti.type, upsert: true })

      if (!uploadErr) {
        await supabase.from('dokumen_verifikasi').insert({
          user_id:    userId,
          jenis:      'foto_bukti',
          file_url:   filePath,
          auto_hapus: true,
        })
      }
    }

    setLoading(false)
    setSubmitted(true)
  }

  // Show spinner while auth context is loading (prevents flash for OAuth redirect)
  if (authLoading || !profileReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Success screen ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9] px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A2415] mb-2">Pendaftaran Berhasil!</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Data dan dokumen Anda telah terkirim. Tim admin akan memverifikasi akun dalam{' '}
            <strong>1–3 hari kerja</strong>. Notifikasi dikirim ke{' '}
            <span className="font-semibold text-[#1A5C38]">{isGoogleMode ? supaUser?.email : form.email}</span>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left space-y-1">
            <p className="text-xs font-bold text-amber-800">Status: Menunggu Verifikasi</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Akun Anda akan aktif setelah dokumen diverifikasi oleh admin portal.
            </p>
          </div>
          {isGoogleMode ? (
            <button
              onClick={async () => {
                await refreshProfile()
                navigate('/verifikasi-status?status=menunggu', { replace: true })
              }}
              className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white text-center hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Lihat Status Pendaftaran
            </button>
          ) : (
            <Link
              to="/masuk"
              className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white text-center hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Kembali ke Halaman Masuk
            </Link>
          )}
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────
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
            Daftarkan diri dan terhubung dengan ribuan alumni dari seluruh Indonesia.
            Bangun jejaring, temukan peluang karir, dan tetap dekat dengan almamater.
          </p>
          <div className="space-y-3">
            {[
              { n: '1', t: 'Isi data diri & biodata lengkap' },
              { n: '2', t: 'Unggah foto bukti alumni' },
              { n: '3', t: 'Tunggu konfirmasi admin (1–3 hari)' },
              { n: '4', t: 'Akun aktif & siap digunakan' },
            ].map(({ n, t }) => (
              <div key={n} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-[#0A2415]" style={{ backgroundColor: '#F0A500' }}>
                  {n}
                </div>
                <p className="text-white/75 text-sm">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative overflow-y-auto">
        {/* Mobile background */}
        <div className="lg:hidden absolute inset-0 -z-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(10,36,21,0.80) 0%, rgba(10,36,21,0.88) 100%)' }} />
        </div>

        <div className="max-w-xl w-full mx-auto relative z-10 bg-white rounded-2xl p-7 shadow-2xl lg:shadow-none lg:rounded-none lg:p-0 lg:bg-transparent">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logoUrl} alt="Logo Daarul Mughni" className="w-9 h-9 object-contain rounded flex-shrink-0" />
              <div>
                <p className="text-sm font-extrabold text-[#0A2415] leading-tight">Portal Alumni</p>
                <p className="text-[10px] font-semibold text-[#1A5C38] leading-tight">Daarul Mughni</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Beranda
              </Link>
              <p className="hidden lg:block text-xs text-gray-400">
                Sudah punya akun?{' '}
                <Link to="/masuk" className="font-bold hover:underline" style={{ color: '#1A5C38' }}>Masuk</Link>
              </p>
            </div>
          </div>

          <h1 className="text-xl font-extrabold text-[#0A2415] mb-0.5">
            {isGoogleMode ? 'Lengkapi Data Pendaftaran' : 'Buat Akun Alumni'}
          </h1>
          <p className="text-sm text-gray-400 mb-4">
            {isGoogleMode
              ? 'Isi biodata dan unggah foto verifikasi untuk melanjutkan.'
              : 'Lengkapi biodata diri dan unggah foto verifikasi.'}
          </p>

          {isGoogleMode ? (
            /* Google connected banner */
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50 mb-5">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#fff"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-green-800">Akun Google Terhubung</p>
                <p className="text-xs text-green-700 truncate">{supaUser?.email}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            </div>
          ) : (
            <>
              {/* Google sign-up shortcut */}
              <button
                type="button"
                onClick={handleGoogleDaftar}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors mb-4"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Daftar dengan Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em]">ATAU ISI MANUAL</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit}>
            {/* 2-column grid on desktop */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-0 space-y-4 lg:space-y-0">

              {/* ── Kolom 1: Biodata Diri ── */}
              <div className="space-y-3 lg:pr-6 lg:border-r lg:border-gray-100">
                <SectionLabel>Biodata Diri</SectionLabel>

                <Field label="Nama Lengkap" required>
                  <TextInput value={form.nama} onChange={set('nama')} placeholder="Sesuai KTP / akta lahir" required />
                </Field>

                {isGoogleMode ? (
                  <Field label="Email">
                    <div className={inputCls + ' bg-gray-50 text-gray-500 truncate'} style={{ borderColor: '#E5E7EB' }}>
                      {supaUser?.email}
                    </div>
                  </Field>
                ) : (
                  <Field label="Email" required>
                    <TextInput value={form.email} onChange={set('email')} placeholder="email@contoh.com" type="email" required />
                  </Field>
                )}
                <Field label="No. HP / WhatsApp" required>
                  <TextInput value={form.hp} onChange={set('hp')} placeholder="08xxxxxxxxxx" type="tel" required />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tempat Lahir" required badge>
                    <TextInput value={form.tempatLahir} onChange={set('tempatLahir')} placeholder="Kota lahir" required />
                  </Field>
                  <Field label="Tanggal Lahir" required badge>
                    <input
                      type="date"
                      value={form.tanggalLahir}
                      onChange={set('tanggalLahir')}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className={inputCls}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                    />
                  </Field>
                </div>

                <Field label="Angkatan" required>
                  <SelectInput value={form.angkatan} onChange={set('angkatan')} required>
                    <option value="">Pilih tahun</option>
                    {angkatanList.map((row) => (
                      <option key={row.id} value={row.tahun_lulus}>
                        {row.tahun_lulus} ({row.nama_angkatan || `Ke-${row.tahun_lulus - 2005}`})
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field label="Domisili Saat Ini" required>
                  <CitySelect value={form.domisili} onChange={set('domisili')} required />
                </Field>

                <Field label="Alamat Lengkap" required badge>
                  <textarea
                    value={form.alamat}
                    onChange={set('alamat')}
                    placeholder="Jl. …, RT/RW …, Kelurahan, Kecamatan"
                    required
                    rows={2}
                    className={inputCls + ' resize-none'}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                  />
                </Field>
              </div>

              {/* ── Kolom 2: Kata Sandi (hanya email mode) + Dokumen ── */}
              <div className="space-y-3 lg:pl-6">
                {!isGoogleMode && (
                  <>
                    <SectionLabel>Kata Sandi</SectionLabel>

                    <Field label="Kata Sandi" required>
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={form.password}
                          onChange={set('password')}
                          placeholder="Min. 8 karakter"
                          required
                          className={inputCls + ' pr-11'}
                          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                          onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {form.password && !passwordOk && (
                        <p className="text-xs text-red-500 mt-1">Minimal 8 karakter</p>
                      )}
                    </Field>

                    <Field label="Konfirmasi Kata Sandi" required>
                      <div className="relative">
                        <input
                          type={showKonfirmasi ? 'text' : 'password'}
                          value={form.konfirmasi}
                          onChange={set('konfirmasi')}
                          placeholder="Ulangi kata sandi"
                          required
                          className={inputCls + ' pr-11'}
                          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                          onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                        />
                        <button type="button" onClick={() => setShowKonfirmasi(!showKonfirmasi)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showKonfirmasi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {form.konfirmasi && !konfirmasiOk && (
                        <p className="text-xs text-red-500 mt-1">Kata sandi tidak cocok</p>
                      )}
                    </Field>
                  </>
                )}

                <SectionLabel>Dokumen Verifikasi</SectionLabel>

                <div className="text-xs text-gray-400 -mt-1 mb-2 space-y-0.5">
                  <p>Format <span className="font-semibold">JPEG atau WebP</span>, maks. 2 MB.</p>
                  <p className="flex items-center gap-1 text-[#1A5C38]/70">
                    <CheckCircle className="w-3 h-3 shrink-0" />
                    Foto otomatis dihapus setelah akun diverifikasi.
                  </p>
                </div>

                {DOC_SLOTS.map((slot) => (
                  <DocSlot
                    key={slot.key}
                    slot={slot}
                    file={docs[slot.key]}
                    onSelect={(f) => setDocs((d) => ({ ...d, [slot.key]: f }))}
                    onRemove={() => setDocs((d) => ({ ...d, [slot.key]: null }))}
                  />
                ))}

                {!docs.bukti && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <span className="font-semibold">Foto bukti alumni</span> wajib diunggah untuk melanjutkan.
                    </p>
                  </div>
                )}

                {/* keterangan badge admin */}
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1">
                  <Lock className="w-3 h-3" />
                  Field bertanda <strong>Admin</strong> hanya terlihat oleh pengelola, tidak ditampilkan ke publik.
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full mt-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1A5C38' }}
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Mendaftarkan...' : 'Kirim Pendaftaran'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4 lg:hidden">
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
