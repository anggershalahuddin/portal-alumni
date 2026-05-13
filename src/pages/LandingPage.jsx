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
  return (
    <div className="font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pimpinan />
        <News />
        <Agenda />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
