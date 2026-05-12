import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, Shield, GraduationCap, Briefcase, Plus, Pencil,
  BookOpen, Award, MapPin, Calendar, UserPlus, X, Download,
  ChevronDown,
} from 'lucide-react'
import Footer from '../components/landing/Footer'

const mockUser = {
  name: 'Ahmad Zaki',
  angkatan: 2018,
  id: 'DM 2018-042',
  profileCompletion: 85,
}

const pendidikan = [
  {
    id: 1,
    gelar: 'Sarjana Teknik Informatika',
    institusi: 'Institut Teknologi Bandung',
    tahun: '2018 - 2022',
    lokasi: 'Bandung, Jawa Barat',
    deskripsi: 'Lulus dengan predikat Cum Laude. Fokus pada kecerdasan buatan dan pengembangan sistem skala besar.',
  },
  {
    id: 2,
    gelar: 'Pendidikan Pesantren (Madrasah Aliyah)',
    institusi: 'Pondok Pesantren Daarul Mughni',
    tahun: '2015 - 2018',
    lokasi: 'Bogor, Jawa Barat',
    deskripsi: "Aktif dalam organisasi santri (ISDM) dan meraih juara 1 Musabaqah Qira'atil Kutub tingkat Kabupaten.",
  },
]

const pekerjaan = [
  {
    id: 1,
    jabatan: 'Software Engineer',
    perusahaan: 'TechNova Solutions',
    periode: 'Jan 2023 - Sekarang',
    lokasi: 'Jakarta (Remote)',
    deskripsi: 'Mengembangkan platform e-learning untuk korporasi menggunakan React, Node.js, dan arsitektur microservices.',
    current: true,
  },
  {
    id: 2,
    jabatan: 'Junior Web Developer',
    perusahaan: 'Creative Digital Agency',
    periode: 'Jun 2022 - Des 2022',
    lokasi: 'Bandung, Jawa Barat',
    deskripsi: 'Bertanggung jawab atas pengembangan front-end untuk 10+ klien UMKM di wilayah Jawa Barat.',
    current: false,
  },
]

const berita = [
  { id: 1, judul: 'Persiapan Reuni Akbar 25 Tahun Daarul Mughni: Catat Tanggalnya!', tanggal: '13 Mei 2024' },
  { id: 2, judul: 'Pondok Pesantren Resmikan Gedung Laboratorium Bahasa Baru', tanggal: '12 Mei 2024' },
  { id: 3, judul: 'Prestasi Santri: Juara Umum Musabaqah Antar Pondok Se-Bogor', tanggal: '08 Mei 2024' },
]

const mungkinKenal = [
  { id: 1, nama: 'Fadhil Muhammad', bidang: 'Hukum', angkatan: 2018 },
  { id: 2, nama: 'Siti Aisyah', bidang: 'Kedokteran', angkatan: 2017 },
  { id: 3, nama: 'Ridwan Hakim', bidang: 'Ekonomi Syariah', angkatan: 2018 },
]

const aksiCepat = [
  { label: 'Edit Profil', icon: Pencil, modal: 'editProfil' },
  { label: 'Tambah Karir', icon: Plus, modal: 'tambahKarir' },
  { label: 'Publikasi', icon: BookOpen, modal: 'publikasi' },
  { label: 'Sertifikasi', icon: Award, modal: 'sertifikasi' },
]

const ANGKATAN_LIST = Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i)

function useScrollLock() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
}

function ModalWrapper({ onClose, children }) {
  useScrollLock()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {children}
    </div>
  )
}

function inputCls(extra = '') {
  return `w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all ${extra}`
}

function ModalField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function EditProfilModal({ onClose }) {
  const [form, setForm] = useState({ nama: mockUser.name, bio: '', bidang: 'Teknik Informatika', domisili: 'Jakarta', linkedin: '', website: '' })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Profil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <ModalField label="Nama Lengkap">
            <input type="text" value={form.nama} onChange={set('nama')} className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <ModalField label="Bio Singkat">
            <textarea value={form.bio} onChange={set('bio')} rows={3} placeholder="Ceritakan tentang diri Anda..."
              className={inputCls('resize-none')}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Bidang / Profesi">
              <input type="text" value={form.bidang} onChange={set('bidang')} className={inputCls()}
                onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </ModalField>
            <ModalField label="Domisili">
              <input type="text" value={form.domisili} onChange={set('domisili')} className={inputCls()}
                onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </ModalField>
          </div>
          <ModalField label="URL LinkedIn">
            <input type="url" value={form.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/username"
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <ModalField label="Website / Portofolio">
            <input type="url" value={form.website} onChange={set('website')} placeholder="https://portofolio.com"
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <ModalField label="Foto Profil">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-green-400 transition-colors cursor-pointer">
              <p className="text-sm text-gray-400">Klik untuk upload foto</p>
              <p className="text-xs text-gray-300 mt-1">JPG, PNG — maks. 2MB</p>
            </div>
          </ModalField>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function TambahKarirModal({ onClose }) {
  const [form, setForm] = useState({ jabatan: '', perusahaan: '', dari: '', sampai: '', lokasi: '', deskripsi: '', current: false })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Tambah Riwayat Pekerjaan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <ModalField label="Jabatan / Posisi">
            <input type="text" value={form.jabatan} onChange={set('jabatan')} placeholder="contoh: Software Engineer"
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <ModalField label="Perusahaan / Instansi">
            <input type="text" value={form.perusahaan} onChange={set('perusahaan')} placeholder="Nama perusahaan"
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Dari">
              <input type="month" value={form.dari} onChange={set('dari')} className={inputCls()}
                onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </ModalField>
            <ModalField label="Sampai">
              <input type="month" value={form.sampai} onChange={set('sampai')} disabled={form.current} className={inputCls()}
                onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </ModalField>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm((p) => ({ ...p, current: e.target.checked }))} className="w-4 h-4 accent-green-600" />
            <span className="text-sm text-gray-600">Masih bekerja di sini</span>
          </label>
          <ModalField label="Lokasi">
            <input type="text" value={form.lokasi} onChange={set('lokasi')} placeholder="Jakarta (Remote)"
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <ModalField label="Deskripsi">
            <textarea value={form.deskripsi} onChange={set('deskripsi')} rows={3} placeholder="Uraian singkat tanggung jawab..."
              className={inputCls('resize-none')}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
          <button onClick={onClose} disabled={!form.jabatan || !form.perusahaan}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function PublikasiModal({ onClose }) {
  const [form, setForm] = useState({ judul: '', penerbit: '', tahun: '', url: '', deskripsi: '' })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Tambah Publikasi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <ModalField label="Judul Publikasi">
            <input type="text" value={form.judul} onChange={set('judul')} placeholder="Judul artikel / buku / jurnal"
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Penerbit / Media">
              <input type="text" value={form.penerbit} onChange={set('penerbit')} placeholder="Nama penerbit"
                className={inputCls()}
                onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </ModalField>
            <ModalField label="Tahun Terbit">
              <input type="number" value={form.tahun} onChange={set('tahun')} placeholder="2024" min="2000" max="2026"
                className={inputCls()}
                onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </ModalField>
          </div>
          <ModalField label="URL / Tautan">
            <input type="url" value={form.url} onChange={set('url')} placeholder="https://..."
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <ModalField label="Deskripsi Singkat">
            <textarea value={form.deskripsi} onChange={set('deskripsi')} rows={3}
              className={inputCls('resize-none')}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
          <button onClick={onClose} disabled={!form.judul}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function SertifikasiModal({ onClose }) {
  const [form, setForm] = useState({ nama: '', penerbit: '', tahun: '', noCert: '', url: '' })
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Tambah Sertifikasi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <ModalField label="Nama Sertifikasi">
            <input type="text" value={form.nama} onChange={set('nama')} placeholder="contoh: Google Professional Cloud Architect"
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Penerbit">
              <input type="text" value={form.penerbit} onChange={set('penerbit')} placeholder="Google, Microsoft, dll"
                className={inputCls()}
                onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </ModalField>
            <ModalField label="Tahun">
              <input type="number" value={form.tahun} onChange={set('tahun')} placeholder="2024"
                className={inputCls()}
                onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
            </ModalField>
          </div>
          <ModalField label="Nomor Sertifikat (opsional)">
            <input type="text" value={form.noCert} onChange={set('noCert')} placeholder="Nomor / ID sertifikat"
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
          <ModalField label="URL Verifikasi (opsional)">
            <input type="url" value={form.url} onChange={set('url')} placeholder="https://..."
              className={inputCls()}
              onFocus={(e) => (e.target.style.borderColor = '#1A5C38')} onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
          </ModalField>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
          <button onClick={onClose} disabled={!form.nama}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function KartuAlumniModal({ onClose }) {
  useScrollLock()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Card */}
        <div className="w-80 rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #0A2415 0%, #1A5C38 60%, #2A7A4F 100%)' }}>
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Alumni Portal</p>
                <p className="text-xs font-bold text-white leading-tight">Pondok Pesantren<br />Daarul Mughni</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#F0A500] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#0A2415]" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold text-white">
                {initials(mockUser.name)}
              </div>
              <div>
                <p className="text-base font-bold text-white">{mockUser.name}</p>
                <p className="text-xs text-white/60">Angkatan {mockUser.angkatan} (Ke-{mockUser.angkatan - 2005})</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[10px] text-green-300 font-semibold">Terverifikasi</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black/20 px-6 py-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-wider">ID Alumni</p>
              <p className="text-sm font-bold text-[#F0A500] font-mono">{mockUser.id}</p>
            </div>
            <p className="text-[9px] text-white/30">© 2026 Daarul Mughni</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4" /> Unduh Kartu
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

function CircularProgress({ pct }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="9" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="#F0A500" strokeWidth="9"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-[#0A2415]">{pct}%</span>
      </div>
    </div>
  )
}

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function AlumniDashboardPage() {
  const [modal, setModal] = useState(null)

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#F0A500] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#0A2415]" />
            </div>
            <span className="text-sm font-bold text-[#0A2415] hidden sm:inline">
              Alumni Portal —{' '}
              <span className="text-[#1A5C38]">Pondok Pesantren Daarul Mughni</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/direktori" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">
              Direktori
            </Link>
            <Link to="/pesantren" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">
              Tentang Kami
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <button className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
              <Shield className="w-4.5 h-4.5" />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ml-1" style={{ backgroundColor: '#1A5C38' }}>
              {initials(mockUser.name)}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* Welcome card */}
            <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6" style={{ backgroundColor: '#FEFCE8' }}>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#0A2415] mb-2">
                  Assalamu'alaikum, {mockUser.name}!
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  Selamat datang kembali di Portal Alumni Daarul Mughni. Mari terus memperbarui profil Anda untuk membangun jaringan profesional yang lebih kuat.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    to="/direktori"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#1A5C38' }}
                  >
                    Jelajahi Direktori
                  </Link>
                  <button onClick={() => setModal('kartu')} className="px-4 py-2 rounded-lg text-sm font-semibold border text-[#1A5C38] hover:bg-[#1A5C38]/5 transition-colors" style={{ borderColor: '#1A5C38' }}>
                    Unduh Kartu Alumni
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <CircularProgress pct={mockUser.profileCompletion} />
                <p className="text-xs font-bold text-[#0A2415] mt-1">Kelengkapan Profil</p>
                <p className="text-[10px] text-gray-400">Tingkatkan untuk verifikasi penuh</p>
              </div>
            </div>

            {/* Riwayat Pendidikan */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4.5 h-4.5 text-[#1A5C38]" />
                  <h2 className="text-sm font-bold text-[#0A2415]">Riwayat Pendidikan</h2>
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Tambah Baru
                </button>
              </div>
              <div className="space-y-5">
                {pendidikan.map((p, i) => (
                  <div key={p.id}>
                    {i > 0 && <div className="border-t border-gray-100 mb-5" />}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-[#0A2415]">{p.gelar}</h3>
                        <p className="text-xs font-semibold text-[#1A5C38] mt-0.5">{p.institusi}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{p.tahun}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{p.lokasi}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{p.deskripsi}</p>
                      </div>
                      <button className="shrink-0 w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-300 hover:text-[#1A5C38] transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Riwayat Pekerjaan */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4.5 h-4.5 text-[#1A5C38]" />
                  <h2 className="text-sm font-bold text-[#0A2415]">Riwayat Pekerjaan</h2>
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Tambah Baru
                </button>
              </div>
              <div className="space-y-5">
                {pekerjaan.map((p, i) => (
                  <div key={p.id}>
                    {i > 0 && <div className="border-t border-gray-100 mb-5" />}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-[#0A2415]">{p.jabatan}</h3>
                          {p.current && (
                            <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Saat Ini
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#1A5C38] mt-0.5">{p.perusahaan}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{p.periode}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{p.lokasi}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{p.deskripsi}</p>
                      </div>
                      <button className="shrink-0 w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-300 hover:text-[#1A5C38] transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Penghargaan banner */}
            <div
              className="rounded-2xl p-6 flex items-center gap-6"
              style={{ background: 'linear-gradient(135deg, #1A5C38 0%, #0A2415 100%)' }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-3.5 h-3.5 text-[#F0A500]" />
                  <span className="text-[10px] font-bold text-[#F0A500] uppercase tracking-widest">
                    Penghargaan Terkini
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">Alumni Inspiratif 2024</h3>
                <p className="text-xs text-white/55 leading-relaxed">
                  Anda terpilih sebagai kandidat Alumni Inspiratif bidang Teknologi. Pastikan profil Anda lengkap untuk meningkatkan visibilitas di depan tim seleksi dan calon mitra kerja.
                </p>
              </div>
              <button
                className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-[#0A2415] whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#F0A500' }}
              >
                Lihat Selengkapnya
              </button>
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-4">

            {/* Aksi Cepat */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-[#0A2415] mb-3">Aksi Cepat</h3>
              <div className="grid grid-cols-2 gap-2">
                {aksiCepat.map(({ label, icon: Icon, modal: m }) => (
                  <button
                    key={label}
                    onClick={() => setModal(m)}
                    className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl border border-gray-100 hover:border-[#1A5C38]/25 hover:bg-[#1A5C38]/5 transition-all"
                  >
                    <Icon className="w-4 h-4 text-[#1A5C38]" />
                    <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kabar Daarul Mughni */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0A2415]">Kabar Daarul Mughni</h3>
                <Link to="/berita" className="text-xs font-semibold text-[#1A5C38] hover:underline">
                  Lihat Semua
                </Link>
              </div>
              <div className="space-y-3.5">
                {berita.map((b) => (
                  <div key={b.id} className="flex items-start gap-3">
                    <div className="w-14 h-12 rounded-lg shrink-0 overflow-hidden bg-gradient-to-br from-[#1A5C38]/15 to-[#F0A500]/15" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0A2415] leading-snug line-clamp-2">{b.judul}</p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />{b.tanggal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mungkin Anda Kenal */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-[#0A2415]">Mungkin Anda Kenal</h3>
              <p className="text-[11px] text-gray-400 mb-4 mt-0.5">Berdasarkan tahun kelulusan 2018</p>
              <div className="space-y-3">
                {mungkinKenal.map((m) => (
                  <div key={m.id} className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: '#1A5C38', color: '#fff' }}
                    >
                      {initials(m.nama)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0A2415] truncate">{m.nama}</p>
                      <p className="text-[10px] text-gray-400">{m.bidang} · Angkatan {m.angkatan}</p>
                    </div>
                    <button className="shrink-0 w-7 h-7 rounded-lg border border-[#1A5C38]/25 hover:bg-[#1A5C38]/10 flex items-center justify-center text-[#1A5C38] transition-colors">
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-xl border border-[#1A5C38]/25 text-xs font-semibold text-[#1A5C38] hover:bg-[#1A5C38]/5 transition-colors">
                Cari Teman Lainnya
              </button>
            </div>

            {/* Status Keanggotaan */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-[#0A2415] mb-3">Status Keanggotaan</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Terverifikasi
                </span>
                <span className="text-[11px] text-gray-400 font-mono">ID: {mockUser.id}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Gunakan ID Alumni Anda untuk mendapatkan akses khusus saat berkunjung ke Pondok Pesantren atau menggunakan fasilitas perpustakaan.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {modal === 'editProfil' && <EditProfilModal onClose={() => setModal(null)} />}
      {modal === 'tambahKarir' && <TambahKarirModal onClose={() => setModal(null)} />}
      {modal === 'publikasi' && <PublikasiModal onClose={() => setModal(null)} />}
      {modal === 'sertifikasi' && <SertifikasiModal onClose={() => setModal(null)} />}
      {modal === 'kartu' && <KartuAlumniModal onClose={() => setModal(null)} />}
    </div>
  )
}
