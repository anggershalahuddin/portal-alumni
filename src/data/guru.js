import pimpinanImg from '@/assets/pimpinan.jpg'

export const initialGuru = [
  {
    id: 1,
    nama: 'KH. Mustopa Mughni, MA.',
    jabatan: 'Pendiri & Pengasuh Utama',
    deskripsi: 'Ulama kharismatik lulusan Universitas Al-Azhar Kairo yang mendedikasikan hidupnya untuk membangun generasi Islam yang unggul dan berakhlak mulia.',
    foto: null,
    isPengasuh: true,
    aktif: true,
  },
  {
    id: 2,
    nama: 'Ustadz H. Ahmad Ridwan, Lc.',
    jabatan: 'Wakil Pimpinan Bidang Akademik',
    deskripsi: 'Pakar kurikulum pesantren modern lulusan Timur Tengah, aktif mengembangkan integrasi ilmu agama dan sains sejak 2005.',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=480&q=80',
    isPengasuh: true,
    aktif: true,
  },
  {
    id: 3,
    nama: 'Dr. H. Ahmad Fauzi, M.Pd',
    jabatan: 'Direktur Pendidikan',
    deskripsi: 'Akademisi berpengalaman 20+ tahun di bidang kurikulum pendidikan Islam yang integratif dan inovatif.',
    foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=480&q=80',
    isPengasuh: false,
    aktif: true,
  },
  {
    id: 4,
    nama: 'Ustd. Siti Maryam, M.Pd',
    jabatan: 'Koordinator Santri Putri',
    deskripsi: 'Pemimpin berdedikasi dalam pengembangan program khusus santri putri yang berdaya dan berkarakter islami.',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=480&q=80',
    isPengasuh: false,
    aktif: true,
  },
  {
    id: 5,
    nama: 'Ustd. Fatimah Azzahra, M.Ag',
    jabatan: 'Pembina Tahfidz Al-Quran',
    deskripsi: 'Hafidzhah 30 juz dengan sanad mutawatir, berpengalaman membina program tahfidz selama 12 tahun di pesantren.',
    foto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=480&q=80',
    isPengasuh: false,
    aktif: true,
  },
]

export function getGurPhotoSrc(guru) {
  return guru.foto || (guru.isPengasuh ? pimpinanImg : null)
}
