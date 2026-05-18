import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, Star, Target, GraduationCap, Loader2, MessageSquareQuote } from 'lucide-react'
import { toast } from '@/lib/toast'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ImageUploadBox from '../../components/admin/ImageUploadBox'
import { supabase } from '@/lib/supabase'

function mapGuru(row) {
  return {
    id: row.id,
    nama: row.nama ?? '',
    jabatan: row.jabatan ?? '',
    deskripsi: row.deskripsi ?? '',
    foto: row.foto_url ?? null,
    isPengasuh: row.is_pengasuh ?? false,
    aktif: row.is_aktif ?? true,
  }
}

function mapMilestone(row) {
  return {
    id: row.id,
    tahun: String(row.tahun),
    judul: row.judul ?? '',
    keterangan: row.keterangan ?? '',
    aktif: row.is_aktif ?? true,
  }
}

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
              bucket="site-assets"
              pathPrefix="guru"
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

// ── Testimoni Modal ───────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#1A5C38', '#2A7A4F', '#0A2415', '#0E7490', '#0369A1', '#7C3AED', '#DB2777', '#D97706', '#065F46', '#4F46E5']

function TestimoniModal({ data, onClose, onSave }) {
  const isEdit = !!data?.id
  const [form, setForm] = useState(data ?? {
    nama: '', angkatan: '', jabatan: '', isi: '',
    foto_url: null, inisial: '', warna_avatar: '#1A5C38',
    urutan: 0, is_aktif: true,
  })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  const valid = form.nama.trim() && form.isi.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama <span className="text-red-400">*</span></label>
            <input value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="cth. Ahmad Fauzi, S.T." className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Angkatan</label>
              <input value={form.angkatan} onChange={e => set('angkatan', e.target.value)} placeholder="cth. Angkatan 2010" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Urutan</label>
              <input type="number" value={form.urutan} onChange={e => set('urutan', Number(e.target.value))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Jabatan / Profesi</label>
            <input value={form.jabatan} onChange={e => set('jabatan', e.target.value)} placeholder="cth. Software Engineer di Tokopedia" className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Isi Testimoni <span className="text-red-400">*</span></label>
            <textarea value={form.isi} onChange={e => set('isi', e.target.value)} rows={4} placeholder="Tulis kutipan testimoni alumni..." className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">URL Foto <span className="text-gray-400 font-normal">(opsional)</span></label>
            <input value={form.foto_url ?? ''} onChange={e => set('foto_url', e.target.value || null)} placeholder="https://..." className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Inisial Avatar <span className="text-gray-400 font-normal">(opsional, otomatis jika kosong)</span></label>
              <input value={form.inisial ?? ''} onChange={e => set('inisial', e.target.value || null)} placeholder="cth. AF" maxLength={3} className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Warna Avatar</label>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                {AVATAR_COLORS.map(c => (
                  <button key={c} onClick={() => set('warna_avatar', c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${form.warna_avatar === c ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_aktif} onChange={e => set('is_aktif', e.target.checked)} className="w-4 h-4 accent-green-700" />
            <span className="text-sm text-gray-700">Tampilkan di landing page</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">Batal</button>
          <button onClick={() => valid && onSave(form)} disabled={!valid}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 disabled:opacity-40"
            style={{ backgroundColor: '#1A5C38' }}>
            <Check className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminLandingPage() {
  const [activeTab, setActiveTab] = useState('guru')
  const [search, setSearch] = useState('')

  // Guru state — multiple records for PesantrenPage
  const [guru, setGuru] = useState([])
  const [loadingGuru, setLoadingGuru] = useState(true)
  const [guruModal, setGuruModal] = useState(null)

  // Milestone state
  const [milestones, setMilestones] = useState([])
  const [loadingMilestone, setLoadingMilestone] = useState(true)
  const [milestoneModal, setMilestoneModal] = useState(null)

  // Testimoni state
  const [testimoni, setTestimoni] = useState([])
  const [loadingTestimoni, setLoadingTestimoni] = useState(true)
  const [testimoniModal, setTestimoniModal] = useState(null)

  // Tentang & Visi Misi
  const [tentang, setTentang] = useState({ judul: '', subtitle: '', deskripsi: '', visi: '', misi: [] })
  const [editingMisi, setEditingMisi] = useState(false)
  const [misiDraft, setMisiDraft] = useState('')

  const loadGuru = useCallback(async () => {
    setLoadingGuru(true)
    const { data } = await supabase
      .from('guru')
      .select('id, nama, jabatan, deskripsi, foto_url, is_pengasuh, is_aktif, urutan')
      .order('urutan', { ascending: true })
    setGuru((data ?? []).map(mapGuru))
    setLoadingGuru(false)
  }, [])

  const loadMilestones = useCallback(async () => {
    setLoadingMilestone(true)
    const { data } = await supabase
      .from('milestone')
      .select('id, tahun, judul, keterangan, is_aktif')
      .order('tahun', { ascending: true })
    setMilestones((data ?? []).map(mapMilestone))
    setLoadingMilestone(false)
  }, [])

  const loadTestimoni = useCallback(async () => {
    setLoadingTestimoni(true)
    const { data } = await supabase
      .from('testimoni')
      .select('id, nama, angkatan, jabatan, isi, foto_url, inisial, warna_avatar, urutan, is_aktif')
      .order('urutan', { ascending: true })
    setTestimoni(data ?? [])
    setLoadingTestimoni(false)
  }, [])

  const loadTentang = useCallback(async () => {
    const { data } = await supabase.from('pengaturan').select('value').eq('key', 'tentang_kami').single()
    if (data?.value) {
      try { setTentang(JSON.parse(data.value)) } catch {}
    }
  }, [])

  useEffect(() => { loadGuru() }, [loadGuru])
  useEffect(() => { loadMilestones() }, [loadMilestones])
  useEffect(() => { loadTestimoni() }, [loadTestimoni])
  useEffect(() => { loadTentang() }, [loadTentang])

  // Confirm
  const [confirm, setConfirm] = useState({ open: false })
  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  // Handlers — Guru
  function saveGuru(form) {
    const isEdit = !!form.id
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Guru' : 'Tambah Guru Baru',
      message: isEdit ? 'Apakah Anda yakin ingin menyimpan perubahan data guru ini?' : 'Apakah Anda yakin ingin menambahkan guru baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const payload = {
          nama: form.nama,
          jabatan: form.jabatan || null,
          deskripsi: form.deskripsi || null,
          foto_url: form.foto ?? null,
          is_pengasuh: form.isPengasuh ?? false,
          is_aktif: form.aktif ?? true,
        }
        if (isEdit) {
          const { error } = await supabase.from('guru').update(payload).eq('id', form.id)
          if (error) { toast('Gagal menyimpan: ' + error.message); closeConfirm(); return }
          setGuru(prev => prev.map(g => g.id === form.id ? { ...form } : g))
        } else {
          const { data, error } = await supabase.from('guru').insert(payload).select().single()
          if (error) { toast('Gagal menyimpan: ' + error.message); closeConfirm(); return }
          if (data) setGuru(prev => [...prev, mapGuru(data)])
        }
        setGuruModal(null)
        closeConfirm()
      },
    })
  }

  function deleteGuru(id) {
    askConfirm({ title: 'Hapus Guru', message: 'Apakah Anda yakin ingin menghapus data guru ini?', confirmLabel: 'Ya, Hapus', variant: 'danger', onConfirm: async () => {
      await supabase.from('guru').delete().eq('id', id)
      setGuru(prev => prev.filter(g => g.id !== id))
      closeConfirm()
    }})
  }

  async function toggleGuru(id) {
    const g = guru.find(x => x.id === id)
    if (!g) return
    await supabase.from('guru').update({ is_aktif: !g.aktif }).eq('id', id)
    setGuru(prev => prev.map(x => x.id === id ? { ...x, aktif: !x.aktif } : x))
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
      onConfirm: async () => {
        const payload = {
          tahun: Number(form.tahun),
          judul: form.judul,
          keterangan: form.keterangan || null,
          is_aktif: form.aktif ?? true,
        }
        if (isEdit) {
          const { error } = await supabase.from('milestone').update(payload).eq('id', form.id)
          if (error) { toast('Gagal menyimpan: ' + error.message); closeConfirm(); return }
          setMilestones(prev => prev.map(m => m.id === form.id ? { ...form } : m))
        } else {
          const { data, error } = await supabase.from('milestone').insert(payload).select().single()
          if (error) { toast('Gagal menyimpan: ' + error.message); closeConfirm(); return }
          if (data) setMilestones(prev => [...prev, mapMilestone(data)])
        }
        setMilestoneModal(null)
        closeConfirm()
      },
    })
  }

  function deleteMilestone(id) {
    askConfirm({ title: 'Hapus Milestone', message: 'Apakah Anda yakin ingin menghapus milestone ini?', confirmLabel: 'Ya, Hapus', variant: 'danger', onConfirm: async () => {
      await supabase.from('milestone').delete().eq('id', id)
      setMilestones(prev => prev.filter(m => m.id !== id))
      closeConfirm()
    }})
  }

  // Handlers — Testimoni
  function saveTestimoni(form) {
    const isEdit = !!form.id
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Testimoni' : 'Tambah Testimoni Baru',
      message: isEdit ? 'Apakah Anda yakin ingin menyimpan perubahan testimoni ini?' : 'Apakah Anda yakin ingin menambahkan testimoni baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const payload = {
          nama: form.nama,
          angkatan: form.angkatan || null,
          jabatan: form.jabatan || null,
          isi: form.isi,
          foto_url: form.foto_url || null,
          inisial: form.inisial || null,
          warna_avatar: form.warna_avatar || '#1A5C38',
          urutan: form.urutan ?? 0,
          is_aktif: form.is_aktif ?? true,
        }
        if (isEdit) {
          const { error } = await supabase.from('testimoni').update(payload).eq('id', form.id)
          if (error) { toast('Gagal menyimpan: ' + error.message); closeConfirm(); return }
          setTestimoni(prev => prev.map(t => t.id === form.id ? { ...form, ...payload } : t))
        } else {
          const { data, error } = await supabase.from('testimoni').insert(payload).select().single()
          if (error) { toast('Gagal menyimpan: ' + error.message); closeConfirm(); return }
          if (data) setTestimoni(prev => [...prev, data])
        }
        setTestimoniModal(null)
        closeConfirm()
      },
    })
  }

  function deleteTestimoni(id) {
    askConfirm({ title: 'Hapus Testimoni', message: 'Apakah Anda yakin ingin menghapus testimoni ini?', confirmLabel: 'Ya, Hapus', variant: 'danger', onConfirm: async () => {
      await supabase.from('testimoni').delete().eq('id', id)
      setTestimoni(prev => prev.filter(t => t.id !== id))
      closeConfirm()
    }})
  }

  async function toggleTestimoni(id) {
    const t = testimoni.find(x => x.id === id)
    if (!t) return
    await supabase.from('testimoni').update({ is_aktif: !t.is_aktif }).eq('id', id)
    setTestimoni(prev => prev.map(x => x.id === id ? { ...x, is_aktif: !x.is_aktif } : x))
  }

  function saveTentang() {
    askConfirm({
      title: 'Simpan Tentang & Visi Misi',
      message: 'Apakah Anda yakin ingin menyimpan perubahan konten ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const finalTentang = editingMisi
          ? { ...tentang, misi: misiDraft.split('\n').map(s => s.trim()).filter(Boolean) }
          : tentang
        await supabase.from('pengaturan').upsert({ key: 'tentang_kami', value: JSON.stringify(finalTentang) })
        if (editingMisi) {
          setTentang(finalTentang)
          setEditingMisi(false)
        }
        closeConfirm()
      },
    })
  }

  const tabs = [
    { key: 'guru',      label: 'Guru Pesantren',      icon: GraduationCap },
    { key: 'milestone', label: 'Milestone Pesantren', icon: Star },
    { key: 'testimoni', label: 'Testimoni Alumni',    icon: MessageSquareQuote },
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
            <p className="text-sm text-gray-500 mt-0.5">Atur konten guru pesantren, milestone, dan profil tentang kami.</p>
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
              {loadingGuru && (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {!loadingGuru && guru.map(g => (
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
              {loadingMilestone && (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
              )}
              <div className="space-y-2">
                {!loadingMilestone && milestones.sort((a, b) => a.tahun - b.tahun).map(m => (
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

          {/* ── Tab: Testimoni Alumni ── */}
          {activeTab === 'testimoni' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHeader
                  title="Testimoni Alumni"
                  subtitle="Ditampilkan di section 'Apa Kata Mereka?' pada landing page. Urutkan dengan angka urutan."
                />
                <button onClick={() => setTestimoniModal({})} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#1A5C38' }}>
                  <Plus className="w-4 h-4" /> Tambah Testimoni
                </button>
              </div>
              {loadingTestimoni && (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {!loadingTestimoni && testimoni.map(t => {
                  const initials = t.inisial || (t.nama ?? '').split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
                  const color = t.warna_avatar || '#1A5C38'
                  return (
                    <div key={t.id} className={`bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-3 ${!t.is_aktif ? 'opacity-60' : ''}`}>
                      <p className="text-xs text-gray-500 italic leading-relaxed line-clamp-3">"{t.isi}"</p>
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                        <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden">
                          {t.foto_url
                            ? <img src={t.foto_url} alt={t.nama} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold" style={{ background: color }}>{initials}</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{t.nama}</p>
                          {t.angkatan && <p className="text-xs text-gray-400 truncate">{t.angkatan}</p>}
                          {t.jabatan && <p className="text-xs text-gray-400 truncate">{t.jabatan}</p>}
                        </div>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 flex-shrink-0">#{t.urutan}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.is_aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {t.is_aktif ? 'Tampil' : 'Disembunyikan'}
                        </span>
                        <button onClick={() => toggleTestimoni(t.id)} className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 ml-auto">
                          {t.is_aktif ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {t.is_aktif ? 'Sembunyikan' : 'Tampilkan'}
                        </button>
                        <button onClick={() => setTestimoniModal(t)} className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => deleteTestimoni(t.id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Tab: Tentang & Visi Misi ── */}
          {activeTab === 'tentang' && (
            <div className="space-y-4">
              <SectionHeader title="Tentang Kami & Visi Misi" subtitle="Konten yang tampil di bagian tentang pesantren." />

              <div className="grid lg:grid-cols-2 gap-4 items-start">
                {/* Kiri: Sejarah Pesantren */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Sejarah Pesantren</h3>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Judul</label>
                    <input value={tentang.judul} onChange={e => setTentang(t => ({ ...t, judul: e.target.value }))} placeholder="cth. Perjalanan Panjang Dakwah Melalui Pendidikan Islam" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Deskripsi</label>
                    <textarea value={tentang.deskripsi} onChange={e => setTentang(t => ({ ...t, deskripsi: e.target.value }))} rows={9} placeholder="Tulis deskripsi sejarah pesantren. Pisahkan paragraf dengan satu baris kosong." className={`${inputCls} resize-none`} />
                  </div>
                </div>

                {/* Kanan: Visi + Misi */}
                <div className="space-y-4">
                  {/* Visi */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                    <h3 className="text-sm font-bold text-gray-900">Visi</h3>
                    <textarea value={tentang.visi} onChange={e => setTentang(t => ({ ...t, visi: e.target.value }))} rows={3} className={`${inputCls} resize-none`} />
                  </div>

                  {/* Misi */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900">Misi</h3>
                      <button onClick={() => { setEditingMisi(!editingMisi); setMisiDraft(tentang.misi.join('\n')) }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Pencil className="w-3.5 h-3.5" />
                        {editingMisi ? 'Pratinjau' : 'Edit'}
                      </button>
                    </div>
                    {editingMisi ? (
                      <textarea value={misiDraft} onChange={e => setMisiDraft(e.target.value)} rows={8} placeholder="Satu misi per baris..." className={`${inputCls} resize-none font-mono text-xs`} />
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
                </div>
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
      {testimoniModal !== null && (
        <TestimoniModal
          data={testimoniModal?.id ? testimoniModal : null}
          onClose={() => setTestimoniModal(null)}
          onSave={saveTestimoni}
        />
      )}

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </div>
  )
}
