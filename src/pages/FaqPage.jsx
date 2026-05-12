import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'

const faqData = [
  {
    kategori: 'Pendaftaran',
    items: [
      {
        q: 'Siapa yang bisa mendaftar di Portal Alumni Daarul Mughni?',
        a: 'Seluruh santri dan santriwati yang pernah atau sedang menempuh pendidikan di Pondok Pesantren Daarul Mughni sejak angkatan 2006 (Ke-1) dapat mendaftar.',
      },
      {
        q: 'Apa saja data yang dibutuhkan untuk mendaftar?',
        a: 'Nama lengkap sesuai KTP, email aktif, nomor HP/WhatsApp, tahun angkatan, dan bidang studi atau profesi saat ini. Setelah mendaftar, admin akan memverifikasi data Anda.',
      },
      {
        q: 'Berapa lama proses verifikasi akun?',
        a: 'Proses verifikasi memerlukan 1–3 hari kerja. Anda akan mendapatkan notifikasi email setelah akun Anda disetujui atau jika ada data yang perlu diperbaiki.',
      },
      {
        q: 'Apakah pendaftaran dikenakan biaya?',
        a: 'Tidak. Pendaftaran dan penggunaan Portal Alumni Daarul Mughni sepenuhnya gratis untuk seluruh alumni.',
      },
    ],
  },
  {
    kategori: 'Akun & Profil',
    items: [
      {
        q: 'Bagaimana cara mengubah kata sandi?',
        a: 'Buka dashboard alumni, klik tombol "Edit Profil" di bagian Aksi Cepat, lalu pilih tab "Keamanan" untuk mengubah kata sandi.',
      },
      {
        q: 'Apakah saya bisa mengubah email yang terdaftar?',
        a: 'Perubahan email memerlukan verifikasi ulang oleh admin. Silakan hubungi kami melalui halaman Kontak dengan menyertakan email lama dan email baru yang diinginkan.',
      },
      {
        q: 'Apa yang dimaksud dengan "Kelengkapan Profil"?',
        a: 'Persentase kelengkapan profil dihitung berdasarkan data yang telah diisi: foto profil, riwayat pendidikan, riwayat pekerjaan, sertifikasi, dan bio. Profil yang lengkap meningkatkan visibilitas di direktori alumni.',
      },
      {
        q: 'Apakah profil saya otomatis terlihat di direktori?',
        a: 'Ya, akun yang terverifikasi otomatis masuk ke direktori alumni. Anda dapat mengatur visibilitas profil (Publik, Sesama Alumni, atau Privat) melalui pengaturan privasi.',
      },
    ],
  },
  {
    kategori: 'Fitur Portal',
    items: [
      {
        q: 'Apakah ada fitur bursa kerja / lowongan pekerjaan?',
        a: 'Ya, tersedia di menu "Karir". Alumni dapat melihat lowongan dari sesama alumni maupun mitra pondok. Untuk memposting lowongan, klik "Tambah Karir" di dashboard Anda.',
      },
      {
        q: 'Bagaimana cara terhubung dengan sesama alumni?',
        a: 'Buka halaman Direktori Alumni, temukan alumni yang ingin Anda hubungi, lalu klik tombol "Hubungi". Anda juga dapat melihat saran koneksi di dashboard berdasarkan angkatan.',
      },
      {
        q: 'Apa itu "Kartu Alumni" dan bagaimana cara mengunduhnya?',
        a: 'Kartu Alumni adalah kartu identitas digital yang berisi nama, ID alumni, angkatan, dan status verifikasi. Klik "Unduh Kartu Alumni" di dashboard Anda untuk mengunduhnya dalam format gambar.',
      },
      {
        q: 'Bisakah saya memposting artikel atau tulisan di portal?',
        a: 'Ya, fitur Publikasi tersedia di dashboard. Artikel yang Anda submit akan ditinjau oleh tim editorial sebelum ditampilkan di halaman Berita.',
      },
    ],
  },
  {
    kategori: 'Verifikasi & Keanggotaan',
    items: [
      {
        q: 'Apa keuntungan akun yang sudah terverifikasi?',
        a: 'Akun terverifikasi mendapatkan akses penuh ke direktori alumni, bisa menghubungi sesama alumni, menerima ID Alumni resmi (format DM-TAHUN-XXX), serta dapat menggunakan ID untuk mengakses fasilitas pondok seperti perpustakaan.',
      },
      {
        q: 'Apa yang terjadi jika pendaftaran saya ditolak?',
        a: 'Anda akan menerima email berisi alasan penolakan secara detail. Perbaiki data yang diperlukan sesuai instruksi, lalu ajukan kembali melalui formulir pendaftaran.',
      },
      {
        q: 'Apakah akun bisa dinonaktifkan?',
        a: 'Ya. Admin dapat menonaktifkan akun jika terdapat pelanggaran ketentuan layanan. Anda juga dapat meminta penonaktifan sementara atau penghapusan akun melalui halaman Kontak.',
      },
    ],
  },
]

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50/50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800 leading-snug">{q}</span>
        <ChevronDown
          className="w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white border-t border-gray-50">
          <p className="text-sm text-gray-500 leading-relaxed mt-3">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  const [activeKat, setActiveKat] = useState('Semua')
  const katList = ['Semua', ...faqData.map((f) => f.kategori)]

  const filtered = activeKat === 'Semua' ? faqData : faqData.filter((f) => f.kategori === activeKat)

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4" style={{ backgroundColor: '#0A2415' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F0A500]/20 flex items-center justify-center mx-auto mb-5">
            <HelpCircle className="w-7 h-7 text-[#F0A500]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Pertanyaan yang Sering Diajukan</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Temukan jawaban atas pertanyaan umum seputar Portal Alumni Daarul Mughni.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        {/* Kategori tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {katList.map((k) => (
            <button
              key={k}
              onClick={() => setActiveKat(k)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                activeKat === k
                  ? { backgroundColor: '#1A5C38', color: '#fff' }
                  : { backgroundColor: '#fff', color: '#4B5563', border: '1px solid #E5E7EB' }
              }
            >
              {k}
            </button>
          ))}
        </div>

        {/* FAQ sections */}
        <div className="space-y-8">
          {filtered.map((section) => (
            <div key={section.kategori}>
              <h2 className="text-base font-bold text-[#0A2415] mb-3">{section.kategori}</h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Accordion key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-sm font-semibold text-gray-700 mb-1">Tidak menemukan jawaban yang dicari?</p>
          <p className="text-xs text-gray-400 mb-4">Tim admin kami siap membantu Anda secara langsung.</p>
          <a
            href="/kontak"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A5C38' }}
          >
            Hubungi Kami
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}
