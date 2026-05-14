import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgeCheck, MapPin, GraduationCap, Globe,
  Link2, Download, Shield, MessageCircle, UserPlus,
  MoreHorizontal, Briefcase, BookOpen, Activity, ExternalLink,
  ChevronRight, Heart, Building2, ShoppingBag, Users, Layers,
  Handshake, Calendar,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { getAvatarColor, getInitials } from '@/data/alumni'
import { fadeUp } from '@/lib/animations'
import { supabase } from '@/lib/supabase'

function mapAngkatan(row) {
  return { id: row.id, tahunLulusan: row.tahun_lulus, angkatanKe: row.tahun_lulus - 2005, nama: row.nama_angkatan ?? `Angkatan ${row.tahun_lulus - 2005}` }
}

// ── Brand SVG Icons ───────────────────────────────────────────────────────────
function IconInstagram({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#ffd600" />
          <stop offset="20%" stopColor="#ff7a00" />
          <stop offset="45%" stopColor="#ff0069" />
          <stop offset="75%" stopColor="#d300c5" />
          <stop offset="100%" stopColor="#7638fa" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.5" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="2.8" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="16.2" cy="7.8" r="0.9" fill="white" />
    </svg>
  )
}
function IconYouTube({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path d="M19.6 8.4a2 2 0 0 0-1.4-1.4C16.9 6.6 12 6.6 12 6.6s-4.9 0-6.2.4A2 2 0 0 0 4.4 8.4C4 9.7 4 12 4 12s0 2.3.4 3.6a2 2 0 0 0 1.4 1.4c1.3.4 6.2.4 6.2.4s4.9 0 6.2-.4a2 2 0 0 0 1.4-1.4C20 14.3 20 12 20 12s0-2.3-.4-3.6z" fill="white" />
      <polygon points="10,9.5 10,14.5 15,12" fill="#FF0000" />
    </svg>
  )
}
function IconTwitterX({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#000" />
      <path d="M17.5 5h-2.2l-3.3 4.2L8.8 5H4.5l5.5 7L4.5 19h2.2l3.6-4.5L14 19h4.3l-5.8-7.4L17.5 5z" fill="white" />
    </svg>
  )
}
function IconFacebook({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path d="M15.5 8H13.5V6.5C13.5 5.95 13.95 5.5 14.5 5.5H15.5V3H13.5C11.84 3 10.5 4.34 10.5 6V8H8.5V11H10.5V21H13.5V11H15.5L16 8H15.5Z" fill="white" />
    </svg>
  )
}
function IconEmail({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#EA4335" />
      <path d="M5 8.5L12 13.5L19 8.5V17.5H5V8.5Z" fill="white" opacity="0.9" />
      <path d="M5 8.5H19L12 13.5L5 8.5Z" fill="white" />
    </svg>
  )
}
function IconWhatsApp({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path d="M12 4C7.58 4 4 7.58 4 12c0 1.49.41 2.88 1.12 4.08L4 20l4.05-1.06A8 8 0 1 0 12 4zm0 14.4A6.4 6.4 0 1 1 12 5.6 6.4 6.4 0 0 1 12 18.4zm3.52-4.86c-.19-.1-1.13-.56-1.3-.62-.18-.06-.31-.1-.44.1-.13.19-.5.62-.61.75-.11.13-.23.14-.42.05-.19-.1-.8-.3-1.53-.95a5.8 5.8 0 0 1-1.06-1.32c-.11-.19-.01-.3.08-.39.09-.09.19-.23.28-.34.1-.12.13-.2.19-.33.06-.13.03-.25-.02-.34-.05-.1-.44-1.06-.6-1.45-.16-.38-.32-.33-.44-.33h-.37c-.13 0-.34.05-.52.25-.18.2-.68.66-.68 1.61 0 .95.7 1.87.8 2 .1.13 1.37 2.09 3.32 2.93.46.2.82.32 1.1.41.46.14.88.12 1.21.07.37-.05 1.13-.46 1.29-.9.16-.45.16-.83.11-.91-.05-.08-.18-.13-.37-.22z" fill="white" />
    </svg>
  )
}
function IconWebsite({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#0A66C2" />
      <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="1.4" fill="none" />
      <ellipse cx="12" cy="12" rx="3" ry="7" stroke="white" strokeWidth="1.4" fill="none" />
      <line x1="5" y1="10" x2="19" y2="10" stroke="white" strokeWidth="1.4" />
      <line x1="5" y1="14" x2="19" y2="14" stroke="white" strokeWidth="1.4" />
    </svg>
  )
}
function IconLinkedIn({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#0A66C2" />
      <path d="M7.5 9.5H5V19H7.5V9.5ZM6.25 8.5C7.08 8.5 7.75 7.83 7.75 7S7.08 5.5 6.25 5.5 4.75 6.17 4.75 7 5.42 8.5 6.25 8.5ZM19 19H16.5V14.25C16.5 13.2 16.48 11.86 15.04 11.86C13.58 11.86 13.36 12.99 13.36 14.17V19H10.86V9.5H13.25V10.7H13.28C13.62 10.06 14.44 9.38 15.67 9.38C18.2 9.38 19 11.04 19 13.2V19Z" fill="white" />
    </svg>
  )
}

const TABS = [
  { key: 'ringkasan', label: 'Ringkasan', icon: Activity },
  { key: 'pengalaman', label: 'Pengalaman & Pendidikan', icon: BookOpen },
  { key: 'lembaga', label: 'Lembaga & Usaha', icon: Building2 },
  { key: 'aktivitas', label: 'Aktivitas', icon: Activity },
]

function AlumniAvatar({ alumni, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-28 h-28' : 'w-10 h-10'
  const text = size === 'lg' ? 'text-2xl' : 'text-sm'

  return alumni.avatar ? (
    <img
      src={alumni.avatar}
      alt={alumni.name}
      className={`${dim} rounded-xl object-cover border-4 border-white shadow-md`}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
        e.currentTarget.nextSibling.style.display = 'flex'
      }}
    />
  ) : (
    <div
      className={`${dim} rounded-xl flex items-center justify-center text-white font-bold ${text} border-4 border-white shadow-md`}
      style={{ backgroundColor: getAvatarColor(alumni.name) }}
    >
      {getInitials(alumni.name)}
    </div>
  )
}

function SmallAlumniAvatar({ alumni }) {
  return (
    <div className="relative flex-shrink-0">
      {alumni.avatar ? (
        <img
          src={alumni.avatar}
          alt={alumni.name}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className="w-10 h-10 rounded-full items-center justify-center text-white text-sm font-bold"
        style={{
          backgroundColor: getAvatarColor(alumni.name),
          display: alumni.avatar ? 'none' : 'flex',
        }}
      >
        {getInitials(alumni.name)}
      </div>
    </div>
  )
}

export default function AlumniProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ringkasan')

  const [alumni, setAlumni]             = useState(null)
  const [detail, setDetail]             = useState(null)
  const [angkatanInfo, setAngkatanInfo] = useState(null)
  const [angkatanList, setAngkatanList] = useState([])
  const [alumniSerupa, setAlumniSerupa] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function fetchProfile() {
      setLoading(true)
      try {
        const { data: p, error: profErr } = await supabase
          .from('profiles')
          .select('id, nama_lengkap, email, angkatan, bidang, domisili, status')
          .eq('id', id)
          .single()

        if (profErr || !p || cancelled) { setLoading(false); return }

        const { data: ap } = await supabase
          .from('alumni_profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        const [keahlianRes, bahasaRes, pekerjaanRes, pendidikanRes, lembagaRes, berkasRes, angkatanRes] =
          await Promise.all([
            supabase.from('keahlian_alumni').select('nama').eq('alumni_id', id),
            supabase.from('bahasa_alumni').select('nama').eq('alumni_id', id),
            supabase.from('pekerjaan').select('*').eq('alumni_id', id),
            supabase.from('pendidikan').select('*').eq('alumni_id', id),
            supabase.from('lembaga_alumni').select('*').eq('alumni_id', id),
            supabase.from('berkas_alumni').select('nama, tipe, ukuran, kategori, file_url').eq('alumni_id', id),
            supabase.from('angkatan').select('id, tahun_lulus, nama_angkatan').order('tahun_lulus'),
          ])

        const fetchedAngkatan = (angkatanRes.data ?? []).map(mapAngkatan)

        if (cancelled) return

        const alumniObj = {
          id:         p.id,
          name:       p.nama_lengkap || p.email,
          angkatan:   p.angkatan,
          bidang:     p.bidang ?? '',
          profesi:    ap?.profesi ?? '',
          perusahaan: ap?.perusahaan ?? '',
          domisili:   p.domisili ?? '',
          keahlian:   (keahlianRes.data ?? []).map((k) => k.nama),
          isVerified: p.status === 'disetujui',
          avatar:     null,
        }

        const detailObj = {
          bio:    ap?.bio ?? '',
          bahasa: (bahasaRes.data ?? []).map((b) => b.nama),
          kontak: {
            email:     p.email,
            linkedin:  ap?.linkedin_url ?? '',
            website:   ap?.website_url ?? '',
            instagram: ap?.instagram_url ?? '',
            twitter:   ap?.twitter_url ?? '',
            github:    ap?.github_url ?? '',
          },
          pengalaman: (pekerjaanRes.data ?? []).map((pek) => ({
            jabatan:   pek.posisi ?? '',
            institusi: pek.institusi ?? '',
            periode:   pek.periode ?? '',
            deskripsi: pek.deskripsi ?? '',
          })),
          pendidikan: (pendidikanRes.data ?? []).map((pend) => ({
            gelar:     pend.gelar ?? '',
            institusi: pend.institusi ?? '',
            tahun:     pend.tahun ?? '',
          })),
          lembaga: (lembagaRes.data ?? []).map((l) => ({
            nama:          l.nama_lembaga ?? '',
            jenis:         l.jenis_lembaga ?? '',
            sebagai:       l.peran ?? '',
            bidang:        l.bidang_usaha ?? '',
            lokasi:        l.domisili ?? '',
            tahun:         l.tahun_berdiri ?? '',
            openKerjasama: l.open_kerjasama ?? false,
            deskripsi:     l.deskripsi ?? '',
            website:       l.website ?? '',
          })),
          dokumen: (berkasRes.data ?? []).map((b) => ({
            nama:   b.nama,
            tipe:   b.tipe ?? b.kategori ?? 'FILE',
            ukuran: b.ukuran ?? '',
          })),
        }

        const angkInfo = fetchedAngkatan.find((a) => a.tahunLulusan === p.angkatan) ?? null

        // Similar alumni: same angkatan or same bidang
        const { data: similar } = await supabase
          .from('profiles')
          .select('id, nama_lengkap, angkatan, bidang, domisili')
          .eq('role', 'alumni')
          .eq('status', 'disetujui')
          .neq('id', id)
          .or(`angkatan.eq.${p.angkatan},bidang.eq.${p.bidang}`)
          .limit(3)

        const simIds = (similar ?? []).map((s) => s.id)
        const { data: simAp } = simIds.length > 0
          ? await supabase.from('alumni_profiles').select('id, profesi, perusahaan').in('id', simIds)
          : { data: [] }

        const simApMap = {}
        ;(simAp ?? []).forEach((ap) => { simApMap[ap.id] = ap })

        const simAlumni = (similar ?? []).map((s) => ({
          id:         s.id,
          name:       s.nama_lengkap || s.email,
          angkatan:   s.angkatan,
          bidang:     s.bidang ?? '',
          profesi:    simApMap[s.id]?.profesi ?? '',
          perusahaan: simApMap[s.id]?.perusahaan ?? '',
          domisili:   s.domisili ?? '',
          avatar:     null,
        }))

        if (!cancelled) {
          setAlumni(alumniObj)
          setDetail(detailObj)
          setAngkatanInfo(angkInfo)
          setAngkatanList(fetchedAngkatan)
          setAlumniSerupa(simAlumni)
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProfile()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="w-8 h-8 border-4 border-[#1A5C38] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!alumni || !detail) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Alumni tidak ditemukan.</p>
            <Link to="/direktori" className="text-[#1A5C38] font-semibold hover:underline">
              Kembali ke Direktori
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      <div className="pt-16">
        {/* Banner */}
        <div
          className="h-28 relative"
          style={{ background: 'linear-gradient(135deg, #E8F5EE 0%, #F0FFF4 50%, #F8FAF9 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-start pt-3 justify-end">
            <span className="flex items-center gap-1.5 text-xs text-[#1A5C38] font-medium">
              <Shield className="w-3.5 h-3.5" />
              Profil Hanya Terlihat untuk Alumni Terdaftar
            </span>
          </div>
        </div>

        {/* Profile header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
            <div className="flex flex-col sm:flex-row gap-5 -mt-14">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <AlumniAvatar alumni={alumni} size="lg" />
              </div>

              {/* Info */}
              <div className="flex-1 pt-2 sm:pt-16 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-bold text-[#0A2415] leading-tight">
                        {alumni.name}
                      </h1>
                      {alumni.isVerified && (
                        <span className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A5C38] text-xs font-bold px-2.5 py-1 rounded-full border border-[#1A5C38]/20">
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Terverifikasi
                        </span>
                      )}
                    </div>
                    <p className="text-[#1A5C38] font-semibold text-sm mt-0.5">
                      {alumni.profesi} at {alumni.perusahaan}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        {angkatanInfo?.logo ? (
                          <img
                            src={angkatanInfo.logo}
                            alt={angkatanInfo.nama}
                            className="w-5 h-5 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <GraduationCap className="w-3.5 h-3.5 text-[#F0A500] flex-shrink-0" />
                        )}
                        {angkatanInfo
                          ? `Angkatan ${angkatanInfo.angkatanKe} · ${angkatanInfo.tahunLulusan} (${angkatanInfo.nama})`
                          : `Angkatan ${alumni.angkatan}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {alumni.domisili}, Indonesia
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 border border-[#1A5C38] text-[#1A5C38] hover:bg-[#E8F5EE] text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Hubungi
                    </button>
                    <button className="flex items-center gap-1.5 bg-[#1A5C38] hover:bg-[#0A2415] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                      <UserPlus className="w-4 h-4" />
                      Minta Koneksi
                    </button>
                    <button className="w-9 h-9 border border-gray-200 hover:border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 mt-2 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#1A5C38] text-[#1A5C38]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid lg:grid-cols-[1fr_300px] gap-7 items-start">

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* RINGKASAN */}
              {activeTab === 'ringkasan' && (
                <div className="space-y-5">
                  {/* Tentang Saya */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="flex items-center gap-2 font-bold text-[#0A2415] mb-4">
                      <span className="w-1 h-5 bg-[#F0A500] rounded-full" />
                      Tentang Saya
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{detail.bio}</p>

                    <div className="grid sm:grid-cols-2 gap-6 mt-6">
                      {/* Keahlian Utama */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                          Keahlian Utama
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {alumni.keahlian.map((k) => (
                            <span
                              key={k}
                              className="text-xs text-[#1A5C38] border border-[#1A5C38]/30 bg-[#E8F5EE] px-3 py-1 rounded-full"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bahasa */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                          Bahasa
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {detail.bahasa.map((b) => (
                            <span
                              key={b}
                              className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-full"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pengalaman ringkas */}
                  {detail.pengalaman.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="flex items-center gap-2 font-bold text-[#0A2415]">
                          <span className="w-1 h-5 bg-[#1A5C38] rounded-full" />
                          Pengalaman Terkini
                        </h2>
                        <button
                          onClick={() => setActiveTab('pengalaman')}
                          className="text-xs text-[#1A5C38] font-semibold hover:underline flex items-center gap-1"
                        >
                          Lihat semua
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {detail.pengalaman.slice(0, 1).map((p, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-10 h-10 bg-[#F8FAF9] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-5 h-5 text-[#1A5C38]" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-[#0A2415]">{p.jabatan}</p>
                              <p className="text-xs text-gray-500">{p.institusi} · {p.periode}</p>
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.deskripsi}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lembaga ringkas */}
                  {detail.lembaga?.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="flex items-center gap-2 font-bold text-[#0A2415]">
                          <span className="w-1 h-5 bg-[#F0A500] rounded-full" />
                          Lembaga & Badan Usaha
                        </h2>
                        <button
                          onClick={() => setActiveTab('lembaga')}
                          className="text-xs text-[#1A5C38] font-semibold hover:underline flex items-center gap-1"
                        >
                          Lihat semua
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {detail.lembaga.slice(0, 1).map((l, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#EFF6FF]">
                              <Building2 className="w-5 h-5 text-[#1D4ED8]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm text-[#0A2415]">{l.nama}</p>
                                {l.sebagai && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{l.sebagai}</span>}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{l.bidang}{l.lokasi ? ` · ${l.lokasi}` : ''}</p>
                              {l.openKerjasama && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 mt-1">
                                  <Handshake className="w-2.5 h-2.5" /> Terbuka untuk Kerjasama
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PENGALAMAN & PENDIDIKAN */}
              {activeTab === 'pengalaman' && (
                <div className="space-y-5">
                  {/* Pengalaman */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="flex items-center gap-2 font-bold text-[#0A2415] mb-5">
                      <Briefcase className="w-4 h-4 text-[#1A5C38]" />
                      Pengalaman Kerja
                    </h2>
                    <div className="space-y-6">
                      {detail.pengalaman.map((p, i) => (
                        <div key={i} className="flex gap-4 relative">
                          {i < detail.pengalaman.length - 1 && (
                            <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-100" />
                          )}
                          <div className="w-10 h-10 bg-[#E8F5EE] rounded-lg flex items-center justify-center flex-shrink-0 z-10">
                            <Briefcase className="w-5 h-5 text-[#1A5C38]" />
                          </div>
                          <div className="flex-1 pb-2">
                            <p className="font-bold text-sm text-[#0A2415]">{p.jabatan}</p>
                            <p className="text-xs text-[#1A5C38] font-medium mb-0.5">{p.institusi}</p>
                            <p className="text-xs text-gray-400 mb-2">{p.periode}</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{p.deskripsi}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pendidikan */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="flex items-center gap-2 font-bold text-[#0A2415] mb-5">
                      <BookOpen className="w-4 h-4 text-[#1A5C38]" />
                      Pendidikan
                    </h2>
                    <div className="space-y-5">
                      {/* Pondok Pesantren selalu muncul */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#FFF8E7] rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                          {angkatanInfo?.logo ? (
                            <img src={angkatanInfo.logo} alt={angkatanInfo.nama} className="w-full h-full object-cover" />
                          ) : (
                            <GraduationCap className="w-5 h-5 text-[#F0A500]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#0A2415]">Santri – Program Tahfidz & Mu'allimin</p>
                          <p className="text-xs text-[#F0A500] font-medium">Pondok Pesantren Daarul Mughni</p>
                          <p className="text-xs text-gray-400">
                            {angkatanInfo
                              ? `Angkatan ${angkatanInfo.angkatanKe} · ${angkatanInfo.tahunLulusan} · ${angkatanInfo.nama}`
                              : `Angkatan ${alumni.angkatan}`}
                          </p>
                        </div>
                      </div>

                      {detail.pendidikan.map((p, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-10 h-10 bg-[#F8FAF9] rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#0A2415]">{p.gelar}</p>
                            <p className="text-xs text-gray-500">{p.institusi}</p>
                            <p className="text-xs text-gray-400">{p.tahun}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* LEMBAGA & USAHA */}
              {activeTab === 'lembaga' && (
                <div className="space-y-5">
                  {detail.lembaga?.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h2 className="flex items-center gap-2 font-bold text-[#0A2415] mb-5">
                        <Building2 className="w-4 h-4 text-[#1A5C38]" />
                        Lembaga & Badan Usaha
                      </h2>
                      <div className="space-y-5">
                        {detail.lembaga.map((l, i) => {
                          const iconMap = {
                            'Perusahaan (PT/CV/UD)': { icon: Building2, color: '#1D4ED8', bg: '#EFF6FF' },
                            'Pesantren / Lembaga Pendidikan': { icon: BookOpen, color: '#1A5C38', bg: '#F0FDF4' },
                            'Yayasan / Lembaga Sosial': { icon: Heart, color: '#DB2777', bg: '#FDF2F8' },
                            'Toko / UMKM': { icon: ShoppingBag, color: '#D97706', bg: '#FFFBEB' },
                            'Koperasi': { icon: Users, color: '#0E7490', bg: '#ECFEFF' },
                            'Lainnya': { icon: Layers, color: '#6B7280', bg: '#F9FAFB' },
                          }
                          const cfg = iconMap[l.jenis] ?? iconMap['Lainnya']
                          const Icon = cfg.icon
                          return (
                            <div key={i} className={`flex gap-4 ${i > 0 ? 'pt-5 border-t border-gray-100' : ''}`}>
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
                                <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-bold text-sm text-[#0A2415]">{l.nama}</p>
                                  {l.openKerjasama && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                      <Handshake className="w-2.5 h-2.5" /> Buka Kerjasama
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <p className="text-xs font-semibold" style={{ color: cfg.color }}>{l.jenis}</p>
                                  {l.sebagai && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{l.sebagai}</span>}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                                  {l.bidang && <span>{l.bidang}</span>}
                                  {l.lokasi && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.lokasi}</span>}
                                  {l.tahun && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Est. {l.tahun}</span>}
                                </div>
                                {l.deskripsi && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{l.deskripsi}</p>}
                                {l.website && (
                                  <a href={`https://${l.website}`} target="_blank" rel="noreferrer"
                                    className="text-[11px] text-[#1A5C38] font-semibold flex items-center gap-1 mt-1 hover:underline">
                                    <Globe className="w-3 h-3" />{l.website}
                                  </a>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                      <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                      <p className="text-sm font-medium text-gray-400">Belum ada data lembaga atau badan usaha.</p>
                    </div>
                  )}
                </div>
              )}

              {/* AKTIVITAS */}
              {activeTab === 'aktivitas' && (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                  <Activity className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm font-medium text-gray-400">Belum ada aktivitas yang ditampilkan.</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Fitur ini akan tersedia setelah alumni bergabung dan aktif di portal.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Right sidebar */}
            <div className="space-y-5">

              {/* Kontak & Sosial */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#0A2415] text-sm">Kontak & Sosial</h3>
                  <span className="text-[10px] text-gray-400 font-medium">Privat</span>
                </div>

                <div className="space-y-0 divide-y divide-gray-50">
                  {/* Email */}
                  <div className="flex items-center gap-3 py-3">
                    <IconEmail size={16} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Utama</p>
                      <p className="text-xs text-gray-700 truncate">{detail.kontak.email}</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center gap-3 py-3">
                    <IconWhatsApp size={16} />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
                      <p className="text-xs text-gray-400 tracking-widest">••••••••••••</p>
                    </div>
                    <Shield className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </div>

                  {/* LinkedIn */}
                  {detail.kontak.linkedin && (
                    <a href={`https://${detail.kontak.linkedin}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 py-3 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors">
                      <IconLinkedIn size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LinkedIn</p>
                        <p className="text-xs text-gray-700 truncate">{detail.kontak.linkedin}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    </a>
                  )}

                  {/* Website */}
                  {detail.kontak.website && (
                    <a href={`https://${detail.kontak.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 py-3 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors">
                      <IconWebsite size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Website</p>
                        <p className="text-xs text-gray-700 truncate">{detail.kontak.website}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    </a>
                  )}

                  {/* Sosial Media */}
                  {[
                    { key: 'instagram', label: 'Instagram',  prefix: '@', Icon: IconInstagram, href: h => `https://instagram.com/${h.replace('@','')}` },
                    { key: 'youtube',   label: 'YouTube',    prefix: '',  Icon: IconYouTube,   href: h => h.startsWith('http') ? h : `https://youtube.com/${h}` },
                    { key: 'twitter',   label: 'Twitter / X', prefix: '@', Icon: IconTwitterX, href: h => `https://x.com/${h.replace('@','')}` },
                    { key: 'facebook',  label: 'Facebook',   prefix: '',  Icon: IconFacebook,  href: h => h.startsWith('http') ? h : `https://facebook.com/${h}` },
                  ].filter(s => detail.kontak[s.key]).map(({ key, label, prefix, Icon, href }) => (
                    <a key={key} href={href(detail.kontak[key])} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 py-3 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors">
                      <Icon size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                        <p className="text-xs text-gray-700 truncate">{prefix}{detail.kontak[key]}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    </a>
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 mt-3 leading-relaxed border-t border-gray-50 pt-3">
                  Kontak yang dikunci hanya dapat dilihat setelah permintaan koneksi disetujui.
                </p>
              </div>

              {/* Dokumen */}
              {detail.dokumen.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-bold text-[#0A2415] text-sm mb-4">Dokumen & Lampiran</h3>
                  <div className="space-y-2">
                    {detail.dokumen.map((doc) => (
                      <div
                        key={doc.nama}
                        className="flex items-center gap-3 p-3 bg-[#F8FAF9] rounded-lg hover:bg-[#E8F5EE] transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-red-500">{doc.tipe}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#0A2415] truncate">{doc.nama}</p>
                          <p className="text-[10px] text-gray-400">{doc.tipe} · {doc.ukuran}</p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-[#1A5C38] transition-colors flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alumni Serupa */}
              {alumniSerupa.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-bold text-[#0A2415] text-sm mb-1">Alumni Serupa</h3>
                  <p className="text-[11px] text-gray-400 mb-4">Berdasarkan angkatan atau industri</p>
                  <div className="space-y-3">
                    {alumniSerupa.map((a) => (
                      <Link
                        key={a.id}
                        to={`/direktori/${a.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <SmallAlumniAvatar alumni={a} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#0A2415] group-hover:text-[#1A5C38] transition-colors truncate">
                            {a.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {(() => {
                              const ag = angkatanList.find(x => x.tahunLulusan === a.angkatan)
                              return ag ? `Angkatan ${ag.angkatanKe} · ${ag.tahunLulusan} · ${ag.nama}` : `Angkatan ${a.angkatan}`
                            })()}
                          </p>
                          <p className="text-[10px] text-[#1A5C38] truncate">
                            {a.profesi} at {a.perusahaan}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/direktori"
                    className="flex items-center gap-1 text-xs text-[#1A5C38] font-semibold mt-4 hover:underline"
                  >
                    Lihat Direktori Selengkapnya
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Donasi Wakaf */}
              <div
                className="rounded-xl p-5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0A2415 0%, #1A5C38 100%)' }}
              >
                <Heart className="w-6 h-6 text-[#F0A500] mb-2" />
                <h3 className="font-bold text-white text-sm mb-1">Donasi Wakaf</h3>
                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  Kontribusi alumni untuk pembangunan asrama baru santri Daarul Mughni 2.
                </p>
                <button className="w-full bg-white hover:bg-gray-100 text-[#0A2415] font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                  Donasi Sekarang
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
