import { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { Activity, Download, Shield, Newspaper, CalendarDays, Users, Settings, Image, Building2, Briefcase, GraduationCap, LogIn, LogOut, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'

const AKSI_CONFIG = {
  login:       { icon: LogIn,       color: '#059669', bg: '#F0FDF4', label: 'Login' },
  logout:      { icon: LogOut,      color: '#6B7280', bg: '#F9FAFB', label: 'Logout' },
  verifikasi:  { icon: Shield,      color: '#1A5C38', bg: '#F0FDF4', label: 'Verifikasi' },
  berita:      { icon: Newspaper,   color: '#7C3AED', bg: '#FAF5FF', label: 'Berita' },
  agenda:      { icon: CalendarDays,color: '#0E7490', bg: '#ECFEFF', label: 'Agenda' },
  user:        { icon: Users,       color: '#D97706', bg: '#FFFBEB', label: 'User' },
  galeri:      { icon: Image,       color: '#C2410C', bg: '#FFF7ED', label: 'Galeri' },
  organisasi:  { icon: Building2,   color: '#1D4ED8', bg: '#EFF6FF', label: 'Organisasi' },
  karir:       { icon: Briefcase,   color: '#7E22CE', bg: '#FDF4FF', label: 'Karir' },
  angkatan:    { icon: GraduationCap,color:'#0F766E', bg: '#F0FDFA', label: 'Angkatan' },
  pengaturan:  { icon: Settings,    color: '#6B7280', bg: '#F9FAFB', label: 'Pengaturan' },
  hapus:       { icon: Trash2,      color: '#BE123C', bg: '#FFF1F2', label: 'Hapus' },
}

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  editor:      'Editor',
  alumni:      'Alumni',
  user:        'Pengguna',
}

function formatWaktu(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function buildKeterangan(row) {
  const d = row.detail ?? {}
  if (d.keterangan) return d.keterangan
  if (row.aksi === 'verifikasi') {
    if (d.aksi === 'setujui') return `Menyetujui verifikasi alumni ${d.nama ?? ''}`
    if (d.aksi === 'tolak')   return `Menolak verifikasi alumni ${d.nama ?? ''}`
    return 'Verifikasi alumni'
  }
  if (row.aksi === 'berita') {
    if (d.aksi === 'tambah') return `Menambah berita: "${d.judul ?? ''}"`
    if (d.aksi === 'ubah')   return `Mengubah berita: "${d.judul ?? ''}"`
    return `Aksi berita: "${d.judul ?? ''}"`
  }
  if (row.aksi === 'agenda') {
    if (d.aksi === 'tambah') return `Menambah agenda: "${d.nama ?? ''}"`
    if (d.aksi === 'ubah')   return `Mengubah agenda: "${d.nama ?? ''}"`
    return `Aksi agenda: "${d.nama ?? ''}"`
  }
  if (row.aksi === 'user') {
    if (d.aksi === 'ubah') return `Mengubah data user: ${d.nama ?? ''}`
    return `Aksi user: ${d.nama ?? ''}`
  }
  if (row.aksi === 'hapus') {
    return `Menghapus ${row.entitas ?? ''}: ${d.nama ?? d.judul ?? ''}`
  }
  return row.aksi
}

function exportXLSX(rows) {
  const data = rows.map(r => ({
    'Aksi': r.aksi,
    'Aktor': r.aktor,
    'Peran': r.peran,
    'Keterangan': r.keterangan,
    'IP Address': r.ip ?? '-',
    'Waktu': r.waktu,
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Log Aktivitas')
  XLSX.writeFile(wb, `log-aktivitas-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export default function AdminLogPage() {
  const [logData, setLogData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')
  const [filterAksi, setFilterAksi] = useState('semua')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('log_aktivitas')
        .select('id, aksi, entitas, entitas_id, detail, ip_address, created_at, profiles!user_id(nama_lengkap, role)')
        .order('created_at', { ascending: false })
        .limit(300)
      if (err) throw err
      setLogData((data ?? []).map(row => ({
        id:          row.id,
        aksi:        row.aksi,
        aktor:       row.profiles?.nama_lengkap ?? '—',
        peran:       ROLE_LABELS[row.profiles?.role] ?? '—',
        keterangan:  buildKeterangan(row),
        ip:          row.ip_address ?? '—',
        waktu:       formatWaktu(row.created_at),
      })))
    } catch (e) {
      setError(e.message ?? 'Gagal memuat log aktivitas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = logData.filter(l => {
    const matchSearch = !search || l.aktor.toLowerCase().includes(search.toLowerCase()) || l.keterangan.toLowerCase().includes(search.toLowerCase())
    const matchAksi   = filterAksi === 'semua' || l.aksi === filterAksi
    return matchSearch && matchAksi
  })

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="log" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari log aktivitas..."
        />

        <motion.div
          className="flex-1 p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Page title + actions */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Log Aktivitas</h1>
              <p className="text-sm text-gray-500 mt-0.5">Rekam jejak seluruh aksi admin dan editor.</p>
            </div>
            <button onClick={() => exportXLSX(filtered)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Ekspor Excel
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <select value={filterAksi} onChange={e => setFilterAksi(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-green-400">
              <option value="semua">Semua Aksi</option>
              {Object.entries(AKSI_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            <button onClick={loadData} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Refresh
            </button>
            <span className="text-xs text-gray-400 ml-auto">{filtered.length} entri</span>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button onClick={loadData} className="ml-auto underline text-xs">Coba lagi</button>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-7 h-7 animate-spin text-[#1A5C38]" />
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Waktu', 'Aksi', 'Aktor', 'Keterangan', 'IP'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Tidak ada log aktivitas</p>
                    </td>
                  </tr>
                ) : filtered.map(l => {
                  const cfg = AKSI_CONFIG[l.aksi] ?? AKSI_CONFIG.pengaturan
                  const Icon = cfg.icon
                  return (
                    <tr key={l.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap">{l.waktu}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                            <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                          </div>
                          <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-800">{l.aktor}</p>
                        <p className="text-[10px] text-gray-400">{l.peran}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">{l.keterangan}</td>
                      <td className="px-4 py-3 text-[11px] text-gray-400 font-mono">{l.ip}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
