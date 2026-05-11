import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, GraduationCap } from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '#' },
  { label: 'Alumni', href: '#alumni' },
  { label: 'Berita', href: '#berita' },
  { label: 'Agenda', href: '#agenda' },
  { label: 'Karir', href: '#karir' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A2415]/95 backdrop-blur-sm border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F0A500] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-[#0A2415]" />
            </div>
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest leading-none mb-0.5">
                Alumni Portal
              </p>
              <p className="text-sm font-bold text-white leading-none">
                Pondok Pesantren Daarul Mughni
              </p>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/masuk"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors px-3 py-2"
            >
              Masuk
            </a>
            <a
              href="/daftar"
              className="bg-[#F0A500] hover:bg-[#D4920A] text-[#0A2415] text-sm font-bold px-5 py-2.5 rounded transition-colors"
            >
              Daftar Alumni
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden py-4 border-t border-white/10 overflow-hidden"
          >
            <div className="space-y-1 mb-4">
              {navLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="block px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/5 rounded text-sm"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="flex gap-3 px-3">
              <a
                href="/masuk"
                className="flex-1 text-center border border-white/30 text-white text-sm font-medium px-4 py-2.5 rounded"
              >
                Masuk
              </a>
              <a
                href="/daftar"
                className="flex-1 text-center bg-[#F0A500] text-[#0A2415] text-sm font-bold px-4 py-2.5 rounded"
              >
                Daftar Alumni
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
