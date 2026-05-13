import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminAksesDitolakPage from '../../pages/admin/AdminAksesDitolakPage'

/**
 * Guards an admin route by role & permission.
 * - Not logged in as admin → redirect to /masuk
 * - Logged in but missing permission → show 403 page (keeps sidebar)
 */
export default function ProtectedAdminRoute({ children, requiredPerm }) {
  const { user, isAdminUser, hasPermission } = useAuth()

  if (!user || !isAdminUser) {
    return <Navigate to="/masuk" replace />
  }

  if (requiredPerm && !hasPermission(requiredPerm)) {
    return <AdminAksesDitolakPage requiredPerm={requiredPerm} />
  }

  return children
}
