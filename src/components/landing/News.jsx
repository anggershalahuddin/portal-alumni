import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Calendar } from 'lucide-react'
import { fadeUp, stagger, viewport } from '@/lib/animations'

const tagStyle = {
  'Kabar Alumni': 'bg-[#E8F5EE] text-[#1A5C38] border border-[#1A5C38]/15',
  'Info Pondok': 'bg-[#FFFBEB] text-[#92400E] border border-amber-200',
  Kegiatan: 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-100',
}

const news = [
  {
    slug: 'alumni-angkatan-2012-luncurkan-beasiswa',
    tag: 'Kabar Alumni',
    date: '12 Nov 2024',
    title: 'Alumni Angkatan 2012 Luncurkan Beasiswa untuk Santri Berprestasi',
    excerpt:
      'Beberapa alumni angkatan 2012 menginisiasi program beasiswa berkelanjutan bagi santri aktif di Daarul Mughni yang berprestasi.',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'pondok-pesantren-raih-penghargaan-berprestasi',
    tag: 'Info Pondok',
    date: '10 Nov 2024',
    title: 'Pondok Pesantren Raih Penghargaan Pesantren Berprestasi',
    excerpt:
      'Komitmen Daarul Mughni dalam pemberdayaan lingkungan meraih apresiasi tinggi dari Kementerian Lingkungan Hidup Indonesia.',
    image:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'kunjungan-kerja-alumni-startup-unicorn',
    tag: 'Kegiatan',
    date: '8 Nov 2024',
    title: 'Kunjungan Kerja Alumni ke Kantor Startup Unicorn',
    excerpt:
      'Membangun mindset digital, pengurus IKA Daarul Mughni melakukan kunjungan ke beberapa kantor startup teknologi di Jakarta.',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
]

export default function News() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#0A2415] mb-2 tracking-tight">
              Kabar Alumni & Pondok
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
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {news.map(({ slug, tag, date, title, excerpt, image }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Link to={`/berita/${slug}`}>
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tagStyle[tag]}`}>
                      {tag}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <Calendar className="w-3 h-3" />
                    {date}
                  </div>
                  <h3 className="text-[#0A2415] font-bold text-base leading-snug mb-2 group-hover:text-[#1A5C38] transition-colors">
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {excerpt}
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
