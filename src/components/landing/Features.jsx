import { Users2, Trophy, BookOpen, Briefcase } from 'lucide-react'

const features = [
  {
    icon: Users2,
    title: 'Networking',
    description:
      'Temukan ribuan keluarga dan jalin kolaborasi profesional antar sesama alumni.',
  },
  {
    icon: Trophy,
    title: 'Achievement',
    description:
      'Bagikan dan lihat prestasi alumni di kancah nasional & global.',
  },
  {
    icon: BookOpen,
    title: 'Knowledge',
    description:
      'Akses materi kajian alumni dan webinar pengembangan diri.',
  },
  {
    icon: Briefcase,
    title: 'Career',
    description:
      'Info lowongan kerja khusus untuk pekerja alumni pesantren.',
  },
]

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E8F5EE] group-hover:bg-[#1A5C38] mb-5 transition-colors">
                <Icon className="w-6 h-6 text-[#1A5C38] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[#0A2415] font-bold text-base mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
