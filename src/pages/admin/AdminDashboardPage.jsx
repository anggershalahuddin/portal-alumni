import { useState } from 'react'
import { Bell, Shield, Search, Users, Newspaper, CalendarDays, TrendingUp, Clock, Image, Briefcase } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { news } from '../../data/news'
import { agendaData } from '../../data/agenda'
import { alumniData, TOTAL_ALUMNI, TOTAL_VERIFIED, getInitials } from '../../data/alumni'
import { initialGaleri } from '../../data/galeri'
import { initialLowongan } from '../../data/lowongan'

const MONTHLY = [
  { label: 'Jan', value: 45 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 48 },
  { label: 'Apr', value: 61 }, { label: 'Mei', value: 73 }, { label: 'Jun', value: 55 },
  { label: 'Jul', value: 49 }, { label: 'Agu', value: 82 }, { label: 'Sep', value: 78 },
  { label: 'Okt', value: 91 }, { label: 'Nov', value: 67 }, { label: 'Des', value: 58 },
]

const recentVerifikasi = [
  { id: 1, name: 'Ahmad Fauzi', angkatan: 2015, status: 'menunggu', tanggal: '12 Okt' },
  { id: 2, name: 'Siti Maryam', angkatan: 2018, status: 'menunggu', tanggal: '11 Okt' },
  { id: 3, name: 'Budi Santoso', angkatan: 2012, status: 'disetujui', tanggal: '10 Okt' },
  { id: 4, name: 'Nurul Hidayah', angkatan: 2020, status: 'menunggu', tanggal: '10 Okt' },
  { id: 5, name: 'Fatimah Az-Zahra', angkatan: 2019, status: 'ditolak', tanggal: '08 Okt' },
]

const pendingVerifikasi = TOTAL_ALUMNI - TOTAL_VERIFIED

const recentBerita = news.slice(0, 3).map(n => ({ judul: n.title, tanggal: n.date }))

const statCards = [
  { label: 'Total Alumni', value: TOTAL_ALUMNI.toLocaleString('id-ID'), icon: Users, color: '#1A5C38', light: '#F0FDF4' },
  { label: 'Pending Verifikasi', value: pendingVerifikasi.toString(), icon: Clock, color: '#D97706', light: '#FFFBEB' },
  { label: 'Total Berita', value: news.length.toString(), icon: Newspaper, color: '#7C3AED', light: '#FAF5FF' },
  { label: 'Total Agenda', value: agendaData.length.toString(), icon: CalendarDays, color: '#0E7490', light: '#ECFEFF' },
  { label: 'Foto Galeri', value: initialGaleri.filter(g => g.aktif).length.toString(), icon: Image, color: '#DB2777', light: '#FDF2F8' },
  { label: 'Lowongan Aktif', value: initialLowongan.filter(l => l.aktif).length.toString(), icon: Briefcase, color: '#0369A1', light: '#F0F9FF' },
]

function StatusBadge({ status }) {
  const map = {
    menunggu: { bg: '#FFF7ED', text: '#C2410C', label: 'Menunggu' },
    disetujui: { bg: '#F0FDF4', text: '#15803D', label: 'Disetujui' },
    ditolak: { bg: '#FFF1F2', text: '#BE123C', label: 'Ditolak' },
  }
  const s = map[status] || map.menunggu
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  )
}

function BarChart() {
  const max = Math.max(...MONTHLY.map(d => d.value))
  return (
    <div className="flex items-end gap-1.5 h-36 mt-4">
      {MONTHLY.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{ height: `${(d.value / max) * 100}%`, backgroundColor: '#1A5C38', minHeight: 4 }}
          />
          <span className="text-[9px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="dashboard" />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-green-400 focus:bg-white transition-all"
            />
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
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">Admin Utama</p>
                <p className="text-[10px] text-gray-400">Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#0A2415' }}>A</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Selamat datang kembali. Berikut ringkasan aktivitas portal.</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, light }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: light }}>
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
            {/* Bar chart */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Pendaftaran Alumni</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Jumlah pendaftar per bulan — 2024</p>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">+12.4%</span>
              </div>
              <BarChart />
            </div>

            {/* Recent berita */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Berita Terbaru</h2>
              <div className="space-y-3">
                {recentBerita.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A5C38]/15 to-[#F0A500]/15 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{b.judul}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{b.tanggal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent verifikasi */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Verifikasi Terbaru</h2>
              <a href="/admin/verifikasi" className="text-xs font-semibold text-[#1A5C38] hover:underline">Lihat Semua</a>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Alumni', 'Angkatan', 'Tanggal', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentVerifikasi.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: '#1A5C38' }}>
                          {getInitials(r.name)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{r.angkatan} <span className="text-[10px] text-gray-400">(Ke-{r.angkatan - 2005})</span></td>
                    <td className="px-5 py-3 text-sm text-gray-500">{r.tanggal}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-400">Sistem Online</span>
          </div>
          <p className="text-xs text-gray-400">Portal Alumni Daarul Mughni · Admin v2.0</p>
        </div>
      </div>
    </div>
  )
}
