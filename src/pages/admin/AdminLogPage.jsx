import { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { Activity, Download, Shield, Newspaper, CalendarDays, Users, Settings, Image, Building2, Briefcase, GraduationCap, LogIn, LogOut, Trash2, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
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

const PER_PAGE_OPTIONS = [10, 25, 50]

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

function mapRow(row) {
  return {
    id:         row.id,
    aksi:       row.aksi,
    aktor:      row.profiles?.nama_lengkap ?? '—',
    peran:      ROLE_LABELS[row.profiles?.role] ?? '—',
    keterangan: buildKeterangan(row),
    ip:         row.ip_address ?? '—',
    waktu:      formatWaktu(row.created_at),
  }
}

async function exportAllXLSX(filterAksi) {
  let query = supabase
    .from('log_aktivitas')
    .select('id, aksi, entitas, detail, ip_address, created_at, profiles!user_id(nama_lengkap, role)')
    .order('created_at', { ascending: false })
  if (filterAksi !== 'semua') query = query.eq('aksi', filterAksi)

  const { data } = await query
  const rows = (data ?? []).map(mapRow)
  const sheet = XLSX.utils.json_to_sheet(rows.map(r => ({
    'Waktu': r.waktu,
    'Aksi': r.aksi,
    'Aktor': r.aktor,
    'Peran': r.peran,
    'Keterangan': r.keterangan,
    'IP Address': r.ip,
  })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, 'Log Aktivitas')
  XLSX.writeFile(wb, `log-aktivitas-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export default function AdminLogPage() {
  const [logData, setLogData]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [filterAksi, setFilterAksi] = useState('semua')
  const [page, setPage]           = useState(1)
  const [perPage, setPerPage]     = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

  const loadData = useCallback(async (p, aksi, pp) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('log_aktivitas')
        .select('id, aksi, entitas, detail, ip_address, created_at, profiles!user_id(nama_lengkap, role)', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (aksi !== 'semua') query = query.eq('aksi', aksi)

      const from = (p - 1) * pp
      query = query.range(from, from + pp - 1)

      const { data, error: err, count } = await query
      if (err) throw err
      setTotalCount(count ?? 0)
      setLogData((data ?? []).map(mapRow))
    } catch (e) {
      setError(e.message ?? 'Gagal memuat log aktivitas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData(page, filterAksi, perPage) }, [loadData, page, filterAksi, perPage])

  function handleFilterAksi(val) {
    setFilterAksi(val)
    setPage(1)
  }

  function handlePerPage(val) {
    setPerPage(Number(val))
    setPage(1)
  }

  async function handleExport() {
    setExporting(true)
    try { await exportAllXLSX(filterAksi) } finally { setExporting(false) }
  }

  const filtered = search
    ? logData.filter(l =>
        l.aktor.toLowerCase().includes(search.toLowerCase()) ||
        l.keterangan.toLowerCase().includes(search.toLowerCase())
      )
    : logData

  const startEntry = (page - 1) * perPage + 1
  const endEntry   = Math.min(page * perPage, totalCount)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="log" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari di halaman ini..."
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
              <p className="text-sm text-gray-500 mt-0.5">Rekam jejak seluruh aksi admin dan editor. Log otomatis terhapus setelah 90 hari.</p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Ekspor Excel
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={filterAksi}
              onChange={e => handleFilterAksi(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-green-400"
            >
              <option value="semua">Semua Aksi</option>
              {Object.entries(AKSI_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            <button
              onClick={() => loadData(page, filterAksi, perPage)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Tampilkan</span>
              {PER_PAGE_OPTIONS.map(n => (
                <button
                  key={n}
                  onClick={() => handlePerPage(n)}
                  className={`w-8 h-7 rounded-lg font-medium border transition-colors
                    ${perPage === n
                      ? 'bg-[#1A5C38] text-white border-[#1A5C38]'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            {!loading && (
              <span className="text-xs text-gray-400 ml-auto">
                {search
                  ? `${filtered.length} hasil pencarian di halaman ini`
                  : `${startEntry}–${endEntry} dari ${totalCount} entri`}
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button onClick={() => loadData(page, filterAksi)} className="ml-auto underline text-xs">Coba lagi</button>
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

          {/* Pagination — tampil selalu saat ada data, navigasi aktif hanya jika >1 halaman */}
          {!loading && totalCount > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Halaman {page} dari {totalPages} &nbsp;·&nbsp; {totalCount} total entri (maks. 500 disimpan)
              </p>
              {totalPages > 1 && <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  «
                </button>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Page number pills */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
                  .reduce((acc, n, idx, arr) => {
                    if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...')
                    acc.push(n)
                    return acc
                  }, [])
                  .map((n, i) =>
                    n === '...'
                      ? <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">…</span>
                      : <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-8 h-7 rounded-lg text-xs font-medium border transition-colors
                            ${page === n
                              ? 'bg-[#1A5C38] text-white border-[#1A5C38]'
                              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                          {n}
                        </button>
                  )
                }

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="px-2 py-1.5 rounded-lg text-xs border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  »
                </button>
              </div>}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
