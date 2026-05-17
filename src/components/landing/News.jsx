import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar } from 'lucide-react'
import { fadeUp, stagger, viewport } from '@/lib/animations'

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

const tagStyle = {
  'Kabar Alumni': 'bg-[#E8F5EE] text-[#1A5C38] border border-[#1A5C38]/15',
  'Info Pondok':  'bg-[#FFFBEB] text-[#92400E] border border-amber-200',
  'Kegiatan':     'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100',
  'Prestasi':     'bg-[#FDF4FF] text-[#7C3AED] border border-purple-100',
  'Akademik':     'bg-[#ECFEFF] text-[#0E7490] border border-cyan-100',
}
const tagDefault = 'bg-[#E8F5EE] text-[#1A5C38] border border-[#1A5C38]/15'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80'

function formatTanggal(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`
}

function extractDesc(konten) {
  try {
    const blocks = JSON.parse(konten)
    if (!Array.isArray(blocks)) return ''
    const para = blocks.find(b => b.type === 'paragraph' && b.text?.trim())
    if (!para) return ''
    const text = para.text.trim()
    return text.length > 150 ? text.slice(0, 150) + '…' : text
  } catch {
    return ''
  }
}

export default function News({ news = [], loading }) {
  if (loading || news.length === 0) return null

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#0A2415] mb-2 tracking-tight">
              Kabar Alumni &amp; Pondok
            </h2>
            <p className="text-gray-500 text-sm">
              Update terbaru seputar prestasi dan kegiatan keluarga besar Daarul Mughni.
            </p>
          </div>
          <Link
            to="/berita"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#1A5C38] hover:text-[#0A2415] text-sm font-bold transition-colors border border-[#1A5C38]/40 hover:border-[#0A2415] px-4 py-2 rounded"
          >
            Lihat Semua Berita
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {news.map((item) => {
            const tag      = item.kategori || 'Kabar Alumni'
            const tagClass = tagStyle[tag] ?? tagDefault
            return (
              <motion.article
                key={item.slug}
                variants={fadeUp}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Link to={`/berita/${item.slug}`}>
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={item.foto_url || FALLBACK_IMG}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tagClass}`}>
                        {tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                      <Calendar className="w-3 h-3" />
                      {formatTanggal(item.published_at)}
                    </div>
                    <h3 className="text-[#0A2415] font-bold text-base leading-snug mb-2 group-hover:text-[#1A5C38] transition-colors">
                      {item.judul}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {extractDesc(item.konten)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[#1A5C38] text-sm font-bold">
                      Selengkapnya
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </motion.div>

        <div className="sm:hidden mt-8 text-center">
          <Link
            to="/berita"
            className="inline-flex items-center gap-1.5 text-[#1A5C38] text-sm font-bold border border-[#1A5C38]/40 px-5 py-2.5 rounded"
          >
            Lihat Semua Berita
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
