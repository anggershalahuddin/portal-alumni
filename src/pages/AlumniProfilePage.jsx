import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgeCheck, MapPin, GraduationCap, Mail, Phone, Globe,
  Link2, Download, Shield, MessageCircle, UserPlus,
  MoreHorizontal, Briefcase, BookOpen, Activity, ExternalLink,
  ChevronRight, Heart,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { alumniData, getAvatarColor, getInitials } from '@/data/alumni'
import { getAlumniDetail } from '@/data/alumniDetail'
import { initialAngkatan } from '@/data/angkatan'
import { fadeUp } from '@/lib/animations'

const TABS = [
  { key: 'ringkasan', label: 'Ringkasan', icon: Activity },
  { key: 'pengalaman', label: 'Pengalaman & Pendidikan', icon: BookOpen },
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

  const alumni = alumniData.find((a) => a.id === Number(id))
  const detail = alumni ? getAlumniDetail(alumni.id) : null
  const angkatanInfo = alumni ? initialAngkatan.find(a => a.tahunLulusan === alumni.angkatan) : null

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

  const alumniSerupa = alumniData
    .filter(
      (a) =>
        a.id !== alumni.id &&
        (a.angkatan === alumni.angkatan || a.bidang === alumni.bidang)
    )
    .slice(0, 3)

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
                    <Mail className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Utama</p>
                      <p className="text-xs text-gray-700 truncate">{detail.kontak.email}</p>
                    </div>
                    <Globe className="w-4 h-4 text-[#1A5C38] flex-shrink-0" />
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 py-3">
                    <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telepon</p>
                      <p className="text-xs text-gray-400 tracking-widest">••••••••••••</p>
                    </div>
                    <Shield className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </div>

                  {/* LinkedIn */}
                  {detail.kontak.linkedin && (
                    <div className="flex items-center gap-3 py-3">
                      <Link2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LinkedIn</p>
                        <p className="text-xs text-gray-700 truncate">{detail.kontak.linkedin}</p>
                      </div>
                      <Globe className="w-4 h-4 text-[#1A5C38] flex-shrink-0" />
                    </div>
                  )}

                  {/* Website */}
                  {detail.kontak.website && (
                    <div className="flex items-center gap-3 py-3">
                      <Globe className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Website</p>
                        <p className="text-xs text-gray-700 truncate">{detail.kontak.website}</p>
                      </div>
                      <Globe className="w-4 h-4 text-[#1A5C38] flex-shrink-0" />
                    </div>
                  )}
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
                              const ag = initialAngkatan.find(x => x.tahunLulusan === a.angkatan)
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
