import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
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
import AdminVerifikasiPage from './pages/admin/AdminVerifikasiPage'
import AdminManajemenUserPage from './pages/admin/AdminManajemenUserPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/berita" element={<NewsListingPage />} />
        <Route path="/berita/:slug" element={<NewsDetailPage />} />
        <Route path="/direktori" element={<AlumniDirectoryPage />} />
        <Route path="/direktori/:id" element={<AlumniProfilePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/masuk" element={<LoginPage />} />
        <Route path="/pesantren" element={<PesantrenPage />} />
        <Route path="/dashboard" element={<AlumniDashboardPage />} />
        <Route path="/daftar" element={<DaftarPage />} />
        <Route path="/karir" element={<KarirPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="/privasi" element={<PrivasiPage />} />
        <Route path="/syarat" element={<SyaratPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/verifikasi" element={<AdminVerifikasiPage />} />
        <Route path="/admin/users" element={<AdminManajemenUserPage />} />
        <Route path="/admin/berita" element={<AdminBeritaPage />} />
        <Route path="/admin/agenda" element={<AdminAgendaPage />} />
        <Route path="/admin/angkatan" element={<AdminAngkatanPage />} />
        <Route path="/admin/alumni-data" element={<AdminDataAlumniPage />} />
        <Route path="/admin/galeri" element={<AdminGaleriPage />} />
        <Route path="/admin/organisasi" element={<AdminOrganisasiPage />} />
        <Route path="/admin/karir" element={<AdminKarirPage />} />
        <Route path="/admin/pengaturan" element={<AdminPengaturanPage />} />
        <Route path="/admin/notifikasi" element={<AdminNotifikasiPage />} />
        <Route path="/admin/log" element={<AdminLogPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
