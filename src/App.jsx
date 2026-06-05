import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { SiteConfigProvider } from './context/SiteConfigContext'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import IdleWarningModal from './components/IdleWarningModal'
import Toast from './components/Toast'

// ── Public pages ──────────────────────────────────────────────────────────────
const LandingPage           = lazy(() => import('./pages/LandingPage'))
const NewsListingPage       = lazy(() => import('./pages/NewsListingPage'))
const NewsDetailPage        = lazy(() => import('./pages/NewsDetailPage'))
const AlumniDirectoryPage   = lazy(() => import('./pages/AlumniDirectoryPage'))
const AlumniProfilePage     = lazy(() => import('./pages/AlumniProfilePage'))
const AgendaPage            = lazy(() => import('./pages/AgendaPage'))
const OrganisasiPage        = lazy(() => import('./pages/OrganisasiPage'))
const LoginPage             = lazy(() => import('./pages/LoginPage'))
const PesantrenPage         = lazy(() => import('./pages/PesantrenPage'))
const GaleriPage            = lazy(() => import('./pages/GaleriPage'))
const AlumniDashboardPage   = lazy(() => import('./pages/AlumniDashboardPage'))
const DaftarPage            = lazy(() => import('./pages/DaftarPage'))
const KarirPage             = lazy(() => import('./pages/KarirPage'))
const FaqPage               = lazy(() => import('./pages/FaqPage'))
const KontakPage            = lazy(() => import('./pages/KontakPage'))
const PrivasiPage           = lazy(() => import('./pages/PrivasiPage'))
const SyaratPage            = lazy(() => import('./pages/SyaratPage'))
const VerifikasiStatusPage  = lazy(() => import('./pages/VerifikasiStatusPage'))
const AkunDinonaktifkanPage = lazy(() => import('./pages/AkunDinonaktifkanPage'))
const AkunDihapusPage       = lazy(() => import('./pages/AkunDihapusPage'))
const AuthCallbackPage      = lazy(() => import('./pages/AuthCallbackPage'))
const PilihDashboardPage    = lazy(() => import('./pages/PilihDashboardPage'))
const ResetPasswordPage     = lazy(() => import('./pages/ResetPasswordPage'))

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminDashboardPage    = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminVerifikasiPage   = lazy(() => import('./pages/admin/AdminVerifikasiPage'))
const AdminManajemenUserPage= lazy(() => import('./pages/admin/AdminManajemenUserPage'))
const AdminBeritaPage       = lazy(() => import('./pages/admin/AdminBeritaPage'))
const AdminAgendaPage       = lazy(() => import('./pages/admin/AdminAgendaPage'))
const AdminAngkatanPage     = lazy(() => import('./pages/admin/AdminAngkatanPage'))
const AdminDataAlumniPage   = lazy(() => import('./pages/admin/AdminDataAlumniPage'))
const AdminGaleriPage       = lazy(() => import('./pages/admin/AdminGaleriPage'))
const AdminOrganisasiPage   = lazy(() => import('./pages/admin/AdminOrganisasiPage'))
const AdminKarirPage        = lazy(() => import('./pages/admin/AdminKarirPage'))
const AdminKomentarPage     = lazy(() => import('./pages/admin/AdminKomentarPage'))
const AdminPengaturanPage   = lazy(() => import('./pages/admin/AdminPengaturanPage'))
const AdminNotifikasiPage   = lazy(() => import('./pages/admin/AdminNotifikasiPage'))
const AdminLogPage          = lazy(() => import('./pages/admin/AdminLogPage'))
const AdminLandingPage      = lazy(() => import('./pages/admin/AdminLandingPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
      <Loader2 className="w-8 h-8 animate-spin text-[#1A5C38]" />
    </div>
  )
}

function App() {
  return (
    <SiteConfigProvider>
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <IdleWarningModal />
        <Toast />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/berita" element={<NewsListingPage />} />
            <Route path="/berita/:slug" element={<NewsDetailPage />} />
            <Route path="/direktori" element={<AlumniDirectoryPage />} />
            <Route path="/direktori/:id" element={<AlumniProfilePage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/organisasi" element={<OrganisasiPage />} />
            <Route path="/masuk" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/pesantren" element={<PesantrenPage />} />
            <Route path="/galeri" element={<GaleriPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><AlumniDashboardPage /></ProtectedRoute>} />
            <Route path="/daftar" element={<DaftarPage />} />
            <Route path="/karir" element={<KarirPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/kontak" element={<KontakPage />} />
            <Route path="/privasi" element={<PrivasiPage />} />
            <Route path="/syarat" element={<SyaratPage />} />
            <Route path="/verifikasi-status" element={<VerifikasiStatusPage />} />
            <Route path="/akun-dinonaktifkan" element={<AkunDinonaktifkanPage />} />
            <Route path="/akun-dihapus" element={<AkunDihapusPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/pilih-dashboard" element={<ProtectedRoute><PilihDashboardPage /></ProtectedRoute>} />

            {/* ── Admin routes — sidebar/header persistent via AdminLayout ── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard"   element={<ProtectedAdminRoute requiredPerm="dashboard"><AdminDashboardPage /></ProtectedAdminRoute>} />
              <Route path="verifikasi"  element={<ProtectedAdminRoute requiredPerm="verifikasi"><AdminVerifikasiPage /></ProtectedAdminRoute>} />
              <Route path="users"       element={<ProtectedAdminRoute requiredPerm="users"><AdminManajemenUserPage /></ProtectedAdminRoute>} />
              <Route path="alumni-data" element={<ProtectedAdminRoute requiredPerm="alumni-data"><AdminDataAlumniPage /></ProtectedAdminRoute>} />
              <Route path="angkatan"    element={<ProtectedAdminRoute requiredPerm="angkatan"><AdminAngkatanPage /></ProtectedAdminRoute>} />
              <Route path="organisasi"  element={<ProtectedAdminRoute requiredPerm="organisasi"><AdminOrganisasiPage /></ProtectedAdminRoute>} />
              <Route path="berita"      element={<ProtectedAdminRoute requiredPerm="berita"><AdminBeritaPage /></ProtectedAdminRoute>} />
              <Route path="agenda"      element={<ProtectedAdminRoute requiredPerm="agenda"><AdminAgendaPage /></ProtectedAdminRoute>} />
              <Route path="galeri"      element={<ProtectedAdminRoute requiredPerm="galeri"><AdminGaleriPage /></ProtectedAdminRoute>} />
              <Route path="landing"     element={<ProtectedAdminRoute requiredPerm="landing"><AdminLandingPage /></ProtectedAdminRoute>} />
              <Route path="karir"       element={<ProtectedAdminRoute requiredPerm="karir"><AdminKarirPage /></ProtectedAdminRoute>} />
              <Route path="komentar"    element={<ProtectedAdminRoute requiredPerm="komentar"><AdminKomentarPage /></ProtectedAdminRoute>} />
              <Route path="notifikasi"  element={<ProtectedAdminRoute requiredPerm="notifikasi"><AdminNotifikasiPage /></ProtectedAdminRoute>} />
              <Route path="log"         element={<ProtectedAdminRoute requiredPerm="log"><AdminLogPage /></ProtectedAdminRoute>} />
              <Route path="pengaturan"  element={<ProtectedAdminRoute requiredPerm="pengaturan"><AdminPengaturanPage /></ProtectedAdminRoute>} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </SiteConfigProvider>
  )
}

export default App
