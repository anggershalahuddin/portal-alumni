import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'

const sections = [
  {
    title: 'Penerimaan Syarat',
    content: [
      'Dengan mendaftar dan menggunakan Portal Alumni Daarul Mughni, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat & Ketentuan ini.',
      'Jika Anda tidak menyetujui syarat-syarat ini, Anda tidak diperkenankan menggunakan layanan portal.',
      'Kami berhak mengubah syarat ini kapan saja. Perubahan akan diberitahukan melalui portal atau email.',
    ],
  },
  {
    title: 'Kelayakan Pengguna',
    content: [
      'Portal ini diperuntukkan bagi alumni (santri/santriwati) yang pernah menempuh pendidikan di Pondok Pesantren Daarul Mughni sejak angkatan 2006.',
      'Pendaftaran memerlukan verifikasi oleh admin. Kami berhak menolak pendaftaran tanpa memberikan alasan.',
      'Satu orang hanya boleh memiliki satu akun aktif. Pembuatan akun ganda dapat menyebabkan pemblokiran.',
    ],
  },
  {
    title: 'Akun dan Keamanan',
    content: [
      'Anda bertanggung jawab menjaga kerahasiaan kata sandi dan informasi akun Anda.',
      'Segera hubungi admin jika Anda mencurigai adanya akses tidak sah ke akun Anda.',
      'Kami tidak bertanggung jawab atas kerugian akibat kelalaian pengguna dalam menjaga keamanan akun.',
      'Akun yang tidak aktif selama lebih dari 2 tahun dapat dinonaktifkan secara otomatis.',
    ],
  },
  {
    title: 'Penggunaan Layanan',
    content: [
      'Portal hanya boleh digunakan untuk tujuan yang sah dan sesuai dengan nilai-nilai Islami dan etika pesantren.',
      'Dilarang menggunakan portal untuk menyebarkan konten yang mengandung SARA, pornografi, hoaks, atau konten yang melanggar hukum.',
      'Dilarang melakukan spam, phishing, atau tindakan yang mengganggu pengguna lain.',
      'Dilarang mencoba mengakses sistem secara tidak sah atau melakukan serangan siber dalam bentuk apapun.',
    ],
  },
  {
    title: 'Konten Pengguna',
    content: [
      'Anda tetap memiliki hak atas konten yang Anda unggah (foto, tulisan, dll), namun memberikan kami lisensi untuk menampilkannya di portal.',
      'Kami berhak menghapus konten yang melanggar syarat ini tanpa pemberitahuan sebelumnya.',
      'Konten yang Anda bagikan di direktori publik dapat dilihat oleh seluruh pengguna terdaftar.',
    ],
  },
  {
    title: 'Batasan Tanggung Jawab',
    content: [
      'Portal disediakan "sebagaimana adanya" tanpa jaminan ketersediaan 100%.',
      'Kami tidak bertanggung jawab atas kerugian yang timbul akibat gangguan layanan, kehilangan data, atau kegagalan sistem.',
      'Kami tidak bertanggung jawab atas konten atau tindakan pengguna lain di portal.',
      'Informasi lowongan kerja di bursa karir disediakan oleh alumni dan bukan merupakan jaminan dari pihak pondok.',
    ],
  },
  {
    title: 'Penangguhan dan Penghapusan Akun',
    content: [
      'Kami berhak menangguhkan atau menghapus akun yang melanggar Syarat & Ketentuan ini.',
      'Pengguna dapat meminta penghapusan akun dengan menghubungi admin melalui halaman Kontak.',
      'Setelah akun dihapus, data yang terkait akan dihapus dalam 30 hari kerja, kecuali diwajibkan disimpan oleh hukum.',
    ],
  },
  {
    title: 'Hukum yang Berlaku',
    content: [
      'Syarat & Ketentuan ini tunduk pada hukum Republik Indonesia.',
      'Setiap perselisihan diselesaikan secara musyawarah mufakat. Jika tidak tercapai kesepakatan, diselesaikan melalui pengadilan yang berwenang di Kabupaten Bogor, Jawa Barat.',
    ],
  },
]

export default function SyaratPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9]">
      <Navbar />

      <section className="pt-24 pb-12 px-4" style={{ backgroundColor: '#0A2415' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white mb-2">Syarat & Ketentuan</h1>
          <p className="text-white/50 text-sm">Terakhir diperbarui: 1 Januari 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Selamat datang di Portal Alumni Pondok Pesantren Daarul Mughni. Dengan mengakses atau menggunakan layanan kami, Anda setuju untuk terikat oleh Syarat & Ketentuan berikut. Harap baca dengan seksama sebelum menggunakan portal.
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
              Pertanyaan mengenai Syarat & Ketentuan ini dapat disampaikan melalui{' '}
              <a href="/kontak" className="text-[#1A5C38] font-semibold hover:underline">halaman Kontak</a>{' '}
              atau email{' '}
              <a href="mailto:ppdaaarulmughni@gmail.com" className="text-[#1A5C38] font-semibold hover:underline">
                ppdaaarulmughni@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
