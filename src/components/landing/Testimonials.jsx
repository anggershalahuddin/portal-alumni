import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '@/lib/animations'

const testimonials = [
  {
    name: 'Dr. Ahmad Fauzi',
    batch: 'Angkatan 2001',
    role: 'Dokter & Peneliti',
    initials: 'AF',
    color: '#1A5C38',
    quote:
      'Wadah silaturahmi ini bukan sekadar tempat berjumpa alumni, tapi juga menjadi tempat saya membangun karier yang bermakna. Kepribadian yang diajarkan pondok sungguh memberi warna luar biasa.',
  },
  {
    name: 'Siti Maryam, S.T.',
    batch: 'Angkatan 2010',
    role: 'Insinyur & Peneliti',
    initials: 'SM',
    color: '#2A7A4F',
    quote:
      'Jejaring alumni di sini sangat suportif. Berkat portal ini, saya bisa berkolaborasi dengan sesama alumni untuk proyek lingkungan dan mendapat apresiasi tinggi dari berbagai instansi.',
  },
  {
    name: 'Rizky Ramadhan',
    batch: 'Angkatan 2012',
    role: 'Entrepreneur',
    initials: 'RR',
    color: '#0A2415',
    quote:
      'Pesan pimpinan tentang Cahaya Masyarakat selalu terngiang. Sekarang saya fokus membangun bisnis yang memberdayakan masyarakat di sekitar pesantren.',
  },
]

export default function Testimonials() {
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
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold text-[#0A2415] mb-3 tracking-tight">
            Apa Kata Mereka?
          </h2>
          <p className="text-gray-500 text-sm">
            Kisah inspiratif dari para alumni yang telah berkarya di berbagai bidang.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map(({ name, batch, role, initials, color, quote }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-[#F8FAF9] border border-gray-100 rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              <svg
                className="w-8 h-8 mb-5 opacity-70"
                style={{ color: '#F0A500' }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <p className="text-gray-600 text-sm leading-relaxed italic flex-1 mb-6">
                "{quote}"
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: color }}
                >
                  {initials}
                </div>
                <div>
                  <div className="text-[#0A2415] font-bold text-sm">{name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    {batch} · {role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
