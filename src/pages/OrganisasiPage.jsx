import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, Mail, Calendar, Search, Loader2 } from 'lucide-react'
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

function OrgCard({ org, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
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
            <a href={`mailto:${org.kontak}`} className="hover:text-[#1A5C38] transition-colors">{org.kontak}</a>
          </div>
        )}
        {org.tahunBerdiri && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5 text-[#1A5C38]" />
            <span>Berdiri {org.tahunBerdiri}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function OrganisasiPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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
              <OrgCard key={org.id} org={org} index={i} />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
