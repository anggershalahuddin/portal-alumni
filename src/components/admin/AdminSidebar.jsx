import { Link } from 'react-router-dom'
import { Shield, Users, LayoutDashboard, Newspaper, CalendarDays, Settings, LogOut, GraduationCap, Database } from 'lucide-react'
import logoUrl from '@/assets/Logo DM Fix.jpg'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard', icon: LayoutDashboard },
  { label: 'Verifikasi Alumni', href: '/admin/verifikasi', key: 'verifikasi', icon: Shield },
  { label: 'Manajemen User', href: '/admin/users', key: 'users', icon: Users },
  { label: 'Data Alumni', href: '/admin/alumni-data', key: 'alumni-data', icon: Database },
  { label: 'Kelola Berita', href: '/admin/berita', key: 'berita', icon: Newspaper },
  { label: 'Kelola Agenda', href: '/admin/agenda', key: 'agenda', icon: CalendarDays },
  { label: 'Kelola Angkatan', href: '/admin/angkatan', key: 'angkatan', icon: GraduationCap },
]

export default function AdminSidebar({ active }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col min-h-screen flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src={logoUrl} alt="Logo Daarul Mughni" className="w-9 h-9 object-contain rounded flex-shrink-0" />
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-none mb-0.5">Admin Panel</p>
            <p className="text-xs font-bold text-gray-800 leading-tight">Daarul Mughni</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Menu Administrasi</p>
        <nav className="space-y-1">
          {navItems.map(({ label, href, key, icon: Icon }) => (
            <Link
              key={key}
              to={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors"
              style={
                active === key
                  ? { backgroundColor: '#1A5C38', color: '#fff', fontWeight: 600 }
                  : { color: '#4B5563', fontWeight: 500 }
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Settings className="w-4 h-4 flex-shrink-0" />
          Pengaturan
        </button>
        <Link to="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Keluar
        </Link>
      </div>
    </aside>
  )
}
