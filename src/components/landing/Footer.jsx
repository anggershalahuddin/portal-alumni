import { Mail, Phone, MapPin } from 'lucide-react'
import logoUrl from '@/assets/Logo DM Fix.jpg'

const portalLinks = [
  { label: 'Direktori Alumni', href: '/direktori' },
  { label: 'Berita Pondok', href: '/berita' },
  { label: 'Acara Mendatang', href: '/agenda' },
  { label: 'Bursa Kerja', href: '/karir' },
]

const bantuanLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Kebijakan Privasi', href: '/privasi' },
  { label: 'Syarat & Ketentuan', href: '/syarat' },
  { label: 'Hubungi Admin', href: '/kontak' },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/daarulmughni.official',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/daarulmughni.official/',
    path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z',
  },
  {
    label: 'X / Twitter',
    href: '#',
    path: 'M4 4l16 16M4 20L20 4',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@DaarulMughniOfficial',
    path: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98l5.75 3.02-5.75 3.02z',
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#060F09' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={logoUrl} alt="Logo Daarul Mughni" className="w-12 h-12 object-contain rounded flex-shrink-0" />
              <div>
                <p className="text-[10px] text-white/35 uppercase tracking-widest leading-none mb-0.5">
                  Alumni Portal
                </p>
                <p className="text-xs font-bold text-white leading-tight">
                  Pondok Pesantren Modern Perpaduan
                </p>
                <p className="text-xs font-bold leading-tight" style={{ color: '#F0A500' }}>
                  Daarul Mughni Al Maaliki
                </p>
              </div>
            </div>
            <p className="text-white/40 text-xs leading-relaxed mb-6">
              Wadah silaturahmi dan kolaborasi profesional seluruh lulusan Pondok
              Pesantren Daarul Mughni sejak 2006.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map(({ path, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded border border-white/10 hover:border-[#F0A500]/40 hover:bg-[#F0A500]/10 flex items-center justify-center text-white/40 hover:text-[#F0A500] transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Portal links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wide">
              Portal Alumni
            </h4>
            <ul className="space-y-3">
              {portalLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-white/40 hover:text-white text-xs transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wide">
              Bantuan
            </h4>
            <ul className="space-y-3">
              {bantuanLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-white/40 hover:text-white text-xs transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wide">
              Kontak Pondok
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#F0A500]" />
                <span className="text-white/40 text-xs leading-relaxed">
                  Jl. Klapanunggal Kp. Cibeber II Ds. Cikahuripan Kec. Klapanunggal Kabupaten Bogor Jawa Barat 16710
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-[#F0A500]" />
                <span className="text-white/40 text-xs">ppdaaarulmughni@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-[#F0A500]" />
                <span className="text-white/40 text-xs">(021) 2921 9666</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © 2026 Alumni Portal – Pondok Pesantren Daarul Mughni. All rights reserved.
          </p>
          <p className="text-white/25 text-xs">
            Powered by Daarul Mughni · 8.0
          </p>
        </div>
      </div>
    </footer>
  )
}
