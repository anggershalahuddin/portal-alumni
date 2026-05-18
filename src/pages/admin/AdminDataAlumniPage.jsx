import { useState, useMemo, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import {
  Search, ChevronDown, X, BadgeCheck,
  GraduationCap, Briefcase, BookOpen, Mail, Globe,
  Link2, Filter, Eye, FileSpreadsheet, Building2, Handshake,
  AlertCircle, Phone, MapPin, Calendar, Award, Loader2, RefreshCw,
} from 'lucide-react'

function IconInstagram({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig-grad-admin" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#ffd600" />
          <stop offset="20%" stopColor="#ff7a00" />
          <stop offset="45%" stopColor="#ff0069" />
          <stop offset="75%" stopColor="#d300c5" />
          <stop offset="100%" stopColor="#7638fa" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad-admin)" />
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
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { PaginationBar, PerPageSelector } from '@/components/PaginationBar'
import { getAvatarColor, getInitials, bidangList } from '@/data/alumni'
import { supabase } from '@/lib/supabase'

function mapAngkatan(row) {
  return { id: row.id, tahunLulusan: row.tahun_lulus, angkatanKe: row.tahun_lulus - 2005, nama: row.nama_angkatan ?? `Angkatan ${row.tahun_lulus - 2005}` }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function periodeStr(mulai, selesai, isCurrent) {
  if (!mulai && !selesai) return ''
  if (isCurrent) return `${mulai ?? '?'} – Sekarang`
  if (mulai && selesai) return `${mulai} – ${selesai}`
  return String(mulai ?? selesai)
}

function exportXLSX(rows) {
  const headers = [
    'Nama', 'Tahun Lulus', 'Angkatan Ke', 'Nama Angkatan',
    'Bidang', 'Profesi', 'Perusahaan', 'Domisili',
    'Keahlian', 'Bahasa',
    'No. HP', 'Email', 'LinkedIn', 'Instagram', 'Website',
    'Posisi Terbaru', 'Perusahaan Terbaru', 'Periode Pengalaman',
    'Jenjang Pendidikan Terakhir', 'Jurusan', 'Institusi Pendidikan', 'Tahun Pendidikan',
    'Sertifikasi Terbaru', 'Penerbit Sertifikasi',
    'Publikasi Terbaru', 'Jenis Publikasi',
    'Nama Lembaga', 'Jenis Lembaga', 'Sebagai di Lembaga', 'Buka Kerjasama',
    'Status Verifikasi',
  ]
  const data = rows.map(({ alumni, detail, angkatanInfo }) => {
    const exp0  = detail?.pengalaman?.[0]
    const pend0 = detail?.pendidikan?.[0]
    const sert0 = detail?.sertifikasi?.[0]
    const pub0  = detail?.publikasi?.[0]
    const lemb0 = detail?.lembaga?.[0]
    return [
      alumni.name, alumni.angkatan,
      angkatanInfo?.angkatanKe ?? '', angkatanInfo?.nama ?? '',
      alumni.bidang, alumni.profesi, alumni.perusahaan, alumni.domisili,
      (alumni.keahlian ?? []).join('; '),
      (detail?.bahasa ?? []).map(b => b.nama ?? b).join('; '),
      detail?.kontak?.noHp ?? '', detail?.kontak?.email ?? '',
      detail?.kontak?.linkedin ?? '', detail?.kontak?.instagram ?? '', detail?.kontak?.website ?? '',
      exp0?.posisi ?? '', exp0?.perusahaan ?? '',
      exp0 ? periodeStr(exp0.tahunMulai, exp0.tahunSelesai, exp0.isCurrent) : '',
      pend0?.jenjang ?? '', pend0?.jurusan ?? '', pend0?.institusi ?? '',
      pend0 ? periodeStr(pend0.tahunMulai, pend0.tahunSelesai, pend0.isCurrent) : '',
      sert0?.nama ?? '', sert0?.penerbit ?? '',
      pub0?.judul ?? '', pub0?.jenis ?? '',
      lemb0?.nama ?? '', lemb0?.jenis ?? '', lemb0?.sebagai ?? '',
      lemb0 ? (lemb0.openKerjasama ? 'Ya' : 'Tidak') : '',
      alumni.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi',
    ]
  })
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
  ws['!cols'] = headers.map((_, i) => ({ wch: i < 4 ? 22 : 18 }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data Alumni')
  XLSX.writeFile(wb, `data-alumni-daarul-mughni-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function AlumniAvatar({ alumni, size = 9 }) {
  const cls = `w-${size} h-${size} rounded-full flex-shrink-0`
  if (alumni.avatar) {
    return <img src={alumni.avatar} alt={alumni.name} className={`${cls} object-cover bg-gray-100`} />
  }
  const displayName = alumni.name !== '-' ? alumni.name : (alumni.email || '?')
  const initials = getInitials(displayName) || displayName.charAt(0).toUpperCase()
  return (
    <div className={`${cls} flex items-center justify-center text-white text-xs font-bold`}
      style={{ backgroundColor: getAvatarColor(displayName) }}>
      {initials}
    </div>
  )
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({ alumni, detail, angkatanInfo, onClose }) {
  const [tab, setTab] = useState('ringkasan')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(6,15,9,0.6)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <AlumniAvatar alumni={alumni} size={10} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-[#0A2415] text-base">{alumni.name}</h2>
                {alumni.isVerified && <BadgeCheck className="w-4 h-4 text-[#1A5C38]" />}
              </div>
              {alumni.email && <p className="text-xs text-gray-400">{alumni.email}</p>}
              {(alumni.profesi || alumni.perusahaan) && (
                <p className="text-xs text-gray-500">{[alumni.profesi, alumni.perusahaan].filter(Boolean).join(' · ')}</p>
              )}
              <p className="text-[11px] text-[#1A5C38] font-medium mt-0.5">
                {angkatanInfo
                  ? `${angkatanInfo.tahunLulusan} · Angkatan ke-${angkatanInfo.angkatanKe}${angkatanInfo.nama !== `Angkatan ${angkatanInfo.angkatanKe}` ? ` · ${angkatanInfo.nama}` : ''}`
                  : alumni.angkatan ? `Angkatan ${alumni.angkatan}` : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6 overflow-x-auto">
          {[
            { key: 'ringkasan',  label: 'Ringkasan' },
            { key: 'karir',      label: 'Karir' },
            { key: 'lembaga',    label: 'Lembaga' },
            { key: 'portofolio', label: 'Portofolio' },
            { key: 'kontak',     label: 'Kontak' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                tab === t.key ? 'border-[#1A5C38] text-[#1A5C38]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {tab === 'ringkasan' && (
            <>
              {detail?.bio && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Bio</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{detail.bio}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Keahlian</p>
                {alumni.keahlian?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {alumni.keahlian.map(k => (
                      <span key={k} className="text-xs text-[#1A5C38] border border-[#1A5C38]/30 bg-[#E8F5EE] px-3 py-1 rounded-full">{k}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Belum ada keahlian.</p>
                )}
              </div>
              {detail?.bahasa?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Bahasa</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.bahasa.map((b, i) => (
                      <span key={i} className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-full">{b}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Domisili</p>
                <p className="text-sm text-gray-700">{alumni.domisili || '-'}</p>
              </div>
            </>
          )}

          {tab === 'karir' && (
            <>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pengalaman Kerja</p>
                <div className="space-y-3">
                  {detail?.pengalaman?.length > 0 ? detail.pengalaman.map((p, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-[#E8F5EE] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-[#1A5C38]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-[#0A2415]">{p.posisi || '-'}</p>
                          {p.isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#1A5C38]">Saat ini</span>
                          )}
                        </div>
                        {p.perusahaan && <p className="text-xs text-[#1A5C38] font-medium mt-0.5">{p.perusahaan}</p>}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                          {p.bidang  && <p className="text-xs text-gray-500">{p.bidang}</p>}
                          {p.lokasi  && <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.lokasi}</p>}
                          {p.periode && <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{p.periode}</p>}
                        </div>
                        {p.deskripsi && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{p.deskripsi}</p>}
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 text-center py-4">Belum ada data pengalaman.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Riwayat Pendidikan</p>
                <div className="space-y-3">
                  {detail?.pendidikan?.length > 0 ? detail.pendidikan.map((p, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-[#FFF8E7] rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-[#F0A500]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#0A2415]">{[p.jenjang, p.jurusan].filter(Boolean).join(' – ')}</p>
                        {p.institusi && <p className="text-xs text-gray-500 font-medium mt-0.5">{p.institusi}</p>}
                        {p.periode   && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{p.periode}</p>}
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 text-center py-4">Belum ada data pendidikan.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 'lembaga' && (
            <div className="space-y-4">
              {detail?.lembaga?.length > 0 ? detail.lembaga.map((l, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-[#E8F5EE] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-[#1A5C38]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-[#0A2415]">{l.nama}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {l.sebagai && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0A2415]/10 text-[#0A2415]">{l.sebagai}</span>
                        )}
                        {l.openKerjasama && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                            <Handshake className="w-2.5 h-2.5" /> Buka Kerjasama
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[#1A5C38] font-medium mt-0.5">{l.jenis}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      {l.bidang && <p className="text-xs text-gray-500">{l.bidang}</p>}
                      {l.lokasi && <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{l.lokasi}</p>}
                      {l.tahun  && <p className="text-xs text-gray-400">Est. {l.tahun}</p>}
                    </div>
                    {l.deskripsi && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{l.deskripsi}</p>}
                    {l.website  && <p className="text-xs text-blue-500 mt-1">{l.website}</p>}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-8">Belum ada data lembaga / badan usaha.</p>
              )}
            </div>
          )}

          {tab === 'portofolio' && (
            <>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Sertifikasi</p>
                <div className="space-y-3">
                  {detail?.sertifikasi?.length > 0 ? detail.sertifikasi.map((s, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[#E8F5EE] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-[#1A5C38]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#0A2415]">{s.nama}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          {s.penerbit && <p className="text-xs text-[#1A5C38] font-medium">{s.penerbit}</p>}
                          {s.tahun   && <p className="text-xs text-gray-400">{s.tahun}</p>}
                          {s.noCert  && <p className="text-xs text-gray-400">No. {s.noCert}</p>}
                        </div>
                        {s.url && (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 mt-1 inline-block">Lihat Sertifikat →</a>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 text-center py-3">Belum ada sertifikasi.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Publikasi &amp; Karya</p>
                <div className="space-y-3">
                  {detail?.publikasi?.length > 0 ? detail.publikasi.map((pub, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[#F8FAF9] rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#0A2415]">{pub.judul}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          {pub.penerbit && <p className="text-xs text-gray-500">{pub.penerbit}</p>}
                          {pub.tahun   && <p className="text-xs text-gray-400">{pub.tahun}</p>}
                        </div>
                        {pub.deskripsi && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pub.deskripsi}</p>}
                        {pub.url && (
                          <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 mt-1 inline-block">Lihat Publikasi →</a>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 text-center py-3">Belum ada publikasi.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Berkas / Dokumen</p>
                <div className="space-y-2">
                  {detail?.berkas?.length > 0 ? detail.berkas.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[#F8FAF9] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Link2 className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[#0A2415] truncate">{b.nama}</p>
                        <div className="flex gap-2 mt-0.5">
                          {b.tipe   && <p className="text-[10px] text-gray-400 uppercase">{b.tipe}</p>}
                          {b.ukuran && <p className="text-[10px] text-gray-400">{b.ukuran}</p>}
                        </div>
                      </div>
                      {b.fileUrl && (
                        <a href={b.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex-shrink-0">Buka</a>
                      )}
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 text-center py-3">Belum ada berkas.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {tab === 'kontak' && (
            <div className="space-y-2">
              {[
                { key: 'noHp',      icon: <Phone className="w-4 h-4 text-[#1A5C38]" />, href: v => `tel:${v}` },
                { key: 'email',     icon: <Mail  className="w-4 h-4 text-gray-500"  />, href: v => `mailto:${v}` },
                { key: 'linkedin',  icon: <Link2 className="w-4 h-4 text-blue-600"  />, href: v => v },
                { key: 'instagram', icon: <IconInstagram size={16} />,                  href: v => v },
                { key: 'twitter',   icon: <IconTwitterX  size={16} />,                  href: v => v },
                { key: 'facebook',  icon: <IconFacebook  size={16} />,                  href: v => v },
                { key: 'youtube',   icon: <IconYouTube   size={16} />,                  href: v => v },
                { key: 'website',   icon: <Globe className="w-4 h-4 text-gray-500"  />, href: v => v },
              ]
                .filter(({ key }) => !!detail?.kontak?.[key])
                .map(({ key, icon, href }) => {
                  const val = detail.kontak[key]
                  return (
                    <a
                      key={key}
                      href={href(val)}
                      target={key !== 'noHp' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      {icon}
                      <span className="text-sm text-gray-700 truncate">{val}</span>
                    </a>
                  )
                })
              }
              {!Object.values(detail?.kontak ?? {}).some(Boolean) && (
                <p className="text-sm text-gray-400 text-center py-8">Belum ada data kontak.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminDataAlumniPage() {
  const [enriched, setEnriched]       = useState([])
  const [angkatanList, setAngkatanList] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [refreshing, setRefreshing]  = useState(false)
  const [loadError, setLoadError]     = useState(null)

  const [search, setSearch]               = useState('')
  const [filterBidang, setFilterBidang]   = useState('')
  const [filterAngkatan, setFilterAngkatan] = useState('')
  const [filterVerifikasi, setFilterVerifikasi] = useState('')
  const [page, setPage]     = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [detail, setDetail] = useState(null)

  /* ── Load all alumni data from Supabase ── */
  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setPageLoading(true)
    setLoadError(null)
    try {
      // Semua profiles dengan status disetujui — termasuk yang belum punya alumni_profiles
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, nama_lengkap, email, no_hp, angkatan, bidang, domisili, status, role, foto_url')
        .eq('status', 'disetujui')
        .order('created_at', { ascending: false })

      if (profErr) throw profErr
      if (!profiles?.length) { setEnriched([]); if (!silent) setPageLoading(false); return }

      const ids = profiles.map((p) => p.id)

      // Phase 1: alumni_profiles + angkatan (needed to get alumni_profiles.id for sub-table queries)
      const [apRes, angkatanRes] = await Promise.all([
        supabase.from('alumni_profiles').select('*').in('user_id', ids),
        supabase.from('angkatan').select('id, tahun_lulus, nama_angkatan').order('tahun_lulus'),
      ])

      const fetchedAngkatan = (angkatanRes.data ?? []).map(mapAngkatan)
      setAngkatanList(fetchedAngkatan)

      const apAll  = apRes.data ?? []
      // alumni_profiles.id (random UUID, different from profiles.id!) — used by all sub-tables
      const apIds  = apAll.map((ap) => ap.id)

      // Phase 2: sub-tables keyed by alumni_profiles.id
      const [keahlianRes, bahasaRes, pekerjaanRes, pendidikanRes, lembagaRes, sertifikasiRes, publikasiRes, berkasRes] =
        await Promise.all([
          apIds.length ? supabase.from('keahlian_alumni').select('*').in('alumni_id', apIds)  : Promise.resolve({ data: [] }),
          apIds.length ? supabase.from('bahasa_alumni').select('*').in('alumni_id', apIds)    : Promise.resolve({ data: [] }),
          apIds.length ? supabase.from('pekerjaan').select('*').in('alumni_id', apIds)        : Promise.resolve({ data: [] }),
          apIds.length ? supabase.from('pendidikan').select('*').in('alumni_id', apIds)       : Promise.resolve({ data: [] }),
          apIds.length ? supabase.from('lembaga_alumni').select('*').in('alumni_id', apIds)   : Promise.resolve({ data: [] }),
          apIds.length ? supabase.from('sertifikasi').select('*').in('alumni_id', apIds)      : Promise.resolve({ data: [] }),
          apIds.length ? supabase.from('publikasi').select('*').in('alumni_id', apIds)        : Promise.resolve({ data: [] }),
          apIds.length ? supabase.from('berkas_alumni').select('*').in('alumni_id', apIds)    : Promise.resolve({ data: [] }),
        ])

      const keahlianAll    = keahlianRes.data ?? []
      const bahasaAll      = bahasaRes.data ?? []
      const pekerjaanAll   = pekerjaanRes.data ?? []
      const pendidikanAll  = pendidikanRes.data ?? []
      const lembagaAll     = lembagaRes.data ?? []
      const sertifikasiAll = sertifikasiRes.data ?? []
      const publikasiAll   = publikasiRes.data ?? []
      const berkasAll      = berkasRes.data ?? []

      const enrichedData = profiles.map((p) => {
        const ap   = apAll.find((a) => a.user_id === p.id) ?? {}
        const apId = ap.id  // alumni_profiles.id — match key for sub-tables

        const alumni = {
          id:         p.id,
          name:       p.nama_lengkap || '-',
          email:      p.email ?? '',
          noHp:       p.no_hp ?? '',
          angkatan:   p.angkatan,
          bidang:     p.bidang ?? '',
          profesi:    ap.profesi ?? '',
          perusahaan: ap.perusahaan ?? '',
          domisili:   p.domisili ?? '',
          keahlian:   apId ? keahlianAll.filter((k) => k.alumni_id === apId).map((k) => k.nama) : [],
          isVerified: p.status === 'disetujui',
          avatar:     p.foto_url ?? null,
        }

        const detail = {
          bio:    ap.bio ?? '',
          bahasa: apId ? bahasaAll.filter((b) => b.alumni_id === apId).map((b) => b.nama) : [],
          kontak: {
            noHp:      p.no_hp ?? '',
            email:     p.email ?? '',
            linkedin:  ap.linkedin_url ?? '',
            instagram: ap.instagram_url ?? '',
            twitter:   ap.twitter_url ?? '',
            facebook:  ap.facebook_url ?? '',
            youtube:   ap.youtube_url ?? '',
            website:   ap.website_url ?? '',
          },
          pengalaman: apId ? pekerjaanAll
            .filter((pek) => pek.alumni_id === apId)
            .sort((a, b) => (b.is_current ? 1 : 0) - (a.is_current ? 1 : 0))
            .map((pek) => ({
              posisi:      pek.posisi ?? '',
              perusahaan:  pek.perusahaan ?? '',
              bidang:      pek.bidang ?? '',
              lokasi:      pek.lokasi ?? '',
              periode:     periodeStr(pek.tahun_mulai, pek.tahun_selesai, pek.is_current),
              deskripsi:   pek.deskripsi ?? '',
              isCurrent:   pek.is_current ?? false,
              tahunMulai:  pek.tahun_mulai ?? null,
              tahunSelesai: pek.tahun_selesai ?? null,
            })) : [],
          pendidikan: apId ? pendidikanAll
            .filter((pend) => pend.alumni_id === apId)
            .sort((a, b) => (b.tahun_selesai ?? 0) - (a.tahun_selesai ?? 0))
            .map((pend) => ({
              jenjang:     pend.jenjang ?? '',
              jurusan:     pend.jurusan ?? '',
              institusi:   pend.institusi ?? '',
              periode:     periodeStr(pend.tahun_mulai, pend.tahun_selesai, pend.is_current),
              tahunMulai:  pend.tahun_mulai ?? null,
              tahunSelesai: pend.tahun_selesai ?? null,
              isCurrent:   pend.is_current ?? false,
            })) : [],
          sertifikasi: apId ? sertifikasiAll
            .filter((s) => s.alumni_id === apId)
            .map((s) => ({
              nama:     s.nama ?? '',
              penerbit: s.penerbit ?? '',
              tahun:    s.tahun ?? '',
              noCert:   s.no_cert ?? '',
              url:      s.url ?? '',
            })) : [],
          publikasi: apId ? publikasiAll
            .filter((pub) => pub.alumni_id === apId)
            .map((pub) => ({
              judul:    pub.judul ?? '',
              penerbit: pub.penerbit ?? '',
              tahun:    pub.tahun ?? '',
              url:      pub.url ?? '',
              deskripsi: pub.deskripsi ?? '',
            })) : [],
          berkas: apId ? berkasAll
            .filter((b) => b.alumni_id === apId)
            .map((b) => ({
              nama:     b.nama ?? '',
              tipe:     b.tipe ?? b.kategori ?? 'FILE',
              ukuran:   b.ukuran ?? '',
              kategori: b.kategori ?? '',
              fileUrl:  b.file_url ?? '',
            })) : [],
          lembaga: apId ? lembagaAll
            .filter((l) => l.alumni_id === apId)
            .map((l) => ({
              nama:          l.nama ?? '',
              jenis:         l.jenis ?? '',
              sebagai:       l.sebagai ?? '',
              bidang:        l.bidang ?? '',
              lokasi:        l.lokasi ?? '',
              tahun:         l.tahun_berdiri ?? '',
              openKerjasama: l.open_kerjasama ?? false,
              deskripsi:     l.deskripsi ?? '',
              website:       l.website ?? '',
            })) : [],
        }

        const angkatanInfo = fetchedAngkatan.find((x) => x.tahunLulusan === p.angkatan) ?? null

        return { alumni, detail, angkatanInfo }
      })

      setEnriched(enrichedData)
    } catch (err) {
      console.error('Error loading alumni data:', err)
      setLoadError(err.message)
    } finally {
      if (!silent) setPageLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function refreshData() {
    setRefreshing(true)
    await loadData({ silent: true })
    setRefreshing(false)
  }

  /* ── Filters ── */
  const filtered = useMemo(() => enriched.filter(({ alumni }) => {
    const q = search.toLowerCase()
    const matchSearch = q === '' ||
      alumni.name.toLowerCase().includes(q) ||
      alumni.profesi.toLowerCase().includes(q) ||
      alumni.perusahaan.toLowerCase().includes(q) ||
      alumni.domisili.toLowerCase().includes(q) ||
      String(alumni.angkatan).includes(q)
    const matchBidang   = filterBidang === '' || alumni.bidang === filterBidang
    const matchAngkatan = filterAngkatan === '' || String(alumni.angkatan) === filterAngkatan
    const matchVerif    = filterVerifikasi === '' ||
      (filterVerifikasi === 'ya'    && alumni.isVerified) ||
      (filterVerifikasi === 'tidak' && !alumni.isVerified)
    return matchSearch && matchBidang && matchAngkatan && matchVerif
  }), [enriched, search, filterBidang, filterAngkatan, filterVerifikasi])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged      = filtered.slice((page - 1) * perPage, page * perPage)
  const startIdx   = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const endIdx     = Math.min(page * perPage, filtered.length)

  function resetPage() { setPage(1) }

  const angkatanOptions = useMemo(() =>
    [...new Set(enriched.map(({ alumni }) => alumni.angkatan).filter(Boolean))].sort((a, b) => a - b),
    [enriched])

  /* ── Loading screen ── */
  if (pageLoading) {
    return (
      <div className="flex min-h-screen bg-[#F8FAF9]">
        <AdminSidebar active="alumni-data" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      <AdminSidebar active="alumni-data" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader searchPlaceholder="Cari data alumni..." />

        <motion.div
          className="flex-1 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Sub-header with export */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Data Alumni</h1>
              <p className="text-xs text-gray-400 mt-0.5">Seluruh data biodata, pendidikan, dan pekerjaan alumni terdaftar</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refreshData} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh
              </button>
              <button
                onClick={() => exportXLSX(filtered)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: '#1A5C38' }}
              >
                <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel ({filtered.length})
              </button>
            </div>
          </div>

          {/* Error banner */}
          {loadError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {loadError}
              <button onClick={loadData} className="ml-auto underline text-xs">Coba lagi</button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Alumni',      value: enriched.length,                                     color: '#1A5C38' },
              { label: 'Terverifikasi',     value: enriched.filter(({ alumni }) => alumni.isVerified).length,  color: '#0E7490' },
              { label: 'Belum Verifikasi',  value: enriched.filter(({ alumni }) => !alumni.isVerified).length, color: '#D97706' },
              { label: 'Bidang Tersedia',   value: bidangList.length,                                   color: '#7C3AED' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 px-4 py-4">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-xl border border-gray-100 mb-4">
            <div className="px-4 py-3 flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text" value={search}
                  onChange={e => { setSearch(e.target.value); resetPage() }}
                  placeholder="Cari nama, profesi, perusahaan..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A5C38]"
                />
              </div>

              {/* Filter bidang */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select
                  value={filterBidang}
                  onChange={e => { setFilterBidang(e.target.value); resetPage() }}
                  className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A5C38] appearance-none bg-white"
                >
                  <option value="">Semua Bidang</option>
                  {bidangList.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter angkatan */}
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select
                  value={filterAngkatan}
                  onChange={e => { setFilterAngkatan(e.target.value); resetPage() }}
                  className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A5C38] appearance-none bg-white"
                >
                  <option value="">Semua Angkatan</option>
                  {angkatanOptions.map(y => {
                    const ag = angkatanList.find(a => a.tahunLulusan === y)
                    return <option key={y} value={y}>{y} {ag ? `(Angkatan ${ag.angkatanKe})` : ''}</option>
                  })}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter verifikasi */}
              <div className="relative">
                <select
                  value={filterVerifikasi}
                  onChange={e => { setFilterVerifikasi(e.target.value); resetPage() }}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A5C38] appearance-none bg-white pr-8"
                >
                  <option value="">Semua Status</option>
                  <option value="ya">Terverifikasi</option>
                  <option value="tidak">Belum Verifikasi</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              <div className="ml-auto flex items-center gap-3">
                <PerPageSelector value={perPage} options={[5, 10, 20, 50]} onChange={n => { setPerPage(n); resetPage() }} />
                <span className="text-xs text-gray-400">{startIdx}–{endIdx} dari {filtered.length}</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {refreshing ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-7 h-7 animate-spin text-[#1A5C38]" />
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-10">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Alumni</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Angkatan</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Profesi &amp; Perusahaan</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Bidang</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Domisili</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Verifikasi</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-gray-400">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">
                          {enriched.length === 0 ? 'Belum ada alumni terdaftar.' : 'Tidak ada alumni ditemukan.'}
                        </p>
                      </td>
                    </tr>
                  ) : paged.map(({ alumni, detail: det, angkatanInfo }, i) => {
                    const bidangLabel = bidangList.find(b => b.value === alumni.bidang)?.label ?? alumni.bidang
                    return (
                      <tr key={alumni.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {(page - 1) * perPage + i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <AlumniAvatar alumni={alumni} size={9} />
                            <div>
                              <p className="font-semibold text-[#0A2415] text-sm leading-snug">{alumni.name}</p>
                              {alumni.email && <p className="text-[11px] text-gray-400">{alumni.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {angkatanInfo?.logo && (
                              <img src={angkatanInfo.logo} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-xs font-bold text-[#1A5C38]">
                                {angkatanInfo ? `Angkatan ${angkatanInfo.angkatanKe}` : `Angkatan ${alumni.angkatan ?? '-'}`}
                              </p>
                              <p className="text-[10px] text-gray-400">{alumni.angkatan ?? '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-[#0A2415] leading-snug">{alumni.profesi || '-'}</p>
                          <p className="text-xs text-gray-400">{alumni.perusahaan}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                            {bidangLabel || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-600">{alumni.domisili || '-'}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {alumni.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#1A5C38]">
                              <BadgeCheck className="w-3 h-3" />
                              Terverifikasi
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setDetail({ alumni, detail: det, angkatanInfo })}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1A5C38] hover:bg-[#E8F5EE] transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            )}

            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 flex justify-center">
                <PaginationBar page={page} totalPages={totalPages} onPage={setPage} />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {detail && (
        <DetailModal
          alumni={detail.alumni}
          detail={detail.detail}
          angkatanInfo={detail.angkatanInfo}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  )
}
