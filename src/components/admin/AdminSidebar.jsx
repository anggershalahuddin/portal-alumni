import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import { NAV_GROUPS, BOTTOM_NAV } from '@/data/adminMenus'
import { useAuth, ROLE_LABELS } from '@/context/AuthContext'

const ROLE_COLORS = {
  super_admin: { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E' },
  admin:       { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  editor:      { bg: '#FAF5FF', color: '#7C3AED', dot: '#A855F7' },
}

export default function AdminSidebar({ active }) {
  const { user, permissions, signOut } = useAuth()
  const navigate = useNavigate()

  const roleColor = ROLE_COLORS[user?.role] ?? ROLE_COLORS['admin']
  const roleLabel = ROLE_LABELS[user?.role] ?? user?.role ?? '-'

  const visibleGroups = NAV_GROUPS
    .map(group => ({
      ...group,
      items: group.items.filter(item => permissions.includes(item.key)),
    }))
    .filter(group => group.items.length > 0)

  const visibleBottom = BOTTOM_NAV.filter(item => permissions.includes(item.key))

  async function handleLogout() {
    await signOut()
    window.location.href = '/masuk'
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex-shrink-0 self-stretch">
      <div className="sticky top-0 h-screen flex flex-col overflow-y-auto">
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

      {/* Role badge */}
      <div className="px-3 pt-3 pb-1">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold"
          style={{ borderColor: roleColor.dot, color: roleColor.color, backgroundColor: roleColor.bg }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: roleColor.dot }} />
          <span className="truncate">{roleLabel}</span>
          {user?.name && (
            <span className="ml-auto text-[10px] font-normal truncate max-w-[80px]" title={user.name}>
              {user.name.split(' ')[0]}
            </span>
          )}
        </div>
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
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Keluar
        </button>
      </div>
    </div>
    </aside>
  )
}
