import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Newspaper, CalendarDays, TrendingUp, Clock, Image, Briefcase, ArrowUpRight } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import { news } from '../../data/news'
import { agendaData } from '../../data/agenda'
import { TOTAL_ALUMNI, TOTAL_VERIFIED, getInitials } from '../../data/alumni'
import { initialGaleri } from '../../data/galeri'
import { initialLowongan } from '../../data/lowongan'

const MONTHLY = [
  { label: 'Jan', value: 45 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 48 },
  { label: 'Apr', value: 61 }, { label: 'Mei', value: 73 }, { label: 'Jun', value: 55 },
  { label: 'Jul', value: 49 }, { label: 'Agu', value: 82 }, { label: 'Sep', value: 78 },
  { label: 'Okt', value: 91 }, { label: 'Nov', value: 67 }, { label: 'Des', value: 58 },
]

const recentVerifikasi = [
  { id: 1, name: 'Ahmad Fauzi',     angkatan: 2015, status: 'menunggu',  tanggal: '12 Okt' },
  { id: 2, name: 'Siti Maryam',     angkatan: 2018, status: 'menunggu',  tanggal: '11 Okt' },
  { id: 3, name: 'Budi Santoso',    angkatan: 2012, status: 'disetujui', tanggal: '10 Okt' },
  { id: 4, name: 'Nurul Hidayah',   angkatan: 2020, status: 'menunggu',  tanggal: '10 Okt' },
  { id: 5, name: 'Fatimah Az-Zahra',angkatan: 2019, status: 'ditolak',   tanggal: '08 Okt' },
]

const pendingVerifikasi = TOTAL_ALUMNI - TOTAL_VERIFIED
const recentBerita = news.slice(0, 3).map(n => ({ judul: n.title, tanggal: n.date }))

const statCards = [
  { label: 'Total Alumni',       value: TOTAL_ALUMNI,                                color: '#1A5C38', light: '#F0FDF4', icon: Users,        suffix: '' },
  { label: 'Pending Verifikasi', value: pendingVerifikasi,                            color: '#D97706', light: '#FFFBEB', icon: Clock,        suffix: '' },
  { label: 'Total Berita',       value: news.length,                                  color: '#7C3AED', light: '#FAF5FF', icon: Newspaper,    suffix: '' },
  { label: 'Total Agenda',       value: agendaData.length,                            color: '#0E7490', light: '#ECFEFF', icon: CalendarDays, suffix: '' },
  { label: 'Foto Galeri',        value: initialGaleri.filter(g => g.aktif).length,    color: '#DB2777', light: '#FDF2F8', icon: Image,        suffix: '' },
  { label: 'Lowongan Aktif',     value: initialLowongan.filter(l => l.aktif).length,  color: '#0369A1', light: '#F0F9FF', icon: Briefcase,    suffix: '' },
]

// ── Animated counter ────────────────────────────────────────────────────────
function useCounter(target, delay = 0) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const duration = 900
    let rafId
    const startTime = performance.now() + delay
    function tick(now) {
      if (now < startTime) { rafId = requestAnimationFrame(tick); return }
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [target, delay])
  return count
}

function StatCard({ label, value, color, light, icon: Icon, delay }) {
  const count = useCounter(value, delay)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: delay / 1000 }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.10)' }}
      className="bg-white rounded-2xl p-5 border border-gray-100 cursor-default"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: light }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900 tabular-nums">{count.toLocaleString('id-ID')}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </motion.div>
  )
}

// ── Animated bar chart ───────────────────────────────────────────────────────
function BarChart() {
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState(null)
  useEffect(() => { const t = setTimeout(() => setReady(true), 120); return () => clearTimeout(t) }, [])
  const max = Math.max(...MONTHLY.map(d => d.value))
  return (
    <div className="flex items-end gap-1 h-36 mt-4">
      {MONTHLY.map((d, i) => (
        <div
          key={d.label}
          className="flex-1 flex flex-col items-center gap-1 group"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="relative w-full flex flex-col items-center">
            {hovered === i && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                {d.value}
              </div>
            )}
            <div
              className="w-full rounded-t-md"
              style={{
                height: ready ? `${(d.value / max) * 100}%` : '0%',
                minHeight: ready ? 4 : 0,
                backgroundColor: hovered === i ? '#F0A500' : '#1A5C38',
                transition: `height 0.55s cubic-bezier(0.4,0,0.2,1) ${i * 0.035}s, background-color 0.2s`,
              }}
            />
          </div>
          <span className="text-[9px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    menunggu:  { bg: '#FFF7ED', text: '#C2410C', label: 'Menunggu' },
    disetujui: { bg: '#F0FDF4', text: '#15803D', label: 'Disetujui' },
    ditolak:   { bg: '#FFF1F2', text: '#BE123C', label: 'Ditolak' },
  }
  const s = map[status] || map.menunggu
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  )
}

// ── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="dashboard" />

      <div className="flex-1 flex flex-col min-w-0">

        <AdminHeader
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari..."
        />

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Selamat datang kembali. Berikut ringkasan aktivitas portal.</p>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map(({ label, value, icon, color, light }, i) => (
              <StatCard
                key={label}
                label={label}
                value={value}
                icon={icon}
                color={color}
                light={light}
                delay={i * 60}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">

            {/* Bar chart */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl p-5 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Pendaftaran Alumni</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Jumlah pendaftar per bulan — 2024</p>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +12.4%
                </span>
              </div>
              <BarChart />
            </motion.div>

            {/* Recent berita */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.42 }}
              className="bg-white rounded-2xl p-5 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900">Berita Terbaru</h2>
                <a href="/admin/berita" className="text-xs font-semibold text-[#1A5C38] hover:underline">Lihat Semua</a>
              </div>
              <div className="space-y-3">
                {recentBerita.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                    className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(26,92,56,0.12), rgba(240,165,0,0.12))' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{b.judul}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{b.tanggal}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Verifikasi table */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Verifikasi Terbaru</h2>
              <a href="/admin/verifikasi" className="text-xs font-semibold text-[#1A5C38] hover:underline">Lihat Semua</a>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Alumni', 'Angkatan', 'Tanggal', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentVerifikasi.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 + i * 0.06, duration: 0.3 }}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: '#1A5C38' }}>
                          {getInitials(r.name)}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {r.angkatan} <span className="text-[10px] text-gray-400">(Ke-{r.angkatan - 2005})</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{r.tanggal}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">Sistem Online</span>
          </div>
          <p className="text-xs text-gray-400">Portal Alumni Daarul Mughni · Admin v2.0</p>
        </div>
      </div>
    </div>
  )
}
