import { useState } from 'react'
import { MapPin, Mail, Phone, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import { supabase } from '@/lib/supabase'
import { useSiteConfig } from '@/context/SiteConfigContext'

const SUBJEK_LIST = ['Pertanyaan Umum', 'Verifikasi Akun', 'Masalah Teknis', 'Saran & Masukan', 'Lainnya']

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white'

export default function KontakPage() {
  const { config } = useSiteConfig()
  const [form, setForm] = useState({ nama: '', email: '', subjek: 'Pertanyaan Umum', pesan: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const kontakInfo = [
    {
      icon: MapPin,
      label: 'Alamat',
      value: config.alamat || 'Jl. Klapanunggal Kp. Cibeber II Ds. Cikahuripan, Kec. Klapanunggal, Kab. Bogor, Jawa Barat 16710',
    },
    {
      icon: Mail,
      label: 'Email',
      value: config.emailKontak || 'ppdaaarulmughni@gmail.com',
      href: `mailto:${config.emailKontak || 'ppdaaarulmughni@gmail.com'}`,
    },
    {
      icon: Phone,
      label: 'Telepon',
      value: config.telepon || '(021) 2921 9666',
      href: `tel:${(config.telepon || '02129219666').replace(/\D/g, '')}`,
    },
    {
      icon: MessageSquare,
      label: 'WhatsApp Admin Portal',
      value: config.whatsapp || '+62 812-3456-7890',
      href: `https://wa.me/${(config.whatsapp || '6281234567890').replace(/\D/g, '')}`,
    },
  ]

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))
  const isValid = form.nama && form.email && form.pesan

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError('')

    const { error: dbErr } = await supabase.from('laporan_masalah').insert({
      nama: form.nama,
      email: form.email,
      judul: form.subjek,
      detail: form.pesan,
    })

    if (dbErr) {
      setError('Gagal mengirim pesan. Silakan coba lagi.')
      setLoading(false)
      return
    }

    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4" style={{ backgroundColor: '#0A2415' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-white mb-3">Hubungi Kami</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Ada pertanyaan atau butuh bantuan? Tim admin portal siap membantu Anda.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Pesan Terkirim!</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Terima kasih, <strong>{form.nama}</strong>. Tim kami akan menghubungi Anda melalui email <strong>{form.email}</strong> dalam 1–2 hari kerja.
                </p>
                <button onClick={() => { setSent(false); setForm({ nama: '', email: '', subjek: 'Pertanyaan Umum', pesan: '' }) }}
                  className="mt-6 text-sm font-semibold text-[#1A5C38] hover:underline">
                  Kirim pesan lain
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-base font-bold text-gray-900 mb-5">Kirim Pesan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                      <input type="text" value={form.nama} onChange={set('nama')} placeholder="Nama Anda"
                        className={inputCls}
                        onFocus={(e) => (e.target.style.borderColor = '#1A5C38')}
                        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder="email@contoh.com"
                        className={inputCls}
                        onFocus={(e) => (e.target.style.borderColor = '#1A5C38')}
                        onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subjek</label>
                    <select value={form.subjek} onChange={set('subjek')}
                      className={inputCls}
                      onFocus={(e) => (e.target.style.borderColor = '#1A5C38')}
                      onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}>
                      {SUBJEK_LIST.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pesan</label>
                    <textarea value={form.pesan} onChange={set('pesan')} placeholder="Tulis pesan Anda di sini..." rows={5}
                      className={inputCls + ' resize-none'}
                      onFocus={(e) => (e.target.style.borderColor = '#1A5C38')}
                      onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')} />
                  </div>
                  {error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-full py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1A5C38' }}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Info kontak */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Informasi Kontak</h3>
              <div className="space-y-4">
                {kontakInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0FDF4' }}>
                      <Icon className="w-4 h-4" style={{ color: '#1A5C38' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-xs text-gray-700 hover:text-[#1A5C38] transition-colors leading-relaxed break-all">
                          {value}
                        </a>
                      ) : (
                        <p className="text-xs text-gray-700 leading-relaxed">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Jam Layanan Admin</h3>
              <div className="space-y-1.5">
                {[
                  { hari: 'Senin – Jumat', jam: '08.00 – 16.00 WIB' },
                  { hari: 'Sabtu', jam: '08.00 – 12.00 WIB' },
                  { hari: 'Minggu & Hari Libur', jam: 'Tutup' },
                ].map(({ hari, jam }) => (
                  <div key={hari} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{hari}</span>
                    <span className="text-xs font-semibold text-gray-700">{jam}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ backgroundColor: '#0A2415' }}>
              <p className="text-xs font-bold text-[#F0A500] uppercase tracking-wider mb-1">Respons Cepat</p>
              <p className="text-sm font-semibold text-white mb-1">Butuh bantuan segera?</p>
              <p className="text-xs text-white/50 leading-relaxed">Hubungi kami via WhatsApp untuk respons lebih cepat di hari kerja.</p>
              <a
                href={`https://wa.me/${(config.whatsapp || '6281234567890').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 px-4 py-2 rounded-xl text-xs font-bold text-[#0A2415] hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#F0A500' }}
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
