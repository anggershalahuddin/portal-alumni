import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import pimpinanImg from '@/assets/pimpinan.jpg'
import { supabase } from '@/lib/supabase'
import { fadeLeft, fadeRight, fadeUp, viewport } from '@/lib/animations'

function mapPimpinan(row) {
  return {
    id: row.id,
    nama: [row.nama, row.gelar].filter(Boolean).join(', '),
    jabatan: row.jabatan ?? '',
    pesan: row.pesan ?? '',
    foto: row.foto_url ?? null,
    aktif: row.is_aktif,
    judul: 'Menjaga Warisan Luhur di Era',
    judulAksen: 'Disrupsi Digital',
    deskripsi: null,
  }
}

export default function Pimpinan() {
  const [p, setP] = useState(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('pimpinan')
      .select('id, nama, gelar, jabatan, pesan, foto_url, is_aktif, urutan')
      .eq('is_aktif', true)
      .order('urutan', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (!cancelled && data?.[0]) setP(mapPimpinan(data[0]))
      })
    return () => { cancelled = true }
  }, [])

  if (!p) return null
  const fotoSrc = p.foto || pimpinanImg

  return (
    <section className="bg-[#F8FAF9] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left: Photo card */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={fadeLeft}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative max-w-sm mx-auto lg:mx-0 w-full"
          >
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl bg-[#F0A500]/20 border border-[#F0A500]/30" />

            <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '4/5' }}>
              <img
                src={fotoSrc}
                alt={p.nama}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061410]/90 via-[#0A2415]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-white font-bold text-base">{p.nama}</div>
                <div className="text-[#F0A500] text-xs font-semibold mt-0.5 uppercase tracking-wide">
                  {p.jabatan}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={fadeRight}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-0.5 bg-[#F0A500]" />
              <span className="text-[#F0A500] text-xs font-bold uppercase tracking-widest">
                Pesan Pimpinan
              </span>
            </motion.div>

            {/* Judul 2 warna: judulAksen otomatis hijau */}
            <h2 className="text-4xl font-bold text-[#0A2415] leading-tight mb-7 tracking-tight">
              {p.judul}{p.judulAksen ? <>{' '}<span className="text-[#1A5C38]">{p.judulAksen}</span></> : null}
            </h2>

            {/* Quote block */}
            <div className="relative pl-5 mb-7">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#F0A500] rounded-full" />
              <svg className="w-7 h-7 text-[#F0A500] mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-600 text-base leading-relaxed italic">{p.pesan}</p>
            </div>

            {p.deskripsi && (
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{p.deskripsi}</p>
            )}

            <a
              href="/pesantren"
              className="inline-flex items-center gap-1.5 text-[#1A5C38] hover:text-[#0A2415] font-bold text-sm transition-colors"
            >
              Baca Profil Lengkap Pesantren
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
