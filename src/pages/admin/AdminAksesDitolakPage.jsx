import { ShieldOff, ArrowLeft, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import { useAuth } from '../../context/AuthContext'
import { ADMIN_MENUS } from '../../data/adminMenus'

export default function AdminAksesDitolakPage({ requiredPerm }) {
  const { user } = useAuth()

  const menu = ADMIN_MENUS.find(m => m.id === requiredPerm)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar active="" />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: '#FEF2F2' }}
            >
              <ShieldOff className="w-10 h-10" style={{ color: '#DC2626' }} />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
            <p className="text-gray-500 text-sm mb-6">
              Anda tidak memiliki izin untuk mengakses halaman ini.
              {menu && (
                <> Halaman <span className="font-semibold text-gray-700">"{menu.labelPerm}"</span> hanya tersedia untuk role tertentu.</>
              )}
            </p>

            {/* Info box */}
            <div
              className="rounded-xl p-4 mb-8 text-left border"
              style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FEF3C7' }}
                >
                  <Lock className="w-4 h-4" style={{ color: '#D97706' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Role Anda: {user?.role}</p>
                  {menu && (
                    <p className="text-xs text-gray-600">
                      Diperlukan: <span className="font-medium">{menu.defaultRoles.join(', ')}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Hubungi Super Admin jika Anda merasa ini adalah kesalahan.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: '#1A5C38' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
