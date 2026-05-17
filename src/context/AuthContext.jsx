import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
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
  const [idleWarning, setIdleWarning]   = useState(false)

  const IDLE_MS   = 10 * 60 * 1000  // 10 menit
  const WARN_MS   =  9 * 60 * 1000  //  9 menit → tampilkan warning
  const warnRef          = useRef(null)
  const logoutRef        = useRef(null)
  const fetchedUserIdRef = useRef(null) // track user ID yang sudah di-fetch, cegah re-fetch berulang

  const ACTIVITY_KEY = 'dm_last_activity'

  const resetIdleTimers = useCallback(() => {
    clearTimeout(warnRef.current)
    clearTimeout(logoutRef.current)
    setIdleWarning(false)
    // Broadcast aktivitas ke tab lain
    localStorage.setItem(ACTIVITY_KEY, Date.now().toString())
    warnRef.current   = setTimeout(() => setIdleWarning(true), WARN_MS)
    logoutRef.current = setTimeout(() => supabase.auth.signOut(), IDLE_MS)
  }, [])

  // Aktifkan idle timer hanya saat user sedang login
  useEffect(() => {
    if (!supaUser) {
      clearTimeout(warnRef.current)
      clearTimeout(logoutRef.current)
      setIdleWarning(false)
      return
    }

    // Dengarkan aktivitas dari tab lain via localStorage
    function onStorage(e) {
      if (e.key === ACTIVITY_KEY) resetIdleTimers()
    }
    window.addEventListener('storage', onStorage)

    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll']
    events.forEach(ev => window.addEventListener(ev, resetIdleTimers, { passive: true }))
    resetIdleTimers()
    return () => {
      clearTimeout(warnRef.current)
      clearTimeout(logoutRef.current)
      events.forEach(ev => window.removeEventListener(ev, resetIdleTimers))
      window.removeEventListener('storage', onStorage)
    }
  }, [supaUser, resetIdleTimers])

  // Ambil profile — retry 2x, timeout 6 detik per percobaan
  async function fetchProfile(userId) {
    for (let i = 0; i < 2; i++) {
      const { data, error } = await Promise.race([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        new Promise(resolve => setTimeout(() => resolve({ data: null, error: { message: 'timeout' } }), 6000)),
      ])
      if (data) return data
      console.warn(`[fetchProfile] attempt ${i + 1} failed — userId: ${userId}`, error?.message ?? 'no data')
      if (i < 1) await new Promise(r => setTimeout(r, 300))
    }
    return null
  }

  useEffect(() => {
    let active = true

    // Safety fallback: paksa loading selesai setelah 14 detik (cover 2 retry × 6s + jeda)
    const safetyTimer = setTimeout(() => {
      if (active) {
        setLoading(false)
        setProfileReady(true)
      }
    }, 14000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!active) return

        // TOKEN_REFRESHED: token diperbarui otomatis, user & profile tidak berubah — skip
        if (event === 'TOKEN_REFRESHED') return

        try {
          if (session?.user) {
            const uid = session.user.id
            setSupaUser(session.user)
            // Hanya fetch profile kalau user-nya beda atau belum pernah di-fetch
            // Cegah re-fetch pada SIGNED_IN berulang (tab fokus, session refresh, dll)
            if (fetchedUserIdRef.current !== uid) {
              fetchedUserIdRef.current = uid
              if (event === 'SIGNED_IN') await new Promise(r => setTimeout(r, 800))
              const p = await fetchProfile(uid)
              if (active) setProfile(p)
            }
          } else {
            fetchedUserIdRef.current = null
            setSupaUser(null)
            setProfile(null)
          }
        } catch (e) {
          console.warn('[AuthContext] auth change error', e)
        } finally {
          if (active) {
            clearTimeout(safetyTimer)
            setLoading(false)
            setProfileReady(true)
          }
        }
      }
    )

    return () => {
      active = false
      clearTimeout(safetyTimer)
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
      idleWarning,
      extendSession: resetIdleTimers,
      refreshProfile: () => supaUser && fetchProfile(supaUser.id).then(setProfile),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
