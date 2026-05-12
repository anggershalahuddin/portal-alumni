import { useState } from 'react'
import { Activity, Search, Download, Shield, Newspaper, CalendarDays, Users, Settings, Image, Building2, Briefcase, GraduationCap, LogIn, LogOut, Trash2, Bell } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'

const AKSI_CONFIG = {
  login: { icon: LogIn, color: '#059669', bg: '#F0FDF4', label: 'Login' },
  logout: { icon: LogOut, color: '#6B7280', bg: '#F9FAFB', label: 'Logout' },
  verifikasi: { icon: Shield, color: '#1A5C38', bg: '#F0FDF4', label: 'Verifikasi' },
  berita: { icon: Newspaper, color: '#7C3AED', bg: '#FAF5FF', label: 'Berita' },
  agenda: { icon: CalendarDays, color: '#0E7490', bg: '#ECFEFF', label: 'Agenda' },
  user: { icon: Users, color: '#D97706', bg: '#FFFBEB', label: 'User' },
  galeri: { icon: Image, color: '#C2410C', bg: '#FFF7ED', label: 'Galeri' },
  organisasi: { icon: Building2, color: '#1D4ED8', bg: '#EFF6FF', label: 'Organisasi' },
  karir: { icon: Briefcase, color: '#7E22CE', bg: '#FDF4FF', label: 'Karir' },
  angkatan: { icon: GraduationCap, color: '#0F766E', bg: '#F0FDFA', label: 'Angkatan' },
  pengaturan: { icon: Settings, color: '#6B7280', bg: '#F9FAFB', label: 'Pengaturan' },
  hapus: { icon: Trash2, color: '#BE123C', bg: '#FFF1F2', label: 'Hapus' },
}

const logData = [
  { id: 1, aksi: 'login', aktor: 'Admin Utama', peran: 'Super Admin', keterangan: 'Login berhasil ke sistem admin', ip: '192.168.1.1', waktu: '2025-05-12 09:15:22' },
  { id: 2, aksi: 'verifikasi', aktor: 'Admin Utama', peran: 'Super Admin', keterangan: 'Menyetujui verifikasi alumni Siti Maryam (2018)', ip: '192.168.1.1', waktu: '2025-05-12 09:20:11' },
  { id: 3, aksi: 'berita', aktor: 'Editor Redaksi', peran: 'Editor', keterangan: 'Membuat berita baru: "Reuni Akbar 25 Tahun Daarul Mughni"', ip: '192.168.1.5', waktu: '2025-05-12 10:02:45' },
  { id: 4, aksi: 'verifikasi', aktor: 'Admin Konten', peran: 'Admin', keterangan: 'Menolak permintaan verifikasi alumni Fatimah Az-Zahra (2019)', ip: '192.168.1.3', waktu: '2025-05-12 10:15:00' },
  { id: 5, aksi: 'agenda', aktor: 'Editor Redaksi', peran: 'Editor', keterangan: 'Menambah agenda: "Workshop Digital Marketing Alumni"', ip: '192.168.1.5', waktu: '2025-05-12 11:30:18' },
  { id: 6, aksi: 'galeri', aktor: 'Admin Konten', peran: 'Admin', keterangan: 'Mengunggah 5 foto baru ke galeri kegiatan alumni', ip: '192.168.1.3', waktu: '2025-05-12 13:05:33' },
  { id: 7, aksi: 'karir', aktor: 'Admin Utama', peran: 'Super Admin', keterangan: 'Mempublikasikan lowongan: "Guru Matematika MTs Daarul Mughni"', ip: '192.168.1.1', waktu: '2025-05-12 13:45:00' },
  { id: 8, aksi: 'user', aktor: 'Admin Utama', peran: 'Super Admin', keterangan: 'Mengubah peran Budi Santoso dari Alumni → Editor', ip: '192.168.1.1', waktu: '2025-05-12 14:10:22' },
  { id: 9, aksi: 'angkatan', aktor: 'Admin Utama', peran: 'Super Admin', keterangan: 'Menambah data angkatan: Angkatan 2025 – Al-Biruni', ip: '192.168.1.1', waktu: '2025-05-12 14:30:55' },
  { id: 10, aksi: 'organisasi', aktor: 'Admin Utama', peran: 'Super Admin', keterangan: 'Mengubah data organisasi HIKMAD – memperbarui info ketua', ip: '192.168.1.1', waktu: '2025-05-11 16:00:10' },
  { id: 11, aksi: 'berita', aktor: 'Admin Konten', peran: 'Admin', keterangan: 'Menyetujui dan mempublikasikan berita: "Santri Raih Juara Musabaqah"', ip: '192.168.1.3', waktu: '2025-05-11 09:25:00' },
  { id: 12, aksi: 'hapus', aktor: 'Admin Utama', peran: 'Super Admin', keterangan: 'Menghapus berita lama yang sudah kadaluarsa', ip: '192.168.1.1', waktu: '2025-05-10 11:00:00' },
  { id: 13, aksi: 'pengaturan', aktor: 'Admin Utama', peran: 'Super Admin', keterangan: 'Mengubah nama peran "User" → "Alumni" di pengaturan sistem', ip: '192.168.1.1', waktu: '2025-05-10 09:00:00' },
  { id: 14, aksi: 'logout', aktor: 'Editor Redaksi', peran: 'Editor', keterangan: 'Logout dari sesi admin', ip: '192.168.1.5', waktu: '2025-05-09 17:30:00' },
  { id: 15, aksi: 'login', aktor: 'Editor Redaksi', peran: 'Editor', keterangan: 'Login berhasil ke sistem admin', ip: '192.168.1.5', waktu: '2025-05-09 08:05:00' },
]

function exportCSV(rows) {
  const headers = ['ID', 'Aksi', 'Aktor', 'Peran', 'Keterangan', 'IP Address', 'Waktu']
  const lines = [
    headers.join(','),
    ...rows.map(r => [r.id, r.aksi, `"${r.aktor}"`, `"${r.peran}"`, `"${r.keterangan}"`, r.ip, r.waktu].join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `log-aktivitas-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminLogPage() {
  const [search, setSearch] = useState('')
  const [filterAksi, setFilterAksi] = useState('semua')

  const filtered = logData.filter(l => {
    const matchSearch = l.aktor.toLowerCase().includes(search.toLowerCase()) || l.keterangan.toLowerCase().includes(search.toLowerCase())
    const matchAksi = filterAksi === 'semua' || l.aksi === filterAksi
    return matchSearch && matchAksi
  })

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="log" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari log aktivitas..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-green-400 focus:bg-white transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0A500' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#0A2415' }} />
            </div>
            <span className="font-bold text-gray-900 text-sm">Portal Alumni Daarul Mughni Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#0A2415' }}>A</div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-4">
          {/* Page title + actions */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Log Aktivitas</h1>
              <p className="text-sm text-gray-500 mt-0.5">Rekam jejak seluruh aksi admin dan editor.</p>
            </div>
            <button onClick={() => exportCSV(filtered)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
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
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
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
          </div>
        </div>
      </div>
    </div>
  )
}
