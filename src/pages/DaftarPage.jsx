import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye, EyeOff, GraduationCap, CheckCircle,
  ChevronDown, Upload, X, Camera, AlertCircle, Lock,
} from 'lucide-react'
import heroImg from '../assets/hero.jpg'

const ANGKATAN_LIST = Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i)

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
            alert(`Ukuran file melebihi batas ${slot.maxMB ?? 2} MB. Kompres foto terlebih dahulu.`)
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
  const [form, setForm] = useState({
    nama: '', email: '', hp: '', angkatan: '',
    tempatLahir: '', tanggalLahir: '',
    domisili: '', bidang: '', alamat: '',
    password: '', konfirmasi: '',
  })
  const [docs, setDocs] = useState({ bukti: null })
  const [showPass, setShowPass] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const passwordOk   = form.password.length >= 8
  const konfirmasiOk = form.password === form.konfirmasi
  const docsOk       = !!docs.bukti

  const isValid =
    form.nama && form.email && form.hp && form.angkatan &&
    form.tempatLahir && form.tanggalLahir &&
    form.domisili && form.bidang && form.alamat &&
    passwordOk && konfirmasiOk && docsOk

  function handleSubmit(e) {
    e.preventDefault()
    if (isValid) setSubmitted(true)
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
            <span className="font-semibold text-[#1A5C38]">{form.email}</span>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left space-y-1">
            <p className="text-xs font-bold text-amber-800">Status: Menunggu Verifikasi</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Akun Anda akan aktif setelah dokumen diverifikasi oleh admin portal.
            </p>
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
              <div className="w-8 h-8 rounded-full bg-[#F0A500] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-[#0A2415]" />
              </div>
              <span className="text-sm font-bold text-[#0A2415]">Portal Alumni Daarul Mughni</span>
            </Link>
            <p className="hidden lg:block text-xs text-gray-400">
              Sudah punya akun?{' '}
              <Link to="/masuk" className="font-bold hover:underline" style={{ color: '#1A5C38' }}>Masuk</Link>
            </p>
          </div>

          <h1 className="text-xl font-extrabold text-[#0A2415] mb-0.5">Buat Akun Alumni</h1>
          <p className="text-sm text-gray-400 mb-5">Lengkapi biodata diri dan unggah foto verifikasi.</p>

          <form onSubmit={handleSubmit}>
            {/* 2-column grid on desktop */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-6 space-y-4 lg:space-y-0">

              {/* ── Kolom 1: Biodata Diri ── */}
              <div className="space-y-3">
                <SectionLabel>Biodata Diri</SectionLabel>

                <Field label="Nama Lengkap" required>
                  <TextInput value={form.nama} onChange={set('nama')} placeholder="Sesuai KTP / akta lahir" required />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email" required>
                    <TextInput value={form.email} onChange={set('email')} placeholder="email@contoh.com" type="email" required />
                  </Field>
                  <Field label="No. HP / WhatsApp" required>
                    <TextInput value={form.hp} onChange={set('hp')} placeholder="08xxxxxxxxxx" type="tel" required />
                  </Field>
                </div>

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

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Angkatan" required>
                    <SelectInput value={form.angkatan} onChange={set('angkatan')} required>
                      <option value="">Pilih tahun</option>
                      {ANGKATAN_LIST.map((y) => (
                        <option key={y} value={y}>{y} (Ke-{y - 2005})</option>
                      ))}
                    </SelectInput>
                  </Field>
                  <Field label="Bidang / Profesi" required>
                    <TextInput value={form.bidang} onChange={set('bidang')} placeholder="Teknik, Kesehatan…" required />
                  </Field>
                </div>

                <Field label="Domisili Saat Ini" required>
                  <SelectInput value={form.domisili} onChange={set('domisili')} required>
                    <option value="">Pilih kota / kabupaten</option>
                    {DOMISILI_GROUPS.map(({ label, cities }) => (
                      <optgroup key={label} label={label}>
                        {cities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </optgroup>
                    ))}
                  </SelectInput>
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

              {/* ── Kolom 2: Kata Sandi + Dokumen ── */}
              <div className="space-y-3">
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

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full mt-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Kirim Pendaftaran
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
