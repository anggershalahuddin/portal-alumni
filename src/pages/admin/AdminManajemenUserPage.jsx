import { useState, useRef, useEffect } from 'react'
import {
  Search, Bell, Shield, CheckCircle, Users,
  Download, ChevronDown, ChevronLeft, ChevronRight,
  MoreHorizontal, UserPlus, X, Pencil, Trash2,
  Lock, Key, Eye, EyeOff,
} from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { PaginationBar, PerPageSelector } from '../../components/PaginationBar'
import { initialAngkatan, getAngkatanKe } from '../../data/angkatan'

// ── Constants ────────────────────────────────────────────────────────────────

const PERAN_OPTIONS = ['Super Admin', 'Admin', 'Editor', 'Alumni']

const PERAN_STYLE = {
  'Super Admin': { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
  'Admin':       { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Editor':      { bg: '#FAF5FF', text: '#7C3AED', border: '#DDD6FE' },
  'Alumni':      { bg: '#F0FDFF', text: '#0E7490', border: '#BAE6FD' },
}

const ALL_PERMISSIONS = [
  { id: 'dashboard',  label: 'Dashboard Admin',     desc: 'Lihat statistik dan ringkasan portal' },
  { id: 'berita',     label: 'Kelola Berita',        desc: 'Buat, edit, arsip, dan hapus artikel berita' },
  { id: 'agenda',     label: 'Kelola Agenda',        desc: 'Tambah dan kelola jadwal acara & kegiatan' },
  { id: 'galeri',     label: 'Kelola Galeri',        desc: 'Unggah dan kelola foto dokumentasi kegiatan' },
  { id: 'angkatan',   label: 'Kelola Angkatan',      desc: 'Tambah dan kelola data angkatan lulusan pondok' },
  { id: 'organisasi', label: 'Kelola Organisasi',    desc: 'Kelola data organisasi dan lembaga alumni' },
  { id: 'karir',      label: 'Kelola Lowongan',      desc: 'Buat dan kelola lowongan pekerjaan pesantren (Admin/SuperAdmin saja)' },
  { id: 'verifikasi', label: 'Verifikasi Alumni',    desc: 'Proses permohonan verifikasi alumni baru' },
  { id: 'users',      label: 'Manajemen User',       desc: 'Kelola akun, peran, dan hak akses pengguna' },
]

const DEFAULT_PERMISSIONS = {
  'Super Admin': ALL_PERMISSIONS.map(p => p.id),
  'Admin':       ['dashboard', 'berita', 'agenda', 'galeri', 'angkatan', 'organisasi', 'karir', 'verifikasi'],
  'Editor':      ['dashboard', 'berita', 'agenda', 'galeri'],
  'Alumni':      [],
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const initialUsers = [
  { id: 0,  name: 'Administrator',   email: 'superadmin@daarulmughni.ac.id', phone: '0811-0000-0000', angkatan: 2005, peran: 'Super Admin', aktif: true,  lastLogin: 'Hari ini, 09:15', avatar: '', profesi: 'Pengelola Portal', kota: 'Bogor', permissions: ALL_PERMISSIONS.map(p => p.id) },
  { id: 1,  name: 'Ahmad Fauzi',     email: 'ahmad.fauzi@email.com',         phone: '0812-1111-2222', angkatan: 2015, peran: 'Alumni',      aktif: true,  lastLogin: '10 Okt 2023, 14:20', avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Software Engineer', kota: 'Jakarta', permissions: [] },
  { id: 2,  name: 'Siti Aminah',     email: 'siti.aminah@email.com',         phone: '0813-2233-4455', angkatan: 2018, peran: 'Editor',      aktif: true,  lastLogin: '12 Okt 2023, 08:45', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Jurnalis', kota: 'Bogor', permissions: ['dashboard', 'berita', 'agenda'] },
  { id: 3,  name: 'Budi Santoso',    email: 'budi.santoso@email.com',        phone: '0814-3344-5566', angkatan: 2012, peran: 'Admin',       aktif: true,  lastLogin: '13 Okt 2023, 11:10', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Guru', kota: 'Sukabumi', permissions: ['dashboard', 'berita', 'agenda', 'verifikasi'] },
  { id: 4,  name: 'Dewi Lestari',    email: 'dewi.lestari@email.com',        phone: '0815-4455-6677', angkatan: 2020, peran: 'Alumni',      aktif: false, lastLogin: '01 Sep 2023, 16:00', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Mahasiswa', kota: 'Bandung', permissions: [] },
  { id: 5,  name: 'Rian Hidayat',    email: 'rian.hidayat@email.com',        phone: '0816-5566-7788', angkatan: 2017, peran: 'Alumni',      aktif: true,  lastLogin: '11 Okt 2023, 19:45', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Wirausaha', kota: 'Depok', permissions: [] },
  { id: 6,  name: 'Nurul Hidayah',   email: 'nurul.hid@email.com',           phone: '0817-6677-8899', angkatan: 2020, peran: 'Alumni',      aktif: true,  lastLogin: '09 Okt 2023, 10:30', avatar: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Mahasiswa', kota: 'Bogor', permissions: [] },
  { id: 7,  name: 'Fatimah Az-Zahra',email: 'fatimah.az@email.com',          phone: '0818-7788-9900', angkatan: 2019, peran: 'Alumni',      aktif: true,  lastLogin: '08 Okt 2023, 07:15', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Pendidik', kota: 'Cianjur', permissions: [] },
  { id: 8,  name: 'Hasan Basri',     email: 'hasan.b@email.com',             phone: '0819-8899-0011', angkatan: 2010, peran: 'Alumni',      aktif: false, lastLogin: '20 Agu 2023, 09:00', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Pengusaha', kota: 'Bekasi', permissions: [] },
  { id: 9,  name: 'Zahra Putri',     email: 'zahra.p@email.com',             phone: '0820-9900-1122', angkatan: 2022, peran: 'Alumni',      aktif: true,  lastLogin: '07 Okt 2023, 16:00', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Mahasiswa', kota: 'Bogor', permissions: [] },
  { id: 10, name: 'Irfan Hakim',     email: 'irfan.h@email.com',             phone: '0821-0011-2233', angkatan: 2014, peran: 'Editor',      aktif: true,  lastLogin: '06 Okt 2023, 12:45', avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Desainer Grafis', kota: 'Jakarta', permissions: ['dashboard', 'berita'] },
  { id: 11, name: 'Mira Santika',    email: 'mira.s@email.com',              phone: '0822-1122-3344', angkatan: 2016, peran: 'Alumni',      aktif: true,  lastLogin: '05 Okt 2023, 11:20', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Dokter', kota: 'Bandung', permissions: [] },
  { id: 12, name: 'Doni Pratama',    email: 'doni.p@email.com',              phone: '0823-2233-4455', angkatan: 2013, peran: 'Alumni',      aktif: false, lastLogin: '10 Jul 2023, 08:00', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=48&h=48&q=80&crop=faces', profesi: 'Advokat', kota: 'Jakarta', permissions: [] },
]

// ── Helper Components ────────────────────────────────────────────────────────

function Toggle({ aktif, onChange, disabled }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="relative w-10 h-6 rounded-full transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ backgroundColor: aktif ? '#22C55E' : '#D1D5DB' }}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: aktif ? 'translateX(18px)' : 'translateX(4px)' }}
      />
    </button>
  )
}

function Avatar({ user, size = 9 }) {
  const cls = `w-${size} h-${size} rounded-full flex-shrink-0`
  if (user.avatar) {
    return <img src={user.avatar} alt={user.name} className={`${cls} object-cover bg-gray-100`} />
  }
  return (
    <div className={`${cls} flex items-center justify-center text-white text-xs font-bold`} style={{ backgroundColor: '#1A5C38' }}>
      {user.name.charAt(0)}
    </div>
  )
}

// ── Action Dropdown ──────────────────────────────────────────────────────────

function ActionMenu({ user, onEdit, onPermission, onToggle, onDelete, onClose }) {
  const ref = useRef(null)
  const isSuperAdmin = user.peran === 'Super Admin'

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return (
    <div ref={ref} className="absolute right-0 top-9 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-40">
      <button onClick={onEdit}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
        <Pencil className="w-3.5 h-3.5 text-gray-400" /> Edit Data User
      </button>
      {(user.peran === 'Admin' || user.peran === 'Editor') && (
        <button onClick={onPermission}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <Key className="w-3.5 h-3.5 text-gray-400" /> Atur Hak Akses
        </button>
      )}
      {!isSuperAdmin && (
        <button onClick={onToggle}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          {user.aktif
            ? <EyeOff className="w-3.5 h-3.5 text-gray-400" />
            : <Eye className="w-3.5 h-3.5 text-gray-400" />
          }
          {user.aktif ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
        </button>
      )}
      {!isSuperAdmin && (
        <>
          <div className="my-1 border-t border-gray-100" />
          <button onClick={onDelete}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Hapus User
          </button>
        </>
      )}
    </div>
  )
}

// ── Edit User Modal ──────────────────────────────────────────────────────────

function EditUserModal({ user, onClose, onSave }) {
  const isSuperAdmin = user.peran === 'Super Admin'
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || '',
    angkatan: String(user.angkatan),
    peran: user.peran,
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors'
  const angkatanInfo = initialAngkatan.find(a => a.tahunLulusan === Number(form.angkatan))
  const angkatanKe = angkatanInfo ? angkatanInfo.angkatanKe : getAngkatanKe(form.angkatan)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar user={user} size={9} />
            <div>
              <h2 className="text-sm font-bold text-gray-900">Edit Data User</h2>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nama Lengkap</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputCls} />
          </div>

          {/* Email — display only */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Email
              <span className="ml-1.5 text-[10px] font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Tidak dapat diubah</span>
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
              {user.email}
            </div>
          </div>

          {/* No HP */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">No. HP / WhatsApp</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="08xx-xxxx-xxxx" className={inputCls} />
          </div>

          {/* Tahun Lulus + Angkatan ke */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tahun Lulus</label>
              <select value={form.angkatan} onChange={e => setForm({ ...form, angkatan: e.target.value })}
                className={inputCls}>
                {Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Angkatan Ke</label>
              <div className="px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm">
                {angkatanKe ? (
                  <span className="font-bold text-[#1A5C38]">Angkatan {angkatanKe}</span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
                {angkatanInfo && (
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{angkatanInfo.nama}</p>
                )}
              </div>
            </div>
          </div>

          {/* Peran */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Peran</label>
            {isSuperAdmin ? (
              <div className={`${inputCls} flex items-center gap-2 bg-gray-50 text-gray-400 cursor-not-allowed`}>
                <Lock className="w-3.5 h-3.5" />
                Super Admin
              </div>
            ) : (
              <select value={form.peran} onChange={e => setForm({ ...form, peran: e.target.value })}
                className={inputCls}>
                {PERAN_OPTIONS.filter(p => p !== 'Super Admin').map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            )}
            {!isSuperAdmin && (form.peran === 'Admin' || form.peran === 'Editor') && (
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <Key className="w-3 h-3" />
                Atur hak akses via menu "Atur Hak Akses" setelah menyimpan.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            onClick={() => form.name && onSave({ ...form, angkatan: Number(form.angkatan) })}
            disabled={!form.name}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#1A5C38' }}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Permission Modal ─────────────────────────────────────────────────────────

function PermissionModal({ user, onClose, onSave }) {
  const [perms, setPerms] = useState(user.permissions || [])
  const isSuperAdmin = user.peran === 'Super Admin'
  const isAlumni = user.peran === 'Alumni'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function toggle(id) {
    setPerms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  function setAll(val) {
    setPerms(val ? ALL_PERMISSIONS.map(p => p.id) : [])
  }

  const isLocked = isSuperAdmin || isAlumni

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Atur Hak Akses</h2>
            <p className="text-xs text-gray-400 mt-0.5">{user.name} · {user.peran}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {isSuperAdmin && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
              <Lock className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">Super Admin memiliki akses penuh ke semua fitur dan tidak dapat dibatasi.</p>
            </div>
          )}
          {isAlumni && (
            <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
              <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 font-medium">Alumni tidak memiliki akses ke fitur admin. Ubah peran menjadi Admin atau Editor untuk memberikan akses.</p>
            </div>
          )}

          {!isLocked && (
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fitur yang Dapat Diakses</p>
              <div className="flex gap-2">
                <button onClick={() => setAll(true)} className="text-xs text-green-700 font-semibold hover:underline">Pilih Semua</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => setAll(false)} className="text-xs text-gray-500 font-semibold hover:underline">Hapus Semua</button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {ALL_PERMISSIONS.map(p => {
              const checked = isSuperAdmin || perms.includes(p.id)
              return (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                    isLocked
                      ? 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      : checked
                        ? 'border-green-200 bg-green-50/50 cursor-pointer'
                        : 'border-gray-100 hover:border-gray-200 cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={isLocked}
                    onChange={() => !isLocked && toggle(p.id)}
                    className="mt-0.5 w-4 h-4 rounded accent-green-600 flex-shrink-0"
                  />
                  <div>
                    <p className={`text-sm font-semibold ${isLocked && !isSuperAdmin ? 'text-gray-400' : 'text-gray-800'}`}>{p.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.desc}</p>
                  </div>
                  {isSuperAdmin && <Lock className="w-3.5 h-3.5 text-gray-300 ml-auto mt-0.5 flex-shrink-0" />}
                </label>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          {!isLocked && (
            <button
              onClick={() => onSave(perms)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Simpan Hak Akses
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Tambah User Modal ────────────────────────────────────────────────────────

function TambahUserModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', angkatan: '2024', peran: 'Alumni', profesi: '', kota: '' })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Tambah User Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Nama alumni" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="email@contoh.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">No. HP</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="08xx-xxxx-xxxx" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Angkatan</label>
              <select value={form.angkatan} onChange={e => setForm({ ...form, angkatan: e.target.value })} className={inputCls}>
                {Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Peran</label>
              <select value={form.peran} onChange={e => setForm({ ...form, peran: e.target.value })} className={inputCls}>
                {PERAN_OPTIONS.filter(p => p !== 'Super Admin').map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profesi</label>
              <input type="text" value={form.profesi} onChange={e => setForm({ ...form, profesi: e.target.value })}
                placeholder="contoh: Mahasiswa" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kota</label>
              <input type="text" value={form.kota} onChange={e => setForm({ ...form, kota: e.target.value })}
                placeholder="contoh: Bogor" className={inputCls} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            onClick={() => form.name && form.email && onSave(form)}
            disabled={!form.name || !form.email}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: '#1A5C38' }}
          >
            Tambah User
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function AdminManajemenUserPage() {
  const [users, setUsers] = useState(initialUsers)
  const [modal, setModal] = useState(null)   // { type: 'edit'|'permission'|'tambah', user? }
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [filterPeran, setFilterPeran] = useState('')
  const [filterAktif, setFilterAktif] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState(null)

  /* Filter */
  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || String(u.angkatan).includes(q) || (u.profesi || '').toLowerCase().includes(q)
    const matchPeran = !filterPeran || u.peran === filterPeran
    const matchAktif = !filterAktif || (filterAktif === 'aktif' ? u.aktif : !u.aktif)
    return matchSearch && matchPeran && matchAktif
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage)
  const startIdx = filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1
  const endIdx = Math.min(safePage * perPage, filtered.length)

  const totalAktif = users.filter(u => u.aktif).length

  /* Selection */
  const pagedIds = paged.map(u => u.id)
  const allPageSelected = pagedIds.length > 0 && pagedIds.every(id => selected.includes(id))
  const somePageSelected = pagedIds.some(id => selected.includes(id))

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  function toggleAll() {
    setSelected(prev =>
      allPageSelected
        ? prev.filter(id => !pagedIds.includes(id))
        : [...new Set([...prev, ...pagedIds])]
    )
  }

  /* Actions */
  function toggleAktif(id) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, aktif: !u.aktif } : u))
    setOpenMenuId(null)
  }

  function deleteUser(id) {
    setUsers(prev => prev.filter(u => u.id !== id))
    setSelected(prev => prev.filter(i => i !== id))
    setOpenMenuId(null)
  }

  function saveEdit(id, form) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...form, permissions: form.peran !== u.peran ? DEFAULT_PERMISSIONS[form.peran] : u.permissions } : u))
    setModal(null)
  }

  function savePermissions(id, perms) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, permissions: perms } : u))
    setModal(null)
  }

  function addUser(form) {
    setUsers(prev => [{
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone || '',
      angkatan: Number(form.angkatan),
      peran: form.peran,
      aktif: true,
      lastLogin: '—',
      avatar: '',
      profesi: form.profesi || '',
      kota: form.kota || '',
      permissions: DEFAULT_PERMISSIONS[form.peran] || [],
    }, ...prev])
    setModal(null)
  }

  /* Bulk Actions */
  function bulkSetAktif(val) {
    setUsers(prev => prev.map(u => selected.includes(u.id) && u.peran !== 'Super Admin' ? { ...u, aktif: val } : u))
    setSelected([])
  }

  function bulkDelete() {
    if (!window.confirm(`Hapus ${selected.length} user yang dipilih? Tindakan ini tidak dapat dibatalkan.`)) return
    setUsers(prev => prev.filter(u => !selected.includes(u.id) || u.peran === 'Super Admin'))
    setSelected([])
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="users" />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Cari user..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-green-400 focus:bg-white transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0A500' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#0A2415' }} />
            </div>
            <span className="font-bold text-gray-900 text-sm">Portal Alumni Daarul Mughni Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">Admin Utama</p>
                <p className="text-[10px] text-gray-400">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold" style={{ backgroundColor: '#0A2415' }}>A</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 space-y-5">

          {/* Title + Actions */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Manajemen User</h1>
              <p className="text-sm text-gray-500 mt-0.5">Kelola peran, hak akses, dan data seluruh pengguna portal.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" /> Ekspor CSV
              </button>
              <button
                onClick={() => setModal({ type: 'tambah' })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#1A5C38' }}
              >
                <UserPlus className="w-4 h-4" /> Tambah User
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Users,       iconBg: '#F0FDFF', iconColor: '#0E7490', value: users.length, label: 'Total User' },
              { icon: CheckCircle, iconBg: '#F0FDF4', iconColor: '#22C55E', value: totalAktif,   label: 'User Aktif' },
              { icon: Shield,      iconBg: '#FFF7ED', iconColor: '#F59E0B', value: 42,           label: 'Menunggu Verifikasi' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.iconBg }}>
                    <Icon className="w-6 h-6" style={{ color: s.iconColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
                    <p className="text-2xl font-extrabold text-gray-900">{s.value.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Filter bar */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Cari nama, email, angkatan, profesi..."
                  value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-green-400 focus:bg-white transition-all" />
              </div>
              <div className="relative">
                <select value={filterPeran} onChange={e => { setFilterPeran(e.target.value); setPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-green-400 cursor-pointer">
                  <option value="">Semua Peran</option>
                  {PERAN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={filterAktif} onChange={e => { setFilterAktif(e.target.value); setPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-green-400 cursor-pointer">
                  <option value="">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="ml-auto">
                <PerPageSelector value={perPage} options={[5, 10, 20]} onChange={n => { setPerPage(n); setPage(1) }} />
              </div>
            </div>

            {/* Bulk Action Bar */}
            {selected.length > 0 && (
              <div className="px-5 py-3 bg-[#0A2415] flex items-center gap-3 flex-wrap">
                <span className="text-sm text-white font-semibold">{selected.length} user dipilih</span>
                <button
                  onClick={() => bulkSetAktif(true)}
                  className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-400 transition-colors"
                >
                  Aktifkan Semua
                </button>
                <button
                  onClick={() => bulkSetAktif(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors"
                >
                  Nonaktifkan Semua
                </button>
                <button
                  onClick={bulkDelete}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-colors"
                >
                  Hapus Terpilih
                </button>
                <button
                  onClick={() => setSelected([])}
                  className="ml-auto text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="w-10 px-5 py-3">
                      <input type="checkbox"
                        checked={allPageSelected}
                        ref={el => { if (el) el.indeterminate = somePageSelected && !allPageSelected }}
                        onChange={toggleAll}
                        className="w-4 h-4 rounded accent-green-600" />
                    </th>
                    {['User', 'Angkatan', 'Peran & Akses', 'Status', 'Terakhir Login', 'Aksi'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paged.map(u => {
                    const ps = PERAN_STYLE[u.peran] || PERAN_STYLE.Alumni
                    const isSA = u.peran === 'Super Admin'
                    const permCount = u.peran === 'Super Admin' ? ALL_PERMISSIONS.length : (u.permissions || []).length
                    return (
                      <tr key={u.id} className={`hover:bg-gray-50/50 transition-colors ${selected.includes(u.id) ? 'bg-green-50/30' : ''}`}>
                        {/* Checkbox */}
                        <td className="px-5 py-4">
                          <input type="checkbox" checked={selected.includes(u.id)}
                            onChange={() => toggleSelect(u.id)}
                            className="w-4 h-4 rounded accent-green-600" />
                        </td>

                        {/* User */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar user={u} size={9} />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap flex items-center gap-1.5">
                                {u.name}
                                {isSA && <Shield className="w-3 h-3 text-red-400" />}
                              </p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                              {u.profesi && <p className="text-[10px] text-gray-300">{u.profesi}{u.kota ? ` · ${u.kota}` : ''}</p>}
                            </div>
                          </div>
                        </td>

                        {/* Angkatan */}
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-gray-900">{u.angkatan}</p>
                          <p className="text-xs text-gray-400">Ke-{getAngkatanKe(u.angkatan)}</p>
                        </td>

                        {/* Peran & Akses */}
                        <td className="px-4 py-4">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                            style={{ backgroundColor: ps.bg, color: ps.text, borderColor: ps.border }}
                          >
                            {u.peran}
                          </span>
                          {(u.peran === 'Admin' || u.peran === 'Editor' || isSA) && (
                            <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                              <Key className="w-2.5 h-2.5" />
                              {isSA ? 'Akses penuh' : `${permCount} fitur`}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <Toggle aktif={u.aktif} onChange={() => toggleAktif(u.id)} disabled={isSA} />
                            <span className={`text-sm font-medium ${u.aktif ? 'text-gray-900' : 'text-gray-400'}`}>
                              {u.aktif ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                        </td>

                        {/* Last Login */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600 whitespace-nowrap">{u.lastLogin}</span>
                        </td>

                        {/* Aksi */}
                        <td className="px-4 py-4">
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openMenuId === u.id && (
                              <ActionMenu
                                user={u}
                                onEdit={() => { setModal({ type: 'edit', user: u }); setOpenMenuId(null) }}
                                onPermission={() => { setModal({ type: 'permission', user: u }); setOpenMenuId(null) }}
                                onToggle={() => toggleAktif(u.id)}
                                onDelete={() => deleteUser(u.id)}
                                onClose={() => setOpenMenuId(null)}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-14 text-center text-sm text-gray-400">
                        Tidak ada user yang sesuai filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                {startIdx}–{endIdx} dari <span className="font-semibold text-gray-700">{filtered.length}</span> user
              </p>
              <PaginationBar page={safePage} totalPages={totalPages} onPage={setPage} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <span>© 2026 Portal Alumni Daarul Mughni Admin. Hak Cipta Dilindungi.</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span>Sistem Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal?.type === 'tambah' && (
        <TambahUserModal onClose={() => setModal(null)} onSave={addUser} />
      )}
      {modal?.type === 'edit' && (
        <EditUserModal
          user={modal.user}
          onClose={() => setModal(null)}
          onSave={form => saveEdit(modal.user.id, form)}
        />
      )}
      {modal?.type === 'permission' && (
        <PermissionModal
          user={modal.user}
          onClose={() => setModal(null)}
          onSave={perms => savePermissions(modal.user.id, perms)}
        />
      )}
    </div>
  )
}
