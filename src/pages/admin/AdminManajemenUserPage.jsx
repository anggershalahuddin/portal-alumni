import { useState, useRef, useEffect, useCallback } from 'react'
import {
  CheckCircle, Users, Shield, Search,
  Download, ChevronDown,
  MoreHorizontal, UserPlus, X, Pencil, Trash2,
  Lock, Key, Eye, EyeOff, AlertCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { PaginationBar, PerPageSelector } from '../../components/PaginationBar'
import { getAngkatanKe } from '../../data/angkatan'
import { ALL_PERMISSIONS, DEFAULT_PERMISSIONS } from '../../data/adminMenus'
import { supabase } from '@/lib/supabase'

// ── Constants ────────────────────────────────────────────────────────────────

const PERAN_OPTIONS = ['Super Admin', 'Admin', 'Editor', 'Alumni']

const ROLE_TO_PERAN = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  editor:      'Editor',
  alumni:      'Alumni',
  user:        'Alumni',
}

const PERAN_TO_ROLE = {
  'Super Admin': 'super_admin',
  'Admin':       'admin',
  'Editor':      'editor',
  'Alumni':      'alumni',
}

function formatLastLogin(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return `Hari ini, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
  if (diffDays === 1) return 'Kemarin'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const PERAN_STYLE = {
  'Super Admin': { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
  'Admin':       { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Editor':      { bg: '#FAF5FF', text: '#7C3AED', border: '#DDD6FE' },
  'Alumni':      { bg: '#F0FDFF', text: '#0E7490', border: '#BAE6FD' },
}


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
  const angkatanKe = getAngkatanKe(form.angkatan)

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Atur Hak Akses</h2>
            <p className="text-xs text-gray-400 mt-0.5">{user.name} · {user.peran}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
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

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
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
  const [users, setUsers]           = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [loadError, setLoadError]   = useState(null)
  const [modal, setModal]           = useState(null)
  const [selected, setSelected]     = useState([])
  const [search, setSearch]         = useState('')
  const [filterPeran, setFilterPeran]   = useState('')
  const [filterAktif, setFilterAktif]   = useState('')
  const [page, setPage]       = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [confirm, setConfirm]       = useState({ open: false })
  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm()   { setConfirm({ open: false }) }

  /* ── Load all profiles from Supabase ── */
  const loadData = useCallback(async () => {
    setPageLoading(true)
    setLoadError(null)
    try {
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, nama_lengkap, no_hp, angkatan, role, status, domisili, is_active, permissions, updated_at')
        .order('created_at', { ascending: false })

      if (profErr) throw profErr

      const ids = (profiles ?? []).map((p) => p.id)
      const { data: apRows } = await supabase
        .from('alumni_profiles')
        .select('user_id, profesi')
        .in('user_id', ids)

      const apMap = {}
      ;(apRows ?? []).forEach((ap) => { apMap[ap.user_id] = ap })

      const usersData = (profiles ?? []).map((p) => {
        const peran = ROLE_TO_PERAN[p.role] ?? 'Alumni'
        const isSA  = p.role === 'super_admin'
        return {
          id:          p.id,
          name:        p.nama_lengkap || 'User',
          email:       '',
          phone:       p.no_hp ?? '',
          angkatan:    p.angkatan,
          peran,
          aktif:       isSA ? true : (p.is_active ?? true),
          lastLogin:   formatLastLogin(p.updated_at),
          avatar:      '',
          profesi:          apMap[p.id]?.profesi ?? '',
          hasAlumniProfile: !!apMap[p.id],
          kota:        p.domisili ?? '',
          permissions: isSA
            ? ALL_PERMISSIONS.map((pm) => pm.id)
            : (p.permissions ?? DEFAULT_PERMISSIONS[peran] ?? []),
        }
      })

      setUsers(usersData)
    } catch (err) {
      console.error('Error loading users:', err)
      setLoadError(err.message)
    } finally {
      setPageLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

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

  /* ── Actions ── */
  function toggleAktif(id) {
    const u = users.find((x) => x.id === id)
    if (!u) return
    askConfirm({
      title: u.aktif ? 'Nonaktifkan Akun' : 'Aktifkan Akun',
      message: u.aktif
        ? `Akun ${u.name} akan dinonaktifkan dan tidak dapat login. Lanjutkan?`
        : `Akun ${u.name} akan diaktifkan kembali. Lanjutkan?`,
      confirmLabel: u.aktif ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan',
      variant: u.aktif ? 'danger' : 'success',
      onConfirm: async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ is_active: !u.aktif })
          .eq('id', id)
        if (error) { console.error(error); closeConfirm(); return }
        setUsers((prev) => prev.map((x) => x.id === id ? { ...x, aktif: !x.aktif } : x))
        setOpenMenuId(null)
        closeConfirm()
      },
    })
  }

  function deleteUser(id) {
    const u = users.find((x) => x.id === id)
    askConfirm({
      title: 'Hapus User',
      message: `Apakah Anda yakin ingin menghapus akun ${u?.name ?? 'ini'}? Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        const { error } = await supabase.from('profiles').delete().eq('id', id)
        if (error) { console.error(error); closeConfirm(); return }
        setUsers((prev) => prev.filter((x) => x.id !== id))
        setSelected((prev) => prev.filter((i) => i !== id))
        setOpenMenuId(null)
        closeConfirm()
      },
    })
  }

  function saveEdit(id, form) {
    askConfirm({
      title: 'Simpan Perubahan User',
      message: 'Apakah Anda yakin ingin menyimpan perubahan data user ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const newRole = PERAN_TO_ROLE[form.peran] ?? 'alumni'
        const { error } = await supabase
          .from('profiles')
          .update({
            nama_lengkap: form.name,
            no_hp:        form.phone,
            angkatan:     Number(form.angkatan),
            role:         newRole,
          })
          .eq('id', id)
        if (error) { console.error(error); closeConfirm(); return }
        const currentUser = users.find((u) => u.id === id)
        const newPerms = form.peran !== currentUser?.peran
          ? (DEFAULT_PERMISSIONS[form.peran] ?? [])
          : currentUser?.permissions ?? []
        setUsers((prev) => prev.map((u) => u.id === id
          ? { ...u, ...form, permissions: newPerms } : u))
        setModal(null)
        closeConfirm()
      },
    })
  }

  function savePermissions(id, perms) {
    askConfirm({
      title: 'Simpan Izin Akses',
      message: 'Apakah Anda yakin ingin menyimpan perubahan izin akses user ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ permissions: perms })
          .eq('id', id)
        if (error) { console.error(error); closeConfirm(); return }
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, permissions: perms } : u))
        setModal(null)
        closeConfirm()
      },
    })
  }

  function addUser(form) {
    askConfirm({
      title: 'Kirim Undangan',
      message: `Kirim tautan login ke ${form.email}? Pengguna dapat langsung mengakses portal setelah mengklik tautan yang dikirim.`,
      confirmLabel: 'Kirim Undangan',
      variant: 'success',
      onConfirm: async () => {
        const { error } = await supabase.auth.signInWithOtp({
          email: form.email,
          options: {
            data: {
              nama_lengkap: form.name,
              ...(form.phone   && { no_hp: form.phone }),
              ...(form.angkatan && { angkatan: Number(form.angkatan) }),
              ...(form.kota    && { domisili: form.kota }),
              ...(form.profesi && { bidang: form.profesi }),
            },
            shouldCreateUser: true,
          },
        })
        if (error) { console.error(error); closeConfirm(); return }
        setModal(null)
        closeConfirm()
      },
    })
  }

  /* ── Bulk Actions ── */
  function bulkSetAktif(val) {
    const nonSAIds = selected.filter((id) => {
      const u = users.find((x) => x.id === id)
      return u && u.peran !== 'Super Admin'
    })
    askConfirm({
      title: val ? 'Aktifkan Akun Terpilih' : 'Nonaktifkan Akun Terpilih',
      message: val
        ? `Aktifkan ${nonSAIds.length} akun yang dipilih?`
        : `Nonaktifkan ${nonSAIds.length} akun yang dipilih?`,
      confirmLabel: val ? 'Ya, Aktifkan' : 'Ya, Nonaktifkan',
      variant: val ? 'success' : 'warning',
      onConfirm: async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ is_active: val })
          .in('id', nonSAIds)
        if (error) { console.error(error); closeConfirm(); return }
        setUsers((prev) => prev.map((u) =>
          nonSAIds.includes(u.id) ? { ...u, aktif: val } : u
        ))
        setSelected([])
        closeConfirm()
      },
    })
  }

  function bulkDelete() {
    const deletableIds = selected.filter((id) => {
      const u = users.find((x) => x.id === id)
      return u && u.peran !== 'Super Admin'
    })
    askConfirm({
      title: `Hapus ${deletableIds.length} User`,
      message: `Apakah Anda yakin ingin menghapus ${deletableIds.length} user yang dipilih? Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: 'Ya, Hapus Semua',
      variant: 'danger',
      onConfirm: async () => {
        const { error } = await supabase.from('profiles').delete().in('id', deletableIds)
        if (error) { console.error(error); closeConfirm(); return }
        setUsers((prev) => prev.filter((u) => !deletableIds.includes(u.id)))
        setSelected([])
        closeConfirm()
      },
    })
  }

  if (pageLoading) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
        <AdminSidebar active="users" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="users" />

      <div className="flex-1 flex flex-col min-w-0">

        <AdminHeader
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Cari user..."
        />

        {/* Content */}
        <motion.div
          className="flex-1 p-6 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >

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

          {/* Error banner */}
          {loadError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {loadError}
              <button onClick={loadData} className="ml-auto underline text-xs">Coba lagi</button>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Users,       iconBg: '#F0FDFF', iconColor: '#0E7490', value: users.length, label: 'Total User' },
              { icon: CheckCircle, iconBg: '#F0FDF4', iconColor: '#22C55E', value: totalAktif,   label: 'User Aktif' },
              { icon: Shield,      iconBg: '#FFF7ED', iconColor: '#F59E0B', value: users.filter(u => u.hasAlumniProfile && u.aktif).length, label: 'Alumni Aktif' },
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
        </motion.div>
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

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </div>
  )
}
