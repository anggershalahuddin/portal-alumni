import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import { ADMIN_MENUS } from '@/data/adminMenus'

function deriveActive(pathname) {
  const match = ADMIN_MENUS.find(m => m.href === pathname)
  return match?.id ?? ''
}

function ContentLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="w-7 h-7 animate-spin text-[#1A5C38]" />
    </div>
  )
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const active = deriveActive(pathname)

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active={active} />
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={<ContentLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
