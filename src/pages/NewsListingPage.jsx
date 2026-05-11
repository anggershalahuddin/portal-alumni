import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calendar, ArrowUpRight, ChevronLeft, ChevronRight, Bell, GraduationCap } from 'lucide-react'
import { news, categories, popularTags } from '@/data/news'
import { fadeUp, stagger, viewport } from '@/lib/animations'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const ITEMS_PER_PAGE = 6

const tagStyle = {
  'kegiatan-alumni': 'bg-[#E8F5EE] text-[#1A5C38] border border-[#1A5C38]/15',
  'info-pondok': 'bg-[#FFFBEB] text-[#92400E] border border-amber-200',
  'peluang-kerja': 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100',
  'kisah-sukses': 'bg-[#FDF4FF] text-[#7E22CE] border border-purple-100',
}

const sidebarAgenda = [
  { day: '20', month: 'DES', title: 'Reuni Akbar Dasawarsa', location: 'Auditorium Utama Pondok' },
  { day: '15', month: 'JAN', title: 'Seminar Karier Alumni Teknologi', location: 'Zoom Online' },
  { day: '05', month: 'MAR', title: 'Haul Guru & Doa Bersama', location: "Masjid Jami' Sa'ad Mughni" },
]

export default function NewsListingPage() {
  const [activeCategory, setActiveCategory] = useState('semua')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [email, setEmail] = useState('')

  const filtered = news.filter((n) => {
    const matchCat = activeCategory === 'semua' || n.category === activeCategory
    const matchSearch =
      search === '' ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleCategoryChange(val) {
    setActiveCategory(val)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      {/* Page Hero */}
      <div
        className="pt-16"
        style={{ background: 'linear-gradient(135deg, #061410 0%, #0A2415 50%, #1A5C38 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white/80 transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-white/80">Berita</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Berita & Pengumuman
          </h1>
          <p className="text-white/60 text-sm">
            Update terbaru seputar prestasi, kegiatan, dan info penting keluarga besar Daarul Mughni.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {categories.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleCategoryChange(value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === value
                    ? 'bg-[#0A2415] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
            <div className="flex-shrink-0 ml-auto pl-4 hidden sm:flex items-center gap-2 border-l border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Cari berita..."
                  className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#1A5C38] w-52"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden bg-white px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari berita..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#1A5C38]"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* Articles grid */}
          <div>
            {paged.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-medium mb-1">Tidak ada berita ditemukan</p>
                <p className="text-sm">Coba ubah filter atau kata kunci pencarian.</p>
              </div>
            ) : (
              <motion.div
                key={`${activeCategory}-${page}`}
                initial="hidden"
                animate="show"
                variants={stagger}
                className="grid sm:grid-cols-2 gap-6"
              >
                {paged.map((item) => (
                  <motion.article
                    key={item.slug}
                    variants={fadeUp}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <Link to={`/berita/${item.slug}`}>
                      <div className="h-44 relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${tagStyle[item.category] ?? 'bg-gray-100 text-gray-600'}`}
                          >
                            {item.categoryLabel}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </div>
                        <h3 className="text-[#0A2415] font-bold text-base leading-snug mb-2 group-hover:text-[#1A5C38] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
                          {item.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[#1A5C38] text-sm font-bold">
                          Selengkapnya
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? 'bg-[#0A2415] text-white'
                        : 'border border-gray-200 text-gray-600 hover:border-[#1A5C38] hover:text-[#1A5C38]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Popular */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-[#0A2415] text-sm mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#F0A500] rounded-full inline-block" />
                Berita Terpopuler
              </h3>
              <div className="space-y-4">
                {news.slice(0, 4).map((item, i) => (
                  <Link
                    key={item.slug}
                    to={`/berita/${item.slug}`}
                    className="flex gap-3 group"
                  >
                    <span className="text-2xl font-bold text-gray-100 leading-none w-6 flex-shrink-0 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-[#0A2415] text-xs font-bold leading-snug group-hover:text-[#1A5C38] transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming agenda */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-[#0A2415] text-sm mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#1A5C38] rounded-full inline-block" />
                Agenda Alumni
              </h3>
              <div className="space-y-3">
                {sidebarAgenda.map(({ day, month, title, location }) => (
                  <div key={title} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 text-center bg-[#F8FAF9] rounded-lg py-1.5">
                      <div className="text-sm font-bold text-[#0A2415] leading-none">{day}</div>
                      <div className="text-[9px] font-bold text-[#F0A500] uppercase tracking-widest mt-0.5">
                        {month}
                      </div>
                    </div>
                    <div>
                      <p className="text-[#0A2415] text-xs font-bold leading-snug">{title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{location}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/agenda"
                className="inline-flex items-center gap-1 text-[#1A5C38] text-xs font-bold mt-4 hover:gap-2 transition-all"
              >
                Lihat semua agenda
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Newsletter */}
            <div
              className="rounded-xl p-5"
              style={{ background: 'linear-gradient(135deg, #0A2415 0%, #1A5C38 100%)' }}
            >
              <Bell className="w-6 h-6 text-[#F0A500] mb-3" />
              <h3 className="font-bold text-white text-sm mb-1">Berlangganan Newsletter</h3>
              <p className="text-white/60 text-xs mb-4 leading-relaxed">
                Dapatkan berita terbaru langsung di kotak masuk email Anda.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Alamat email Anda"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#F0A500] mb-2"
              />
              <button className="w-full bg-[#F0A500] hover:bg-[#D4920A] text-[#0A2415] text-xs font-bold py-2 rounded-lg transition-colors">
                Langganan Sekarang
              </button>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-[#0A2415] text-sm mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#F0A500] rounded-full inline-block" />
                Tag Populer
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-xs bg-[#F8FAF9] hover:bg-[#E8F5EE] text-gray-600 hover:text-[#1A5C38] rounded-full border border-gray-100 hover:border-[#1A5C38]/20 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0A2415 0%, #1A5C38 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative px-8 py-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F0A500] flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-[#0A2415]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-0.5">
                  Ada Kisah Menarik yang Ingin Dibagikan?
                </h3>
                <p className="text-white/60 text-sm">
                  Kirim cerita inspirasi, prestasi, atau pengumuman komunitas alumni.
                </p>
              </div>
            </div>
            <a
              href="mailto:alumni@daarulmughni.ac.id"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#F0A500] hover:bg-[#D4920A] text-[#0A2415] font-bold px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              Kirim Cerita
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
