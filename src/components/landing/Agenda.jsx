import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, CalendarDays, ArrowRight, ExternalLink } from 'lucide-react'
import { fadeLeft, fadeUp, stagger, viewport } from '@/lib/animations'
import { useAuth } from '@/context/AuthContext'
import { ensureAbsoluteUrl } from '@/lib/utils'

const BULAN = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES']

function formatWaktu(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function Agenda({ events = [], loading }) {
  const { supaUser } = useAuth()
  const navigate = useNavigate()

  if (loading || events.length === 0) return null

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
              const time   = !start ? '—' : end ? `${start} s.d ${end} WIB` : `${start} s.d Selesai`

              return (
                <motion.div
                  key={ev.id}
                  variants={fadeUp}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="flex gap-5 bg-white rounded-xl px-5 py-3 border border-amber-100 hover:border-[#F0A500]/50 hover:shadow-md transition-all group cursor-pointer"
                >
                  {/* Date box */}
                  <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center self-center text-center">
                    <div className="text-2xl font-bold text-[#0A2415] leading-none">{day}</div>
                    <div className="text-[11px] font-bold text-[#F0A500] uppercase tracking-widest mt-0.5">
                      {month}
                    </div>
                  </div>

                  <div className="w-px bg-amber-100 self-stretch flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0A2415] text-base leading-snug mb-2 group-hover:text-[#1A5C38] transition-colors">
                      {ev.judul}
                    </h3>
                    <div className="flex flex-wrap gap-4 mb-3">
                      {ev.lokasi && (
                        ev.maps_url
                          ? (
                            <a
                              href={ensureAbsoluteUrl(ev.maps_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-[#1A5C38] hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              {ev.lokasi}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              {ev.lokasi}
                            </span>
                          )
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {time}
                      </span>
                    </div>
                    {ev.link_registrasi && (
                      supaUser ? (
                        <a
                          href={ensureAbsoluteUrl(ev.link_registrasi)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0A2415] hover:bg-[#1A5C38] text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Daftar Sekarang
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); navigate('/masuk') }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0A2415] hover:bg-[#1A5C38] text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Login untuk Daftar
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )
                    )}
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
