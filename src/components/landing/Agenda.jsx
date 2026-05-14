import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, CalendarDays, ArrowRight } from 'lucide-react'
import { fadeLeft, fadeUp, stagger, viewport } from '@/lib/animations'
import { supabase } from '@/lib/supabase'

const BULAN = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES']

function formatWaktu(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function Agenda() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const now = new Date().toISOString()
    supabase
      .from('agenda')
      .select('id, judul, lokasi, tanggal_mulai, tanggal_selesai')
      .eq('is_aktif', true)
      .gte('tanggal_mulai', now)
      .order('tanggal_mulai', { ascending: true })
      .limit(4)
      .then(({ data }) => setEvents(data ?? []))
  }, [])

  if (events.length === 0) return null

  return (
    <section className="bg-[#FFFDF0] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-14 items-start">

          {/* Left: intro */}
          <motion.div
            initial="hidden" whileInView="show" viewport={viewport} variants={fadeLeft}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="lg:sticky lg:top-24"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F0A500] mb-6">
              <CalendarDays className="w-6 h-6 text-[#0A2415]" />
            </div>
            <h2 className="text-3xl font-bold text-[#0A2415] mb-4 tracking-tight">
              Agenda Mendatang
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Jangan lewatkan kesempatan untuk bertemu kembali, reunian pengembangan diri,
              dan acara silaturahmi alumni.
            </p>
            <Link
              to="/agenda"
              className="inline-flex items-center gap-2 bg-[#0A2415] hover:bg-[#1A5C38] text-white text-sm font-bold px-6 py-3 rounded transition-colors"
            >
              Lihat Kalender Lengkap
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right: Event list */}
          <motion.div
            initial="hidden" whileInView="show" viewport={viewport} variants={stagger}
            className="space-y-3"
          >
            {events.map((ev) => {
              const tgl    = new Date(ev.tanggal_mulai)
              const day    = tgl.getDate().toString().padStart(2, '0')
              const month  = BULAN[tgl.getMonth()]
              const start  = formatWaktu(ev.tanggal_mulai)
              const end    = formatWaktu(ev.tanggal_selesai)
              const time   = start && end ? `${start} – ${end}` : start ?? '—'

              return (
                <motion.div
                  key={ev.id}
                  variants={fadeUp}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex gap-5 bg-white rounded-xl p-5 border border-amber-100 hover:border-[#F0A500]/50 hover:shadow-md transition-all group cursor-pointer"
                >
                  {/* Date box */}
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="text-2xl font-bold text-[#0A2415] leading-none">{day}</div>
                    <div className="text-[11px] font-bold text-[#F0A500] uppercase tracking-widest mt-0.5">
                      {month}
                    </div>
                  </div>

                  <div className="w-px bg-amber-100 self-stretch flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0A2415] text-sm leading-snug mb-2 group-hover:text-[#1A5C38] transition-colors">
                      {ev.judul}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {ev.lokasi && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {ev.lokasi}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
