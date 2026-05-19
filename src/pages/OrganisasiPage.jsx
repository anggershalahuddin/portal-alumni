import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, Mail, Calendar, Search, Loader2, X, ExternalLink } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { fadeUp, stagger } from '@/lib/animations'
import { supabase } from '@/lib/supabase'

function mapOrg(row) {
  return {
    id: row.id,
    nama: row.nama,
    singkatan: row.singkatan ?? '',
    deskripsi: row.deskripsi ?? '',
    logo: row.logo_url ?? '',
    ketua: row.ketua ?? '',
    kontak: row.kontak ?? '',
    tahunBerdiri: row.tahun_berdiri ?? null,
  }
}

function DetailModal({ org, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-[#0A2415] px-6 pt-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-4">
            {org.logo ? (
              <img
                src={org.logo}
                alt={org.nama}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border-2 border-white/20 bg-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-2xl bg-[#1A5C38]">
                {(org.singkatan || org.nama).charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xl font-extrabold text-white leading-tight">
                {org.singkatan || org.nama}
              </p>
              {org.singkatan && (
                <p className="text-white/60 text-sm mt-0.5">{org.nama}</p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {org.deskripsi && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tentang</p>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{org.deskripsi}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {org.ketua && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-[#E8F5EE] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-[#1A5C38]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ketua</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{org.ketua}</p>
                </div>
              </div>
            )}
            {org.tahunBerdiri && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-[#E8F5EE] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#1A5C38]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tahun Berdiri</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{org.tahunBerdiri}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {org.kontak && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 min-w-0">
              <Mail className="w-4 h-4 text-[#1A5C38] flex-shrink-0" />
              <span className="truncate">{org.kontak}</span>
            </div>
            <a
              href={`mailto:${org.kontak}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white flex-shrink-0 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Hubungi <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function OrgCard({ org, index, onClick }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {org.logo ? (
          <img
            src={org.logo}
            alt={org.nama}
            className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-100"
            onError={e => { e.target.onerror = null; e.target.src = '' }}
          />
        ) : (
          <div
            className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: '#1A5C38' }}
          >
            {(org.singkatan || org.nama).charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-900 leading-tight">
            {org.singkatan ? org.singkatan : org.nama}
          </p>
          {org.singkatan && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{org.nama}</p>
          )}
        </div>
      </div>

      {org.deskripsi && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{org.deskripsi}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-auto pt-3 border-t border-gray-50">
        {org.ketua && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="w-3.5 h-3.5 text-[#1A5C38]" />
            <span>{org.ketua}</span>
          </div>
        )}
        {org.kontak && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Mail className="w-3.5 h-3.5 text-[#1A5C38]" />
            <span className="truncate max-w-[140px]">{org.kontak}</span>
          </div>
        )}
        {org.tahunBerdiri && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-[#1A5C38]" />
            <span>Berdiri {org.tahunBerdiri}</span>
          </div>
        )}
      </div>

      <p className="text-[11px] text-[#1A5C38] font-semibold -mt-2">Lihat Detail →</p>
    </motion.div>
  )
}

export default function OrganisasiPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('organisasi')
        .select('id, nama, singkatan, deskripsi, logo_url, tahun_berdiri, ketua, kontak')
        .eq('is_aktif', true)
        .order('id', { ascending: true })
      setList((data ?? []).map(mapOrg))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = list.filter(o => {
    const q = search.toLowerCase()
    return (
      o.nama.toLowerCase().includes(q) ||
      o.singkatan.toLowerCase().includes(q) ||
      o.deskripsi.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      {/* Hero */}
      <div className="pt-16 bg-[#0A2415] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F0A500] blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#1A5C38] blur-2xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[#1A5C38]/60 text-[#86EFAC] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Building2 className="w-3.5 h-3.5" />
              Jaringan Organisasi Alumni
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Organisasi Alumni
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto">
              Bergabunglah dan berkolaborasi melalui berbagai organisasi alumni aktif Pondok Pesantren Daarul Mughni.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search + count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari organisasi..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#1A5C38] transition-colors"
            />
          </div>
          {!loading && (
            <p className="text-sm text-gray-500">
              {filtered.length} organisasi{search ? ' ditemukan' : ' aktif'}
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#1A5C38]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Building2 className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">
              {search ? 'Tidak ada organisasi yang cocok dengan pencarian.' : 'Belum ada organisasi aktif.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-[#1A5C38] text-sm font-semibold hover:underline"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((org, i) => (
              <OrgCard key={org.id} org={org} index={i} onClick={() => setSelected(org)} />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />

      {selected && <DetailModal org={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
