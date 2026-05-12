import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, MapPin, Briefcase, GraduationCap, BadgeCheck,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  SlidersHorizontal, X,
} from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import {
  alumniData, angkatanList, wilayahList, bidangList,
  TOTAL_ALUMNI, TOTAL_VERIFIED, getAvatarColor, getInitials,
} from '@/data/alumni'
import { fadeUp, stagger } from '@/lib/animations'

const ITEMS_PER_PAGE = 9

const sortOptions = [
  { value: 'verified', label: 'Terverifikasi Dulu' },
  { value: 'terbaru', label: 'Angkatan Terbaru' },
  { value: 'terlama', label: 'Angkatan Terlama' },
  { value: 'nama-az', label: 'Nama A-Z' },
]

function FilterSection({ title, expanded, onToggle, children }) {
  return (
    <div className="border-t border-gray-100 pt-4">
      <button
        className="w-full flex items-center justify-between mb-3"
        onClick={onToggle}
      >
        <span className="text-sm font-semibold text-[#0A2415]">{title}</span>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />
        }
      </button>
      {expanded && <div className="space-y-2.5 mb-1">{children}</div>}
    </div>
  )
}

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 accent-[#1A5C38] cursor-pointer"
      />
      <span className="text-sm text-gray-600 group-hover:text-[#0A2415] transition-colors leading-snug">
        {label}
      </span>
    </label>
  )
}

export default function AlumniDirectoryPage() {
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch] = useState('')
  const [selectedAngkatan, setSelectedAngkatan] = useState([])
  const [selectedWilayah, setSelectedWilayah] = useState([])
  const [selectedBidang, setSelectedBidang] = useState([])
  const [sort, setSort] = useState('verified')
  const [page, setPage] = useState(1)
  const [expandAngkatan, setExpandAngkatan] = useState(true)
  const [expandWilayah, setExpandWilayah] = useState(true)
  const [expandBidang, setExpandBidang] = useState(false)
  const [showAllAngkatan, setShowAllAngkatan] = useState(false)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const shownAngkatan = showAllAngkatan ? angkatanList : angkatanList.slice(0, 4)

  function triggerSearch() {
    setSearch(inputValue)
    setPage(1)
  }

  function toggleAngkatan(year) {
    setSelectedAngkatan((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    )
    setPage(1)
  }

  function toggleWilayah(val) {
    setSelectedWilayah((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    )
    setPage(1)
  }

  function toggleBidang(val) {
    setSelectedBidang((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    )
    setPage(1)
  }

  function resetFilters() {
    setSelectedAngkatan([])
    setSelectedWilayah([])
    setSelectedBidang([])
    setSearch('')
    setInputValue('')
    setPage(1)
  }

  const activeFilterCount =
    selectedAngkatan.length + selectedWilayah.length + selectedBidang.length

  const filtered = useMemo(() => {
    let result = alumniData

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.profesi.toLowerCase().includes(q) ||
          a.perusahaan.toLowerCase().includes(q) ||
          a.keahlian.some((k) => k.toLowerCase().includes(q))
      )
    }

    if (selectedAngkatan.length > 0) {
      result = result.filter((a) => selectedAngkatan.includes(a.angkatan))
    }

    if (selectedWilayah.length > 0) {
      result = result.filter((a) => selectedWilayah.includes(a.wilayah))
    }

    if (selectedBidang.length > 0) {
      result = result.filter((a) => selectedBidang.includes(a.bidang))
    }

    if (sort === 'nama-az') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'id'))
    } else if (sort === 'terbaru') {
      result = [...result].sort((a, b) => b.angkatan - a.angkatan)
    } else if (sort === 'terlama') {
      result = [...result].sort((a, b) => a.angkatan - b.angkatan)
    } else if (sort === 'verified') {
      result = [...result].sort((a, b) => Number(b.isVerified) - Number(a.isVerified))
    }

    return result
  }, [search, selectedAngkatan, selectedWilayah, selectedBidang, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const resultLabel = search ? `"${search}"` : '"Alumni Terdaftar"'

  const filterContent = (
    <div className="space-y-0">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1A5C38]" />
          <span className="font-bold text-[#0A2415] text-sm">Filter Data</span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#F0A500] font-semibold hover:text-[#D4920A] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <FilterSection
        title="Angkatan (Marhalah)"
        expanded={expandAngkatan}
        onToggle={() => setExpandAngkatan((v) => !v)}
      >
        {shownAngkatan.map(({ year, angkatanKe }) => (
          <FilterCheckbox
            key={year}
            label={
              <span>
                {year}{' '}
                <span className="text-gray-400 text-xs">(Angkatan ke-{angkatanKe})</span>
              </span>
            }
            checked={selectedAngkatan.includes(year)}
            onChange={() => toggleAngkatan(year)}
          />
        ))}
        {!showAllAngkatan ? (
          <button
            onClick={() => setShowAllAngkatan(true)}
            className="text-xs text-[#F0A500] font-semibold hover:text-[#D4920A] transition-colors mt-1"
          >
            Tampilkan Lebih Banyak...
          </button>
        ) : (
          <button
            onClick={() => setShowAllAngkatan(false)}
            className="text-xs text-[#F0A500] font-semibold hover:text-[#D4920A] transition-colors mt-1"
          >
            Tampilkan Lebih Sedikit
          </button>
        )}
      </FilterSection>

      <FilterSection
        title="Wilayah Domisili"
        expanded={expandWilayah}
        onToggle={() => setExpandWilayah((v) => !v)}
      >
        {wilayahList.map(({ value, label }) => (
          <FilterCheckbox
            key={value}
            label={label}
            checked={selectedWilayah.includes(value)}
            onChange={() => toggleWilayah(value)}
          />
        ))}
      </FilterSection>

      <FilterSection
        title="Bidang Pekerjaan"
        expanded={expandBidang}
        onToggle={() => setExpandBidang((v) => !v)}
      >
        {bidangList.map(({ value, label }) => (
          <FilterCheckbox
            key={value}
            label={label}
            checked={selectedBidang.includes(value)}
            onChange={() => toggleBidang(value)}
          />
        ))}
      </FilterSection>

      <div className="border-t border-gray-100 pt-4 mt-1">
        <div className="bg-[#E8F5EE] border border-[#1A5C38]/20 rounded-xl p-4">
          <p className="text-xs text-[#1A5C38] leading-relaxed">
            <span className="font-bold">Tips:</span> Gunakan filter angkatan untuk
            menemukan teman sekelas Anda dengan lebih cepat.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      <Navbar />

      {/* Hero */}
      <div
        className="pt-16"
        style={{ background: 'linear-gradient(135deg, #061410 0%, #0A2415 50%, #1A5C38 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link to="/" className="hover:text-white/80 transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-white/80">Direktori Alumni</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                Direktori Alumni
              </h1>
              <p className="text-white/60 text-sm max-w-md leading-relaxed">
                Cari dan terhubung kembali dengan rekan marhalah dari seluruh angkatan
                Pondok Pesantren Daarul Mughni.
              </p>
            </div>

            <div className="flex gap-3 flex-shrink-0">
              <div className="text-center bg-[#F0A500]/10 border border-[#F0A500]/30 rounded-xl px-5 py-3 min-w-[100px]">
                <div className="text-2xl font-bold text-[#F0A500]">
                  {TOTAL_ALUMNI.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-white/60 uppercase tracking-widest mt-0.5">
                  Total Alumni
                </div>
              </div>
              <div className="text-center bg-[#1A5C38]/30 border border-[#2A7A4F]/40 rounded-xl px-5 py-3 min-w-[100px]">
                <div className="text-2xl font-bold text-[#4ADE80]">
                  {TOTAL_VERIFIED.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-white/60 uppercase tracking-widest mt-0.5">
                  Terverifikasi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setSearch(e.target.value)
                  setPage(1)
                }}
                onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
                placeholder="Cari berdasarkan nama, profesi, atau perusahaan..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A5C38] focus:ring-2 focus:ring-[#1A5C38]/10 transition-all"
              />
            </div>
            <button
              onClick={triggerSearch}
              className="bg-[#F0A500] hover:bg-[#D4920A] text-[#0A2415] font-bold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap flex-shrink-0"
            >
              Cari Sekarang
            </button>
            <button
              onClick={() => setShowMobileFilter((v) => !v)}
              className="lg:hidden relative flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-3 rounded-xl text-sm hover:border-[#1A5C38] hover:text-[#1A5C38] transition-colors flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1A5C38] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilter && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[#0A2415] text-sm">Filter Alumni</span>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block bg-white rounded-xl border border-gray-100 p-5 sticky top-36">
            {filterContent}
          </aside>

          {/* Content */}
          <div>
            {/* Result header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <p className="text-sm text-gray-600">
                Menampilkan{' '}
                <span className="font-bold text-[#0A2415]">{filtered.length}</span> hasil
                untuk{' '}
                <span className="text-[#1A5C38] font-medium">{resultLabel}</span>
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm text-gray-500">Urutkan:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value)
                    setPage(1)
                  }}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1A5C38] bg-white text-[#0A2415]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedAngkatan.map((y) => (
                  <span
                    key={y}
                    className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A5C38] text-xs font-medium px-3 py-1 rounded-full border border-[#1A5C38]/20"
                  >
                    {y}
                    <button onClick={() => toggleAngkatan(y)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                ))}
                {selectedWilayah.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A5C38] text-xs font-medium px-3 py-1 rounded-full border border-[#1A5C38]/20"
                  >
                    {wilayahList.find((w) => w.value === v)?.label}
                    <button onClick={() => toggleWilayah(v)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                ))}
                {selectedBidang.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 bg-[#E8F5EE] text-[#1A5C38] text-xs font-medium px-3 py-1 rounded-full border border-[#1A5C38]/20"
                  >
                    {bidangList.find((b) => b.value === v)?.label}
                    <button onClick={() => toggleBidang(v)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                >
                  Hapus semua
                </button>
              </div>
            )}

            {/* Grid */}
            {paged.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-25" />
                <p className="text-base font-medium mb-1 text-gray-500">
                  Tidak ada alumni ditemukan
                </p>
                <p className="text-sm">Coba ubah filter atau kata kunci pencarian.</p>
              </div>
            ) : (
              <motion.div
                key={`${search}-${selectedAngkatan.join()}-${selectedWilayah.join()}-${selectedBidang.join()}-${sort}-${page}`}
                initial="hidden"
                animate="show"
                variants={stagger}
                className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {paged.map((alumni) => (
                  <Link key={alumni.id} to={`/direktori/${alumni.id}`}>
                  <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative flex-shrink-0">
                        {alumni.avatar ? (
                          <img
                            src={alumni.avatar}
                            alt={alumni.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className="w-14 h-14 rounded-full items-center justify-center text-white font-bold text-base select-none"
                          style={{
                            backgroundColor: getAvatarColor(alumni.name),
                            display: alumni.avatar ? 'none' : 'flex',
                          }}
                        >
                          {getInitials(alumni.name)}
                        </div>
                      </div>
                      {alumni.isVerified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#1A5C38] bg-[#E8F5EE] px-2.5 py-1 rounded-full border border-[#1A5C38]/15">
                          <BadgeCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-[#0A2415] text-sm mb-1.5 leading-snug">
                      {alumni.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#F0A500] font-semibold mb-2">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Angkatan {alumni.angkatan}
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-gray-600 mb-1.5">
                      <Briefcase className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
                      <span className="line-clamp-1">
                        {alumni.profesi} at {alumni.perusahaan}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      <span>{alumni.domisili}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {alumni.keahlian.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-[#F8FAF9] text-gray-600 px-2.5 py-1 rounded-full border border-gray-100"
                        >
                          {tag}
                        </span>
                      ))}
                      {alumni.keahlian.length > 2 && (
                        <span className="text-[10px] text-gray-400 py-1">
                          +{alumni.keahlian.length - 2} lainnya
                        </span>
                      )}
                    </div>
                  </motion.div>
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? 'bg-[#0A2415] text-white'
                        : 'border border-gray-200 text-gray-600 hover:border-[#1A5C38] hover:text-[#1A5C38]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
