import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import LandingPage from './pages/LandingPage'
import NewsListingPage from './pages/NewsListingPage'
import NewsDetailPage from './pages/NewsDetailPage'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/berita" element={<NewsListingPage />} />
        <Route path="/berita/:slug" element={<NewsDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
