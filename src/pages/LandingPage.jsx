import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import Pimpinan from '../components/landing/Pimpinan'
import News from '../components/landing/News'
import Agenda from '../components/landing/Agenda'
import Testimonials from '../components/landing/Testimonials'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  const [landingData, setLandingData] = useState(null)

  useEffect(() => {
    const now = new Date().toISOString()
    Promise.all([
      supabase.from('berita')
        .select('slug, judul, konten, foto_url, kategori, published_at')
        .eq('status', 'published').order('published_at', { ascending: false }).limit(3),
      supabase.from('agenda')
        .select('id, judul, lokasi, tanggal_mulai, tanggal_selesai, link_registrasi, maps_url')
        .eq('is_aktif', true).gte('tanggal_mulai', now).order('tanggal_mulai', { ascending: true }).limit(4),
    ]).then(([beritaRes, agendaRes]) => {
      setLandingData({
        berita: beritaRes.data ?? [],
        agenda: agendaRes.data ?? [],
      })
    })
  }, [])

  const loading = landingData === null

  return (
    <div className="font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pimpinan />
        <News        news={landingData?.berita ?? []}            loading={loading} />
        <Agenda      events={landingData?.agenda ?? []}          loading={loading} />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
