export const categories = [
  { value: 'semua', label: 'Semua' },
  { value: 'kegiatan-alumni', label: 'Kegiatan Alumni' },
  { value: 'info-pondok', label: 'Info Pondok' },
  { value: 'peluang-kerja', label: 'Peluang Kerja' },
  { value: 'kisah-sukses', label: 'Kisah Sukses' },
]

export const popularTags = [
  'Beasiswa', 'Reuni', 'Karir', 'Pesantren', 'Teknologi',
  'Kewirausahaan', 'Pendidikan', 'Sosial',
]

export const news = [
  {
    slug: 'alumni-angkatan-2012-luncurkan-beasiswa',
    category: 'kegiatan-alumni',
    categoryLabel: 'Kegiatan Alumni',
    date: '12 Nov 2024',
    dateISO: '2024-11-12',
    title: 'Alumni Angkatan 2012 Luncurkan Beasiswa untuk Santri Berprestasi',
    excerpt:
      'Beberapa alumni angkatan 2012 menginisiasi program beasiswa berkelanjutan bagi santri aktif di Daarul Mughni yang berprestasi di bidang akademik dan tahfidz.',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    imageWide:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
    author: 'Redaksi IKA Daarul Mughni',
    authorInitials: 'RI',
    readTime: '4 menit',
    views: 842,
    comments: 14,
    tags: ['Beasiswa', 'Kegiatan Alumni', 'Pendidikan'],
    content: [
      {
        type: 'paragraph',
        text: 'Sebuah inisiatif luar biasa lahir dari semangat kebersamaan alumni angkatan 2012 Pondok Pesantren Daarul Mughni. Mereka resmi meluncurkan program beasiswa berkelanjutan yang diberi nama "Beasiswa Cahaya Ilmu" pada bulan November 2024.',
      },
      {
        type: 'paragraph',
        text: 'Program ini dirancang untuk mendukung santri aktif yang memiliki prestasi akademik menonjol maupun capaian di bidang tahfidz Al-Qur\'an. Dengan target awal 10 penerima beasiswa per tahun, para alumni berharap dapat meringankan beban orang tua sekaligus memotivasi generasi penerus.',
      },
      {
        type: 'quote',
        text: 'Kami ingin memastikan bahwa tidak ada santri yang berhenti belajar karena keterbatasan finansial. Ini adalah bentuk nyata rasa syukur kami atas ilmu yang telah diberikan pesantren.',
        author: 'Fajar Ramdhani, Ketua Angkatan 2012',
      },
      {
        type: 'paragraph',
        text: 'Dana beasiswa dikumpulkan melalui mekanisme infak rutin bulanan dari alumni angkatan 2012 yang tersebar di berbagai kota dan profesi. Hingga peluncuran, telah terkumpul dana awal sebesar Rp 85 juta yang siap disalurkan pada semester berikutnya.',
      },
      {
        type: 'images',
        items: [
          'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
        ],
      },
      {
        type: 'paragraph',
        text: 'Pihak pesantren menyambut hangat inisiatif ini. Pimpinan Pondok, KH. Mustopa Mughni, MA. menyatakan apresiasi mendalam dan berharap langkah ini menginspirasi angkatan alumni lainnya untuk berbuat hal serupa.',
      },
      {
        type: 'paragraph',
        text: 'Pendaftaran beasiswa akan dibuka setiap semester, dengan seleksi berdasarkan nilai akademik, hafalan Qur\'an, dan rekomendasi dari ustadz pembimbing. Informasi lebih lanjut dapat diakses melalui portal alumni atau menghubungi panitia langsung.',
      },
    ],
  },
  {
    slug: 'pondok-pesantren-raih-penghargaan-berprestasi',
    category: 'info-pondok',
    categoryLabel: 'Info Pondok',
    date: '10 Nov 2024',
    dateISO: '2024-11-10',
    title: 'Pondok Pesantren Raih Penghargaan Pesantren Berprestasi Nasional',
    excerpt:
      'Komitmen Daarul Mughni dalam pemberdayaan lingkungan dan pendidikan karakter meraih apresiasi tinggi dari Kementerian Agama dan Kementerian Lingkungan Hidup Indonesia.',
    image:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    imageWide:
      'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=80',
    author: 'Humas Pesantren',
    authorInitials: 'HP',
    readTime: '3 menit',
    views: 1203,
    comments: 21,
    tags: ['Info Pondok', 'Penghargaan', 'Pendidikan'],
    content: [
      {
        type: 'paragraph',
        text: 'Pondok Pesantren Daarul Mughni kembali menorehkan prestasi membanggakan di kancah nasional. Pada Peringatan Hari Santri 22 Oktober 2024, pesantren yang berlokasi di Bogor ini resmi menerima penghargaan "Pesantren Berprestasi Bidang Lingkungan Hidup" dari Kementerian Lingkungan Hidup dan Kehutanan Republik Indonesia.',
      },
      {
        type: 'paragraph',
        text: 'Penghargaan ini diraih berkat konsistensi Daarul Mughni dalam menjalankan program pesantren ramah lingkungan. Mulai dari pengelolaan sampah terpadu, budidaya pertanian organik, hingga program penanaman pohon yang melibatkan seluruh santri dan alumni.',
      },
      {
        type: 'quote',
        text: 'Penghargaan ini bukan milik pesantren semata, tapi milik seluruh keluarga besar Daarul Mughni — para ustadz, santri, dan alumni yang telah bersama-sama menjaga amanah lingkungan.',
        author: 'KH. Mustopa Mughni, MA., Pimpinan Pesantren',
      },
      {
        type: 'paragraph',
        text: 'Selain di bidang lingkungan, Daarul Mughni juga mendapat nominasi terbaik dalam kategori Pesantren Inovatif dari Kementerian Agama RI atas program digitalisasi pembelajaran yang diimplementasikan sejak 2022.',
      },
    ],
  },
  {
    slug: 'kunjungan-kerja-alumni-startup-unicorn',
    category: 'kegiatan-alumni',
    categoryLabel: 'Kegiatan Alumni',
    date: '8 Nov 2024',
    dateISO: '2024-11-08',
    title: 'Kunjungan Kerja Alumni ke Kantor Startup Unicorn Jakarta',
    excerpt:
      'Membangun mindset digital, pengurus IKA Daarul Mughni melakukan kunjungan ke beberapa kantor startup teknologi terkemuka di Jakarta untuk memperluas wawasan anggota.',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    imageWide:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    author: 'Redaksi IKA Daarul Mughni',
    authorInitials: 'RI',
    readTime: '5 menit',
    views: 634,
    comments: 8,
    tags: ['Kegiatan Alumni', 'Teknologi', 'Karir'],
    content: [
      {
        type: 'paragraph',
        text: 'Ikatan Alumni (IKA) Daarul Mughni menggelar program kunjungan kerja bertajuk "Tech Safari: Belajar dari Para Pelaku Industri Digital" pada 5-6 November 2024. Sebanyak 30 alumni dari berbagai angkatan berkesempatan mengunjungi tiga kantor startup terkemuka di Jakarta.',
      },
      {
        type: 'paragraph',
        text: 'Kunjungan pertama dilakukan ke kantor Tokopedia, di mana tim alumni mendapat sesi eksklusif bersama salah satu co-founder yang ternyata memiliki latar belakang pesantren. Sesi ini membuka perspektif bahwa nilai-nilai kepesantrenan sangat relevan dalam dunia startup modern.',
      },
      {
        type: 'quote',
        text: 'Kejujuran, kerja keras, dan kepedulian sosial yang diajarkan di pesantren adalah modal utama yang membawa saya bertahan dan berkembang di dunia startup.',
        author: 'Hendra Gunawan, Alumni Angkatan 2007, Tech Entrepreneur',
      },
      {
        type: 'paragraph',
        text: 'Hari kedua diisi dengan workshop singkat tentang digital marketing dan product management yang difasilitasi oleh alumni yang kini berkarier di perusahaan teknologi tersebut. Seluruh peserta mendapat sertifikat dan akses ke komunitas alumni tech eksklusif.',
      },
      {
        type: 'images',
        items: [
          'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ],
  },
  {
    slug: 'lowongan-kerja-alumni-bidang-teknologi-2024',
    category: 'peluang-kerja',
    categoryLabel: 'Peluang Kerja',
    date: '5 Nov 2024',
    dateISO: '2024-11-05',
    title: 'Lowongan Kerja Eksklusif untuk Alumni: 15 Posisi di Bidang Teknologi',
    excerpt:
      'Jaringan alumni IKA Daarul Mughni membuka akses ke 15 posisi pekerjaan eksklusif di perusahaan teknologi dan keuangan yang dipimpin atau direkomendasikan oleh alumni.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    imageWide:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
    author: 'Divisi Karir IKA',
    authorInitials: 'DK',
    readTime: '6 menit',
    views: 2187,
    comments: 36,
    tags: ['Peluang Kerja', 'Karir', 'Teknologi'],
    content: [
      {
        type: 'paragraph',
        text: 'Divisi Karir IKA Daarul Mughni dengan bangga mengumumkan program "Alumni Hiring Network" — sebuah inisiatif untuk menghubungkan alumni pencari kerja dengan perusahaan yang dipimpin atau memiliki rekrutmen dari jaringan alumni.',
      },
      {
        type: 'paragraph',
        text: 'Pada batch November 2024 ini, tersedia 15 posisi di berbagai bidang: Software Engineering, Data Analysis, Digital Marketing, Finance Analyst, dan Business Development. Seluruh posisi berasal dari perusahaan yang telah terverifikasi dan memiliki kultur kerja yang baik.',
      },
      {
        type: 'quote',
        text: 'Kami ingin memastikan alumni Daarul Mughni mendapat kesempatan terbaik di pasar kerja. Rekomendasi internal dari sesama alumni terbukti meningkatkan peluang diterima secara signifikan.',
        author: 'Ir. Budi Santoso, Ketua Divisi Karir IKA',
      },
      {
        type: 'paragraph',
        text: 'Cara mendaftar: Login ke portal alumni, buka menu Karir, pilih posisi yang sesuai, dan unggah CV terbaru Anda. Pelamar yang merupakan alumni terverifikasi akan mendapat prioritas review dalam 3 hari kerja.',
      },
    ],
  },
  {
    slug: 'kisah-sukses-rizky-entrepreneur-muda',
    category: 'kisah-sukses',
    categoryLabel: 'Kisah Sukses',
    date: '1 Nov 2024',
    dateISO: '2024-11-01',
    title: 'Dari Santri ke CEO: Kisah Rizky Membangun Startup Senilai 10 Miliar',
    excerpt:
      'Rizky Ramadhan, alumni angkatan 2012, berbagi perjalanan inspiratifnya membangun startup sosial yang kini telah memberdayakan lebih dari 500 UMKM di sekitar pesantren.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    imageWide:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1400&q=80',
    author: 'Tim Editorial IKA',
    authorInitials: 'TE',
    readTime: '8 menit',
    views: 3421,
    comments: 52,
    tags: ['Kisah Sukses', 'Kewirausahaan', 'Sosial'],
    content: [
      {
        type: 'paragraph',
        text: 'Siapa sangka, pemuda yang dulu dikenal sebagai santri pendiam di kelas Tahfidz kini menjadi CEO startup yang valuasinya menembus angka 10 miliar rupiah. Rizky Ramadhan, alumni angkatan 2012, membuktikan bahwa modal terbesar bukan uang, melainkan karakter.',
      },
      {
        type: 'paragraph',
        text: 'Perjalanan Rizky dimulai bukan dari Silicon Valley atau inkubator startup mewah, melainkan dari garasi rumah orangtuanya di Bogor. Dengan modal awal Rp 5 juta hasil tabungan mengajar les privat, ia membangun platform marketplace untuk UMKM lokal di sekitar pondok pesantren.',
      },
      {
        type: 'quote',
        text: 'Pesan Kiai yang selalu saya pegang: "Jadilah cahaya bagi masyarakat sekitarmu." Startup saya adalah cara saya mewujudkan pesan itu. Setiap UMKM yang bergabung adalah cahaya kecil yang kami nyalakan bersama.',
        author: 'Rizky Ramadhan, CEO & Founder PasarBerkah.id',
      },
      {
        type: 'paragraph',
        text: 'Kini PasarBerkah.id telah memiliki lebih dari 500 mitra UMKM dan memproses transaksi rata-rata Rp 800 juta per bulan. Yang membanggakan, 40% dari mitra usaha tersebut adalah keluarga santri dan alumni Daarul Mughni sendiri.',
      },
      {
        type: 'images',
        items: [
          'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&w=600&q=80',
        ],
      },
      {
        type: 'paragraph',
        text: 'Rizky berencana membuka program mentorship bagi alumni yang ingin merintis usaha. Ia percaya bahwa ekosistem alumni yang saling mendukung adalah kekuatan yang belum dimanfaatkan secara maksimal.',
      },
    ],
  },
  {
    slug: 'seminar-pengembangan-diri-alumni-2024',
    category: 'kegiatan-alumni',
    categoryLabel: 'Kegiatan Alumni',
    date: '28 Okt 2024',
    dateISO: '2024-10-28',
    title: 'Seminar Nasional Pengembangan Diri Alumni: Ratusan Peserta Hadir',
    excerpt:
      'Lebih dari 300 alumni dari seluruh Indonesia hadir dalam Seminar Nasional Pengembangan Diri yang diselenggarakan IKA Daarul Mughni secara hybrid di Bogor dan online.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    imageWide:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80',
    author: 'Panitia Seminar IKA',
    authorInitials: 'PS',
    readTime: '5 menit',
    views: 987,
    comments: 19,
    tags: ['Kegiatan Alumni', 'Pendidikan', 'Karir'],
    content: [
      {
        type: 'paragraph',
        text: 'Pondok Pesantren Daarul Mughni menjadi tuan rumah Seminar Nasional Pengembangan Diri Alumni pada 26 Oktober 2024. Acara bertajuk "Santri Berdaya, Bangsa Maju" ini dihadiri lebih dari 300 alumni secara luring dan ribuan lainnya melalui siaran langsung daring.',
      },
      {
        type: 'paragraph',
        text: 'Acara dibuka oleh Pimpinan Pondok dengan pesan tentang pentingnya alumni untuk terus mengembangkan diri sambil menjaga identitas ke-pesantren-an. Dilanjutkan dengan tiga sesi panel yang menghadirkan alumni berprestasi dari berbagai bidang.',
      },
      {
        type: 'quote',
        text: 'Santri bukan hanya identitas masa lalu. Santri adalah cara pandang, cara bersikap, dan cara berkarya yang harus dibawa sepanjang hayat.',
        author: 'Dr. Ahmad Fauzi, Alumni 2001, Keynote Speaker',
      },
      {
        type: 'paragraph',
        text: 'Sesi interaktif paling diminati adalah workshop "Personal Branding untuk Alumni Pesantren" yang dipandu oleh Siti Maryam, alumni 2010 yang kini menjadi konsultan karir. Seluruh materi seminar dapat diakses ulang oleh alumni yang telah terverifikasi melalui portal ini.',
      },
    ],
  },
]

export function getNewsBySlug(slug) {
  return news.find((n) => n.slug === slug)
}

export function getNewsByCategory(category) {
  if (category === 'semua') return news
  return news.filter((n) => n.category === category)
}

export function getRelatedNews(slug, limit = 3) {
  const current = getNewsBySlug(slug)
  if (!current) return []
  return news
    .filter((n) => n.slug !== slug && n.category === current.category)
    .slice(0, limit)
    .concat(news.filter((n) => n.slug !== slug && n.category !== current.category))
    .slice(0, limit)
}
