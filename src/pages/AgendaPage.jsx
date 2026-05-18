import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight,
  X, Info, ExternalLink, BadgeCheck, ZoomIn, Search, Loader2,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { agendaKategori, agendaLokasi, kategoriStyle } from '@/data/agenda'
import { getAvatarColor, getInitials } from '@/data/alumni'
import { PaginationBar, PerPageSelector } from '@/components/PaginationBar'
import { fadeUp, stagger } from '@/lib/animations'
import { supabase } from '@/lib/supabase'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'

function inferLokasiKategori(lokasi) {
  if (!lokasi) return 'luar'
  const l = lokasi.toLowerCase()
  if (l.includes('zoom') || l.includes('webinar') || l.includes('online') || l.includes('virtual')) return 'online'
  if (l.includes('pondok') || l.includes('pesantren') || l.includes('daarul') || l.includes('aula') || l.includes('masjid') || l.includes('kampus') || l.includes('lapangan')) return 'pondok'
  return 'luar'
}

function mapAgenda(row) {
  const tgl = new Date(row.tanggal_mulai)
  const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
  const monthShort = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
  const iso = tgl.toISOString().slice(0, 10)
  const tanggalLabel = `${dayNames[tgl.getDay()]}, ${tgl.getDate()} ${monthShort[tgl.getMonth()]} ${tgl.getFullYear()}`
  const startTime = tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const waktu = row.tanggal_selesai
    ? `${startTime} s.d ${new Date(row.tanggal_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
    : `${startTime} s.d Selesai`
  const kat = row.kategori ?? ''
  const katObj = agendaKategori.find(k => k.value === kat)
  return {
    id: row.id,
    title: row.judul,
    kategori: kat,
    kategoriLabel: katObj?.label?.split(' & ')[0] ?? kat,
    kategoriLabelPanjang: katObj?.label ?? kat,
    tanggalISO: iso,
    tanggalLabel,
    waktu,
    lokasiSingkat: row.lokasi ?? '—',
    lokasiDetail: row.lokasi ?? '',
    lokasiKategori: row.lokasi_kategori || inferLokasiKategori(row.lokasi),
    mapsUrl: row.maps_url ?? '',
    linkRegistrasi: row.link_registrasi ?? '',
    image: row.foto_url || FALLBACK_IMAGE,
    imageHero: row.image_hero || row.foto_url || FALLBACK_IMAGE.replace('w=600', 'w=1200'),
    excerpt: row.deskripsi ?? '',
    deskripsi: (row.deskripsi ?? '').split('\n\n').filter(Boolean).length
      ? (row.deskripsi ?? '').split('\n\n').filter(Boolean)
      : [row.deskripsi ?? ''],
    status: row.status_pendaftaran || (row.link_registrasi ? 'Terbuka untuk Umum Alumni' : 'Terbuka untuk Umum'),
    htm: row.htm || 'Gratis',
    hasSertifikat: row.has_sertifikat || false,
    pembicara: Array.isArray(row.pembicara) ? row.pembicara : [],
    pamflet: row.pamflet_url || null,
    publishedBy: row.published_by || 'IKA Daarul Mughni',
  }
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
const DAY_ABBR = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function isSameDay(date, iso) {
  const d2 = parseISO(iso)
  return (
    date.getFullYear() === d2.getFullYear() &&
    date.getMonth() === d2.getMonth() &&
    date.getDate() === d2.getDate()
  )
}

function MiniCalendar({ selectedDate, onSelect, eventDates }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate()

  const cells = []
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, type: 'prev' })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' })
  }
  let next = 1
  while (cells.length < 42) {
    cells.push({ day: next++, type: 'next' })
  }

  function isToday(cell) {
    return (
      cell.type === 'current' &&
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      cell.day === today.getDate()
    )
  }

  function isSelected(cell) {
    if (!selectedDate || cell.type !== 'current') return false
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === cell.day
    )
  }

  function hasEvent(cell) {
    if (cell.type !== 'current') return false
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
    return eventDates.includes(iso)
  }

  function handleCell(cell) {
    if (cell.type === 'prev') {
      const pm = viewMonth === 0 ? 11 : viewMonth - 1
      const py = viewMonth === 0 ? viewYear - 1 : viewYear
      setViewMonth(pm); setViewYear(py)
      onSelect(new Date(py, pm, cell.day))
    } else if (cell.type === 'next') {
      const nm = viewMonth === 11 ? 0 : viewMonth + 1
      const ny = viewMonth === 11 ? viewYear + 1 : viewYear
      setViewMonth(nm); setViewYear(ny)
      onSelect(new Date(ny, nm, cell.day))
    } else {
      const d = new Date(viewYear, viewMonth, cell.day)
      if (selectedDate && isSameDay(selectedDate, d.toISOString().slice(0, 10))) {
        onSelect(null)
      } else {
        onSelect(d)
      }
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }
  function goToToday() {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    onSelect(null)
  }

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-[#0A2415]">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_ABBR.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const today_ = isToday(cell)
          const selected_ = isSelected(cell)
          const event_ = hasEvent(cell)
          return (
            <button
              key={i}
              onClick={() => handleCell(cell)}
              className={`relative h-8 w-full flex flex-col items-center justify-center text-xs rounded-lg transition-colors
                ${cell.type !== 'current' ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}
                ${today_ && !selected_ ? 'font-bold bg-green-100 text-[#1A5C38] hover:bg-green-200' : ''}
                ${selected_ ? '!bg-[#1A5C38] !text-white font-bold hover:!bg-[#155230]' : ''}
              `}
            >
              {cell.day}
              {event_ && !selected_ && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#F0A500]" />
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={goToToday}
        className="w-full text-center text-xs text-[#1A5C38] font-semibold mt-3 hover:underline"
      >
        Kembali ke Hari Ini
      </button>
    </div>
  )
}

function PamfletLightbox({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/92 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>
      <img
        src={src}
        alt="Pamflet Acara"
        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

function EventModal({ event, onClose }) {
  const [pamfletOpen, setPamfletOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const style = kategoriStyle[event.kategori] || { bg: 'bg-gray-500', text: 'text-white' }

  return (
    <>
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 sm:h-64 flex-shrink-0">
          <img
            src={event.imageHero}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className={`inline-block ${style.bg} ${style.text} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2`}>
              {event.kategoriLabelPanjang}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
              {event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {event.tanggalLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {event.lokasiSingkat}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 grid sm:grid-cols-[1fr_220px] gap-6">
          {/* Left: description + speakers */}
          <div>
            <h3 className="flex items-center gap-2 font-bold text-[#0A2415] mb-3 text-sm">
              <span className="w-4 h-4 flex items-center justify-center">📖</span>
              Deskripsi Acara
            </h3>
            <div className="space-y-3 mb-6">
              {event.deskripsi.map((p, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
              ))}
            </div>

            {event.pembicara.length > 0 && (
              <>
                <h3 className="flex items-center gap-2 font-bold text-[#0A2415] mb-3 text-sm">
                  <Users className="w-4 h-4" />
                  Pembicara & Tokoh Hadir
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {event.pembicara.map((p) => (
                    <div key={p.nama} className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: getAvatarColor(p.nama) }}
                      >
                        {getInitials(p.nama)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0A2415] leading-snug">{p.nama}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{p.peran}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: registration + map */}
          <div className="space-y-4">
            {/* Registration card */}
            <div className="bg-[#F8FAF9] border border-gray-100 rounded-xl p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                Status Pendaftaran
              </p>
              <p className="text-sm font-bold text-[#0A2415] mb-3">{event.status}</p>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                HTM / Kontribusi
              </p>
              <p className="text-sm font-bold text-[#0A2415] mb-4">{event.htm}</p>

              {event.linkRegistrasi ? (
                supaUser ? (
                  <a
                    href={event.linkRegistrasi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#1A5C38] hover:bg-[#0A2415] text-white font-bold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Daftar Sekarang
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    onClick={() => navigate('/masuk')}
                    className="w-full bg-[#1A5C38] hover:bg-[#0A2415] text-white font-bold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Login untuk Daftar
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )
              ) : (
                <button disabled className="w-full bg-gray-200 text-gray-400 font-bold text-sm py-2.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                  Pendaftaran Belum Dibuka
                </button>
              )}

              {event.hasSertifikat && (
                <p className="text-[10px] text-gray-400 text-center mt-2 leading-relaxed italic">
                  Sertifikat digital tersedia bagi peserta yang mendaftar online.
                </p>
              )}
            </div>

            {/* Map card */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="relative h-24 bg-gradient-to-br from-[#1A5C38]/20 to-[#2A7A4F]/20">
                <img
                  src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=400&h=120&q=60"
                  alt="Peta lokasi"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#1A5C38] rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-[#0A2415] mb-1">Lokasi:</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{event.lokasiDetail}</p>
                {event.mapsUrl ? (
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#1A5C38] font-semibold hover:underline"
                  >
                    Buka di Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 italic">Tautan peta tidak tersedia</span>
                )}
              </div>
            </div>
            {/* Pamflet card */}
            {event.pamflet && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-[#0A2415]">Pamflet Acara</p>
                  <span className="text-[10px] text-gray-400">Klik untuk perbesar</span>
                </div>
                <button
                  onClick={() => setPamfletOpen(true)}
                  className="relative w-full group overflow-hidden block"
                >
                  <img
                    src={event.pamflet}
                    alt="Pamflet"
                    className="w-full object-cover max-h-48 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <ZoomIn className="w-5 h-5 text-[#0A2415]" />
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 pb-5 border-t border-gray-100 pt-4">
          <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <span>🌐</span>
            Acara ini dipublikasikan oleh {event.publishedBy}
          </p>
        </div>
      </motion.div>
    </div>

    {pamfletOpen && event.pamflet && (
      <PamfletLightbox src={event.pamflet} onClose={() => setPamfletOpen(false)} />
    )}
    </>
  )
}

export default function AgendaPage() {
  const { supaUser } = useAuth()
  const navigate = useNavigate()
  const [agendaList, setAgendaList] = useState([])
  const [loadingAgenda, setLoadingAgenda] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [filterKategori, setFilterKategori] = useState('semua')
  const [filterLokasi, setFilterLokasi] = useState('semua')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(4)
  const [openEvent, setOpenEvent] = useState(null)

  const loadAgenda = useCallback(async () => {
    setLoadingAgenda(true)
    try {
      const { data } = await supabase
        .from('agenda')
        .select('id, judul, deskripsi, lokasi, lokasi_kategori, tanggal_mulai, tanggal_selesai, kategori, foto_url, link_registrasi, maps_url, pembicara, status_pendaftaran, htm, has_sertifikat, published_by, image_hero, pamflet_url')
        .eq('is_aktif', true)
        .order('tanggal_mulai', { ascending: true })
      setAgendaList((data ?? []).map(mapAgenda))
    } catch {}
    finally { setLoadingAgenda(false) }
  }, [])

  useEffect(() => { loadAgenda() }, [loadAgenda])

  const eventDates = agendaList.map(e => e.tanggalISO)

  const filtered = useMemo(() => {
    let result = agendaList

    if (selectedDate) {
      result = result.filter(e => isSameDay(selectedDate, e.tanggalISO))
    }
    if (filterKategori !== 'semua') {
      result = result.filter(e => e.kategori === filterKategori)
    }
    if (filterLokasi !== 'semua') {
      result = result.filter(e => e.lokasiKategori === filterLokasi)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.lokasiSingkat.toLowerCase().includes(q)
      )
    }

    return result
  }, [agendaList, selectedDate, filterKategori, filterLokasi, search])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const startIdx = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const endIdx = Math.min(page * perPage, filtered.length)

  function resetPage() { setPage(1) }

  function handleSelectDate(date) { setSelectedDate(date); resetPage() }
  function handleKategori(val)    { setFilterKategori(val); resetPage() }
  function handleLokasi(val)      { setFilterLokasi(val); resetPage() }

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <Link to="/" className="hover:text-[#1A5C38] transition-colors">Beranda</Link>
            <span>/</span>
            <span className="text-[#0A2415] font-medium">Agenda Acara</span>
          </nav>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

            {/* Sidebar */}
            <aside className="space-y-5">
              {/* Calendar */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="flex items-center gap-2 font-bold text-[#0A2415] text-sm mb-4">
                  <Calendar className="w-4 h-4 text-[#1A5C38]" />
                  Filter Tanggal
                </h3>
                <p className="text-xs text-gray-400 mb-4 -mt-2">
                  {selectedDate
                    ? `Menampilkan: ${selectedDate.getDate()} ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
                    : 'Pilih tanggal untuk melihat jadwal'
                  }
                </p>
                <MiniCalendar
                  selectedDate={selectedDate}
                  onSelect={handleSelectDate}
                  eventDates={eventDates}
                />
              </div>

              {/* Kategori & Lokasi */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="flex items-center gap-2 font-bold text-[#0A2415] text-sm mb-4">
                  <span className="w-4 h-4 text-[#1A5C38] flex-shrink-0">▼</span>
                  Kategori & Lokasi
                </h3>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Kategori
                </p>
                <div className="relative mb-4">
                  <select
                    value={filterKategori}
                    onChange={e => handleKategori(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1A5C38] bg-white text-[#0A2415] appearance-none pr-8"
                  >
                    {agendaKategori.map(k => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                  <ChevronLeft className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 rotate-[-90deg] pointer-events-none" />
                </div>

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Lokasi
                </p>
                <div className="relative">
                  <select
                    value={filterLokasi}
                    onChange={e => handleLokasi(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1A5C38] bg-white text-[#0A2415] appearance-none pr-8"
                  >
                    {agendaLokasi.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                  <ChevronLeft className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 rotate-[-90deg] pointer-events-none" />
                </div>
              </div>

              {/* Info RSVP */}
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-4 flex gap-3">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-800 mb-0.5">Info Registrasi</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Fitur RSVP hanya tersedia bagi alumni yang telah diverifikasi oleh admin.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div>
              <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2415] tracking-tight mb-1">
                  Agenda Acara Alumni
                </h1>
                <p className="text-gray-500 text-sm mb-4">
                  Temukan berbagai kegiatan untuk tetap terhubung dan berkontribusi bagi almamater.
                </p>
                {/* Search bar */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); resetPage() }}
                    placeholder="Cari nama acara atau lokasi..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#1A5C38] bg-white transition-colors"
                  />
                  {search && (
                    <button onClick={() => { setSearch(''); resetPage() }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Active filters indicator */}
              {(selectedDate || filterKategori !== 'semua' || filterLokasi !== 'semua') && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="text-xs text-gray-500">
                    Menampilkan <span className="font-bold text-[#0A2415]">{filtered.length}</span> acara
                  </span>
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A5C38] text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {filterKategori !== 'semua' && (
                    <button
                      onClick={() => setFilterKategori('semua')}
                      className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A5C38] text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {agendaKategori.find(k => k.value === filterKategori)?.label}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {filterLokasi !== 'semua' && (
                    <button
                      onClick={() => setFilterLokasi('semua')}
                      className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A5C38] text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {agendaLokasi.find(l => l.value === filterLokasi)?.label}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Agenda list */}
              {loadingAgenda ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#1A5C38]" />
                </div>
              ) : paged.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-25" />
                  <p className="text-base font-medium text-gray-500 mb-1">Tidak ada acara ditemukan</p>
                  <p className="text-sm">Coba ubah filter atau pilih tanggal lain.</p>
                </div>
              ) : (
                <motion.div
                  key={`${selectedDate}-${filterKategori}-${filterLokasi}`}
                  initial="hidden"
                  animate="show"
                  variants={stagger}
                  className="space-y-0"
                >
                  {paged.map((event, idx) => {
                    const style = kategoriStyle[event.kategori] || { bg: 'bg-gray-500', text: 'text-white' }
                    return (
                      <motion.div
                        key={event.id}
                        variants={fadeUp}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`flex gap-5 py-6 ${idx < paged.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        {/* Image */}
                        <div className="relative flex-shrink-0 w-44 h-32 rounded-xl overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <span className={`absolute top-2 left-2 ${style.bg} ${style.text} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                            {event.kategoriLabel}
                          </span>
                        </div>

                        {/* Detail */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#0A2415] text-base leading-snug mb-2 line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {event.tanggalLabel}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {event.waktu}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              {event.lokasiSingkat}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                            {event.excerpt}
                          </p>
                          <div className="flex gap-2">
                            {event.linkRegistrasi && (
                              supaUser ? (
                                <a
                                  href={event.linkRegistrasi}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-[#1A5C38] hover:bg-[#0A2415] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                                >
                                  RSVP Sekarang
                                </a>
                              ) : (
                                <button
                                  onClick={() => navigate('/masuk')}
                                  className="bg-[#1A5C38] hover:bg-[#0A2415] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                                >
                                  Login untuk RSVP
                                </button>
                              )
                            )}
                            <button
                              onClick={() => setOpenEvent(event)}
                              className="border border-[#1A5C38] text-[#1A5C38] hover:bg-[#E8F5EE] text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                              Lihat Detail
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}

              {/* Pagination */}
              {filtered.length > 0 && (
                <div className="mt-8 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-6">
                    <PerPageSelector value={perPage} options={[4, 8, 12]} onChange={n => { setPerPage(n); resetPage() }} />
                    <span className="text-xs text-gray-400">{startIdx}–{endIdx} dari {filtered.length} acara</span>
                  </div>
                  <PaginationBar page={page} totalPages={totalPages} onPage={setPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal */}
      {openEvent && (
        <EventModal event={openEvent} onClose={() => setOpenEvent(null)} />
      )}
    </div>
  )
}
