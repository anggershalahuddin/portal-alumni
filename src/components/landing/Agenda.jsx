import { MapPin, Clock, CalendarDays, ArrowRight } from 'lucide-react'

const events = [
  {
    day: '20',
    month: 'DES',
    title: 'Reuni Akbar Dasawarsa Daarul Mughni',
    location: 'Auditorium Utama Pondok',
    time: '09:00 – 17:00',
  },
  {
    day: '15',
    month: 'JAN',
    title: 'Seminar Karier: Alumni di Bidang Teknologi',
    location: 'Zoom Online Meeting',
    time: '19:00 – 21:00',
  },
  {
    day: '05',
    month: 'MAR',
    title: "Haul Guru & Doa Bersama Alumni",
    location: "Masjid Jami' Sa'ad Mughni",
    time: '19:30 – 21:30',
  },
  {
    day: '22',
    month: 'MAR',
    title: 'Mukhayyam Al-Quran Alumni',
    location: 'Villa Hejo Puncak',
    time: '3 Hari 2 Malam',
  },
]

export default function Agenda() {
  return (
    <section className="bg-[#FFFDF0] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-14 items-start">

          {/* Left: intro */}
          <div className="lg:sticky lg:top-24">
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
            <a
              href="/agenda"
              className="inline-flex items-center gap-2 bg-[#0A2415] hover:bg-[#1A5C38] text-white text-sm font-bold px-6 py-3 rounded transition-colors"
            >
              Lihat Kalender Lengkap
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Event list */}
          <div className="space-y-3">
            {events.map(({ day, month, title, location, time }) => (
              <div
                key={title}
                className="flex gap-5 bg-white rounded-xl p-5 border border-amber-100 hover:border-[#F0A500]/50 hover:shadow-md transition-all group cursor-pointer"
              >
                {/* Date box */}
                <div className="flex-shrink-0 w-14 text-center">
                  <div className="text-2xl font-bold text-[#0A2415] leading-none">{day}</div>
                  <div className="text-[11px] font-bold text-[#F0A500] uppercase tracking-widest mt-0.5">
                    {month}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-amber-100 self-stretch flex-shrink-0" />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#0A2415] text-sm leading-snug mb-2 group-hover:text-[#1A5C38] transition-colors">
                    {title}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      {time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
