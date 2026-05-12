import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Clock, Briefcase, ChevronRight, ExternalLink } from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'

const KATEGORI = ['Semua', 'Teknologi', 'Kesehatan', 'Hukum', 'Ekonomi & Bisnis', 'Pendidikan']

const TIPE_COLOR = {
  Remote: { bg: '#EFF6FF', text: '#1D4ED8' },
  Onsite: { bg: '#F0FDF4', text: '#15803D' },
  Hybrid: { bg: '#FFF7ED', text: '#C2410C' },
}

const lowongan = [
  {
    id: 1, judul: 'Software Engineer', perusahaan: 'TechNova Solutions', lokasi: 'Jakarta',
    tipe: 'Remote', gaji: 'Rp 8–15 jt/bln', kategori: 'Teknologi',
    tags: ['React', 'Node.js', 'PostgreSQL'], poster: 'Ahmad Zaki · Angkatan 2018', posted: '2 hari lalu',
  },
  {
    id: 2, judul: 'Dokter Umum', perusahaan: 'Klinik Sehat Bersama', lokasi: 'Bogor',
    tipe: 'Onsite', gaji: 'Rp 7–12 jt/bln', kategori: 'Kesehatan',
    tags: ['BPJS', 'Faskes Tingkat 1'], poster: 'Fatimah Az-Zahra · Angkatan 2016', posted: '3 hari lalu',
  },
  {
    id: 3, judul: 'Konsultan Hukum', perusahaan: 'Adil & Partners Law Firm', lokasi: 'Bandung',
    tipe: 'Onsite', gaji: 'Rp 10–20 jt/bln', kategori: 'Hukum',
    tags: ['Litigasi', 'Hukum Perusahaan', 'Kontrak'], poster: 'Ridwan Hakim · Angkatan 2015', posted: '1 minggu lalu',
  },
  {
    id: 4, judul: 'Guru Matematika', perusahaan: 'SMA Islam Al-Mubarok', lokasi: 'Depok',
    tipe: 'Onsite', gaji: 'Rp 4–6 jt/bln', kategori: 'Pendidikan',
    tags: ['Kurikulum Merdeka', 'Matematika', 'SMA'], poster: 'Nurul Hidayah · Angkatan 2019', posted: '4 hari lalu',
  },
  {
    id: 5, judul: 'Financial Analyst', perusahaan: 'Bank Syariah Mandiri', lokasi: 'Jakarta',
    tipe: 'Hybrid', gaji: 'Rp 9–15 jt/bln', kategori: 'Ekonomi & Bisnis',
    tags: ['Analisis Keuangan', 'Excel', 'Perbankan Syariah'], poster: 'Hasan Basri · Angkatan 2013', posted: '5 hari lalu',
  },
  {
    id: 6, judul: 'UI/UX Designer', perusahaan: 'Kreasi Digital Studio', lokasi: 'Jakarta',
    tipe: 'Remote', gaji: 'Rp 7–12 jt/bln', kategori: 'Teknologi',
    tags: ['Figma', 'Prototyping', 'User Research'], poster: 'Zahra Putri · Angkatan 2022', posted: '1 hari lalu',
  },
  {
    id: 7, judul: 'Apoteker', perusahaan: 'RS Bhakti Mandiri', lokasi: 'Bekasi',
    tipe: 'Onsite', gaji: 'Rp 6–9 jt/bln', kategori: 'Kesehatan',
    tags: ['Farmasi', 'Apotek Rumah Sakit'], poster: 'Siti Maryam · Angkatan 2017', posted: '6 hari lalu',
  },
  {
    id: 8, judul: 'Data Analyst', perusahaan: 'Fintech Syariah Indonesia', lokasi: 'Jakarta',
    tipe: 'Remote', gaji: 'Rp 10–18 jt/bln', kategori: 'Teknologi',
    tags: ['Python', 'SQL', 'Tableau', 'Machine Learning'], poster: 'Irfan Hakim · Angkatan 2016', posted: '3 hari lalu',
  },
  {
    id: 9, judul: 'Legal Officer', perusahaan: 'PT Maju Bersama Tbk', lokasi: 'Surabaya',
    tipe: 'Hybrid', gaji: 'Rp 8–12 jt/bln', kategori: 'Hukum',
    tags: ['Hukum Perusahaan', 'Kontrak', 'Compliance'], poster: 'Budi Santoso · Angkatan 2014', posted: '1 minggu lalu',
  },
  {
    id: 10, judul: 'Content Writer & Editor', perusahaan: 'Media Islam Nusantara', lokasi: 'Bandung',
    tipe: 'Remote', gaji: 'Rp 4–7 jt/bln', kategori: 'Pendidikan',
    tags: ['Penulisan Konten', 'SEO', 'Editorial'], poster: 'Mira Santika · Angkatan 2018', posted: '2 hari lalu',
  },
]

function initials(name) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export default function KarirPage() {
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('Semua')

  const filtered = lowongan.filter((l) => {
    const q = search.toLowerCase()
    const matchSearch = !q || l.judul.toLowerCase().includes(q) || l.perusahaan.toLowerCase().includes(q) || l.lokasi.toLowerCase().includes(q)
    const matchKat = kategori === 'Semua' || l.kategori === kategori
    return matchSearch && matchKat
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-10 px-4" style={{ backgroundColor: '#0A2415' }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Briefcase className="w-3 h-3" /> Bursa Kerja Alumni
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Temukan Peluang Karir<br />dari Sesama Alumni
          </h1>
          <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Lowongan pekerjaan yang dipercayakan oleh alumni Daarul Mughni dari berbagai bidang dan perusahaan terkemuka.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari posisi, perusahaan, atau lokasi..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/30 text-sm outline-none focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {KATEGORI.map((kat) => (
            <button
              key={kat}
              onClick={() => setKategori(kat)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                kategori === kat
                  ? { backgroundColor: '#1A5C38', color: '#fff' }
                  : { backgroundColor: '#fff', color: '#4B5563', border: '1px solid #E5E7EB' }
              }
            >
              {kat}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} lowongan ditemukan</span>
        </div>

        {/* Job list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">Tidak ada lowongan yang sesuai pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((job) => {
              const tipe = TIPE_COLOR[job.tipe] || TIPE_COLOR.Onsite
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
                        {initials(job.perusahaan)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A2415] group-hover:text-[#1A5C38] transition-colors">
                          {job.judul}
                        </h3>
                        <p className="text-xs text-gray-500">{job.perusahaan}</p>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tipe.bg, color: tipe.text }}
                    >
                      {job.tipe}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.lokasi}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.gaji}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">Diposting oleh <span className="font-semibold text-gray-600">{job.poster}</span></p>
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
            <h3 className="text-base font-bold text-white mb-1">Punya lowongan untuk sesama alumni?</h3>
            <p className="text-xs text-white/50">Posting gratis dan jangkau 5.000+ alumni Daarul Mughni.</p>
          </div>
          <Link
            to="/dashboard"
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-[#0A2415] hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F0A500' }}
          >
            Posting Lowongan
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
