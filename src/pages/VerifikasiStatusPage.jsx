import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import {
  Clock, XCircle, CheckCircle, LogOut,
  Upload, FileText, RefreshCw, MessageSquare, Phone,
  Mail, ChevronRight, AlertTriangle, Send, X, Loader2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

// ── Komponen upload slot dokumen ───────────────────────────────────────────────
function DocSlot({ label, icon: Icon, file, onPick, onRemove }) {
  return (
    <div className="relative">
      {file ? (
        <div className="border border-green-200 bg-green-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-green-800 truncate">{file.name}</p>
            <p className="text-[10px] text-green-600">{label}</p>
          </div>
          <button onClick={onRemove} className="w-6 h-6 rounded-full hover:bg-green-200 flex items-center justify-center text-green-500 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-200 hover:border-[#1A5C38]/40 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-colors group">
          <input type="file" className="sr-only" accept=".jpg,.jpeg,.png,.pdf" onChange={e => e.target.files?.[0] && onPick(e.target.files[0])} />
          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#1A5C38]/10 flex items-center justify-center flex-shrink-0 transition-colors">
            <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#1A5C38] transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700">{label}</p>
            <p className="text-[10px] text-gray-400">Klik untuk upload · JPG/PDF maks. 5MB</p>
          </div>
          <Upload className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1A5C38] transition-colors" />
        </label>
      )}
    </div>
  )
}

// ── Halaman Utama ──────────────────────────────────────────────────────────────
export default function VerifikasiStatusPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  async function handleLogout() {
    await signOut()
    window.location.href = '/masuk'
  }

  // Status bisa 'menunggu' atau 'ditolak' — diset dari URL param saat redirect setelah login
  const status = params.get('status') === 'ditolak' ? 'ditolak' : 'menunggu'
  const pesanAdmin = params.get('pesan') || 'Dokumen yang Anda lampirkan tidak dapat dibaca dengan jelas. Mohon unggah ulang dengan kualitas yang lebih baik dan pastikan semua dokumen yang diminta telah dilampirkan.'

  // State untuk form pengajuan ulang (jika ditolak)
  const [files, setFiles] = useState({ ktp: null, ijazah: null, foto: null, surat: null })
  const [catatan, setCatatan] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Demo switcher (untuk preview di development)
  const [demoStatus, setDemoStatus] = useState(status)

  const isRejected = demoStatus === 'ditolak'

  function setFile(key, file) { setFiles(p => ({ ...p, [key]: file })) }
  function removeFile(key) { setFiles(p => ({ ...p, [key]: null })) }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1800))
    setSubmitting(false)
    setSubmitted(true)
  }

  const docSlots = [
    { key: 'ktp', label: 'Kartu Identitas (KTP/Kartu Pelajar)', icon: FileText },
    { key: 'ijazah', label: 'Ijazah / Surat Keterangan Lulus', icon: FileText },
    { key: 'foto', label: 'Foto Diri Terbaru (Formal)', icon: FileText },
    { key: 'surat', label: 'Surat Keterangan Lainnya (opsional)', icon: FileText },
  ]

  const allRequiredUploaded = files.ktp && files.ijazah && files.foto

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F1F5F9' }}>

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoUrl} alt="Logo Daarul Mughni" className="w-8 h-8 object-contain rounded flex-shrink-0" />
            <div>
              <p className="text-sm font-extrabold text-[#0A2415] leading-none">Portal Alumni</p>
              <p className="text-[10px] text-[#1A5C38] font-semibold leading-none mt-0.5">Daarul Mughni</p>
            </div>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </header>

      {/* Demo switcher */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-4">
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium flex-1">Mode pratinjau — lihat tampilan berdasarkan status akun:</p>
          <div className="flex gap-1.5">
            <button onClick={() => setDemoStatus('menunggu')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${demoStatus === 'menunggu' ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 border border-amber-200'}`}>
              Menunggu
            </button>
            <button onClick={() => setDemoStatus('ditolak')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${demoStatus === 'ditolak' ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-200'}`}>
              Ditolak
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ── STATE: MENUNGGU ── */}
          {!isRejected && (
            <motion.div key="menunggu"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Status card */}
              <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
                {/* Top accent */}
                <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #F0A500, #FBBF24)' }} />
                <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                  {/* Animated icon */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFFBEB' }}>
                      <Clock className="w-10 h-10 text-amber-500" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-30" />
                  </div>

                  <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Akun Dalam Proses Verifikasi</h1>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-md mb-1">
                    Pendaftaran Anda telah kami terima. Tim admin sedang memverifikasi data dan dokumen yang Anda lampirkan.
                  </p>
                  <div className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold bg-amber-50 px-3 py-1.5 rounded-full mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    Estimasi waktu: <span className="font-extrabold ml-1">1–3 hari kerja</span>
                  </div>
                </div>
              </div>

              {/* Info tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { step: '01', title: 'Data Diterima', desc: 'Dokumen dan data pendaftaran Anda berhasil diterima oleh sistem.', done: true },
                  { step: '02', title: 'Sedang Diverifikasi', desc: 'Tim admin sedang memeriksa keaslian dokumen dan mencocokkan data alumni.', done: false, active: true },
                  { step: '03', title: 'Akun Aktif', desc: 'Jika disetujui, Anda akan mendapatkan akses penuh ke dashboard alumni.', done: false },
                ].map(({ step, title, desc, done, active }) => (
                  <div key={step} className={`rounded-2xl p-4 border ${done ? 'border-green-200 bg-green-50' : active ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold mb-3 ${done ? 'bg-green-500 text-white' : active ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    <p className={`text-sm font-bold mb-1 ${done ? 'text-green-800' : active ? 'text-amber-800' : 'text-gray-600'}`}>{title}</p>
                    <p className={`text-xs leading-relaxed ${done ? 'text-green-600' : active ? 'text-amber-600' : 'text-gray-400'}`}>{desc}</p>
                  </div>
                ))}
              </div>

              {/* Notice */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#1A5C38]" /> Yang perlu Anda ketahui
                </h3>
                <ul className="space-y-2">
                  {[
                    'Anda akan menerima notifikasi email setelah proses verifikasi selesai.',
                    'Pastikan email yang Anda daftarkan aktif dan bisa menerima pesan.',
                    'Jika lebih dari 3 hari kerja belum ada konfirmasi, silakan hubungi admin.',
                    'Jangan mendaftar ulang — akun Anda sudah terdaftar dan sedang diproses.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38] flex-shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Butuh bantuan? Hubungi Admin</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="mailto:alumni@daarulmughni.ac.id"
                    className="flex items-center gap-3 flex-1 p-3.5 rounded-xl border border-gray-100 hover:border-[#1A5C38]/30 hover:bg-[#1A5C38]/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#1A5C38]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Email Admin</p>
                      <p className="text-xs font-semibold text-gray-700 group-hover:text-[#1A5C38] transition-colors">alumni@daarulmughni.ac.id</p>
                    </div>
                  </a>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 flex-1 p-3.5 rounded-xl border border-gray-100 hover:border-[#1A5C38]/30 hover:bg-[#1A5C38]/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#1A5C38]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">WhatsApp Admin</p>
                      <p className="text-xs font-semibold text-gray-700 group-hover:text-[#1A5C38] transition-colors">+62 812-3456-7890</p>
                    </div>
                  </a>
                </div>
              </div>

              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <LogOut className="w-4 h-4" /> Kembali ke Halaman Login
              </button>
            </motion.div>
          )}

          {/* ── STATE: DITOLAK ── */}
          {isRejected && !submitted && (
            <motion.div key="ditolak"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Status card */}
              <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #EF4444, #F87171)' }} />
                <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Pengajuan Verifikasi Ditolak</h1>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                    Mohon maaf, pengajuan verifikasi akun Anda tidak dapat diproses saat ini. Silakan baca keterangan dari admin dan ajukan perbaikan.
                  </p>
                </div>
              </div>

              {/* Admin rejection message */}
              <div className="bg-white rounded-2xl border border-red-100">
                <div className="px-5 py-4 border-b border-red-50 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Keterangan dari Admin</p>
                    <p className="text-[10px] text-gray-400">Silakan perbaiki sesuai catatan di bawah ini</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-sm text-red-800 leading-relaxed">{pesanAdmin}</p>
                  </div>
                </div>
              </div>

              {/* Re-application form */}
              <div className="bg-white rounded-2xl border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                    <RefreshCw className="w-3.5 h-3.5 text-[#1A5C38]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Ajukan Perbaikan</p>
                    <p className="text-[10px] text-gray-400">Lengkapi dokumen dan catatan perbaikan, lalu kirim ulang</p>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Catatan perbaikan */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Catatan Perbaikan <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={catatan}
                      onChange={e => setCatatan(e.target.value)}
                      rows={4}
                      placeholder="Jelaskan perbaikan yang telah Anda lakukan berdasarkan keterangan admin di atas. Semakin detail semakin baik..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1A5C38] transition-colors resize-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">{catatan.length}/500 karakter</p>
                  </div>

                  {/* Document uploads */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Unggah Ulang Dokumen <span className="text-red-400">* (min. 3 dokumen pertama)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {docSlots.map(({ key, label, icon }) => (
                        <DocSlot key={key} label={label} icon={icon}
                          file={files[key]}
                          onPick={f => setFile(key, f)}
                          onRemove={() => removeFile(key)} />
                      ))}
                    </div>
                    {!allRequiredUploaded && (
                      <p className="text-[10px] text-amber-600 mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        KTP/Kartu Pelajar, Ijazah, dan Foto Diri wajib diunggah.
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={!catatan.trim() || !allRequiredUploaded || submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ backgroundColor: '#1A5C38' }}
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim Pengajuan...</>
                      : <><Send className="w-4 h-4" /> Kirim Pengajuan Ulang</>
                    }
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">
                    Pengajuan ulang akan ditinjau kembali oleh admin dalam 1–3 hari kerja.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Masih bingung? Hubungi Admin</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="mailto:alumni@daarulmughni.ac.id"
                    className="flex items-center gap-3 flex-1 p-3 rounded-xl border border-gray-100 hover:border-[#1A5C38]/30 hover:bg-[#1A5C38]/5 transition-colors group">
                    <Mail className="w-4 h-4 text-[#1A5C38] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400">Email</p>
                      <p className="text-xs font-semibold text-gray-700 group-hover:text-[#1A5C38] transition-colors">alumni@daarulmughni.ac.id</p>
                    </div>
                  </a>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 flex-1 p-3 rounded-xl border border-gray-100 hover:border-[#1A5C38]/30 hover:bg-[#1A5C38]/5 transition-colors group">
                    <Phone className="w-4 h-4 text-[#1A5C38] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-400">WhatsApp</p>
                      <p className="text-xs font-semibold text-gray-700 group-hover:text-[#1A5C38] transition-colors">+62 812-3456-7890</p>
                    </div>
                  </a>
                </div>
              </div>

              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <LogOut className="w-4 h-4" /> Kembali ke Halaman Login
              </button>
            </motion.div>
          )}

          {/* ── STATE: SUBMITTED (setelah ajukan ulang) ── */}
          {isRejected && submitted && (
            <motion.div key="submitted"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="bg-white rounded-2xl border border-green-100 overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #1A5C38, #22C55E)' }} />
                <div className="p-10 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pengajuan Ulang Terkirim!</h2>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-md mb-6">
                    Pengajuan perbaikan Anda telah berhasil dikirim. Tim admin akan segera meninjau kembali data dan dokumen Anda dalam <strong>1–3 hari kerja</strong>.
                  </p>
                  <div className="flex items-center gap-1.5 text-green-700 text-xs font-bold bg-green-50 px-4 py-2 rounded-full mb-6">
                    <CheckCircle className="w-3.5 h-3.5" /> Status: Menunggu Tinjauan Ulang
                  </div>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <button onClick={() => { setSubmitted(false); setDemoStatus('menunggu') }}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#1A5C38' }}>
                      <Clock className="w-4 h-4" /> Pantau Status
                    </button>
                    <button onClick={() => navigate('/masuk')}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Kembali ke Login
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="border-t border-gray-100 bg-white py-4 text-center">
        <p className="text-xs text-gray-400">© 2026 Portal Alumni Pondok Pesantren Daarul Mughni · Semua Hak Dilindungi</p>
      </div>
    </div>
  )
}
