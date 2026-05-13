import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_PERMISSIONS } from '../data/adminMenus'

const ADMIN_ROLES = ['super_admin', 'admin', 'editor']

// Peta role DB (snake_case) ke label UI (Title Case)
export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  editor:      'Editor',
  alumni:      'Alumni',
  user:        'Pengguna',
}

// Peta role DB ke permission keys di DEFAULT_PERMISSIONS
const ROLE_PERM_KEY = {
  super_admin: 'Super Admin',
  admin:       'Admin',
  editor:      'Editor',
  alumni:      'Alumni',
  user:        'Alumni', // belum terverifikasi, perlakukan seperti alumni (no perm)
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [supaUser, setSupaUser]     = useState(null) // Supabase auth user
  const [profile, setProfile]       = useState(null) // public.profiles row
  const [loading, setLoading]       = useState(true)

  // Ambil profile dari public.profiles berdasarkan auth user id
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) { console.error('fetchProfile:', error); return null }
    return data
  }

  useEffect(() => {
    // Cek sesi aktif saat app pertama kali load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSupaUser(session?.user ?? null)
      if (session?.user) {
        const p = await fetchProfile(session.user.id)
        setProfile(p)
      }
      setLoading(false)
    })

    // Subscribe perubahan auth state (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSupaUser(session?.user ?? null)
        if (session?.user) {
          const p = await fetchProfile(session.user.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ── Auth actions ────────────────────────────────────────────────────

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  const signUp = useCallback(async ({ email, password, namaLengkap }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nama_lengkap: namaLengkap } },
    })
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    return { data, error }
  }, [])

  // ── Derived state ────────────────────────────────────────────────────

  const role        = profile?.role ?? null               // 'super_admin' | 'admin' | ...
  const roleLabel   = ROLE_LABELS[role] ?? '-'
  const isAdminUser = role && ADMIN_ROLES.includes(role)

  // Nama & initials dari profile atau email fallback
  const displayName = profile?.nama_lengkap ?? supaUser?.email ?? 'Pengguna'
  const initials    = displayName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

  const user = supaUser
    ? { id: supaUser.id, email: supaUser.email, name: displayName, initials, role, roleLabel }
    : null

  // Permissions berdasarkan role
  const permKey    = ROLE_PERM_KEY[role] ?? 'Alumni'
  const permissions = DEFAULT_PERMISSIONS[permKey] ?? []

  const hasPermission = useCallback(
    (permId) => permissions.includes(permId),
    [permissions],
  )

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      supaUser,
      loading,
      isAdminUser,
      permissions,
      hasPermission,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      // Expose refreshProfile agar komponen bisa reload setelah update
      refreshProfile: () => supaUser && fetchProfile(supaUser.id).then(setProfile),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
