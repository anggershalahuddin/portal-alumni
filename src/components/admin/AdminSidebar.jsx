import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, ChevronDown } from 'lucide-react'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import { NAV_GROUPS, BOTTOM_NAV } from '@/data/adminMenus'
import { useAuth, DEMO_USERS } from '@/context/AuthContext'

const ROLE_COLORS = {
  'Super Admin': { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E' },
  'Admin':       { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  'Editor':      { bg: '#FAF5FF', color: '#7C3AED', dot: '#A855F7' },
}

export default function AdminSidebar({ active }) {
  const { user, permissions, login, logout } = useAuth()
  const [showRoleMenu, setShowRoleMenu] = useState(false)

  const roleColor = ROLE_COLORS[user?.role] ?? ROLE_COLORS['Admin']

  // Filter nav groups — only show items the current user has permission for
  const visibleGroups = NAV_GROUPS
    .map(group => ({
      ...group,
      items: group.items.filter(item => permissions.includes(item.key)),
    }))
    .filter(group => group.items.length > 0)

  // Filter bottom nav items by permissions
  const visibleBottom = BOTTOM_NAV.filter(item => permissions.includes(item.key))

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

      {/* Demo role switcher */}
      <div className="px-3 pt-3 pb-1 relative">
        <button
          onClick={() => setShowRoleMenu(v => !v)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors hover:bg-gray-50"
          style={{ borderColor: roleColor.dot, color: roleColor.color, backgroundColor: roleColor.bg }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: roleColor.dot }}
            />
            <span>{user?.role ?? 'Tidak Login'}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
        </button>

        {showRoleMenu && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 pt-2.5 pb-1">
              Demo — Ganti Role
            </p>
            {Object.keys(DEMO_USERS).filter(r => r !== 'Alumni').map(role => {
              const rc = ROLE_COLORS[role] ?? ROLE_COLORS['Admin']
              return (
                <button
                  key={role}
                  onClick={() => { login(role); setShowRoleMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors hover:bg-gray-50"
                  style={user?.role === role ? { color: rc.color, fontWeight: 700 } : { color: '#374151' }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: rc.dot }} />
                  {role}
                  {user?.role === role && <span className="ml-auto text-[9px] font-bold" style={{ color: rc.color }}>aktif</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {visibleGroups.map(group => (
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
        {visibleBottom.map(({ key, label, href, icon: Icon }) => (
          <Link
            key={key}
            to={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              active === key ? 'bg-[#1A5C38] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
