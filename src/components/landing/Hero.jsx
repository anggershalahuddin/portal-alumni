import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import heroImg from '@/assets/hero.jpg'
import { TOTAL_ALUMNI } from '@/data/alumni'
import { useSiteConfig } from '@/context/SiteConfigContext'

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: 'easeOut', delay },
})

export default function Hero() {
  const { config } = useSiteConfig()
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background photo */}
      <img
        src={heroImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(6,20,16,0.88) 0%, rgba(10,36,21,0.80) 50%, rgba(6,20,16,0.75) 100%)',
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div {...up(0.1)}>
            <div className="inline-flex items-center gap-2 border border-[#F0A500]/40 bg-[#F0A500]/10 text-[#F0A500] text-xs font-bold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
              Portal Alumni Resmi
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            {...up(0.25)}
            className="text-4xl sm:text-6xl lg:text-[68px] font-bold text-white leading-[1.06] mb-6 tracking-tight"
          >
            Menjalin Ukhuwah,{' '}
            <span className="text-[#F0A500]">Membangun Masa Depan</span>
          </motion.h1>

          {/* Description */}
          <motion.p {...up(0.4)} className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
            Selamat datang di wadah kolaborasi profesional dan silaturahmi seluruh lulusan Pondok Pesantren Daarul Mughni Al Maaliki. Terus terhubung dengan almamater dan sesama alumni.
          </motion.p>

          {/* CTAs */}
          <motion.div {...up(0.52)} className="flex flex-wrap gap-4">
            <a
              href="/daftar"
              className="inline-flex items-center gap-2 bg-[#F0A500] hover:bg-[#D4920A] text-[#0A2415] font-bold text-sm px-7 py-3.5 rounded transition-colors"
            >
              Gabung Sekarang
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#tentang"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium text-sm px-7 py-3.5 rounded transition-colors"
            >
              Pelajari Lebih
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...up(0.65)}
            className="flex flex-wrap gap-10 mt-16 pt-8 border-t border-white/10"
          >
            {[
              { value: TOTAL_ALUMNI.toLocaleString('id-ID') + '+', label: 'Alumni Terdaftar' },
              { value: '20+', label: 'Angkatan' },
              { value: '2006', label: 'Tahun Pertama Lulusan' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-white/45 text-sm mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
