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
  const [supaUser, setSupaUser]         = useState(null)
  const [profile, setProfile]           = useState(null)
  const [loading, setLoading]           = useState(true)
  const [profileReady, setProfileReady] = useState(false)

  // Ambil profile — retry 3x karena kadang row belum terbuat saat OAuth selesai
  async function fetchProfile(userId) {
    for (let i = 0; i < 3; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (data) return data
      if (error) console.warn('[fetchProfile]', error.code, error.message)
      if (i < 2) await new Promise(r => setTimeout(r, 800))
    }
    return null
  }

  useEffect(() => {
    let active = true

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!active) return
        if (session?.user) {
          setSupaUser(session.user)
          const p = await fetchProfile(session.user.id)
          if (active) setProfile(p)
        } else {
          setSupaUser(null)
          setProfile(null)
        }
      } catch (e) {
        console.warn('[AuthContext] init error', e)
      } finally {
        if (active) {
          setLoading(false)
          setProfileReady(true)
        }
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return
        if (!active) return
        try {
          if (session?.user) {
            setSupaUser(session.user)
            const p = await fetchProfile(session.user.id)
            if (active) setProfile(p)
          } else {
            setSupaUser(null)
            setProfile(null)
          }
        } catch (e) {
          console.warn('[AuthContext] auth change error', e)
        } finally {
          if (active) {
            setLoading(false)
            setProfileReady(true)
          }
        }
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  // ── Auth actions ────────────────────────────────────────────────────

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  const signUp = useCallback(async ({
    email, password,
    namaLengkap, noHp, angkatan,
    tempatLahir, tanggalLahir,
    domisili, bidang, alamat,
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nama_lengkap:   namaLengkap,
          no_hp:          noHp,
          angkatan:       angkatan ? String(angkatan) : null,
          tempat_lahir:   tempatLahir,
          tanggal_lahir:  tanggalLahir,   // format 'YYYY-MM-DD'
          domisili,
          bidang,
          alamat_lengkap: alamat,
        },
      },
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
      profileReady,
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
