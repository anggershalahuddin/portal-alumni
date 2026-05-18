import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { kategoriGaleri } from '@/data/galeri'
import { supabase } from '@/lib/supabase'

const KATEGORI_LIST = [{ value: 'semua', label: 'Semua' }, ...kategoriGaleri]

function formatTanggal(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function GaleriPage() {
  const [galeri, setGaleri]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [activeKat, setActiveKat]     = useState('semua')
  const [lightbox, setLightbox]       = useState(null) // index of current item in filtered

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('galeri')
      .select('id, judul, deskripsi, foto_url, kategori, created_at')
      .eq('is_aktif', true)
      .order('created_at', { ascending: false })
    if (err) { setError(err.message); setLoading(false); return }
    setGaleri((data ?? []).map(row => ({
      id:       row.id,
      judul:    row.judul,
      deskripsi:row.deskripsi ?? '',
      url:      row.foto_url,
      kategori: row.kategori ?? 'kegiatan',
      tanggal:  formatTanggal(row.created_at),
    })))
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = activeKat === 'semua' ? galeri : galeri.filter(g => g.kategori === activeKat)

  function openLightbox(idx) { setLightbox(idx) }
  function closeLightbox()   { setLightbox(null) }
  function prev() { setLightbox(i => (i - 1 + filtered.length) % filtered.length) }
  function next() { setLightbox(i => (i + 1) % filtered.length) }

  useEffect(() => {
    if (lightbox === null) return
    function onKey(e) {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, filtered.length])

  const currentItem = lightbox !== null ? filtered[lightbox] : null

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      {/* Hero */}
      <div
        className="pt-16"
        style={{ background: 'linear-gradient(135deg, #061410 0%, #0A2415 50%, #1A5C38 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white/80 transition-colors">Beranda</Link>
            <span>/</span>
            <Link to="/pesantren" className="hover:text-white/80 transition-colors">Pesantren</Link>
            <span>/</span>
            <span className="text-white/80">Galeri</span>
          </nav>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Dokumentasi</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Galeri Kegiatan &amp; Alumni
          </h1>
          <p className="text-white/60 text-sm">
            Rekam jejak berbagai kegiatan dan momen berkesan yang terjadi di Daarul Mughni.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {KATEGORI_LIST.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveKat(value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeKat === value
                    ? 'bg-[#0A2415] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={loadData} className="ml-auto font-bold hover:underline">Coba lagi</button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#1A5C38]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium mb-1">Belum ada foto</p>
            <p className="text-sm">Tidak ada foto dalam kategori ini.</p>
          </div>
        ) : (
          <motion.div
            key={activeKat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.35, ease: 'easeOut' }}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={item.url}
                  alt={item.judul}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80' }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-sm font-bold leading-snug line-clamp-2">{item.judul}</p>
                  {item.deskripsi && <p className="text-white/70 text-xs mt-1 line-clamp-1">{item.deskripsi}</p>}
                </div>
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#0A2415] capitalize">
                    {kategoriGaleri.find(k => k.value === item.kategori)?.label ?? item.kategori}
                  </span>
                </div>
                {/* Zoom icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-[#0A2415]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            {filtered.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={currentItem.url}
                alt={currentItem.judul}
                className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80' }}
              />
              <div className="mt-4 text-center">
                <p className="text-white font-bold text-base">{currentItem.judul}</p>
                {currentItem.deskripsi && <p className="text-white/60 text-sm mt-1">{currentItem.deskripsi}</p>}
                {filtered.length > 1 && (
                  <p className="text-white/40 text-xs mt-2">{lightbox + 1} / {filtered.length}</p>
                )}
              </div>
            </motion.div>

            {/* Next */}
            {filtered.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
