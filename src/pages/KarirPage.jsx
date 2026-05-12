import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Clock, Briefcase, ExternalLink } from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import { initialLowongan, bidangLowongan, tipeLowongan } from '../data/lowongan'

const TIPE_STYLE = {
  fulltime: { bg: '#F0FDF4', text: '#15803D' },
  parttime: { bg: '#EFF6FF', text: '#1D4ED8' },
  kontrak: { bg: '#FFF7ED', text: '#C2410C' },
  magang: { bg: '#FAF5FF', text: '#7C3AED' },
}

function getRelativeDate(dateStr) {
  if (!dateStr) return '—'
  const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hari ini'
  if (diff === 1) return '1 hari lalu'
  if (diff < 7) return `${diff} hari lalu`
  if (diff < 30) return `${Math.floor(diff / 7)} minggu lalu`
  return `${Math.floor(diff / 30)} bulan lalu`
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const activeJobs = initialLowongan.filter(l => l.aktif)

export default function KarirPage() {
  const [search, setSearch] = useState('')
  const [filterBidang, setFilterBidang] = useState('semua')

  const filtered = activeJobs.filter((l) => {
    const q = search.toLowerCase()
    const matchSearch = !q || l.judul.toLowerCase().includes(q) || l.instansi.toLowerCase().includes(q) || l.lokasi.toLowerCase().includes(q)
    const matchBidang = filterBidang === 'semua' || l.bidang === filterBidang
    return matchSearch && matchBidang
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-10 px-4" style={{ backgroundColor: '#0A2415' }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Briefcase className="w-3 h-3" /> Lowongan Pesantren
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Bergabung Bersama<br />Keluarga Daarul Mughni
          </h1>
          <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Lowongan pekerjaan dari unit-unit Pondok Pesantren Daarul Mughni Al Maaliki. Prioritas diberikan kepada alumni pesantren.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari posisi, instansi, atau lokasi..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/30 text-sm outline-none focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <button
            onClick={() => setFilterBidang('semua')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={filterBidang === 'semua' ? { backgroundColor: '#1A5C38', color: '#fff' } : { backgroundColor: '#fff', color: '#4B5563', border: '1px solid #E5E7EB' }}
          >
            Semua
          </button>
          {bidangLowongan.map((b) => (
            <button
              key={b.value}
              onClick={() => setFilterBidang(b.value)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                filterBidang === b.value
                  ? { backgroundColor: '#1A5C38', color: '#fff' }
                  : { backgroundColor: '#fff', color: '#4B5563', border: '1px solid #E5E7EB' }
              }
            >
              {b.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} lowongan ditemukan</span>
        </div>

        {/* Job list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Tidak ada lowongan yang sesuai pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((job) => {
              const tipeStyle = TIPE_STYLE[job.tipe] ?? TIPE_STYLE.fulltime
              const tipeLabel = tipeLowongan.find(t => t.value === job.tipe)?.label ?? job.tipe
              const deadlinePast = job.deadline && new Date(job.deadline) < new Date()
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#1A5C38]/25 hover:shadow-md transition-all group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: '#1A5C38' }}
                      >
                        {initials(job.instansi)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A2415] group-hover:text-[#1A5C38] transition-colors">
                          {job.judul}
                        </h3>
                        <p className="text-xs text-gray-500">{job.instansi}</p>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tipeStyle.bg, color: tipeStyle.text }}
                    >
                      {tipeLabel}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.lokasi}</span>
                    {job.gaji && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.gaji}</span>}
                    {job.deadline && (
                      <span className={`flex items-center gap-1 ${deadlinePast ? 'text-orange-500' : ''}`}>
                        <Clock className="w-3 h-3" />Deadline: {new Date(job.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {job.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">Diposting {getRelativeDate(job.tanggalPosting)}</p>
                    <button
                      className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      style={{ backgroundColor: '#1A5C38', color: '#fff' }}
                    >
                      Lamar <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Post job CTA */}
        <div className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: '#0A2415' }}>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Ingin membuka lowongan untuk pesantren?</h3>
            <p className="text-xs text-white/50">Hubungi admin portal atau akses halaman admin untuk memposting lowongan baru.</p>
          </div>
          <Link
            to="/admin/karir"
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-[#0A2415] hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F0A500' }}
          >
            Kelola Lowongan
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
