import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { SiteConfigProvider } from './context/SiteConfigContext'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'

import LandingPage from './pages/LandingPage'
import NewsListingPage from './pages/NewsListingPage'
import NewsDetailPage from './pages/NewsDetailPage'
import AlumniDirectoryPage from './pages/AlumniDirectoryPage'
import AgendaPage from './pages/AgendaPage'
import AlumniProfilePage from './pages/AlumniProfilePage'
import LoginPage from './pages/LoginPage'
import PesantrenPage from './pages/PesantrenPage'
import AlumniDashboardPage from './pages/AlumniDashboardPage'
import DaftarPage from './pages/DaftarPage'
import KarirPage from './pages/KarirPage'
import FaqPage from './pages/FaqPage'
import KontakPage from './pages/KontakPage'
import PrivasiPage from './pages/PrivasiPage'
import SyaratPage from './pages/SyaratPage'
import VerifikasiStatusPage from './pages/VerifikasiStatusPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import PilihDashboardPage from './pages/PilihDashboardPage'

import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminVerifikasiPage from './pages/admin/AdminVerifikasiPage'
import AdminManajemenUserPage from './pages/admin/AdminManajemenUserPage'
import AdminBeritaPage from './pages/admin/AdminBeritaPage'
import AdminAgendaPage from './pages/admin/AdminAgendaPage'
import AdminAngkatanPage from './pages/admin/AdminAngkatanPage'
import AdminDataAlumniPage from './pages/admin/AdminDataAlumniPage'
import AdminGaleriPage from './pages/admin/AdminGaleriPage'
import AdminOrganisasiPage from './pages/admin/AdminOrganisasiPage'
import AdminKarirPage from './pages/admin/AdminKarirPage'
import AdminPengaturanPage from './pages/admin/AdminPengaturanPage'
import AdminNotifikasiPage from './pages/admin/AdminNotifikasiPage'
import AdminLogPage from './pages/admin/AdminLogPage'
import AdminLandingPage from './pages/admin/AdminLandingPage'
import IdleWarningModal from './components/IdleWarningModal'

function App() {
  return (
    <SiteConfigProvider>
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <IdleWarningModal />
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/berita" element={<NewsListingPage />} />
          <Route path="/berita/:slug" element={<NewsDetailPage />} />
          <Route path="/direktori" element={<AlumniDirectoryPage />} />
          <Route path="/direktori/:id" element={<AlumniProfilePage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/masuk" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/pesantren" element={<PesantrenPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><AlumniDashboardPage /></ProtectedRoute>} />
          <Route path="/daftar" element={<GuestRoute><DaftarPage /></GuestRoute>} />
          <Route path="/karir" element={<KarirPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/kontak" element={<KontakPage />} />
          <Route path="/privasi" element={<PrivasiPage />} />
          <Route path="/syarat" element={<SyaratPage />} />
          <Route path="/verifikasi-status" element={<VerifikasiStatusPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/pilih-dashboard" element={<ProtectedRoute><PilihDashboardPage /></ProtectedRoute>} />

          {/* ── Admin routes (role-protected) ── */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute requiredPerm="dashboard">
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/verifikasi" element={
            <ProtectedAdminRoute requiredPerm="verifikasi">
              <AdminVerifikasiPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedAdminRoute requiredPerm="users">
              <AdminManajemenUserPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/alumni-data" element={
            <ProtectedAdminRoute requiredPerm="alumni-data">
              <AdminDataAlumniPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/angkatan" element={
            <ProtectedAdminRoute requiredPerm="angkatan">
              <AdminAngkatanPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/organisasi" element={
            <ProtectedAdminRoute requiredPerm="organisasi">
              <AdminOrganisasiPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/berita" element={
            <ProtectedAdminRoute requiredPerm="berita">
              <AdminBeritaPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/agenda" element={
            <ProtectedAdminRoute requiredPerm="agenda">
              <AdminAgendaPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/galeri" element={
            <ProtectedAdminRoute requiredPerm="galeri">
              <AdminGaleriPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/landing" element={
            <ProtectedAdminRoute requiredPerm="landing">
              <AdminLandingPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/karir" element={
            <ProtectedAdminRoute requiredPerm="karir">
              <AdminKarirPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/notifikasi" element={
            <ProtectedAdminRoute requiredPerm="notifikasi">
              <AdminNotifikasiPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/log" element={
            <ProtectedAdminRoute requiredPerm="log">
              <AdminLogPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/pengaturan" element={
            <ProtectedAdminRoute requiredPerm="pengaturan">
              <AdminPengaturanPage />
            </ProtectedAdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </SiteConfigProvider>
  )
}

export default App
