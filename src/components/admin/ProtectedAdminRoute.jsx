import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminAksesDitolakPage from '../../pages/admin/AdminAksesDitolakPage'

/**
 * Guards an admin route by role & permission.
 * - Loading → tampilkan spinner
 * - Not logged in as admin → redirect to /masuk
 * - Logged in but missing permission → show 403 page (keeps sidebar)
 */
export default function ProtectedAdminRoute({ children, requiredPerm }) {
  const { user, isAdminUser, hasPermission, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdminUser) {
    return <Navigate to="/masuk" replace />
  }

  if (requiredPerm && !hasPermission(requiredPerm)) {
    return <AdminAksesDitolakPage requiredPerm={requiredPerm} />
  }

  return children
}
