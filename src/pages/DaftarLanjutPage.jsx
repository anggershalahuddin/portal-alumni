import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle, ChevronDown, Upload, X, Camera, AlertCircle, Lock, ArrowLeft,
} from 'lucide-react'
import heroImg from '../assets/hero.jpg'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/toast'

const DOMISILI_GROUPS = [
  { label: 'DKI Jakarta', cities: ['Jakarta Pusat', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Utara'] },
  { label: 'Jawa Barat', cities: ['Bandung', 'Bekasi', 'Bogor', 'Cimahi', 'Cirebon', 'Depok', 'Garut', 'Indramayu', 'Karawang', 'Purwakarta', 'Sukabumi', 'Tasikmalaya'] },
  { label: 'Banten', cities: ['Cilegon', 'Serang', 'Tangerang', 'Tangerang Selatan'] },
  { label: 'Jawa Tengah', cities: ['Magelang', 'Pekalongan', 'Salatiga', 'Semarang', 'Surakarta', 'Tegal'] },
  { label: 'DI Yogyakarta', cities: ['Bantul', 'Gunungkidul', 'Kulon Progo', 'Sleman', 'Yogyakarta'] },
  { label: 'Jawa Timur', cities: ['Banyuwangi', 'Blitar', 'Gresik', 'Jember', 'Kediri', 'Madiun', 'Malang', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Sidoarjo', 'Surabaya'] },
  { label: 'Sumatera Utara', cities: ['Binjai', 'Medan', 'Padangsidimpuan', 'Pematangsiantar', 'Sibolga', 'Tanjungbalai', 'Tebing Tinggi'] },
  { label: 'Sumatera Barat', cities: ['Bukittinggi', 'Padang', 'Padangpanjang', 'Pariaman', 'Payakumbuh', 'Sawahlunto', 'Solok'] },
  { label: 'Riau', cities: ['Dumai', 'Pekanbaru'] },
  { label: 'Sumatera Selatan', cities: ['Lubuklinggau', 'Pagar Alam', 'Palembang', 'Prabumulih'] },
  { label: 'Lampung', cities: ['Bandar Lampung', 'Metro'] },
  { label: 'Kalimantan Timur', cities: ['Balikpapan', 'Bontang', 'Samarinda'] },
  { label: 'Sulawesi Selatan', cities: ['Makassar', 'Palopo', 'Parepare'] },
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

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
      <span className="flex-1 h-px bg-gray-100" />
      {children}
      <span className="flex-1 h-px bg-gray-100" />
    </p>
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

function DocSlot({ file, onSelect, onRemove }) {
  const ref = useRef()
  return (
    <div className={`relative rounded-xl border-2 transition-all ${
      file ? 'border-green-400 bg-green-50' : 'border-dashed border-gray-200 bg-gray-50 hover:border-[#1A5C38] hover:bg-green-50/30'
    }`}>
      <span className="absolute -top-2 right-3 text-[9px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
        Wajib
      </span>
      <div className="p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: file ? '#D1FAE5' : '#F3F4F6' }}>
          {file ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Camera className="w-4 h-4 text-gray-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight">Foto Bukti Alumni</p>
          {file
            ? <p className="text-xs text-green-700 font-medium truncate mt-0.5">{file.name}</p>
            : <p className="text-xs text-gray-400 mt-0.5 leading-snug">Memegang ijazah/raport pesantren atau berseragam Daarul Mughni</p>
          }
        </div>
        {file ? (
          <button type="button" onClick={onRemove}
            className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center flex-shrink-0">
            <X className="w-3 h-3 text-red-500" />
          </button>
        ) : (
          <button type="button" onClick={() => ref.current.click()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border flex-shrink-0"
            style={{ borderColor: '#1A5C38', color: '#1A5C38' }}>
            <Upload className="w-3 h-3" /> Pilih
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/webp" className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (!f) return
          if (f.size > 2 * 1024 * 1024) { toast('Ukuran file melebihi batas 2 MB.', 'warning'); return }
          else onSelect(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export default function DaftarLanjutPage() {
  const navigate  = useNavigate()
  const { supaUser, loading, profileReady } = useAuth()

  const [angkatanList, setAngkatanList] = useState([])
  const [form, setForm] = useState({
    nama: '', hp: '', angkatan: '',
    tempatLahir: '', tanggalLahir: '',
    domisili: '', alamat: '',
  })
  const [bukti, setBukti]       = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')

  // Guard: redirect to /daftar if not authenticated
  useEffect(() => {
    if (!loading && profileReady && !supaUser) {
      navigate('/daftar', { replace: true })
    }
  }, [loading, profileReady, supaUser, navigate])

  // Pre-fill nama from Google user_metadata
  useEffect(() => {
    if (supaUser) {
      const googleName = supaUser.user_metadata?.full_name ?? supaUser.user_metadata?.name ?? ''
      setForm(f => ({ ...f, nama: googleName }))
    }
  }, [supaUser])

  // Load angkatan from DB
  useEffect(() => {
    supabase.from('angkatan')
      .select('id, tahun_lulus, nama_angkatan')
      .order('tahun_lulus', { ascending: true })
      .then(({ data }) => { if (data) setAngkatanList(data) })
  }, [])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const isValid = form.nama && form.hp && form.angkatan &&
    form.tempatLahir && form.tanggalLahir &&
    form.domisili && form.alamat && !!bukti

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid || !supaUser) return
    setSubmitting(true)
    setError('')

    try {
      // 1. Update profile
      const { error: updateErr } = await supabase.from('profiles').update({
        nama_lengkap:  form.nama,
        no_hp:         form.hp,
        angkatan:      Number(form.angkatan),
        tempat_lahir:  form.tempatLahir,
        tanggal_lahir: form.tanggalLahir,
        domisili:      form.domisili,
        alamat_lengkap: form.alamat,
        status:        'menunggu',
      }).eq('id', supaUser.id)

      if (updateErr) throw updateErr

      // 2. Upload foto bukti
      const ext      = bukti.name.split('.').pop().toLowerCase()
      const filePath = `${supaUser.id}/foto_bukti.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(filePath, bukti, { contentType: bukti.type, upsert: true })

      if (!uploadErr) {
        await supabase.from('dokumen_verifikasi').insert({
          user_id:    supaUser.id,
          jenis:      'foto_bukti',
          file_url:   filePath,
          auto_hapus: true,
        })
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !profileReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
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
            Data Anda telah terkirim. Tim admin akan memverifikasi akun dalam{' '}
            <strong>1–3 hari kerja</strong>. Notifikasi dikirim ke{' '}
            <span className="font-semibold text-[#1A5C38]">{supaUser?.email}</span>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-bold text-amber-800">Status: Menunggu Verifikasi</p>
            <p className="text-xs text-amber-700 leading-relaxed mt-0.5">
              Akun Anda akan aktif setelah dokumen diverifikasi oleh admin portal.
            </p>
          </div>
          <button
            onClick={() => navigate('/verifikasi-status?status=menunggu', { replace: true })}
            className="inline-block w-full py-3 rounded-xl text-sm font-bold text-white text-center hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A5C38' }}
          >
            Lihat Status Pendaftaran
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-end w-[44%] relative overflow-hidden p-12 pb-14 flex-shrink-0">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(42,122,79,0.82) 0%, rgba(26,92,56,0.90) 50%, rgba(10,36,21,0.97) 100%)' }}
        />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0A500]" /> Satu Langkah Lagi
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
            Lengkapi Profil<br />Alumni Anda
          </h2>
          <p className="text-white/65 text-sm leading-relaxed mb-8">
            Akun Google Anda berhasil terhubung. Isi data berikut agar tim admin dapat memverifikasi status alumni Anda.
          </p>
          <div className="space-y-3">
            {[
              { n: '1', t: 'Akun Google sudah terhubung' },
              { n: '2', t: 'Isi biodata & unggah foto bukti alumni' },
              { n: '3', t: 'Tunggu konfirmasi admin (1–3 hari)' },
              { n: '4', t: 'Akun aktif & siap digunakan' },
            ].map(({ n, t }) => (
              <div key={n} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-[#0A2415]"
                  style={{ backgroundColor: '#F0A500' }}>
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
            <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Beranda
            </Link>
          </div>

          <h1 className="text-xl font-extrabold text-[#0A2415] mb-0.5">Lengkapi Data Pendaftaran</h1>
          <p className="text-sm text-gray-400 mb-4">Isi biodata dan unggah foto verifikasi untuk melanjutkan.</p>

          {/* Google account info */}
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

          <form onSubmit={handleSubmit}>
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-0 space-y-4 lg:space-y-0">

              {/* Kolom 1: Biodata */}
              <div className="space-y-3 lg:pr-6 lg:border-r lg:border-gray-100">
                <SectionLabel>Biodata Diri</SectionLabel>

                <Field label="Nama Lengkap" required>
                  <input
                    type="text" value={form.nama} onChange={set('nama')}
                    placeholder="Sesuai KTP / akta lahir" required
                    className={inputCls}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                  />
                </Field>

                <Field label="No. HP / WhatsApp" required>
                  <input
                    type="tel" value={form.hp} onChange={set('hp')}
                    placeholder="08xxxxxxxxxx" required
                    className={inputCls}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tempat Lahir" required badge>
                    <input
                      type="text" value={form.tempatLahir} onChange={set('tempatLahir')}
                      placeholder="Kota lahir" required
                      className={inputCls}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                    />
                  </Field>
                  <Field label="Tanggal Lahir" required badge>
                    <input
                      type="date" value={form.tanggalLahir} onChange={set('tanggalLahir')}
                      required max={new Date().toISOString().split('T')[0]}
                      className={inputCls}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                    <SelectInput value={form.domisili} onChange={set('domisili')} required>
                      <option value="">Pilih kota / kabupaten</option>
                      {DOMISILI_GROUPS.map(({ label, cities }) => (
                        <optgroup key={label} label={label}>
                          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </optgroup>
                      ))}
                    </SelectInput>
                  </Field>
                </div>

                <Field label="Alamat Lengkap" required badge>
                  <textarea
                    value={form.alamat} onChange={set('alamat')}
                    placeholder="Jl. …, RT/RW …, Kelurahan, Kecamatan"
                    required rows={2}
                    className={inputCls + ' resize-none'}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
                  />
                </Field>
              </div>

              {/* Kolom 2: Dokumen */}
              <div className="space-y-3 lg:pl-6">
                <SectionLabel>Dokumen Verifikasi</SectionLabel>

                <div className="text-xs text-gray-400 -mt-1 mb-2 space-y-0.5">
                  <p>Format <span className="font-semibold">JPEG atau WebP</span>, maks. 2 MB.</p>
                  <p className="flex items-center gap-1 text-[#1A5C38]/70">
                    <CheckCircle className="w-3 h-3 shrink-0" />
                    Foto otomatis dihapus setelah akun diverifikasi.
                  </p>
                </div>

                <DocSlot
                  file={bukti}
                  onSelect={setBukti}
                  onRemove={() => setBukti(null)}
                />

                {!bukti && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <span className="font-semibold">Foto bukti alumni</span> wajib diunggah untuk melanjutkan.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1">
                  <Lock className="w-3 h-3" />
                  Field bertanda <strong>Admin</strong> hanya terlihat oleh pengelola.
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="w-full mt-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: '#1A5C38' }}
            >
              {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {submitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
