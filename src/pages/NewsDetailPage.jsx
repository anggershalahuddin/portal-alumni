import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, Eye, MessageCircle, ArrowLeft, ArrowUpRight, Lock, Tag } from 'lucide-react'
import { getNewsBySlug, getRelatedNews, getCategoryStyle } from '@/data/news'
import { fadeUp, viewport } from '@/lib/animations'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

function ShareButton({ label, color, icon }) {
  return (
    <button
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity hover:opacity-80"
      style={{ background: color }}
      title={label}
    >
      {icon}
    </button>
  )
}

function ContentBlock({ block }) {
  if (block.type === 'paragraph') {
    return (
      <p className="text-gray-700 leading-relaxed text-base mb-5">{block.text}</p>
    )
  }
  if (block.type === 'quote') {
    return (
      <blockquote className="relative pl-5 mb-6 border-l-[3px] border-[#F0A500]">
        <svg className="w-6 h-6 text-[#F0A500] mb-2 opacity-70" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-gray-600 italic text-base leading-relaxed mb-2">"{block.text}"</p>
        <cite className="text-[#1A5C38] text-sm font-bold not-italic">— {block.author}</cite>
      </blockquote>
    )
  }
  if (block.type === 'images') {
    return (
      <div className="grid grid-cols-2 gap-3 mb-6">
        {block.items.map((src, i) => (
          <div key={i} className="rounded-xl overflow-hidden aspect-video">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function NewsDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const article = getNewsBySlug(slug)
  const related = getRelatedNews(slug, 3)

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Berita tidak ditemukan.</p>
          <Link to="/berita" className="text-[#1A5C38] font-bold hover:underline">
            Kembali ke Berita
          </Link>
        </div>
      </div>
    )
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      {/* Hero */}
      <div className="pt-16 relative">
        <div className="h-[420px] sm:h-[520px] relative overflow-hidden">
          <img
            src={article.imageWide}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061410]/95 via-[#0A2415]/60 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-10 max-w-4xl mx-auto w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
              <Link to="/" className="hover:text-white/80 transition-colors">Beranda</Link>
              <span>/</span>
              <Link to="/berita" className="hover:text-white/80 transition-colors">Berita</Link>
              <span>/</span>
              <span className="text-white/70 line-clamp-1">{article.title}</span>
            </nav>

            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={getCategoryStyle(article.category)}
            >
              {article.categoryLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-white/60 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-[#1A5C38] flex items-center justify-center text-white text-xs font-bold">
                  {article.authorInitials}
                </div>
                <span className="text-white/80 font-medium">{article.author}</span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {article.readTime} baca
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {article.views.toLocaleString('id-ID')} dilihat
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> {article.comments} komentar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[56px_1fr_300px] gap-8 items-start">

          {/* Share column — sticky */}
          <div className="hidden lg:flex flex-col items-center gap-3 sticky top-24 self-start">
            <p className="text-gray-400 text-xs font-medium mb-1 writing-mode-vertical" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.1em' }}>
              BAGIKAN
            </p>
            {/* Facebook */}
            <ShareButton
              label="Bagikan ke Facebook"
              color="#1877F2"
              icon={
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              }
            />
            {/* Twitter/X */}
            <ShareButton
              label="Bagikan ke Twitter"
              color="#000000"
              icon={
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              }
            />
            {/* WhatsApp */}
            <ShareButton
              label="Bagikan ke WhatsApp"
              color="#25D366"
              icon={
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              }
            />
            {/* Copy link */}
            <button
              onClick={copyLink}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Salin tautan"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </button>
          </div>

          {/* Article body */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="min-w-0"
          >
            {/* Mobile share */}
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <span className="text-gray-400 text-xs font-medium">Bagikan:</span>
              <div className="flex gap-2">
                {[
                  { color: '#1877F2', label: 'Facebook' },
                  { color: '#000', label: 'Twitter' },
                  { color: '#25D366', label: 'WhatsApp' },
                ].map(({ color, label }) => (
                  <div key={label} className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs" style={{ background: color }}>
                    {label[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Article content */}
            <div className="prose-custom">
              {article.content.map((block, i) => (
                <ContentBlock key={i} block={block} />
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-gray-100">
              <Tag className="w-4 h-4 text-gray-400" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-[#F8FAF9] text-gray-600 rounded-full border border-gray-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Back */}
            <div className="mt-8">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-[#1A5C38] text-sm font-bold hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Berita
              </button>
            </div>

            {/* Comments section */}
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-[#0A2415] text-base">
                  Komentar ({article.comments})
                </h3>
              </div>
              <div className="px-6 py-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#F8FAF9] border border-gray-100 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <p className="font-bold text-[#0A2415] mb-1">Hanya Alumni yang Dapat Berkomentar</p>
                <p className="text-gray-500 text-sm mb-5 max-w-xs">
                  Masuk dengan akun alumni terverifikasi untuk bergabung dalam diskusi.
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/masuk"
                    className="bg-[#0A2415] hover:bg-[#1A5C38] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/daftar"
                    className="border border-[#0A2415] text-[#0A2415] hover:bg-[#0A2415] hover:text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Daftar Alumni
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right sidebar */}
          <aside className="hidden lg:block space-y-6 sticky top-24 self-start">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-[#0A2415] text-sm mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#F0A500] rounded-full inline-block" />
                Tentang Penulis
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A5C38] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {article.authorInitials}
                </div>
                <div>
                  <p className="text-[#0A2415] text-sm font-bold">{article.author}</p>
                  <p className="text-gray-400 text-xs">IKA Daarul Mughni</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-[#0A2415] text-sm mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#1A5C38] rounded-full inline-block" />
                Info Artikel
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Kategori</span>
                  <span
                    className="px-2.5 py-0.5 rounded-full font-medium"
                    style={getCategoryStyle(article.category)}
                  >
                    {article.categoryLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Diterbitkan</span>
                  <span className="text-[#0A2415] font-medium">{article.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Waktu baca</span>
                  <span className="text-[#0A2415] font-medium">{article.readTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Dilihat</span>
                  <span className="text-[#0A2415] font-medium">{article.views.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related news */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0A2415]">Berita Terkait</h2>
              <Link
                to="/berita"
                className="text-[#1A5C38] text-sm font-bold inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Lihat semua
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/berita/${item.slug}`}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-40 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={getCategoryStyle(item.category)}
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
                    <h3 className="text-[#0A2415] font-bold text-sm leading-snug group-hover:text-[#1A5C38] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
