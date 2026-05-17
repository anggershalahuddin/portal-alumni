import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const didNavigate = useRef(false)

  useEffect(() => {
    function goToPilih() {
      if (didNavigate.current) return
      didNavigate.current = true
      navigate('/pilih-dashboard', { replace: true })
    }

    // Tangkap SIGNED_IN dari OAuth redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) goToPilih()
    })

    // Fallback: kalau session sudah ada (refresh halaman)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) goToPilih()
      else if (!didNavigate.current) {
        setTimeout(() => {
          if (!didNavigate.current) navigate('/masuk', { replace: true })
        }, 3000)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Memproses login...</p>
      </div>
    </div>
  )
}
