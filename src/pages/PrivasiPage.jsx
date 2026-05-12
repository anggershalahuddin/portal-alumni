import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'

const sections = [
  {
    title: 'Informasi yang Kami Kumpulkan',
    content: [
      'Data identitas: nama lengkap, email, nomor telepon, dan tahun angkatan yang Anda berikan saat mendaftar.',
      'Data profil: riwayat pendidikan, pekerjaan, sertifikasi, dan foto profil yang Anda tambahkan secara sukarela.',
      'Data penggunaan: halaman yang dikunjungi, waktu akses, dan interaksi dalam portal untuk keperluan analisis dan peningkatan layanan.',
      'Data teknis: alamat IP, jenis perangkat, dan browser yang digunakan.',
    ],
  },
  {
    title: 'Bagaimana Kami Menggunakan Data Anda',
    content: [
      'Memverifikasi identitas Anda sebagai alumni Pondok Pesantren Daarul Mughni.',
      'Menampilkan profil Anda di direktori alumni sesuai pengaturan privasi yang Anda pilih.',
      'Mengirimkan notifikasi terkait aktivitas akun, verifikasi, dan informasi terbaru dari pondok.',
      'Meningkatkan fitur dan layanan portal berdasarkan pola penggunaan.',
      'Memenuhi kewajiban hukum yang berlaku.',
    ],
  },
  {
    title: 'Keamanan Data',
    content: [
      'Kami menerapkan enkripsi SSL/TLS untuk seluruh transmisi data antara perangkat Anda dan server kami.',
      'Kata sandi disimpan dalam bentuk hash menggunakan algoritma bcrypt.',
      'Akses ke data pribadi dibatasi hanya untuk personel yang berwenang.',
      'Kami melakukan audit keamanan secara berkala untuk memastikan perlindungan data Anda.',
    ],
  },
  {
    title: 'Berbagi Data dengan Pihak Ketiga',
    content: [
      'Kami tidak menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan komersial.',
      'Data dapat dibagikan kepada penyedia layanan teknis (hosting, email) yang mendukung operasional portal, dengan perjanjian kerahasiaan.',
      'Kami dapat mengungkapkan data jika diwajibkan oleh hukum atau perintah pengadilan.',
    ],
  },
  {
    title: 'Hak-hak Anda',
    content: [
      'Hak akses: Anda berhak meminta salinan data pribadi yang kami simpan.',
      'Hak koreksi: Anda dapat memperbarui atau mengoreksi data yang tidak akurat melalui halaman profil.',
      'Hak penghapusan: Anda dapat meminta penghapusan akun dan data Anda dengan menghubungi admin.',
      'Hak membatasi pemrosesan: Anda dapat mengatur visibilitas profil di pengaturan privasi.',
      'Untuk menggunakan hak-hak ini, hubungi kami melalui halaman Kontak.',
    ],
  },
  {
    title: 'Cookie dan Penyimpanan Lokal',
    content: [
      'Kami menggunakan cookie sesi untuk autentikasi dan menjaga keamanan akun.',
      'localStorage digunakan untuk menyimpan preferensi tampilan.',
      'Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur portal mungkin tidak berfungsi optimal.',
    ],
  },
  {
    title: 'Perubahan Kebijakan',
    content: [
      'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.',
      'Perubahan signifikan akan diberitahukan melalui email atau notifikasi di portal.',
      'Dengan terus menggunakan portal setelah perubahan berlaku, Anda dianggap menyetujui kebijakan yang diperbarui.',
    ],
  },
]

export default function PrivasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <Navbar />

      <section className="pt-24 pb-12 px-4" style={{ backgroundColor: '#0A2415' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white mb-2">Kebijakan Privasi</h1>
          <p className="text-white/50 text-sm">Terakhir diperbarui: 1 Januari 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Portal Alumni Pondok Pesantren Daarul Mughni ("kami") berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi yang Anda berikan saat menggunakan portal alumni kami.
          </p>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-base font-bold text-[#0A2415] mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center shrink-0" style={{ backgroundColor: '#1A5C38' }}>
                    {i + 1}
                  </span>
                  {s.title}
                </h2>
                <ul className="space-y-2 pl-8">
                  {s.content.map((c, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-500 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38]/40 mt-2 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 leading-relaxed">
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami melalui email{' '}
              <a href="mailto:ppdaaarulmughni@gmail.com" className="text-[#1A5C38] font-semibold hover:underline">
                ppdaaarulmughni@gmail.com
              </a>{' '}
              atau kunjungi halaman{' '}
              <a href="/kontak" className="text-[#1A5C38] font-semibold hover:underline">Kontak</a>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
