import { useState, useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedAdminRoute({ children, requiredPerm }) {
  const { user, profile, isAdminUser, loading, profileReady, refreshProfile } = useAuth()
  const [fetchFailed, setFetchFailed] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const retryRef = useRef(null)

  const userId = user?.id ?? null

  useEffect(() => {
    // Profile sudah ada — bersihkan semua
    if (profile) {
      clearTimeout(retryRef.current)
      setFetchFailed(false)
      setRetryCount(0)
      return
    }

    // Belum siap atau tidak ada user — tunggu
    if (!profileReady || !userId) return

    // profileReady=true, user ada, tapi profile null — retry aktif setiap 2 detik, maks 5x
    const MAX_RETRY = 5
    let attempt = 0

    function doRetry() {
      if (attempt >= MAX_RETRY) {
        setFetchFailed(true)
        return
      }
      attempt++
      setRetryCount(attempt)
      refreshProfile().then(() => {
        // Kalau masih null setelah refresh, jadwalkan retry berikutnya
        retryRef.current = setTimeout(doRetry, 2000)
      })
    }

    retryRef.current = setTimeout(doRetry, 1000)

    return () => clearTimeout(retryRef.current)
  }, [profileReady, userId, profile, refreshProfile])

  // Spinner saat loading atau sedang retry
  if (loading || !profileReady || (userId && !profile && !fetchFailed)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
          {retryCount > 0 && (
            <p className="text-xs text-gray-400 mt-3">Memuat profil... ({retryCount}/5)</p>
          )}
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/masuk" replace />

  // Gagal setelah 5x retry
  if (fetchFailed && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <p className="text-gray-700 font-semibold mb-1">Gagal memuat profil</p>
          <p className="text-sm text-gray-400 mb-6">Periksa koneksi internet lalu coba lagi.</p>
          <button
            onClick={() => { setFetchFailed(false); setRetryCount(0) }}
            className="bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  if (!isAdminUser) return <Navigate to="/dashboard" replace />

  return children
}
