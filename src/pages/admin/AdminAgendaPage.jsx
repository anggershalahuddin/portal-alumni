import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Download, MapPin, Calendar, Users, Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ImageUploadBox from '../../components/admin/ImageUploadBox'
import { PaginationBar, PerPageSelector } from '../../components/PaginationBar'

const STATUS_AGENDA = ['Akan Datang', 'Berlangsung', 'Selesai', 'Dibatalkan']

const STATUS_STYLE = {
  'Akan Datang': { bg: '#EFF6FF', text: '#1D4ED8' },
  'Berlangsung': { bg: '#F0FDF4', text: '#15803D' },
  'Selesai': { bg: '#F9FAFB', text: '#6B7280' },
  'Dibatalkan': { bg: '#FFF1F2', text: '#BE123C' },
}

const WARNA_OPSI = [
  '#F0A500', '#1A5C38', '#3B82F6', '#F97316',
  '#A855F7', '#EF4444', '#14B8A6', '#EC4899',
]

const initialTags = [
  { id: 'reuni',    label: 'Reuni & Silaturahmi', bg: '#F0A500', text: '#fff' },
  { id: 'edukasi',  label: 'Edukasi & Seminar',   bg: '#3B82F6', text: '#fff' },
  { id: 'dakwah',   label: 'Dakwah & Kajian',      bg: '#1A5C38', text: '#fff' },
  { id: 'sosial',   label: 'Bakti Sosial',          bg: '#F97316', text: '#fff' },
  { id: 'olahraga', label: 'Olahraga & Seni',       bg: '#A855F7', text: '#fff' },
]

const initialAgenda = [
  {
    id: 1,
    nama: 'Reuni Akbar 25 Tahun Daarul Mughni',
    tanggal: '15 Nov 2024',
    waktu: '08.00 WIB',
    lokasi: 'Aula Utama Pesantren',
    lokasiDetail: 'Jl. Pesantren No. 1, Sukabumi, Jawa Barat',
    mapsUrl: 'https://maps.google.com',
    kapasitas: 500,
    terdaftar: 342,
    status: 'Akan Datang',
    kategori: 'reuni',
    htm: 'Gratis',
    statusPendaftaran: 'Terbuka untuk Umum Alumni',
    hasSertifikat: true,
    pembicara: [
      { nama: 'KH. Ahmad Fauzi', peran: 'Pimpinan Pesantren' },
      { nama: 'Ustadz Hasan Basri', peran: 'Pembicara Utama' },
    ],
    deskripsi: 'Acara reuni akbar memperingati 25 tahun berdirinya Pondok Pesantren Daarul Mughni.',
    publishedBy: 'Sekretariat Alumni Pusat Daarul Mughni',
  },
  {
    id: 2,
    nama: 'Wisuda Santri 2024',
    tanggal: '20 Des 2024',
    waktu: '09.00 WIB',
    lokasi: 'Masjid Al-Falah',
    lokasiDetail: 'Masjid Al-Falah, Komplek Pesantren Daarul Mughni',
    mapsUrl: '',
    kapasitas: 300,
    terdaftar: 0,
    status: 'Akan Datang',
    kategori: 'edukasi',
    htm: 'Gratis',
    statusPendaftaran: 'Terbuka untuk Keluarga Santri',
    hasSertifikat: false,
    pembicara: [],
    deskripsi: 'Wisuda dan pelepasan santri kelas akhir tahun 2024.',
    publishedBy: 'Panitia Wisuda Daarul Mughni 2024',
  },
  {
    id: 3,
    nama: 'Seminar Nasional Alumni — Kewirausahaan Islam',
    tanggal: '05 Okt 2024',
    waktu: '13.00 WIB',
    lokasi: 'Zoom Webinar',
    lokasiDetail: '',
    mapsUrl: '',
    kapasitas: 1000,
    terdaftar: 847,
    status: 'Selesai',
    kategori: 'edukasi',
    htm: 'Rp 50.000,- (Infaq)',
    statusPendaftaran: 'Pendaftaran Ditutup',
    hasSertifikat: true,
    pembicara: [{ nama: 'Ustadz Yusuf Mansur', peran: 'Keynote Speaker' }],
    deskripsi: 'Seminar nasional tentang kewirausahaan berbasis nilai Islam.',
    publishedBy: 'Divisi Ekonomi IKA Daarul Mughni',
  },
  {
    id: 4,
    nama: 'Bazar UMKM Alumni 2024',
    tanggal: '12 Okt 2024',
    waktu: '08.00 - 17.00 WIB',
    lokasi: 'Halaman Pesantren',
    lokasiDetail: 'Halaman Utama Pondok Pesantren Daarul Mughni, Sukabumi',
    mapsUrl: 'https://maps.google.com',
    kapasitas: 200,
    terdaftar: 156,
    status: 'Selesai',
    kategori: 'sosial',
    htm: 'Gratis',
    statusPendaftaran: 'Pendaftaran Ditutup',
    hasSertifikat: false,
    pembicara: [],
    deskripsi: 'Bazar UMKM alumni sebagai ajang silaturahmi dan promosi produk alumni.',
    publishedBy: 'Divisi Ekonomi IKA Daarul Mughni',
  },
  {
    id: 5,
    nama: 'Tabligh Akbar 1446 H',
    tanggal: '28 Okt 2024',
    waktu: '08.00 WIB',
    lokasi: 'Lapangan Utama',
    lokasiDetail: 'Lapangan Utama Pondok Pesantren Daarul Mughni',
    mapsUrl: 'https://maps.google.com',
    kapasitas: 2000,
    terdaftar: 1890,
    status: 'Berlangsung',
    kategori: 'dakwah',
    htm: 'Gratis',
    statusPendaftaran: 'Terbuka untuk Umum',
    hasSertifikat: false,
    pembicara: [{ nama: 'KH. Abdullah Gymnastiar', peran: 'Pembicara Utama' }],
    deskripsi: 'Tabligh akbar dalam rangka menyambut tahun baru Islam 1446 H.',
    publishedBy: 'Divisi Dakwah IKA Daarul Mughni',
  },
  {
    id: 6,
    nama: 'Pelatihan Kewirausahaan Alumni',
    tanggal: '30 Nov 2024',
    waktu: '09.00 WIB',
    lokasi: 'Aula Serbaguna',
    lokasiDetail: 'Aula Serbaguna Gedung B, Pondok Pesantren Daarul Mughni',
    mapsUrl: '',
    kapasitas: 100,
    terdaftar: 67,
    status: 'Akan Datang',
    kategori: 'edukasi',
    htm: 'Rp 100.000,- (Infaq)',
    statusPendaftaran: 'Terbuka untuk Alumni',
    hasSertifikat: true,
    pembicara: [{ nama: 'Bpk. Ridwan Kamil', peran: 'Pembicara Tamu' }],
    deskripsi: 'Pelatihan intensif kewirausahaan untuk alumni Daarul Mughni.',
    publishedBy: 'Divisi Ekonomi IKA Daarul Mughni',
  },
]

function SectionLabel({ children }) {
  return <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{children}</p>
}

// ── Tag Manager Modal ──────────────────────────────────────────────────────────
function TagManagerModal({ tags, onClose, onAdd, onDelete }) {
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState(WARNA_OPSI[2])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleAdd() {
    const label = newLabel.trim()
    if (!label) return
    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (tags.find(t => t.id === id)) return
    onAdd({ id, label, bg: newColor, text: '#fff' })
    setNewLabel('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Kelola Tag Acara</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Existing tags */}
          <div>
            <SectionLabel>Tag Tersedia</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: t.bg, color: t.text }}
                >
                  {t.label}
                  <button
                    onClick={() => onDelete(t.id)}
                    className="w-3.5 h-3.5 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <p className="text-xs text-gray-400 italic">Belum ada tag.</p>
              )}
            </div>
          </div>

          {/* Add new tag */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <SectionLabel>Tambah Tag Baru</SectionLabel>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="contoh: Reuni & Silaturahmi"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors"
            />
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Pilih Warna</p>
              <div className="flex items-center gap-2 flex-wrap">
                {WARNA_OPSI.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewColor(c)}
                    className="w-7 h-7 rounded-full transition-all"
                    style={{
                      backgroundColor: c,
                      outline: newColor === c ? `3px solid ${c}` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
            {newLabel.trim() && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Preview:</span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: newColor, color: '#fff' }}
                >
                  {newLabel.trim()}
                </span>
              </div>
            )}
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Tambah Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Agenda Modal ───────────────────────────────────────────────────────────────
function AgendaModal({ agenda, tags, onClose, onSave }) {
  const isEdit = !!agenda
  const [form, setForm] = useState(
    isEdit
      ? {
          nama: agenda.nama,
          tanggal: '',
          waktu: agenda.waktu || '',
          lokasi: agenda.lokasi,
          lokasiDetail: agenda.lokasiDetail || '',
          mapsUrl: agenda.mapsUrl || '',
          kapasitas: String(agenda.kapasitas),
          deskripsi: agenda.deskripsi || '',
          status: agenda.status,
          kategori: agenda.kategori || '',
          htm: agenda.htm || '',
          statusPendaftaran: agenda.statusPendaftaran || '',
          hasSertifikat: agenda.hasSertifikat || false,
          publishedBy: agenda.publishedBy || '',
          thumbnail: agenda.thumbnail || '',
          imageHero: agenda.imageHero || '',
          pamflet: agenda.pamflet || '',
        }
      : {
          nama: '',
          tanggal: '',
          waktu: '',
          lokasi: '',
          lokasiDetail: '',
          mapsUrl: '',
          kapasitas: '',
          deskripsi: '',
          status: 'Akan Datang',
          kategori: '',
          htm: '',
          statusPendaftaran: '',
          hasSertifikat: false,
          publishedBy: '',
          thumbnail: '',
          imageHero: '',
          pamflet: '',
        }
  )
  const [pembicara, setPembicara] = useState(isEdit ? (agenda.pembicara || []) : [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function addPembicara() {
    setPembicara((prev) => [...prev, { nama: '', peran: '' }])
  }

  function updatePembicara(idx, field, val) {
    setPembicara((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p))
  }

  function removePembicara(idx) {
    setPembicara((prev) => prev.filter((_, i) => i !== idx))
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Agenda' : 'Tambah Agenda Baru'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* Informasi Dasar */}
          <div className="space-y-4">
            <SectionLabel>Informasi Dasar</SectionLabel>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Acara</label>
              <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama acara atau kegiatan" className={inputCls} />
            </div>

            {/* Tag / Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tag Kategori</label>
              {tags.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Belum ada tag. Tambahkan melalui tombol "Kelola Tag".</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => {
                    const isSelected = form.kategori === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm({ ...form, kategori: isSelected ? '' : t.id })}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all"
                        style={isSelected
                          ? { backgroundColor: t.bg, color: t.text, borderColor: t.bg }
                          : { backgroundColor: 'transparent', color: t.bg, borderColor: t.bg }
                        }
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal</label>
                <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Waktu</label>
                <input type="text" value={form.waktu} onChange={(e) => setForm({ ...form, waktu: e.target.value })}
                  placeholder="08.00 WIB" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kapasitas</label>
                <input type="number" value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
                  placeholder="Jumlah peserta maks." className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status Acara</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                  {STATUS_AGENDA.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Lokasi */}
          <div className="space-y-4 pt-1 border-t border-gray-100">
            <SectionLabel>Lokasi</SectionLabel>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lokasi Singkat</label>
              <input type="text" value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                placeholder="contoh: Aula Utama, Zoom Webinar" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Alamat Lengkap</label>
              <textarea value={form.lokasiDetail} onChange={(e) => setForm({ ...form, lokasiDetail: e.target.value })}
                placeholder="Alamat lengkap tempat acara (ditampilkan di kartu peta)" rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL Google Maps</label>
              <input type="url" value={form.mapsUrl} onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..." className={inputCls} />
              <p className="text-[11px] text-gray-400 mt-1">Digunakan untuk link "Buka di Google Maps" di detail acara.</p>
            </div>
          </div>

          {/* Pendaftaran & HTM */}
          <div className="space-y-4 pt-1 border-t border-gray-100">
            <SectionLabel>Pendaftaran &amp; HTM</SectionLabel>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status Pendaftaran</label>
              <input type="text" value={form.statusPendaftaran} onChange={(e) => setForm({ ...form, statusPendaftaran: e.target.value })}
                placeholder="contoh: Terbuka untuk Umum Alumni" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">HTM / Kontribusi</label>
              <input type="text" value={form.htm} onChange={(e) => setForm({ ...form, htm: e.target.value })}
                placeholder="contoh: Gratis atau Rp 100.000,- (Infaq)" className={inputCls} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={form.hasSertifikat}
                onChange={(e) => setForm({ ...form, hasSertifikat: e.target.checked })}
                className="w-4 h-4 rounded accent-green-600" />
              <span className="text-sm font-semibold text-gray-700">Tersedia Sertifikat Keikutsertaan</span>
            </label>
          </div>

          {/* Pembicara */}
          <div className="space-y-3 pt-1 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <SectionLabel>Pembicara &amp; Tokoh Hadir</SectionLabel>
              <button type="button" onClick={addPembicara}
                className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
            {pembicara.length === 0 && (
              <p className="text-xs text-gray-400 italic">Belum ada pembicara. Klik "Tambah" untuk menambahkan.</p>
            )}
            {pembicara.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input type="text" value={p.nama} onChange={(e) => updatePembicara(idx, 'nama', e.target.value)}
                    placeholder="Nama pembicara"
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors" />
                  <input type="text" value={p.peran} onChange={(e) => updatePembicara(idx, 'peran', e.target.value)}
                    placeholder="Peran / jabatan"
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors" />
                </div>
                <button type="button" onClick={() => removePembicara(idx)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Konten */}
          <div className="space-y-4 pt-1 border-t border-gray-100">
            <SectionLabel>Konten</SectionLabel>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat acara..." rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dipublikasikan Oleh</label>
              <input type="text" value={form.publishedBy} onChange={(e) => setForm({ ...form, publishedBy: e.target.value })}
                placeholder="contoh: Divisi Dakwah IKA Daarul Mughni" className={inputCls} />
              <p className="text-[11px] text-gray-400 mt-1">Tampil di detail acara: "Acara ini dipublikasikan oleh ..."</p>
            </div>
          </div>

          {/* Gambar */}
          <div className="space-y-3 pt-1 border-t border-gray-100">
            <SectionLabel>Gambar Kegiatan</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <ImageUploadBox label="Thumbnail (Card List)" hint="Rasio 4:3 · maks. 2MB" value={form.thumbnail} onChange={url => setForm(f => ({ ...f, thumbnail: url }))} />
              <ImageUploadBox label="Banner (Header Detail)" hint="Rasio 16:9 · maks. 5MB" value={form.imageHero} onChange={url => setForm(f => ({ ...f, imageHero: url }))} />
            </div>
            <ImageUploadBox label="Pamflet Acara (opsional)" hint="Tampil di detail acara, bisa dibuka penuh · maks. 5MB" value={form.pamflet} onChange={url => setForm(f => ({ ...f, pamflet: url }))} />
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            onClick={() => form.nama && onSave({ ...form, pembicara })}
            disabled={!form.nama}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#1A5C38' }}
          >
            {isEdit ? 'Simpan Perubahan' : 'Tambah Agenda'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdminAgendaPage() {
  const [agenda, setAgenda] = useState(initialAgenda)
  const [tags, setTags] = useState(initialTags)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modal, setModal] = useState(null)       // null | 'tambah' | agendaObj
  const [tagModal, setTagModal] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(6)
  const [confirm, setConfirm] = useState({ open: false })
  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  const filtered = agenda.filter((a) => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.nama.toLowerCase().includes(q) || a.lokasi.toLowerCase().includes(q)
    const matchStatus = !filterStatus || a.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const startIdx = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const endIdx = Math.min(page * perPage, filtered.length)

  function handleSave(form) {
    const isEdit = modal && modal !== 'tambah'
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Agenda' : 'Tambah Agenda Baru',
      message: isEdit
        ? 'Apakah Anda yakin ingin menyimpan perubahan pada agenda ini?'
        : 'Apakah Anda yakin ingin menambahkan agenda baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: () => {
        if (!isEdit) {
          setAgenda((prev) => [{
            id: Date.now(),
            ...form,
            kapasitas: Number(form.kapasitas) || 0,
            terdaftar: 0,
            tanggal: form.tanggal || 'TBD',
          }, ...prev])
        } else {
          setAgenda((prev) => prev.map((a) =>
            a.id === modal.id
              ? { ...a, ...form, kapasitas: Number(form.kapasitas) || a.kapasitas }
              : a
          ))
        }
        setModal(null)
        closeConfirm()
      },
    })
  }

  function handleDelete(id) {
    askConfirm({
      title: 'Hapus Agenda',
      message: 'Apakah Anda yakin ingin menghapus agenda ini? Tindakan ini tidak dapat dibatalkan.',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: () => { setAgenda((prev) => prev.filter((a) => a.id !== id)); closeConfirm() },
    })
  }

  function handleAddTag(tag) {
    setTags((prev) => [...prev, tag])
  }

  function handleDeleteTag(id) {
    setTags((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="agenda" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Cari agenda..."
        />

        {/* Content */}
        <motion.div
          className="flex-1 p-6 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Kelola Agenda</h1>
              <p className="text-sm text-gray-500 mt-0.5">Tambah dan kelola jadwal acara &amp; kegiatan alumni.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTagModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Tag className="w-4 h-4" /> Kelola Tag
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" /> Ekspor
              </button>
              <button
                onClick={() => setModal('tambah')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1A5C38' }}
              >
                <Plus className="w-4 h-4" /> Tambah Agenda
              </button>
            </div>
          </div>

          {/* Filter + PerPage */}
          <div className="flex items-center gap-2 flex-wrap">
            {['', ...STATUS_AGENDA].map((s) => (
              <button key={s} onClick={() => { setFilterStatus(s); setPage(1) }}
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                style={filterStatus === s
                  ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' }
                  : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }
                }>
                {s || 'Semua'}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-4">
              <PerPageSelector value={perPage} options={[6, 12, 24]} onChange={n => { setPerPage(n); setPage(1) }} />
              <span className="text-xs text-gray-400">{startIdx}–{endIdx} dari {filtered.length} agenda</span>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paged.map((a) => {
              const st = STATUS_STYLE[a.status] || STATUS_STYLE['Akan Datang']
              const tag = tags.find(t => t.id === a.kategori)
              const pct = a.kapasitas > 0 ? Math.round((a.terdaftar / a.kapasitas) * 100) : 0
              return (
                <div key={a.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#1A5C38]/20 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      {tag && (
                        <span
                          className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                          style={{ backgroundColor: tag.bg, color: tag.text }}
                        >
                          {tag.label}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-gray-800 leading-snug">{a.nama}</h3>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: st.bg, color: st.text }}>
                      {a.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />{a.tanggal}{a.waktu ? ` · ${a.waktu}` : ''}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />{a.lokasi}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Users className="w-3.5 h-3.5" />{a.terdaftar} / {a.kapasitas} peserta
                    </div>
                  </div>
                  {a.kapasitas > 0 && (
                    <div className="mb-4">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#1A5C38' }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{pct}% kapasitas terisi</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => setModal(a)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors ml-auto">
                      <Trash2 className="w-3 h-3" /> Hapus
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center bg-white rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-400">Tidak ada agenda yang ditemukan.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-2">
              <PaginationBar page={page} totalPages={totalPages} onPage={setPage} />
            </div>
          )}
        </motion.div>

        <div className="border-t border-gray-100 bg-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-400">Sistem Online</span>
          </div>
          <p className="text-xs text-gray-400">Portal Alumni Daarul Mughni · Admin v2.0</p>
        </div>
      </div>

      {tagModal && (
        <TagManagerModal
          tags={tags}
          onClose={() => setTagModal(false)}
          onAdd={handleAddTag}
          onDelete={handleDeleteTag}
        />
      )}

      {modal && (
        <AgendaModal
          agenda={modal === 'tambah' ? null : modal}
          tags={tags}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </div>
  )
}
