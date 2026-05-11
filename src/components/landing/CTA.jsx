import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fadeUp, stagger, viewport } from '@/lib/animations'

export default function CTA() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #061410 0%, #0A2415 35%, #1A5C38 65%, #0A2415 100%)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(240, 165, 0, 0.12) 0%, transparent 60%)',
        }}
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={stagger}
        className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl font-bold text-white mb-4 tracking-tight"
        >
          Siap Terhubung Kembali?
        </motion.h2>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-white/60 text-base mb-10 leading-relaxed max-w-xl mx-auto"
        >
          Dapatkan akses eksklusif ke direktori alumni, info bursa kerja, dan jalin
          kolaborasi bisnis dengan sesama lulusan Daarul Mughni.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/daftar"
            className="inline-flex items-center gap-2 bg-[#F0A500] hover:bg-[#D4920A] text-[#0A2415] font-bold px-8 py-3.5 rounded transition-colors"
          >
            Daftar Akun Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/masuk"
            className="inline-flex items-center border border-white/25 hover:border-white/50 text-white font-medium px-8 py-3.5 rounded transition-colors"
          >
            Masuk
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
