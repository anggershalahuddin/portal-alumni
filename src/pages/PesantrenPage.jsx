import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle, MapPin, Phone, Mail, Send,
  BookOpen, Monitor, Home, GraduationCap, Heart,
  Coffee, Activity, Users, ChevronRight, ChevronLeft, Shield,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import heroImg from '@/assets/hero.jpg'
import pimpinanImg from '@/assets/pimpinan.jpg'
import { fadeUp, fadeLeft, fadeRight, stagger, viewport } from '@/lib/animations'
import { kategoriGaleri } from '@/data/galeri'
import { getGurPhotoSrc } from '@/data/guru'
import { supabase } from '@/lib/supabase'

/* ─── Data ─── */
const timeline = [
  { year: '1999', title: 'Pendirian Awal', desc: 'Pondok Pesantren Daarul Mughni resmi berdiri dengan 5 santri perdana di bawah pimpinan KH. Mustopa Mughni, MA.' },
  { year: '2005', title: 'Peresmian Mahkamah', desc: 'Pembangunan gedung utama dan peresmian program pendidikan formal yang terintegrasi dengan kurikulum nasional.' },
  { year: '2010', title: 'Pembukaan Fasilitas', desc: 'Penambahan asrama baru, perpustakaan modern, dan laboratorium komputer untuk menunjang pembelajaran digital.' },
  { year: '2015', title: 'Akreditasi Unggul', desc: 'Meraih akreditasi A (Unggul) dari BAN-SM, menjadi pesantren terbaik tingkat provinsi Jawa Barat.' },
  { year: '2019', title: 'Transformasi Digital', desc: 'Implementasi sistem pembelajaran digital dan pendirian studio multimedia pesantren.' },
  { year: '2024', title: 'Alumni Global', desc: 'Alumni tersebar di 15+ negara dengan kontribusi nyata di bidang dakwah, akademik, dan profesional.' },
]

const misi = [
  'Menyelenggarakan pendidikan Islam yang berkualitas dan berorientasi masa depan',
  'Membentuk karakter santri yang berakhlak mulia dan berwawasan global',
  'Mengintegrasikan ilmu agama dan ilmu pengetahuan umum secara harmonis',
  'Mengembangkan potensi santri secara holistik dalam bidang akademik dan non-akademik',
  'Berkontribusi aktif dalam pemberdayaan masyarakat dan dakwah Islam',
]


const fasilitas = [
  { icon: Home,          name: 'Asrama Representatif',   desc: 'Gedung asrama putra & putri modern dengan kapasitas 500 santri' },
  { icon: BookOpen,      name: 'Perpustakaan Lengkap',    desc: 'Koleksi 15.000+ buku islami, ilmiah, dan referensi pendidikan' },
  { icon: Monitor,       name: 'Laboratorium Komputer',   desc: '2 lab komputer dengan 50 unit PC terkoneksi internet cepat' },
  { icon: GraduationCap, name: 'Ruang Kelas AC',          desc: '24 ruang kelas nyaman ber-AC dengan proyektor digital interaktif' },
  { icon: Heart,         name: 'Klinik Kesehatan',        desc: 'Klinik 24 jam dengan tenaga medis profesional untuk santri' },
  { icon: Coffee,        name: 'Kantin Higenis',          desc: 'Standar kebersihan tinggi menyajikan makanan bergizi dan halal' },
  { icon: Activity,      name: 'Sarana Olahraga',         desc: 'Lapangan futsal, basket, badminton, dan kolam renang' },
  { icon: Users,         name: 'Aula Serbaguna',          desc: 'Aula kapasitas 1.000 orang untuk kegiatan besar dan wisuda' },
]

const galeriKategoriList = ['Semua', ...kategoriGaleri.map(k => k.label)]

function mapAngkatan(row) {
  return {
    id: row.id,
    tahunLulusan: row.tahun_lulus,
    angkatanKe: row.tahun_lulus - 2005,
    nama: row.nama_angkatan ?? `Angkatan ${row.tahun_lulus - 2005}`,
    logo: null,
  }
}

function mapOrganisasi(row) {
  return {
    id: row.id,
    nama: row.nama,
    namaLengkap: row.nama,
    singkatan: row.singkatan ?? '',
    deskripsi: row.deskripsi ?? '',
    logo: row.logo_url ?? '',
    ketua: row.ketua ?? '',
    kontak: row.kontak ?? '',
    tahunBerdiri: row.tahun_berdiri ?? '—',
    aktif: row.is_aktif,
  }
}

const stats = [
  { value: '6.200+', label: 'Alumni' },
  { value: '1999',   label: 'Tahun Berdiri' },
  { value: '12',     label: 'Program Unggulan' },
  { value: '1.500+', label: 'Santri Aktif' },
]

const kontakInfo = [
  { icon: MapPin, title: 'Alamat', lines: ['Jl. Klapanunggal Kp. Cibeber II Ds. Cikahuripan', 'Kec. Klapanunggal, Kab. Bogor, Jawa Barat 16710'] },
  { icon: Phone,  title: 'Telepon', lines: ['(021) 2921 9666'] },
  { icon: Mail,   title: 'Email',   lines: ['ppdaaarulmughni@gmail.com'] },
]

/* ─── Component ─── */
export default function PesantrenPage() {
  const [activeGaleri, setActiveGaleri] = useState('Semua')
  const [form, setForm] = useState({ nama: '', email: '', judul: '', pesan: '' })
  const [angkatanList, setAngkatanList] = useState([])
  const [organisasiList, setOrganisasiList] = useState([])
  const [galeriList, setGaleriList] = useState([])
  const [guru, setGuru] = useState([])
  const pengasuhScrollRef = useRef(null)
  const orgScrollRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      const [angkatanRes, orgRes, galeriRes, guruRes] = await Promise.all([
        supabase.from('angkatan').select('id, tahun_lulus, nama_angkatan').order('tahun_lulus', { ascending: true }),
        supabase.from('organisasi').select('id, nama, singkatan, deskripsi, logo_url, tahun_berdiri, ketua, kontak, is_aktif').eq('is_aktif', true),
        supabase.from('galeri').select('id, judul, foto_url, kategori').eq('is_aktif', true).order('created_at', { ascending: false }),
        supabase.from('guru').select('id, nama, jabatan, deskripsi, foto_url, is_pengasuh').eq('is_aktif', true).order('urutan', { ascending: true }),
      ])
      if (cancelled) return
      setAngkatanList((angkatanRes.data ?? []).map(mapAngkatan))
      setOrganisasiList((orgRes.data ?? []).map(mapOrganisasi))
      setGaleriList((galeriRes.data ?? []).map((row, i) => ({
        id: row.id,
        kategori: kategoriGaleri.find(k => k.value === row.kategori)?.label ?? row.kategori ?? 'Lainnya',
        wide: i % 3 === 0,
        src: row.foto_url,
        alt: row.judul,
        judul: row.judul,
      })))
      setGuru((guruRes.data ?? []).map(row => ({
        id: row.id,
        nama: row.nama ?? '',
        jabatan: row.jabatan ?? '',
        deskripsi: row.deskripsi ?? '',
        foto: row.foto_url ?? null,
        isPengasuh: row.is_pengasuh ?? false,
      })))
    }
    loadData()
    return () => { cancelled = true }
  }, [])

  function scrollPengasuh(dir) { pengasuhScrollRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' }) }
  function scrollOrg(dir) { orgScrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' }) }

  const filteredGaleri =
    activeGaleri === 'Semua' ? galeriList : galeriList.filter((g) => g.kategori === activeGaleri)

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center text-center pt-16" style={{ minHeight: '82vh' }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,36,21,0.72) 0%, rgba(10,36,21,0.94) 100%)' }} />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-6 py-20"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ border: '1.5px solid rgba(240,165,0,0.65)', backgroundColor: 'rgba(240,165,0,0.1)' }}>
            <Shield className="w-3.5 h-3.5" style={{ color: '#F0A500' }} />
            <span className="text-xs font-bold tracking-widest" style={{ color: '#F0A500' }}>
              RESMI &amp; TERVERIFIKASI KEMENAG RI
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
            Pondok Pesantren<br />Daarul Mughni
          </h1>
          <p className="text-white/75 text-lg mb-9 max-w-xl mx-auto leading-relaxed">
            Lembaga pendidikan Islam yang mendidik masa depan melalui ilmu pengetahuan,
            karakter mulia, dan teknologi
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/daftar"
              className="px-7 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#F0A500', color: '#0A2415' }}
            >
              Daftar Sekarang
            </Link>
            <a
              href="#kontak"
              className="px-7 py-3 rounded-xl font-bold text-sm border text-white hover:bg-white/10 transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              Hubungi Kami
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Sejarah + Timeline ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-start">
          {/* Kiri: cerita */}
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={viewport}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Tentang Kami</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
              Perjalanan Panjang Dakwah<br />Melalui Pendidikan Islam
            </h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                Berdiri sejak 1999, Pondok Pesantren Daarul Mughni telah menjadi mercusuar pendidikan Islam
                di Jawa Barat. Didirikan oleh KH. Mustopa Mughni, MA., pesantren ini lahir dari keyakinan
                bahwa pendidikan Islam yang berkualitas adalah kunci kemajuan umat.
              </p>
              <p>
                Pondok Pesantren Daarul Mughni Al Maaliki adalah lembaga pendidikan Islam yang telah berdiri
                lebih dari dua dekade dan terus berkembang menjadi salah satu pusat pendidikan terkemuka
                di kawasan Jawa Barat. Dengan visi yang jelas dan kepemimpinan yang kuat, pesantren ini
                telah melahirkan ribuan alumni yang kini berkiprah di berbagai bidang kehidupan.
              </p>
              <p>
                Nama "Daarul Mughni" mencerminkan tujuan mulia pondok ini — menjadi rumah yang mencukupi,
                tempat santri mendapatkan bekal ilmu, iman, dan amal untuk menghadapi tantangan zaman
                dengan penuh keyakinan dan integritas.
              </p>
            </div>
            <div className="flex gap-12 mt-10">
              <div>
                <div className="text-4xl font-extrabold" style={{ color: '#1A5C38' }}>25+</div>
                <div className="text-sm text-gray-500 mt-1">Tahun Pengalaman</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold" style={{ color: '#1A5C38' }}>120+</div>
                <div className="text-sm text-gray-500 mt-1">Penghargaan Nasional</div>
              </div>
            </div>
          </motion.div>

          {/* Kanan: timeline */}
          <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={viewport}>
            <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: '#F0A500' }}>Milestones Penting</p>
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200" />
              <div className="space-y-7">
                {timeline.map((item, i) => (
                  <div key={i} className="pl-8 relative">
                    <div
                      className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white"
                      style={{ borderColor: '#1A5C38' }}
                    />
                    <div className="text-xs font-extrabold mb-0.5" style={{ color: '#F0A500' }}>{item.year}</div>
                    <div className="font-bold text-gray-900 text-sm mb-1">{item.title}</div>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Video Perjalanan ── */}
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#F0A500' }}>Video Dokumentasi</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-5">Perjalanan dari Masa ke Masa</h3>
            <div className="rounded-2xl overflow-hidden aspect-video shadow-md">
              <iframe
                src="https://www.youtube.com/embed/FYyo5KjPKbM"
                title="Perjalanan Pondok Pesantren Daarul Mughni dari Masa ke Masa"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Visi & Misi ── */}
      <section className="py-24" style={{ backgroundColor: '#F8FAF9' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Visi &amp; Misi</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Landasan Pondok Pesantren Daarul Mughni</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Kiri: Visi */}
            <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={viewport}>
              <div className="rounded-2xl p-8 h-full" style={{ backgroundColor: '#1A5C38' }}>
                <p className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">Visi</p>
                <div className="text-6xl font-serif leading-none mb-4" style={{ color: '#F0A500' }}>"</div>
                <blockquote className="text-xl font-bold text-white leading-relaxed mb-6">
                  Terwujudnya lembaga pendidikan Islam yang unggul, kompetitif, dan berkontribusi pada kemaslahatan umat.
                </blockquote>
                <p className="text-white/50 text-xs font-semibold tracking-widest uppercase">
                  — Visi Pondok Pesantren Daarul Mughni
                </p>
              </div>
            </motion.div>

            {/* Kanan: Misi */}
            <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={viewport}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#F0A500' }}>Misi</p>
              <h3 className="text-xl font-extrabold text-gray-900 mb-6">Misi Kami</h3>
              <div className="space-y-4">
                {misi.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#1A5C38' }} />
                    <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Guru ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="flex items-end justify-between mb-12">
            <div className="text-center flex-1">
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Tenaga Pengajar</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Mengenal Para Guru di Pesantren</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Dibimbing oleh para guru dan ulama yang penuh dedikasi untuk mencetak generasi terbaik umat.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0 ml-4 pb-1">
              <button onClick={() => scrollPengasuh(-1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollPengasuh(1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <div
            ref={pengasuhScrollRef}
            className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth justify-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {guru.map((g) => {
              const fotoSrc = getGurPhotoSrc(g)
              return (
                <div key={g.id} className="min-w-[200px] max-w-[220px] flex-shrink-0 snap-start text-center group">
                  <div className="relative mb-5 mx-auto w-48 h-56 rounded-2xl overflow-hidden shadow-md">
                    {fotoSrc
                      ? <img src={fotoSrc} alt={g.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold" style={{ backgroundColor: '#1A5C38' }}>{g.nama[0]}</div>
                    }
                    {g.isPengasuh && (
                      <div className="absolute bottom-0 inset-x-0 py-1.5 text-xs font-bold text-center"
                        style={{ backgroundColor: '#F0A500', color: '#0A2415' }}>
                        Pengasuh / Pendiri Pesantren
                      </div>
                    )}
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-0.5">{g.nama}</h3>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#1A5C38' }}>{g.jabatan}</p>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">{g.deskripsi}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Fasilitas ── */}
      <section className="py-24" style={{ backgroundColor: '#F8FAF9' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Infrastruktur</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Fasilitas Penunjang Pendidikan</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Kami menyediakan sarana dan prasarana terbaik untuk mendukung proses belajar santri secara optimal.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={viewport}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {fasilitas.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div key={i} variants={fadeUp}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: '#F0FDF4' }}>
                    <Icon className="w-5 h-5" style={{ color: '#1A5C38' }} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{f.name}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Video Tur Virtual */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mt-8">
            <div
              className="flex items-center justify-between gap-4 flex-wrap rounded-t-2xl px-8 py-4"
              style={{ backgroundColor: '#1A5C38' }}
            >
              <p className="text-white font-semibold text-sm">Tur Virtual — Saksikan langsung fasilitas kami</p>
              <a
                href="https://www.youtube.com/watch?v=Hr9_PAE7rBk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold px-4 py-2 rounded-lg transition-opacity hover:opacity-90 flex-shrink-0"
                style={{ backgroundColor: '#F0A500', color: '#0A2415' }}
              >
                Buka di YouTube ↗
              </a>
            </div>
            <div className="rounded-b-2xl overflow-hidden aspect-video shadow-md">
              <iframe
                src="https://www.youtube.com/embed/Hr9_PAE7rBk"
                title="Tur Virtual Pondok Pesantren Daarul Mughni"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Angkatan Lulusan ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="text-center">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Lulusan Terbaik</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Keluarga Besar Angkatan Alumni</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              20 angkatan lulusan sejak 2006 — masing-masing membawa semangat dan identitas unik dalam melanjutkan estafet dakwah.
            </p>
          </motion.div>
        </div>

        {/* Marquee baris 1 */}
        <div className="relative mb-4">
          <div className="flex gap-5 animate-marquee-left w-max">
            {[...angkatanList, ...angkatanList].map((item, i) => (
              <div
                key={`r1-${i}`}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-[#1A5C38]/30 transition-all bg-gray-50">
                  {item.logo ? (
                    <img src={item.logo} alt={item.nama} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-[#1A5C38]">Angkatan {item.angkatanKe}</p>
                  <p className="text-[9px] text-gray-400 leading-tight max-w-[80px] truncate">{item.nama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee baris 2 — offset untuk zigzag */}
        <div className="relative">
          <div className="flex gap-5 animate-marquee-left-offset w-max" style={{ marginLeft: '-48px' }}>
            {[...angkatanList.slice(10), ...angkatanList.slice(0, 10), ...angkatanList.slice(10), ...angkatanList.slice(0, 10)].map((item, i) => (
              <div
                key={`r2-${i}`}
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-[#F0A500]/30 transition-all bg-gray-50">
                  {item.logo ? (
                    <img src={item.logo} alt={item.nama} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold" style={{ color: '#F0A500' }}>Angkatan {item.angkatanKe}</p>
                  <p className="text-[9px] text-gray-400 leading-tight max-w-[80px] truncate">{item.nama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/direktori"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#1A5C38] hover:gap-3 transition-all"
          >
            Temui seluruh alumni
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Organisasi Alumni ── */}
      <section className="py-20" style={{ backgroundColor: '#F8FAF9' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="flex items-end justify-between mb-12">
            <div className="text-center flex-1">
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Keluarga Besar</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Organisasi &amp; Lembaga Alumni</h2>
              <p className="text-gray-500 text-sm max-w-lg mx-auto">
                Organisasi resmi yang menghimpun dan memberdayakan seluruh alumni Pondok Pesantren Modern Perpaduan Daarul Mughni Al Maaliki.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0 ml-4 pb-1">
              <button onClick={() => scrollOrg(-1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollOrg(1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <div
            ref={orgScrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {organisasiList.map((org) => (
              <div key={org.id} className="min-w-[260px] max-w-[300px] flex-shrink-0 snap-start bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  {org.logo ? (
                    <img src={org.logo} alt={org.namaLengkap}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100 group-hover:border-[#1A5C38]/30 transition-all"
                      onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
                    style={{ backgroundColor: '#1A5C38', display: org.logo ? 'none' : 'flex' }}>
                    {(org.singkatan || org.namaLengkap).charAt(0)}
                  </div>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-3"
                  style={{ backgroundColor: '#F0FDF4', color: '#1A5C38' }}>
                  <CheckCircle className="w-3 h-3" /> Organisasi Resmi
                </div>

                {/* Singkatan — paling besar, bold */}
                <h3 className="text-lg font-extrabold text-gray-900 mb-1 leading-tight">
                  {org.singkatan || org.namaLengkap}
                </h3>

                {/* Kepanjangan — semibold, lebih kecil dari singkatan */}
                {org.singkatan && org.namaLengkap && (
                  <p className="text-sm font-semibold text-gray-600 mb-2 leading-snug">{org.namaLengkap}</p>
                )}

                {/* Deskripsi — paling kecil, normal */}
                {org.deskripsi && (
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">{org.deskripsi}</p>
                )}

                {/* Info bawah */}
                <div className="flex flex-col gap-1.5 text-xs text-gray-400">
                  {org.ketua && (
                    <div className="flex items-center justify-center gap-1.5">
                      <Users className="w-3 h-3 flex-shrink-0" />
                      <span>{org.ketua}</span>
                    </div>
                  )}
                  {org.kontak && (
                    <div className="flex items-center justify-center gap-1.5">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <a href={`mailto:${org.kontak}`} className="hover:text-[#1A5C38] transition-colors truncate">{org.kontak}</a>
                    </div>
                  )}
                  {org.tahunBerdiri && (
                    <p className="text-[10px] text-gray-300 mt-1">Berdiri sejak {org.tahunBerdiri}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galeri ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Dokumentasi</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Galeri Kegiatan &amp; Alumni</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Rekam jejak berbagai kegiatan dan momen berkesan yang terjadi di Daarul Mughni.
            </p>
          </motion.div>

          {/* Filter tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {galeriKategoriList.map((k) => (
              <button
                key={k}
                onClick={() => setActiveGaleri(k)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={
                  activeGaleri === k
                    ? { backgroundColor: '#1A5C38', color: '#fff' }
                    : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                }
              >
                {k}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredGaleri.map((g, i) => (
              <div
                key={`${activeGaleri}-${i}`}
                className={`rounded-2xl overflow-hidden${g.wide ? ' col-span-2' : ''}`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16" style={{ backgroundColor: '#0A2415' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}
              className="text-center"
            >
              <div className="text-4xl font-extrabold mb-1" style={{ color: '#F0A500' }}>{s.value}</div>
              <div className="text-sm text-white/70">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Kontak ── */}
      <section id="kontak" className="py-24" style={{ backgroundColor: '#F8FAF9' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-start">
          {/* Form */}
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={viewport}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Kontak</p>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Kirim Pesan</h2>
            <p className="text-gray-500 text-sm mb-7">
              Kami siap membantu menjawab pertanyaan Anda. Hubungi kami melalui formulir berikut.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
                  <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@contoh.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul</label>
                <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  placeholder="Subjek pesan Anda"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pesan</label>
                <textarea value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                  placeholder="Tulis pesan Anda di sini..." rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all resize-none" />
              </div>
              <button type="submit"
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110"
                style={{ backgroundColor: '#1A5C38' }}>
                <Send className="w-4 h-4" />
                Kirim Pesan Sekarang
              </button>
            </form>
          </motion.div>

          {/* Info kontak */}
          <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={viewport} className="space-y-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#F0A500' }}>Informasi Kontak</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Hubungi Kami</h2>
            </div>
            {kontakInfo.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F0FDF4' }}>
                    <Icon className="w-5 h-5" style={{ color: '#1A5C38' }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm mb-1">{item.title}</div>
                    {item.lines.map((line, j) => (
                      <p key={j} className="text-gray-500 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              )
            })}
            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden mt-4 shadow-sm border border-gray-200" style={{ height: '220px' }}>
              <iframe
                src="https://maps.google.com/maps?q=-6.454637629604064,106.97567018494564&z=16&output=embed"
                title="Lokasi Pondok Pesantren Daarul Mughni"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
