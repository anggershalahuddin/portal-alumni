import { Link, useLocation } from 'react-router-dom'
import { Settings, LogOut, Bell, Activity } from 'lucide-react'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import { NAV_GROUPS } from '@/data/adminMenus'

export default function AdminSidebar({ active }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col min-h-screen flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src={logoUrl} alt="Logo Daarul Mughni" className="w-9 h-9 object-contain rounded flex-shrink-0" />
          <div>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-none mb-0.5">Admin Panel</p>
            <p className="text-[11px] font-bold text-gray-800 leading-tight">Daarul Mughni</p>
            <p className="text-[9px] text-gray-400 leading-tight">Al Maaliki</p>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">
              {group.label}
            </p>
            <nav className="space-y-0.5">
              {group.items.map(({ label, href, key, icon: Icon }) => (
                <Link
                  key={key}
                  to={href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors"
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
        ))}
      </div>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        <Link
          to="/admin/notifikasi"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${active === 'notifikasi' ? 'bg-[#1A5C38] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Bell className="w-4 h-4 flex-shrink-0" />
          Notifikasi
        </Link>
        <Link
          to="/admin/log"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${active === 'log' ? 'bg-[#1A5C38] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Activity className="w-4 h-4 flex-shrink-0" />
          Log Aktivitas
        </Link>
        <Link
          to="/admin/pengaturan"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${active === 'pengaturan' ? 'bg-[#1A5C38] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Pengaturan
        </Link>
        <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Keluar
        </Link>
      </div>
    </aside>
  )
}
