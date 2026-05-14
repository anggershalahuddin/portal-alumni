import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye, EyeOff, GraduationCap, CheckCircle,
  ChevronDown, Upload, X, Camera, AlertCircle,
} from 'lucide-react'
import heroImg from '../assets/hero.jpg'

const ANGKATAN_LIST = Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i)

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white'
const focusStyle = { borderColor: '#1A5C38' }
const blurStyle  = { borderColor: '#E5E7EB' }

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
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

const DOC_SLOTS = [
  {
    key: 'bukti',
    icon: Camera,
    label: 'Foto Bukti Alumni',
    desc: 'Foto memegang ijazah/raport pesantren, atau foto berseragam Daarul Mughni',
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
      className={`relative rounded-2xl border-2 transition-all ${
        hasFile
          ? 'border-green-400 bg-green-50'
          : 'border-dashed border-gray-200 bg-gray-50 hover:border-[#1A5C38] hover:bg-green-50/30'
      }`}
    >
      {/* Required badge */}
      {slot.required && (
        <span className="absolute -top-2 right-3 text-[9px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
          Wajib
        </span>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: hasFile ? '#D1FAE5' : '#F3F4F6' }}
          >
            {hasFile
              ? <CheckCircle className="w-5 h-5 text-green-600" />
              : <Icon className="w-5 h-5 text-gray-400" />
            }
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800">{slot.label}</p>
            {hasFile ? (
              <p className="text-xs text-green-700 font-medium truncate mt-0.5">{file.name}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-0.5">{slot.desc}</p>
            )}
          </div>

          {/* Action */}
          {hasFile ? (
            <button
              type="button"
              onClick={onRemove}
              className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-red-500" />
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
    nama: '', email: '', hp: '', angkatan: '', domisili: '', bidang: '',
    password: '', konfirmasi: '',
  })
  const [docs, setDocs] = useState({ foto: null, ktp: null, ijazah: null })
  const [showPass, setShowPass] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const passwordOk  = form.password.length >= 8
  const konfirmasiOk = form.password === form.konfirmasi
  const docsOk      = !!docs.bukti

  const isValid =
    form.nama && form.email && form.hp && form.angkatan && form.bidang &&
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
          {/* Steps */}
          <div className="space-y-3">
            {[
              { n: '1', t: 'Isi data diri lengkap' },
              { n: '2', t: 'Unggah dokumen verifikasi' },
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
      <div className="flex-1 flex flex-col justify-start px-6 py-10 relative overflow-y-auto">
        {/* Mobile background */}
        <div className="lg:hidden absolute inset-0 -z-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(10,36,21,0.80) 0%, rgba(10,36,21,0.88) 100%)' }} />
        </div>

        <div className="max-w-lg w-full mx-auto relative z-10 bg-white rounded-2xl p-7 shadow-2xl lg:shadow-none lg:rounded-none lg:p-0 lg:bg-transparent">
          <Link to="/" className="flex items-center gap-2.5 mb-7">
            <div className="w-8 h-8 rounded-full bg-[#F0A500] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#0A2415]" />
            </div>
            <span className="text-sm font-bold text-[#0A2415]">Portal Alumni Daarul Mughni</span>
          </Link>

          <h1 className="text-2xl font-extrabold text-[#0A2415] mb-1">Buat Akun Alumni</h1>
          <p className="text-sm text-gray-400 mb-7">Lengkapi data diri dan unggah dokumen untuk mendaftar.</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Data Diri ── */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-gray-100" /> Data Diri <span className="flex-1 h-px bg-gray-100" />
              </p>
              <div className="space-y-4">
                <Field label="Nama Lengkap" required>
                  <TextInput value={form.nama} onChange={set('nama')} placeholder="Sesuai KTP" required />
                </Field>

                <Field label="Email" required>
                  <TextInput value={form.email} onChange={set('email')} placeholder="email@contoh.com" type="email" required />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="No. HP / WhatsApp" required>
                    <TextInput value={form.hp} onChange={set('hp')} placeholder="08xxxxxxxxxx" type="tel" required />
                  </Field>
                  <Field label="Angkatan" required>
                    <div className="relative">
                      <select
                        value={form.angkatan}
                        onChange={set('angkatan')}
                        required
                        className={inputCls + ' appearance-none pr-8'}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e)  => Object.assign(e.target.style, blurStyle)}
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

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Domisili Saat Ini">
                    <TextInput value={form.domisili} onChange={set('domisili')} placeholder="Kota / Kabupaten" />
                  </Field>
                  <Field label="Bidang / Profesi" required>
                    <TextInput value={form.bidang} onChange={set('bidang')} placeholder="Teknik, Kesehatan..." required />
                  </Field>
                </div>
              </div>
            </div>

            {/* ── Kata Sandi ── */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-gray-100" /> Kata Sandi <span className="flex-1 h-px bg-gray-100" />
              </p>
              <div className="space-y-4">
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
              </div>
            </div>

            {/* ── Dokumen Verifikasi ── */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <span className="flex-1 h-px bg-gray-100" /> Dokumen Verifikasi <span className="flex-1 h-px bg-gray-100" />
              </p>
              <p className="text-xs text-gray-400 mb-1">
                Foto digunakan admin untuk memverifikasi bahwa Anda adalah alumni Daarul Mughni.
                Format <span className="font-semibold">JPEG atau WebP</span>, maks. 2 MB.
              </p>
              <p className="text-xs text-[#1A5C38]/70 mb-3 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 shrink-0" />
                Foto ini akan otomatis dihapus setelah akun Anda diverifikasi.
              </p>
              <div className="space-y-3">
                {DOC_SLOTS.map((slot) => (
                  <DocSlot
                    key={slot.key}
                    slot={slot}
                    file={docs[slot.key]}
                    onSelect={(f) => setDocs((d) => ({ ...d, [slot.key]: f }))}
                    onRemove={() => setDocs((d) => ({ ...d, [slot.key]: null }))}
                  />
                ))}
              </div>
              {/* Reminder jika belum diisi */}
              {!docs.bukti && (
                <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    <span className="font-semibold">Foto bukti alumni</span> wajib diunggah untuk melanjutkan pendaftaran.
                  </p>
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Kirim Pendaftaran
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
