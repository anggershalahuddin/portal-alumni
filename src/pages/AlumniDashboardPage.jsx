import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, GraduationCap, Briefcase, Plus, Pencil, Trash2,
  BookOpen, Award, MapPin, Calendar, UserPlus, X, Download,
  Check, CheckCheck, ChevronRight, LogOut, Settings,
  FileText, Globe, Users, Clock, Newspaper, CalendarDays,
  Shield, AlertCircle, ExternalLink, Loader2, Star, Image as ImageIcon,
  Phone, Mail,
} from 'lucide-react'
import Footer from '../components/landing/Footer'
import { news } from '../data/news'
import { agendaData, kategoriStyle } from '../data/agenda'
import { initialLowongan } from '../data/lowongan'
import { initialGaleri } from '../data/galeri'
import { TOTAL_ALUMNI } from '../data/alumni'

// ── Mock logged-in user ────────────────────────────────────────────────────────
const mockUser = {
  name: 'Ahmad Zaki',
  angkatan: 2018,
  id: 'DM-2018-042',
  email: 'ahmad.zaki@email.com',
  phone: '0812-3456-7890',
}

// ── Initial section data ───────────────────────────────────────────────────────
const initPendidikan = [
  { id: 1, gelar: 'Sarjana Teknik Informatika', institusi: 'Institut Teknologi Bandung', tahun: '2018 - 2022', lokasi: 'Bandung, Jawa Barat', deskripsi: 'Lulus dengan predikat Cum Laude. Fokus pada kecerdasan buatan dan pengembangan sistem skala besar.' },
  { id: 2, gelar: 'Pendidikan Pesantren (Madrasah Aliyah)', institusi: 'Pondok Pesantren Daarul Mughni', tahun: '2015 - 2018', lokasi: 'Bogor, Jawa Barat', deskripsi: "Aktif dalam organisasi santri (ISDM) dan meraih juara 1 Musabaqah Qira'atil Kutub tingkat Kabupaten." },
]

const initPekerjaan = [
  { id: 1, jabatan: 'Software Engineer', perusahaan: 'TechNova Solutions', periode: 'Jan 2023 - Sekarang', lokasi: 'Jakarta (Remote)', deskripsi: 'Mengembangkan platform e-learning menggunakan React, Node.js, dan arsitektur microservices.', current: true },
  { id: 2, jabatan: 'Junior Web Developer', perusahaan: 'Creative Digital Agency', periode: 'Jun 2022 - Des 2022', lokasi: 'Bandung, Jawa Barat', deskripsi: 'Pengembangan front-end untuk 10+ klien UMKM di Jawa Barat.', current: false },
]

const initSertifikasi = [
  { id: 1, nama: 'AWS Certified Solutions Architect', penerbit: 'Amazon Web Services', tahun: 2023, noCert: 'AWS-SAA-C03-00123', url: '' },
  { id: 2, nama: 'Google Professional Cloud Developer', penerbit: 'Google Cloud', tahun: 2022, noCert: 'GCP-PCD-7890', url: '' },
]

const initPublikasi = [
  { id: 1, judul: 'Implementasi Machine Learning pada Sistem Rekomendasi Konten Digital', penerbit: 'Jurnal Informatika Indonesia', tahun: 2023, url: '' },
]

// ── Alumni notifications ───────────────────────────────────────────────────────
const initNotif = [
  { id: 1, icon: Shield, color: '#1A5C38', bg: '#F0FDF4', judul: 'Akun Anda Terverifikasi', pesan: 'Selamat! Akun alumni Anda telah berhasil diverifikasi oleh admin portal.', waktu: '1 hari lalu', dibaca: false },
  { id: 2, icon: CalendarDays, color: '#0E7490', bg: '#ECFEFF', judul: 'Agenda Mendatang', pesan: 'Reuni Akbar Lintas Angkatan 2024 akan berlangsung minggu depan. Segera daftar!', waktu: '2 hari lalu', dibaca: false },
  { id: 3, icon: Briefcase, color: '#7C3AED', bg: '#FAF5FF', judul: 'Lowongan Baru Sesuai Profil', pesan: 'Terdapat 2 lowongan baru yang sesuai dengan bidang teknologi Anda.', waktu: '3 hari lalu', dibaca: true },
  { id: 4, icon: Newspaper, color: '#D97706', bg: '#FFFBEB', judul: 'Berita Terbaru', pesan: 'Pondok Pesantren Daarul Mughni resmikan Gedung Laboratorium Bahasa Baru.', waktu: '4 hari lalu', dibaca: true },
  { id: 5, icon: AlertCircle, color: '#6B7280', bg: '#F9FAFB', judul: 'Profil Belum Lengkap', pesan: 'Lengkapi foto profil dan LinkedIn Anda untuk meningkatkan visibilitas di direktori alumni.', waktu: '5 hari lalu', dibaca: true },
]

// ── Utilities ──────────────────────────────────────────────────────────────────
function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function useScrollLock() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
}

const dropAnim = {
  initial: { opacity: 0, y: 8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.96 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

// ── Circular progress ──────────────────────────────────────────────────────────
function CircularProgress({ pct }) {
  const r = 42
  const circ = 2 * Math.PI * r
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F0A500" strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-[#0A2415]">{pct}%</span>
      </div>
    </div>
  )
}

// ── Modals ─────────────────────────────────────────────────────────────────────
function ModalWrapper({ onClose, children }) {
  useScrollLock()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {children}
    </div>
  )
}

function MF({ label, children }) {
  return <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>{children}</div>
}

const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1A5C38] transition-colors'

function EditProfilModal({ profil, onSave, onClose }) {
  const [form, setForm] = useState({ ...profil })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Profil</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <MF label="Nama Lengkap"><input className={inp} value={form.nama} onChange={s('nama')} /></MF>
          <MF label="Bio Singkat"><textarea className={`${inp} resize-none`} rows={3} value={form.bio} onChange={s('bio')} placeholder="Ceritakan tentang diri Anda..." /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Bidang / Profesi"><input className={inp} value={form.bidang} onChange={s('bidang')} /></MF>
            <MF label="Domisili"><input className={inp} value={form.domisili} onChange={s('domisili')} /></MF>
          </div>
          <MF label="Email"><input className={inp} type="email" value={form.email} onChange={s('email')} /></MF>
          <MF label="No. HP / WhatsApp"><input className={inp} type="tel" value={form.phone} onChange={s('phone')} /></MF>
          <MF label="URL LinkedIn"><input className={inp} type="url" value={form.linkedin} onChange={s('linkedin')} placeholder="linkedin.com/in/username" /></MF>
          <MF label="Website / Portofolio"><input className={inp} type="url" value={form.website} onChange={s('website')} placeholder="https://portofolio.com" /></MF>
          <MF label="Foto Profil">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-[#1A5C38]/40 transition-colors cursor-pointer">
              <ImageIcon className="w-6 h-6 text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Klik untuk upload foto</p>
              <p className="text-[10px] text-gray-300 mt-0.5">JPG, PNG — maks. 2MB</p>
            </div>
          </MF>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => { onSave(form); onClose() }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function PendidikanModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    gelar: item?.gelar ?? '', institusi: item?.institusi ?? '',
    tahun: item?.tahun ?? '', lokasi: item?.lokasi ?? '', deskripsi: item?.deskripsi ?? '',
  })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Riwayat Pendidikan</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <MF label="Gelar / Jenjang"><input className={inp} value={form.gelar} onChange={s('gelar')} placeholder="S1 Teknik Informatika" /></MF>
          <MF label="Institusi"><input className={inp} value={form.institusi} onChange={s('institusi')} placeholder="Nama universitas/pesantren" /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Periode"><input className={inp} value={form.tahun} onChange={s('tahun')} placeholder="2018 - 2022" /></MF>
            <MF label="Lokasi"><input className={inp} value={form.lokasi} onChange={s('lokasi')} placeholder="Kota, Provinsi" /></MF>
          </div>
          <MF label="Deskripsi"><textarea className={`${inp} resize-none`} rows={3} value={form.deskripsi} onChange={s('deskripsi')} placeholder="Prestasi, kegiatan, dll." /></MF>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.gelar && form.institusi && onSave(form)} disabled={!form.gelar || !form.institusi}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function KarirModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    jabatan: item?.jabatan ?? '', perusahaan: item?.perusahaan ?? '',
    periode: item?.periode ?? '', lokasi: item?.lokasi ?? '',
    deskripsi: item?.deskripsi ?? '', current: item?.current ?? false,
  })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Riwayat Pekerjaan</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <MF label="Jabatan / Posisi"><input className={inp} value={form.jabatan} onChange={s('jabatan')} placeholder="Software Engineer" /></MF>
          <MF label="Perusahaan / Instansi"><input className={inp} value={form.perusahaan} onChange={s('perusahaan')} placeholder="Nama perusahaan" /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Periode"><input className={inp} value={form.periode} onChange={s('periode')} placeholder="Jan 2023 - Sekarang" /></MF>
            <MF label="Lokasi"><input className={inp} value={form.lokasi} onChange={s('lokasi')} placeholder="Jakarta (Remote)" /></MF>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={form.current} onChange={e => setForm(p => ({ ...p, current: e.target.checked }))} className="w-4 h-4 accent-green-600" />
            Masih bekerja di sini
          </label>
          <MF label="Deskripsi"><textarea className={`${inp} resize-none`} rows={3} value={form.deskripsi} onChange={s('deskripsi')} /></MF>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.jabatan && form.perusahaan && onSave(form)} disabled={!form.jabatan || !form.perusahaan}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function SertifikasiModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({ nama: item?.nama ?? '', penerbit: item?.penerbit ?? '', tahun: item?.tahun ?? '', noCert: item?.noCert ?? '', url: item?.url ?? '' })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Sertifikasi</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <MF label="Nama Sertifikasi"><input className={inp} value={form.nama} onChange={s('nama')} placeholder="Google Professional Cloud Architect" /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Penerbit"><input className={inp} value={form.penerbit} onChange={s('penerbit')} placeholder="Google, AWS, dll" /></MF>
            <MF label="Tahun"><input className={inp} type="number" value={form.tahun} onChange={s('tahun')} placeholder="2024" /></MF>
          </div>
          <MF label="Nomor Sertifikat (opsional)"><input className={inp} value={form.noCert} onChange={s('noCert')} /></MF>
          <MF label="URL Verifikasi (opsional)"><input className={inp} type="url" value={form.url} onChange={s('url')} placeholder="https://..." /></MF>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.nama && onSave(form)} disabled={!form.nama}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function PublikasiModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({ judul: item?.judul ?? '', penerbit: item?.penerbit ?? '', tahun: item?.tahun ?? '', url: item?.url ?? '', deskripsi: item?.deskripsi ?? '' })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Publikasi</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <MF label="Judul Publikasi / Karya"><input className={inp} value={form.judul} onChange={s('judul')} placeholder="Judul artikel, jurnal, buku..." /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Penerbit / Media"><input className={inp} value={form.penerbit} onChange={s('penerbit')} /></MF>
            <MF label="Tahun Terbit"><input className={inp} type="number" value={form.tahun} onChange={s('tahun')} placeholder="2024" /></MF>
          </div>
          <MF label="URL / Tautan"><input className={inp} type="url" value={form.url} onChange={s('url')} placeholder="https://..." /></MF>
          <MF label="Deskripsi Singkat"><textarea className={`${inp} resize-none`} rows={2} value={form.deskripsi} onChange={s('deskripsi')} /></MF>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.judul && onSave(form)} disabled={!form.judul}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

// ── Kartu Alumni Modal ─────────────────────────────────────────────────────────
function KartuAlumniModal({ user, profil, onClose }) {
  useScrollLock()
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      await document.fonts.ready
      const canvas = await html2canvas(cardRef.current, {
        scale: 4, useCORS: true, logging: false, backgroundColor: null,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] })
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 54)
      pdf.save(`kartu-alumni-${user.id}.pdf`)
    } catch (e) { console.error(e) }
    finally { setDownloading(false) }
  }

  // KTP ratio: 85.6 × 54mm → width 360px → height = 360×54/85.6 ≈ 227px
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-white/70 text-xs font-semibold">Pratinjau Kartu Alumni · Ukuran KTP (85.6 × 54 mm)</p>
        </div>

        {/* Card — 360 × 227px = KTP proportions */}
        <div
          ref={cardRef}
          style={{
            width: 360, height: 227,
            background: 'linear-gradient(135deg, #0A2415 0%, #1A5C38 55%, #226B44 100%)',
            borderRadius: 12, overflow: 'hidden', position: 'relative',
            fontFamily: 'Inter, sans-serif', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', border: '1.5px solid rgba(240,165,0,0.2)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -20, right: -20, width: 72, height: 72, borderRadius: '50%', border: '1.5px solid rgba(240,165,0,0.15)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -24, left: -24, width: 80, height: 80, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 20px 0' }}>
            <div>
              <div style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.4)', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 3 }}>KARTU ALUMNI RESMI</div>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: '#fff', lineHeight: 1.4 }}>Pondok Pesantren<br />Daarul Mughni Al Maaliki</div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#F0A500', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#0A2415', fontWeight: 900, fontSize: 13, letterSpacing: -0.5 }}>DM</span>
            </div>
          </div>

          {/* Divider line */}
          <div style={{ margin: '10px 20px 0', height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />

          {/* Main info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px' }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.12)', border: '2px solid rgba(240,165,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20, fontWeight: 900, color: '#fff' }}>
              {initials(user.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', marginBottom: 3, letterSpacing: -0.3 }}>{user.name}</div>
              <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>{profil.bidang || 'Alumni'}</div>
              <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>Angkatan {user.angkatan} · Ke-{user.angkatan - 2005}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, backgroundColor: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 20, padding: '2px 8px' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#4ADE80' }} />
                <span style={{ fontSize: 7.5, color: '#4ADE80', fontWeight: 700, letterSpacing: 0.5 }}>TERVERIFIKASI</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.35)', padding: '7px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>ID ALUMNI</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#F0A500', fontFamily: 'monospace', letterSpacing: 1 }}>{user.id}</div>
            </div>
            {/* Barcode decoration */}
            <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 22 }}>
              {[10, 16, 8, 20, 12, 22, 9, 18, 11, 16, 8, 14].map((h, i) => (
                <div key={i} style={{ width: 2, height: h, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 1 }} />
              ))}
            </div>
            <div style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.2)', textAlign: 'right' }}>Bogor, Jawa Barat<br />© 2026 Daarul Mughni</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-[#0A2415] hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#F0A500' }}
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Mengunduh...' : 'Unduh PDF (KTP)'}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            Tutup
          </button>
        </div>
        <p className="text-white/35 text-[10px]">File PDF akan tersimpan dalam ukuran fisik KTP (85.6 × 54 mm) — siap cetak</p>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AlumniDashboardPage() {
  const navigate = useNavigate()

  // Section states
  const [profil, setProfil] = useState({
    nama: mockUser.name, email: mockUser.email, phone: mockUser.phone,
    bio: 'Software Engineer dengan passion di bidang teknologi dan pengembangan sistem digital skala besar.',
    bidang: 'Teknik Informatika', domisili: 'Jakarta', linkedin: '', website: '', foto: false,
  })
  const [pendidikan, setPendidikan] = useState(initPendidikan)
  const [pekerjaan, setPekerjaan] = useState(initPekerjaan)
  const [sertifikasi, setSertifikasi] = useState(initSertifikasi)
  const [publikasi, setPublikasi] = useState(initPublikasi)
  const [notif, setNotif] = useState(initNotif)

  // UI states
  const [modal, setModal] = useState(null)  // { type, item? }
  const [showBell, setShowBell] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const bellRef = useRef(null)
  const profileRef = useRef(null)

  // Click outside for dropdowns
  useEffect(() => {
    function handler(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowBell(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Profile completion
  const completionItems = [
    { label: 'Foto Profil', weight: 10, done: profil.foto },
    { label: 'Bio', weight: 10, done: !!profil.bio },
    { label: 'Bidang/Profesi', weight: 10, done: !!profil.bidang },
    { label: 'Domisili', weight: 10, done: !!profil.domisili },
    { label: 'LinkedIn', weight: 10, done: !!profil.linkedin },
    { label: 'Riwayat Pendidikan', weight: 15, done: pendidikan.length > 0 },
    { label: 'Riwayat Pekerjaan', weight: 15, done: pekerjaan.length > 0 },
    { label: 'Sertifikasi', weight: 10, done: sertifikasi.length > 0 },
    { label: 'Publikasi', weight: 10, done: publikasi.length > 0 },
  ]
  const profileCompletion = completionItems.reduce((a, i) => a + (i.done ? i.weight : 0), 0)
  const missing = completionItems.filter(i => !i.done)

  const unreadCount = notif.filter(n => !n.dibaca).length
  const recentNews = news.slice(0, 3)
  const upcomingAgenda = agendaData.slice(0, 3)
  const activeJobs = initialLowongan.filter(l => l.aktif).slice(0, 3)
  const recentGaleri = initialGaleri.filter(g => g.aktif).slice(0, 4)

  // CRUD helpers
  function addPendidikan(form) { setPendidikan(p => [...p, { ...form, id: Date.now() }]); setModal(null) }
  function editPendidikan(id, form) { setPendidikan(p => p.map(x => x.id === id ? { ...x, ...form } : x)); setModal(null) }
  function delPendidikan(id) { setPendidikan(p => p.filter(x => x.id !== id)) }

  function addPekerjaan(form) { setPekerjaan(p => [{ ...form, id: Date.now(), current: !!form.current }, ...p]); setModal(null) }
  function editPekerjaan(id, form) { setPekerjaan(p => p.map(x => x.id === id ? { ...x, ...form } : x)); setModal(null) }
  function delPekerjaan(id) { setPekerjaan(p => p.filter(x => x.id !== id)) }

  function addSertifikasi(form) { setSertifikasi(p => [...p, { ...form, id: Date.now() }]); setModal(null) }
  function delSertifikasi(id) { setSertifikasi(p => p.filter(x => x.id !== id)) }

  function addPublikasi(form) { setPublikasi(p => [...p, { ...form, id: Date.now() }]); setModal(null) }
  function delPublikasi(id) { setPublikasi(p => p.filter(x => x.id !== id)) }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col">

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#F0A500] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#0A2415]" />
            </div>
            <span className="text-sm font-bold text-[#0A2415] hidden sm:inline">
              Alumni Portal — <span className="text-[#1A5C38]">Daarul Mughni</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <Link to="/direktori" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">Direktori</Link>
            <Link to="/berita" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">Berita</Link>
            <Link to="/agenda" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">Agenda</Link>
            <Link to="/karir" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">Karir</Link>
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Bell */}
            <div ref={bellRef} className="relative">
              <button onClick={() => { setShowBell(v => !v); setShowProfile(false) }}
                className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showBell && (
                  <motion.div {...dropAnim}
                    className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                      <span className="text-sm font-bold text-gray-900">Notifikasi</span>
                      {unreadCount > 0 && (
                        <button onClick={() => setNotif(n => n.map(x => ({ ...x, dibaca: true })))}
                          className="text-[10px] font-semibold text-[#1A5C38] flex items-center gap-1 hover:underline">
                          <CheckCheck className="w-3 h-3" /> Semua Dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notif.map(n => {
                        const Icon = n.icon
                        return (
                          <div key={n.id} onClick={() => setNotif(prev => prev.map(x => x.id === n.id ? { ...x, dibaca: true } : x))}
                            className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.dibaca ? 'bg-green-50/40' : ''}`}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: n.bg }}>
                              <Icon className="w-4 h-4" style={{ color: n.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-800">{n.judul}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{n.pesan}</p>
                              <p className="text-[9px] text-gray-400 mt-1">{n.waktu}</p>
                            </div>
                            {!n.dibaca && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1" />}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button onClick={() => { setShowProfile(v => !v); setShowBell(false) }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1A5C38' }}>
                {initials(profil.nama)}
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div {...dropAnim}
                    className="absolute right-0 top-11 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#1A5C38' }}>
                          {initials(profil.nama)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{profil.nama}</p>
                          <p className="text-[10px] text-[#1A5C38] font-semibold">Alumni Terverifikasi</p>
                          <p className="text-[9px] text-gray-400 font-mono">{mockUser.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setModal({ type: 'editProfil' }); setShowProfile(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings className="w-3.5 h-3.5 text-gray-400" /> Edit Profil
                      </button>
                      <Link to="/profil-alumni" onClick={() => setShowProfile(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Users className="w-3.5 h-3.5 text-gray-400" /> Halaman Profil Publik
                      </Link>
                      <button onClick={() => { setModal({ type: 'kartu' }); setShowProfile(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <FileText className="w-3.5 h-3.5 text-gray-400" /> Unduh Kartu Alumni
                      </button>
                    </div>
                    <div className="border-t border-gray-50 py-1">
                      <button onClick={() => navigate('/login')}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Keluar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-6">

            {/* ── LEFT COLUMN ── */}
            <div className="space-y-5">

              {/* Welcome + Stats */}
              <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'linear-gradient(135deg, #FEFCE8 0%, #F0FDF4 100%)', border: '1px solid #E9F5EE' }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A2415] mb-1.5">
                      Assalamu'alaikum, {profil.nama.split(' ')[0]}!
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed mb-1">{profil.bio || 'Lengkapi bio profil Anda.'}</p>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400 mb-4">
                      {profil.bidang && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{profil.bidang}</span>}
                      {profil.domisili && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profil.domisili}</span>}
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />Angkatan {mockUser.angkatan} · Ke-{mockUser.angkatan - 2005}</span>
                    </div>
                    {/* Stat chips */}
                    <div className="flex items-center gap-2 flex-wrap mb-5">
                      {[
                        { label: `${TOTAL_ALUMNI.toLocaleString('id-ID')} Alumni`, icon: Users, color: '#1A5C38' },
                        { label: 'ID: ' + mockUser.id, icon: FileText, color: '#7C3AED' },
                        { label: `${pekerjaan.length} Pengalaman Kerja`, icon: Briefcase, color: '#D97706' },
                        { label: `${sertifikasi.length} Sertifikasi`, icon: Award, color: '#0E7490' },
                      ].map(({ label, icon: Icon, color }) => (
                        <span key={label} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{ color, backgroundColor: color + '10', borderColor: color + '25' }}>
                          <Icon className="w-3 h-3" />{label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Link to="/direktori" className="px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#1A5C38' }}>
                        Jelajahi Direktori
                      </Link>
                      <button onClick={() => setModal({ type: 'kartu' })}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border text-[#1A5C38] hover:bg-[#1A5C38]/5 transition-colors" style={{ borderColor: '#1A5C38' }}>
                        <Download className="w-3.5 h-3.5 inline mr-1.5" />Kartu Alumni
                      </button>
                      <button onClick={() => setModal({ type: 'editProfil' })}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5 inline mr-1.5" />Edit Profil
                      </button>
                    </div>
                  </div>
                  {/* Profile completion */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <CircularProgress pct={profileCompletion} />
                    <p className="text-xs font-bold text-[#0A2415]">Kelengkapan Profil</p>
                    {missing.length > 0 && (
                      <p className="text-[10px] text-gray-400 text-center max-w-[96px] leading-snug">
                        Belum: {missing.slice(0, 2).map(m => m.label).join(', ')}{missing.length > 2 ? ` +${missing.length - 2}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Riwayat Pendidikan */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4.5 h-4.5 text-[#1A5C38]" />
                    <h2 className="text-sm font-bold text-[#0A2415]">Riwayat Pendidikan</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addPendidikan' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {pendidikan.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada riwayat pendidikan. Tambahkan sekarang.</p>
                ) : (
                  <div className="space-y-4">
                    {pendidikan.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                        {i > 0 && <div className="border-t border-gray-100 mb-4" />}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-[#0A2415]">{p.gelar}</h3>
                            <p className="text-xs font-semibold text-[#1A5C38] mt-0.5">{p.institusi}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.tahun}</span>
                              {p.lokasi && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.lokasi}</span>}
                            </div>
                            {p.deskripsi && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{p.deskripsi}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setModal({ type: 'editPendidikan', item: p })}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-300 hover:text-[#1A5C38] transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => delPendidikan(p.id)}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-200 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Riwayat Pekerjaan */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4.5 h-4.5 text-[#1A5C38]" />
                    <h2 className="text-sm font-bold text-[#0A2415]">Riwayat Pekerjaan</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addPekerjaan' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {pekerjaan.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada riwayat pekerjaan.</p>
                ) : (
                  <div className="space-y-4">
                    {pekerjaan.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                        {i > 0 && <div className="border-t border-gray-100 mb-4" />}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-[#0A2415]">{p.jabatan}</h3>
                              {p.current && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Saat Ini</span>}
                            </div>
                            <p className="text-xs font-semibold text-[#1A5C38] mt-0.5">{p.perusahaan}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.periode}</span>
                              {p.lokasi && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.lokasi}</span>}
                            </div>
                            {p.deskripsi && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{p.deskripsi}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setModal({ type: 'editPekerjaan', item: p })}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-300 hover:text-[#1A5C38] transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => delPekerjaan(p.id)}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-200 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Sertifikasi */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-[#1A5C38]" />
                    <h2 className="text-sm font-bold text-[#0A2415]">Sertifikasi & Kompetensi</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addSertifikasi' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {sertifikasi.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada sertifikasi. Tambahkan untuk meningkatkan profil.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sertifikasi.map((s, i) => (
                      <motion.div key={s.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-[#1A5C38]/20 transition-colors group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0FDF4' }}>
                          <Star className="w-4 h-4 text-[#1A5C38]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 leading-snug">{s.nama}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{s.penerbit} · {s.tahun}</p>
                          {s.noCert && <p className="text-[9px] text-gray-400 font-mono mt-0.5">{s.noCert}</p>}
                        </div>
                        <button onClick={() => delSertifikasi(s.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-300 transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Publikasi */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-[#1A5C38]" />
                    <h2 className="text-sm font-bold text-[#0A2415]">Publikasi & Karya</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addPublikasi' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {publikasi.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada publikasi atau karya.</p>
                ) : (
                  <div className="space-y-3">
                    {publikasi.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 group hover:border-[#1A5C38]/20 transition-colors">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF5FF' }}>
                          <FileText className="w-4 h-4 text-[#7C3AED]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 leading-snug">{p.judul}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{p.penerbit}{p.tahun ? ` · ${p.tahun}` : ''}</p>
                          {p.deskripsi && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{p.deskripsi}</p>}
                          {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="text-[10px] text-[#1A5C38] font-semibold flex items-center gap-1 mt-1 hover:underline"><ExternalLink className="w-3 h-3" />Lihat Publikasi</a>}
                        </div>
                        <button onClick={() => delPublikasi(p.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-300 transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Banner Penghargaan */}
              <div className="rounded-2xl p-5 sm:p-6 flex items-center gap-5" style={{ background: 'linear-gradient(135deg, #1A5C38 0%, #0A2415 100%)' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Award className="w-3.5 h-3.5 text-[#F0A500]" />
                    <span className="text-[10px] font-bold text-[#F0A500] uppercase tracking-widest">Penghargaan Terkini</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">Alumni Inspiratif 2024</h3>
                  <p className="text-xs text-white/55 leading-relaxed">Anda terpilih sebagai kandidat Alumni Inspiratif bidang Teknologi. Pastikan profil lengkap untuk meningkatkan visibilitas Anda.</p>
                </div>
                <button className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold text-[#0A2415] hover:opacity-90 transition-opacity whitespace-nowrap" style={{ backgroundColor: '#F0A500' }}>
                  Lihat Detil
                </button>
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="space-y-4">

              {/* Aksi Cepat */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider mb-3">Aksi Cepat</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Edit Profil', icon: Pencil, action: () => setModal({ type: 'editProfil' }) },
                    { label: 'Tambah Karir', icon: Briefcase, action: () => setModal({ type: 'addPekerjaan' }) },
                    { label: 'Sertifikasi', icon: Award, action: () => setModal({ type: 'addSertifikasi' }) },
                    { label: 'Publikasi', icon: BookOpen, action: () => setModal({ type: 'addPublikasi' }) },
                    { label: 'Kartu Alumni', icon: FileText, action: () => setModal({ type: 'kartu' }) },
                    { label: 'Direktori', icon: Users, action: () => navigate('/direktori') },
                  ].map(({ label, icon: Icon, action }) => (
                    <button key={label} onClick={action}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-gray-100 hover:border-[#1A5C38]/30 hover:bg-[#1A5C38]/5 transition-all">
                      <Icon className="w-4 h-4 text-[#1A5C38]" />
                      <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agenda Mendatang */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider">Agenda Mendatang</h3>
                  <Link to="/agenda" className="text-[10px] font-semibold text-[#1A5C38] hover:underline flex items-center gap-0.5">
                    Semua <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingAgenda.map((a) => {
                    const kStyle = kategoriStyle[a.kategori] ?? { bg: 'bg-gray-200', text: 'text-gray-700' }
                    return (
                      <div key={a.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          {a.image && <img src={a.image} alt={a.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">{a.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />{a.tanggalLabel}
                          </p>
                          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${kStyle.bg} ${kStyle.text}`}>{a.kategoriLabel}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Lowongan Tersedia */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider">Lowongan Tersedia</h3>
                  <Link to="/karir" className="text-[10px] font-semibold text-[#1A5C38] hover:underline flex items-center gap-0.5">
                    Semua <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {activeJobs.map(j => (
                    <div key={j.id} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">{j.judul}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{j.instansi}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[9px] font-semibold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{j.tipe}</span>
                        <span className="text-[9px] text-gray-400 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{j.lokasi}</span>
                      </div>
                      <p className="text-[10px] font-bold text-[#1A5C38] mt-1">{j.gaji}</p>
                    </div>
                  ))}
                </div>
                <Link to="/karir" className="mt-3 block w-full py-2 rounded-xl border border-[#1A5C38]/25 text-xs font-semibold text-[#1A5C38] text-center hover:bg-[#1A5C38]/5 transition-colors">
                  Lihat Semua Lowongan
                </Link>
              </div>

              {/* Galeri Pesantren */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider">Galeri Pesantren</h3>
                  <Link to="/pesantren" className="text-[10px] font-semibold text-[#1A5C38] hover:underline flex items-center gap-0.5">
                    Semua <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {recentGaleri.map(g => (
                    <div key={g.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-pointer">
                      <img src={g.url} alt={g.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Kabar Daarul Mughni */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider">Kabar Terbaru</h3>
                  <Link to="/berita" className="text-[10px] font-semibold text-[#1A5C38] hover:underline flex items-center gap-0.5">
                    Semua <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentNews.map(b => (
                    <Link to={`/berita/${b.slug}`} key={b.slug} className="flex items-start gap-2.5 pb-3 border-b border-gray-50 last:border-0 last:pb-0 group">
                      <div className="w-12 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100">
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1A5C38] transition-colors">{b.title}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{b.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Status Keanggotaan */}
              <div className="rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg, #F0FDF4, #FEFCE8)', borderColor: '#D1FAE5' }}>
                <h3 className="text-xs font-bold text-[#0A2415] mb-3">Status Keanggotaan</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Terverifikasi
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">{mockUser.id}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
                  ID Alumni Anda aktif dan terverifikasi. Gunakan ID ini untuk akses khusus ke fasilitas dan layanan alumni Daarul Mughni.
                </p>
                <button onClick={() => setModal({ type: 'kartu' })}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: '#1A5C38' }}>
                  <Download className="w-3.5 h-3.5" /> Unduh Kartu Alumni (PDF)
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* ── Modals ── */}
      {modal?.type === 'editProfil' && (
        <EditProfilModal profil={profil} onSave={form => setProfil(p => ({ ...p, ...form }))} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addPendidikan' && (
        <PendidikanModal item={null} onSave={addPendidikan} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editPendidikan' && (
        <PendidikanModal item={modal.item} onSave={form => editPendidikan(modal.item.id, form)} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addPekerjaan' && (
        <KarirModal item={null} onSave={addPekerjaan} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editPekerjaan' && (
        <KarirModal item={modal.item} onSave={form => editPekerjaan(modal.item.id, form)} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addSertifikasi' && (
        <SertifikasiModal item={null} onSave={addSertifikasi} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addPublikasi' && (
        <PublikasiModal item={null} onSave={addPublikasi} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'kartu' && (
        <KartuAlumniModal user={mockUser} profil={profil} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
