import { useState, useMemo } from 'react'
import {
  Search, Download, ChevronDown, X, BadgeCheck,
  GraduationCap, Briefcase, BookOpen, Mail, Globe,
  Link2, Filter, Eye,
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { PaginationBar, PerPageSelector } from '@/components/PaginationBar'
import { alumniData, getAvatarColor, getInitials, bidangList } from '@/data/alumni'
import { getAlumniDetail } from '@/data/alumniDetail'
import { initialAngkatan } from '@/data/angkatan'

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeCSV(val) {
  if (val == null) return ''
  const s = String(val).replace(/"/g, '""')
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s
}

function exportCSV(rows) {
  const headers = [
    'Nama', 'Tahun Lulus', 'Angkatan Ke', 'Nama Angkatan',
    'Bidang', 'Profesi', 'Perusahaan', 'Domisili',
    'Keahlian', 'Bahasa', 'Email Kontak', 'LinkedIn', 'Website',
    'Pengalaman Terbaru', 'Institusi Pengalaman', 'Periode Pengalaman',
    'Pendidikan Terakhir', 'Institusi Pendidikan', 'Tahun Pendidikan',
    'Status Verifikasi',
  ]

  const csvRows = rows.map(({ alumni, detail, angkatanInfo }) => {
    const pengExp = detail?.pengalaman?.[0]
    const pengPend = detail?.pendidikan?.[0]
    return [
      alumni.name,
      alumni.angkatan,
      angkatanInfo?.angkatanKe ?? '',
      angkatanInfo?.nama ?? '',
      alumni.bidang,
      alumni.profesi,
      alumni.perusahaan,
      alumni.domisili,
      (alumni.keahlian ?? []).join('; '),
      (detail?.bahasa ?? []).join('; '),
      detail?.kontak?.email ?? '',
      detail?.kontak?.linkedin ?? '',
      detail?.kontak?.website ?? '',
      pengExp?.jabatan ?? '',
      pengExp?.institusi ?? '',
      pengExp?.periode ?? '',
      pengPend?.gelar ?? '',
      pengPend?.institusi ?? '',
      pengPend?.tahun ?? '',
      alumni.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi',
    ].map(escapeCSV).join(',')
  })

  const blob = new Blob([[headers.join(','), ...csvRows].join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `data-alumni-daarul-mughni-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function AlumniAvatar({ alumni, size = 9 }) {
  const cls = `w-${size} h-${size} rounded-full flex-shrink-0`
  if (alumni.avatar) {
    return <img src={alumni.avatar} alt={alumni.name} className={`${cls} object-cover bg-gray-100`} />
  }
  return (
    <div className={`${cls} flex items-center justify-center text-white text-xs font-bold`}
      style={{ backgroundColor: getAvatarColor(alumni.name) }}>
      {getInitials(alumni.name)}
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
                {alumni.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-[#1A5C38]" />
                )}
              </div>
              <p className="text-xs text-gray-500">{alumni.profesi} · {alumni.perusahaan}</p>
              <p className="text-[11px] text-[#1A5C38] font-medium mt-0.5">
                {angkatanInfo
                  ? `Angkatan ${angkatanInfo.angkatanKe} · ${angkatanInfo.tahunLulusan} · ${angkatanInfo.nama}`
                  : `Angkatan ${alumni.angkatan}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {[
            { key: 'ringkasan', label: 'Ringkasan' },
            { key: 'pengalaman', label: 'Pengalaman' },
            { key: 'pendidikan', label: 'Pendidikan' },
            { key: 'kontak', label: 'Kontak' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                tab === t.key ? 'border-[#1A5C38] text-[#1A5C38]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {tab === 'ringkasan' && (
            <>
              {/* Bio */}
              {detail?.bio && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Bio</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{detail.bio}</p>
                </div>
              )}
              {/* Keahlian */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Keahlian</p>
                <div className="flex flex-wrap gap-2">
                  {alumni.keahlian.map(k => (
                    <span key={k} className="text-xs text-[#1A5C38] border border-[#1A5C38]/30 bg-[#E8F5EE] px-3 py-1 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
              {/* Bahasa */}
              {detail?.bahasa?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Bahasa</p>
                  <div className="flex flex-wrap gap-2">
                    {detail.bahasa.map(b => (
                      <span key={b} className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-full">{b}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Domisili */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Domisili</p>
                <p className="text-sm text-gray-700">{alumni.domisili}</p>
              </div>
            </>
          )}

          {tab === 'pengalaman' && (
            <div className="space-y-5">
              {detail?.pengalaman?.length > 0 ? detail.pengalaman.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 bg-[#F8FAF9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-[#1A5C38]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0A2415]">{p.jabatan}</p>
                    <p className="text-xs text-[#1A5C38] font-medium">{p.institusi}</p>
                    <p className="text-xs text-gray-400">{p.periode}</p>
                    {p.deskripsi && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{p.deskripsi}</p>}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-8">Belum ada data pengalaman.</p>
              )}
            </div>
          )}

          {tab === 'pendidikan' && (
            <div className="space-y-5">
              {/* Pesantren selalu ditampilkan */}
              <div className="flex gap-4">
                <div className="w-9 h-9 overflow-hidden rounded-lg flex-shrink-0">
                  {angkatanInfo?.logo ? (
                    <img src={angkatanInfo.logo} alt={angkatanInfo.nama} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#FFF8E7] flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-[#F0A500]" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#0A2415]">Santri – Program Tahfidz & Mu'allimin</p>
                  <p className="text-xs text-[#F0A500] font-medium">Pondok Pesantren Daarul Mughni</p>
                  <p className="text-xs text-gray-400">
                    {angkatanInfo
                      ? `${angkatanInfo.tahunLulusan} · ${angkatanInfo.nama}`
                      : alumni.angkatan}
                  </p>
                </div>
              </div>
              {detail?.pendidikan?.map((p, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 bg-[#F8FAF9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#0A2415]">{p.gelar}</p>
                    <p className="text-xs text-gray-500">{p.institusi}</p>
                    <p className="text-xs text-gray-400">{p.tahun}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'kontak' && (
            <div className="space-y-3">
              {detail?.kontak?.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-4 h-4 text-[#1A5C38]" />
                  <span className="text-sm text-gray-700">{detail.kontak.email}</span>
                </div>
              )}
              {detail?.kontak?.linkedin && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Link2 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">{detail.kontak.linkedin}</span>
                </div>
              )}
              {detail?.kontak?.website && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{detail.kontak.website}</span>
                </div>
              )}
              {!detail?.kontak?.email && !detail?.kontak?.linkedin && !detail?.kontak?.website && (
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
  const [search, setSearch] = useState('')
  const [filterBidang, setFilterBidang] = useState('')
  const [filterAngkatan, setFilterAngkatan] = useState('')
  const [filterVerifikasi, setFilterVerifikasi] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [detail, setDetail] = useState(null) // { alumni, detail, angkatanInfo }

  const enriched = useMemo(() => alumniData.map(a => ({
    alumni: a,
    detail: getAlumniDetail(a.id),
    angkatanInfo: initialAngkatan.find(x => x.tahunLulusan === a.angkatan) ?? null,
  })), [])

  const filtered = useMemo(() => enriched.filter(({ alumni }) => {
    const q = search.toLowerCase()
    const matchSearch = q === '' ||
      alumni.name.toLowerCase().includes(q) ||
      alumni.profesi.toLowerCase().includes(q) ||
      alumni.perusahaan.toLowerCase().includes(q) ||
      alumni.domisili.toLowerCase().includes(q) ||
      String(alumni.angkatan).includes(q)
    const matchBidang = filterBidang === '' || alumni.bidang === filterBidang
    const matchAngkatan = filterAngkatan === '' || String(alumni.angkatan) === filterAngkatan
    const matchVerif = filterVerifikasi === '' ||
      (filterVerifikasi === 'ya' && alumni.isVerified) ||
      (filterVerifikasi === 'tidak' && !alumni.isVerified)
    return matchSearch && matchBidang && matchAngkatan && matchVerif
  }), [enriched, search, filterBidang, filterAngkatan, filterVerifikasi])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const startIdx = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const endIdx = Math.min(page * perPage, filtered.length)

  function resetPage() { setPage(1) }

  const angkatanOptions = useMemo(() =>
    [...new Set(alumniData.map(a => a.angkatan))].sort((a, b) => a - b), [])

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      <AdminSidebar active="alumni-data" />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-[#0A2415]">Data Alumni</h1>
            <p className="text-xs text-gray-400 mt-0.5">Seluruh data biodata, pendidikan, dan pekerjaan alumni terdaftar</p>
          </div>
          <button
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: '#1A5C38' }}
          >
            <Download className="w-4 h-4" />
            Export CSV ({filtered.length})
          </button>
        </header>

        <div className="flex-1 p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Alumni', value: alumniData.length, color: '#1A5C38' },
              { label: 'Terverifikasi', value: alumniData.filter(a => a.isVerified).length, color: '#0E7490' },
              { label: 'Belum Verifikasi', value: alumniData.filter(a => !a.isVerified).length, color: '#D97706' },
              { label: 'Bidang Tersedia', value: bidangList.length, color: '#7C3AED' },
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
                    const ag = initialAngkatan.find(a => a.tahunLulusan === y)
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-10">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Alumni</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Angkatan</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Profesi & Perusahaan</th>
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
                        <p className="text-sm">Tidak ada alumni ditemukan</p>
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
                              {det?.kontak?.email && (
                                <p className="text-[11px] text-gray-400">{det.kontak.email}</p>
                              )}
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
                                {angkatanInfo ? `Angkatan ${angkatanInfo.angkatanKe}` : `Angkatan ${alumni.angkatan}`}
                              </p>
                              <p className="text-[10px] text-gray-400">{alumni.angkatan}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-[#0A2415] leading-snug">{alumni.profesi}</p>
                          <p className="text-xs text-gray-400">{alumni.perusahaan}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{bidangLabel}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-600">{alumni.domisili}</p>
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

            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 flex justify-center">
                <PaginationBar page={page} totalPages={totalPages} onPage={setPage} />
              </div>
            )}
          </div>
        </div>
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
