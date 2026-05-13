import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Halaman ini menangani redirect setelah OAuth (Google login)
export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/masuk')
        return
      }

      // Ambil profile untuk cek role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      const adminRoles = ['super_admin', 'admin', 'editor']
      if (profile && adminRoles.includes(profile.role)) {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    })
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
