import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const didNavigate = useRef(false)

  useEffect(() => {
    async function handleSession(session) {
      if (didNavigate.current) return
      didNavigate.current = true

      // Check if profile registration is complete (no_hp is the key indicator)
      const { data: prof } = await supabase
        .from('profiles')
        .select('no_hp')
        .eq('id', session.user.id)
        .maybeSingle()

      navigate(!prof?.no_hp ? '/daftar' : '/pilih-dashboard', { replace: true })
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) handleSession(session)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handleSession(session)
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
