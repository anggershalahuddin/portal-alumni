import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fadeUp, viewport } from '@/lib/animations'

// Konten statis — edit langsung di sini untuk mengubah/menambah testimoni
const TESTIMONI = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    batch: 'Angkatan 5 (2010)',
    role: 'Software Engineer di Tokopedia',
    quote: 'Nilai-nilai keislaman dan kedisiplinan yang ditanamkan Daarul Mughni menjadi fondasi karir saya. Portal ini memudahkan saya terhubung kembali dengan kawan-kawan lama.',
    initials: 'AF',
    color: '#1A5C38',
  },
  {
    id: 2,
    name: 'Siti Maryam',
    batch: 'Angkatan 8 (2013)',
    role: 'Dokter Umum RS Cipto Mangunkusumo',
    quote: 'Pondok mengajarkan saya untuk tidak pernah berhenti belajar. Senang sekali ada wadah resmi seperti ini untuk alumni Daarul Mughni.',
    initials: 'SM',
    color: '#0E7490',
  },
  {
    id: 3,
    name: 'Rizky Pratama',
    batch: 'Angkatan 12 (2017)',
    role: 'Pengusaha & Founder Startup EdTech',
    quote: 'Portal alumni ini bukan hanya tempat nostalgia, tapi juga jembatan peluang. Saya sudah merekrut 3 alumni lewat fitur karir di sini!',
    initials: 'RP',
    color: '#7C3AED',
  },
  {
    id: 4,
    name: 'Hendra Kusuma',
    batch: 'Angkatan 3 (2008)',
    role: 'Pegawai Kementerian Agama RI',
    quote: 'Pengalaman belajar di Daarul Mughni membentuk karakter saya sebagai abdi negara yang amanah. Bangga bisa berkontribusi lewat jalur pemerintahan.',
    initials: 'HK',
    color: '#0369A1',
  },
  {
    id: 5,
    name: 'Nurul Hidayah',
    batch: 'Angkatan 10 (2015)',
    role: 'Guru & Kepala Sekolah MI Al-Falah',
    quote: 'Semangat mendidik yang saya miliki lahir dari pondok ini. Kini saya bahagia bisa meneruskan estafet itu kepada generasi berikutnya.',
    initials: 'NH',
    color: '#DB2777',
  },
  {
    id: 6,
    name: 'Fajar Ramadhan',
    batch: 'Angkatan 14 (2019)',
    role: 'Mahasiswa S2 Universitas Indonesia',
    quote: 'Disiplin dan akhlak yang tertanam di pondok jadi bekal saya bersaing di lingkungan akademik nasional. Daarul Mughni bukan sekadar sekolah, tapi rumah kedua.',
    initials: 'FR',
    color: '#D97706',
  },
  {
    id: 7,
    name: 'Aisyah Rahmawati',
    batch: 'Angkatan 7 (2012)',
    role: 'Konsultan Keuangan Syariah',
    quote: 'Pemahaman ekonomi Islam yang kuat saya dapatkan sejak di pondok. Kini ilmu itu menjadi profesi dan ladang amal sekaligus. Terima kasih Daarul Mughni!',
    initials: 'AR',
    color: '#065F46',
  },
  {
    id: 8,
    name: 'Muhamad Ilham',
    batch: 'Angkatan 16 (2021)',
    role: 'Content Creator & Da\'i Muda',
    quote: 'Pondok mengajarkan saya keberanian berbicara di depan umum dan kedalaman ilmu agama. Dua hal itu kini jadi modal saya berdakwah di era digital.',
    initials: 'MI',
    color: '#4F46E5',
  },
]

export default function Testimonials() {
  const scrollRef = useRef(null)

  function scroll(dir) {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#0A2415] mb-3 tracking-tight">
              Apa Kata Mereka?
            </h2>
            <p className="text-gray-500 text-sm">
              Kisah inspiratif dari para alumni yang telah berkarya di berbagai bidang.
            </p>
          </div>
          {TESTIMONI.length > 1 && (
            <div className="flex gap-2 flex-shrink-0 ml-4">
              <button
                onClick={() => scroll(-1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll(1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TESTIMONI.map(({ id, name, batch, role, initials, color, foto, quote }) => (
            <div
              key={id}
              className="min-w-[280px] max-w-[340px] flex-shrink-0 snap-start bg-[#F8FAF9] border border-gray-100 rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
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
                <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                  {foto
                    ? <img src={foto} alt={name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    : <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold" style={{ background: color }}>{initials}</div>
                  }
                </div>
                <div>
                  <div className="text-[#0A2415] font-bold text-sm">{name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{batch}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
