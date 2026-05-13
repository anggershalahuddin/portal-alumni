import { createContext, useContext, useState, useCallback } from 'react'
import { DEFAULT_PERMISSIONS } from '../data/adminMenus'

const ADMIN_ROLES = ['Super Admin', 'Admin', 'Editor']

export const DEMO_USERS = {
  'Super Admin': {
    name: 'Ahmad Mufid',
    role: 'Super Admin',
    email: 'superadmin@dm.ac.id',
    initials: 'AM',
  },
  'Admin': {
    name: 'Fatimah Azzahra',
    role: 'Admin',
    email: 'admin@dm.ac.id',
    initials: 'FA',
  },
  'Editor': {
    name: 'Rizky Pratama',
    role: 'Editor',
    email: 'editor@dm.ac.id',
    initials: 'RP',
  },
  'Alumni': {
    name: 'Ahmad Zaki',
    role: 'Alumni',
    email: 'alumni@dm.ac.id',
    initials: 'AZ',
  },
}

const LS_KEY = 'portal_dm_user'

function loadUser() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser())

  const login = useCallback((role) => {
    const u = DEMO_USERS[role] ?? DEMO_USERS['Super Admin']
    localStorage.setItem(LS_KEY, JSON.stringify(u))
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(LS_KEY)
    setUser(null)
  }, [])

  const permissions = user ? (DEFAULT_PERMISSIONS[user.role] ?? []) : []

  const hasPermission = useCallback(
    (permId) => permissions.includes(permId),
    [permissions],
  )

  const isAdminUser = user && ADMIN_ROLES.includes(user.role)

  return (
    <AuthContext.Provider value={{ user, login, logout, permissions, hasPermission, isAdminUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
