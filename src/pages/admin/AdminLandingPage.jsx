import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, Quote, Users, Star, Target, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ImageUploadBox from '../../components/admin/ImageUploadBox'
import { initialTestimonials, initialPengasuh, initialMilestones, initialTentangKami } from '../../data/landingContent'
import { initialGuru } from '../../data/guru'

// ── Reusable helpers ─────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 transition-colors'

// ── Testimonial Modal ─────────────────────────────────────────────────────────
function TestimonialModal({ data, onClose, onSave }) {
  const isEdit = !!data?.id
  const [form, setForm] = useState(data ?? { name: '', batch: '', role: '', quote: '', initials: '', color: '#1A5C38', foto: null, aktif: true })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Lengkap</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="cth. Dr. Ahmad Fauzi" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Angkatan</label>
              <input value={form.batch} onChange={e => set('batch', e.target.value)} placeholder="cth. Angkatan 2010" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Profesi / Peran</label>
              <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="cth. Dokter & Peneliti" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Kutipan / Pesan</label>
            <textarea value={form.quote} onChange={e => set('quote', e.target.value)} rows={4} placeholder="Tuliskan kesan dan pesan alumni..." className={`${inputCls} resize-none`} />
          </div>

          {/* Foto profil */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Foto Profil <span className="text-gray-400 font-normal">(opsional — jika kosong pakai inisial)</span>
            </label>
            <ImageUploadBox
              hint="Upload atau paste URL foto profil alumni"
              value={form.foto ?? ''}
              onChange={url => set('foto', url || null)}
            />
          </div>

          {/* Inisial & warna — fallback jika tidak ada foto */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Inisial (2 huruf)</label>
              <input value={form.initials} onChange={e => set('initials', e.target.value.toUpperCase().slice(0, 2))} placeholder="AF" className={inputCls} maxLength={2} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Warna Avatar</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={e => set('color', e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
                <span className="text-xs text-gray-400 font-mono">{form.color}</span>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.aktif} onChange={e => set('aktif', e.target.checked)} className="w-4 h-4 accent-green-700" />
            <span className="text-sm text-gray-700">Tampilkan di halaman depan</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.name && form.quote && onSave(form)} disabled={!form.name || !form.quote} className="px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>
            <Check className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Pengasuh Modal ────────────────────────────────────────────────────────────
function PengasuhModal({ data, onClose, onSave }) {
  const [form, setForm] = useState(data ?? { nama: '', jabatan: '', judul: '', judulAksen: '', pesan: '', deskripsi: '', foto: null, aktif: true })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Pengasuh</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[78vh] overflow-y-auto">

          {/* Identitas */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Lengkap</label>
            <input value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="cth. KH. Mustopa Mughni, MA." className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Jabatan</label>
            <input value={form.jabatan} onChange={e => set('jabatan', e.target.value)} placeholder="cth. Pimpinan Pondok Pesantren" className={inputCls} />
          </div>

          {/* Judul 2 warna */}
          <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Judul Halaman Depan</span>
              <span className="text-[10px] text-gray-400">(tampil otomatis 2 warna)</span>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Bagian 1 — warna gelap</label>
              <input value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="cth. Menjaga Warisan Luhur di Era" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Bagian 2 — warna hijau (kata kunci)</label>
              <input value={form.judulAksen} onChange={e => set('judulAksen', e.target.value)} placeholder="cth. Disrupsi Digital" className={inputCls} />
            </div>
            {/* Preview */}
            {(form.judul || form.judulAksen) && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-[10px] text-gray-400 mb-1">Preview:</p>
                <p className="text-sm font-bold text-[#0A2415] leading-snug">
                  {form.judul}{' '}
                  {form.judulAksen && <span style={{ color: '#1A5C38' }}>{form.judulAksen}</span>}
                </p>
              </div>
            )}
          </div>

          {/* Kutipan */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Kutipan / Pesan</label>
            <textarea value={form.pesan} onChange={e => set('pesan', e.target.value)} rows={4} placeholder="Pesan inspiratif dari pengasuh..." className={`${inputCls} resize-none`} />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Deskripsi <span className="text-gray-400 font-normal">(paragraf di bawah kutipan, opsional)</span>
            </label>
            <textarea value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)} rows={3} placeholder="Paragraf penjelasan tambahan..." className={`${inputCls} resize-none`} />
          </div>

          {/* Foto */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Foto Pengasuh <span className="text-gray-400 font-normal">(opsional)</span></label>
            <ImageUploadBox
              hint="Upload atau paste URL foto pengasuh"
              value={form.foto ?? ''}
              onChange={url => set('foto', url || null)}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.aktif} onChange={e => set('aktif', e.target.checked)} className="w-4 h-4 accent-green-700" />
            <span className="text-sm text-gray-700">Tampilkan di halaman depan</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.nama && onSave(form)} disabled={!form.nama} className="px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>
            <Check className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Guru Modal ────────────────────────────────────────────────────────────────
function GuruModal({ data, onClose, onSave }) {
  const isEdit = !!data?.id
  const [form, setForm] = useState(data ?? { nama: '', jabatan: '', deskripsi: '', foto: null, isPengasuh: false, aktif: true })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Data Guru' : 'Tambah Guru'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Lengkap</label>
            <input value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="cth. Ustadz H. Ahmad Ridwan, Lc." className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Jabatan / Peran</label>
            <input value={form.jabatan} onChange={e => set('jabatan', e.target.value)} placeholder="cth. Kepala Bidang Akademik" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Deskripsi Singkat</label>
            <textarea value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)} rows={3} placeholder="Latar belakang dan keahlian guru..." className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
              Foto <span className="text-gray-400 font-normal">(opsional)</span>
            </label>
            <ImageUploadBox
              hint="Upload atau paste URL foto guru"
              value={form.foto ?? ''}
              onChange={url => set('foto', url || null)}
            />
          </div>
          <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/50">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.isPengasuh} onChange={e => set('isPengasuh', e.target.checked)} className="w-4 h-4 accent-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Pengasuh / Pendiri Pesantren</p>
                <p className="text-xs text-gray-500 mt-0.5">Akan diberi label khusus di bawah foto pada halaman Pesantren.</p>
              </div>
            </label>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.aktif} onChange={e => set('aktif', e.target.checked)} className="w-4 h-4 accent-green-700" />
            <span className="text-sm text-gray-700">Tampilkan di halaman Pesantren</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.nama && onSave(form)} disabled={!form.nama} className="px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>
            <Check className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Milestone Modal ───────────────────────────────────────────────────────────
function MilestoneModal({ data, onClose, onSave }) {
  const isEdit = !!data?.id
  const [form, setForm] = useState(data ?? { tahun: '', judul: '', keterangan: '', aktif: true })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Milestone' : 'Tambah Milestone'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Tahun</label>
            <input value={form.tahun} onChange={e => set('tahun', e.target.value)} placeholder="cth. 2010" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Judul Pencapaian</label>
            <input value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="cth. 500+ Alumni" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Keterangan</label>
            <textarea value={form.keterangan} onChange={e => set('keterangan', e.target.value)} rows={3} placeholder="Deskripsi singkat pencapaian..." className={`${inputCls} resize-none`} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.aktif} onChange={e => set('aktif', e.target.checked)} className="w-4 h-4 accent-green-700" />
            <span className="text-sm text-gray-700">Tampilkan di halaman Pesantren</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.tahun && form.judul && onSave(form)} disabled={!form.tahun || !form.judul} className="px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>
            <Check className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminLandingPage() {
  const [activeTab, setActiveTab] = useState('testimoni')
  const [search, setSearch] = useState('')

  // Testimoni state
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [testimoniModal, setTestimoniModal] = useState(null) // null | {} | item

  // Pengasuh (pesan pimpinan) state — single record
  const [pengasuh, setPengasuh] = useState(initialPengasuh)
  const [pengasuhModal, setPengasuhModal] = useState(null)

  // Guru state — multiple records for PesantrenPage
  const [guru, setGuru] = useState(initialGuru)
  const [guruModal, setGuruModal] = useState(null)

  // Milestone state
  const [milestones, setMilestones] = useState(initialMilestones)
  const [milestoneModal, setMilestoneModal] = useState(null)

  // Tentang & Visi Misi
  const [tentang, setTentang] = useState(initialTentangKami)
  const [editingMisi, setEditingMisi] = useState(false)
  const [misiDraft, setMisiDraft] = useState(initialTentangKami.misi.join('\n'))

  // Confirm
  const [confirm, setConfirm] = useState({ open: false })
  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  // Handlers — Testimoni
  function saveTestimoni(form) {
    const isEdit = !!form.id
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Testimoni' : 'Tambah Testimoni Baru',
      message: isEdit
        ? 'Apakah Anda yakin ingin menyimpan perubahan testimoni ini?'
        : 'Apakah Anda yakin ingin menambahkan testimoni baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: () => {
        if (isEdit) {
          setTestimonials(prev => prev.map(t => t.id === form.id ? form : t))
        } else {
          setTestimonials(prev => [...prev, { ...form, id: Date.now() }])
        }
        setTestimoniModal(null)
        closeConfirm()
      },
    })
  }

  function deleteTestimoni(id) {
    askConfirm({ title: 'Hapus Testimoni', message: 'Apakah Anda yakin ingin menghapus testimoni ini?', confirmLabel: 'Ya, Hapus', variant: 'danger', onConfirm: () => { setTestimonials(prev => prev.filter(t => t.id !== id)); closeConfirm() } })
  }

  function toggleTestimoni(id) {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, aktif: !t.aktif } : t))
  }

  // Handlers — Pengasuh (single record, edit only)
  function savePengasuh(form) {
    askConfirm({
      title: 'Simpan Perubahan Pesan Pimpinan',
      message: 'Apakah Anda yakin ingin menyimpan perubahan ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: () => {
        setPengasuh(prev => prev.map(p => p.id === form.id ? form : p))
        setPengasuhModal(null)
        closeConfirm()
      },
    })
  }

  // Handlers — Guru
  function saveGuru(form) {
    const isEdit = !!form.id
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Guru' : 'Tambah Guru Baru',
      message: isEdit ? 'Apakah Anda yakin ingin menyimpan perubahan data guru ini?' : 'Apakah Anda yakin ingin menambahkan guru baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: () => {
        if (isEdit) {
          setGuru(prev => prev.map(g => g.id === form.id ? form : g))
        } else {
          setGuru(prev => [...prev, { ...form, id: Date.now() }])
        }
        setGuruModal(null)
        closeConfirm()
      },
    })
  }

  function deleteGuru(id) {
    askConfirm({ title: 'Hapus Guru', message: 'Apakah Anda yakin ingin menghapus data guru ini?', confirmLabel: 'Ya, Hapus', variant: 'danger', onConfirm: () => { setGuru(prev => prev.filter(g => g.id !== id)); closeConfirm() } })
  }

  function toggleGuru(id) {
    setGuru(prev => prev.map(g => g.id === id ? { ...g, aktif: !g.aktif } : g))
  }

  // Handlers — Milestone
  function saveMilestone(form) {
    const isEdit = !!form.id
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Milestone' : 'Tambah Milestone Baru',
      message: isEdit
        ? 'Apakah Anda yakin ingin menyimpan perubahan milestone ini?'
        : 'Apakah Anda yakin ingin menambahkan milestone baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: () => {
        if (isEdit) {
          setMilestones(prev => prev.map(m => m.id === form.id ? form : m))
        } else {
          setMilestones(prev => [...prev, { ...form, id: Date.now() }])
        }
        setMilestoneModal(null)
        closeConfirm()
      },
    })
  }

  function deleteMilestone(id) {
    askConfirm({ title: 'Hapus Milestone', message: 'Apakah Anda yakin ingin menghapus milestone ini?', confirmLabel: 'Ya, Hapus', variant: 'danger', onConfirm: () => { setMilestones(prev => prev.filter(m => m.id !== id)); closeConfirm() } })
  }

  function saveTentang() {
    askConfirm({
      title: 'Simpan Tentang & Visi Misi',
      message: 'Apakah Anda yakin ingin menyimpan perubahan konten ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: () => {
        if (editingMisi) {
          setTentang(t => ({ ...t, misi: misiDraft.split('\n').map(s => s.trim()).filter(Boolean) }))
          setEditingMisi(false)
        }
        closeConfirm()
      },
    })
  }

  const tabs = [
    { key: 'testimoni', label: 'Testimoni Alumni',   icon: Quote },
    { key: 'pengasuh',  label: 'Pesan Pimpinan',     icon: Users },
    { key: 'guru',      label: 'Guru Pesantren',     icon: GraduationCap },
    { key: 'milestone', label: 'Milestone Pesantren', icon: Star },
    { key: 'tentang',   label: 'Tentang & Visi Misi', icon: Target },
  ]

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="landing" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari konten..."
        />

        {/* Content */}
        <motion.div
          className="flex-1 p-6 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Kelola Konten Landing Page</h1>
            <p className="text-sm text-gray-500 mt-0.5">Atur isi halaman depan: testimoni, pengasuh, milestone, dan profil pesantren.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 border-b border-gray-200">
            {tabs.map(t => {
              const Icon = t.icon
              return (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-colors ${activeTab === t.key ? 'border-green-700 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* ── Tab: Testimoni ── */}
          {activeTab === 'testimoni' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader title="Kisah Inspiratif Alumni" subtitle="Tampil di halaman depan, dapat digeser ke samping jika lebih dari 3." />
                <button onClick={() => setTestimoniModal({})} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#1A5C38' }}>
                  <Plus className="w-4 h-4" /> Tambah Testimoni
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {testimonials.map(t => (
                  <div key={t.id} className={`bg-white rounded-2xl p-5 border border-gray-100 ${!t.aktif ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                        {t.foto
                          ? <img src={t.foto} alt={t.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: t.color }}>{t.initials}</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.batch} · {t.role}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${t.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {t.aktif ? 'Tampil' : 'Disembunyikan'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-3">"{t.quote}"</p>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      <button onClick={() => toggleTestimoni(t.id)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700">
                        {t.aktif ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {t.aktif ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                      <button onClick={() => setTestimoniModal(t)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 ml-auto">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => deleteTestimoni(t.id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Pesan Pimpinan ── */}
          {activeTab === 'pengasuh' && (() => {
            const p = pengasuh[0]
            if (!p) return null
            return (
              <div className="space-y-4 max-w-2xl">
                <SectionHeader
                  title="Pesan Pimpinan"
                  subtitle="Ditampilkan di bagian 'Pesan Pimpinan' pada halaman beranda. Hanya satu pimpinan yang ditampilkan."
                />
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      {p.foto
                        ? <img src={p.foto} alt={p.nama} className="w-full h-full object-cover" />
                        : <span className="text-xl font-bold text-gray-400">{p.nama[0]}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900">{p.nama}</p>
                      <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1" style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}>{p.jabatan}</span>
                    </div>
                    <button
                      onClick={() => setPengasuhModal(p)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors flex-shrink-0"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    {(p.judul || p.judulAksen) && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Judul Halaman Depan</p>
                        <p className="text-sm font-bold text-[#0A2415]">
                          {p.judul}{' '}
                          {p.judulAksen && <span style={{ color: '#1A5C38' }}>{p.judulAksen}</span>}
                        </p>
                      </div>
                    )}
                    {p.pesan && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Kutipan / Pesan</p>
                        <p className="text-xs text-gray-600 italic leading-relaxed">"{p.pesan}"</p>
                      </div>
                    )}
                    {p.deskripsi && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Deskripsi</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{p.deskripsi}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* ── Tab: Guru Pesantren ── */}
          {activeTab === 'guru' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader
                  title="Para Guru Pesantren"
                  subtitle="Ditampilkan di bagian 'Mengenal Para Guru' pada halaman Pesantren. Guru yang ditandai sebagai Pengasuh akan mendapat label khusus."
                />
                <button onClick={() => setGuruModal({})} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#1A5C38' }}>
                  <Plus className="w-4 h-4" /> Tambah Guru
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {guru.map(g => (
                  <div key={g.id} className={`bg-white rounded-2xl p-5 border border-gray-100 ${!g.aktif ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                        {g.foto
                          ? <img src={g.foto} alt={g.nama} className="w-full h-full object-cover" />
                          : <span className="text-base font-bold text-gray-400">{g.nama[0]}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{g.nama}</p>
                        <p className="text-xs text-gray-500 truncate">{g.jabatan}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {g.isPengasuh && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}>
                              Pengasuh / Pendiri
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${g.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {g.aktif ? 'Tampil' : 'Disembunyikan'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {g.deskripsi && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{g.deskripsi}</p>
                    )}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button onClick={() => toggleGuru(g.id)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700">
                        {g.aktif ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {g.aktif ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                      <button onClick={() => setGuruModal(g)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 ml-auto">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => deleteGuru(g.id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Milestone ── */}
          {activeTab === 'milestone' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader title="Milestone Pesantren" subtitle="Tonggak sejarah yang ditampilkan di halaman Tentang Pesantren." />
                <button onClick={() => setMilestoneModal({})} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#1A5C38' }}>
                  <Plus className="w-4 h-4" /> Tambah Milestone
                </button>
              </div>
              <div className="space-y-2">
                {milestones.sort((a, b) => a.tahun - b.tahun).map(m => (
                  <div key={m.id} className={`bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4 ${!m.aktif ? 'opacity-60' : ''}`}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0" style={{ backgroundColor: '#0A2415' }}>
                      {m.tahun}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{m.judul}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{m.keterangan}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {m.aktif ? 'Aktif' : 'Disembunyikan'}
                      </span>
                      <button onClick={() => setMilestoneModal(m)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteMilestone(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Tentang & Visi Misi ── */}
          {activeTab === 'tentang' && (
            <div className="space-y-4 max-w-3xl">
              <SectionHeader title="Tentang Kami & Visi Misi" subtitle="Konten yang tampil di bagian tentang pesantren." />

              {/* Tentang */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Informasi Dasar</h3>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Judul Halaman</label>
                  <input value={tentang.judul} onChange={e => setTentang(t => ({ ...t, judul: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Subtitle</label>
                  <input value={tentang.subtitle} onChange={e => setTentang(t => ({ ...t, subtitle: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Deskripsi</label>
                  <textarea value={tentang.deskripsi} onChange={e => setTentang(t => ({ ...t, deskripsi: e.target.value }))} rows={4} className={`${inputCls} resize-none`} />
                </div>
              </div>

              {/* Visi */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Visi</h3>
                <textarea value={tentang.visi} onChange={e => setTentang(t => ({ ...t, visi: e.target.value }))} rows={3} className={`${inputCls} resize-none`} />
              </div>

              {/* Misi */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Misi</h3>
                  <button onClick={() => { setEditingMisi(!editingMisi); setMisiDraft(tentang.misi.join('\n')) }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Pencil className="w-3.5 h-3.5" />
                    {editingMisi ? 'Pratinjau' : 'Edit'}
                  </button>
                </div>
                {editingMisi ? (
                  <textarea value={misiDraft} onChange={e => setMisiDraft(e.target.value)} rows={7} placeholder="Satu misi per baris..." className={`${inputCls} resize-none font-mono text-xs`} />
                ) : (
                  <ul className="space-y-2">
                    {tentang.misi.map((m, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: '#1A5C38' }}>{i + 1}</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button onClick={saveTentang}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1A5C38' }}>
                <Check className="w-4 h-4" /> Simpan Perubahan
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      {testimoniModal !== null && (
        <TestimonialModal
          data={testimoniModal?.id ? testimoniModal : null}
          onClose={() => setTestimoniModal(null)}
          onSave={saveTestimoni}
        />
      )}
      {pengasuhModal !== null && (
        <PengasuhModal
          data={pengasuhModal?.id ? pengasuhModal : null}
          onClose={() => setPengasuhModal(null)}
          onSave={savePengasuh}
        />
      )}
      {guruModal !== null && (
        <GuruModal
          data={guruModal?.id ? guruModal : null}
          onClose={() => setGuruModal(null)}
          onSave={saveGuru}
        />
      )}
      {milestoneModal !== null && (
        <MilestoneModal
          data={milestoneModal?.id ? milestoneModal : null}
          onClose={() => setMilestoneModal(null)}
          onSave={saveMilestone}
        />
      )}

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </div>
  )
}
