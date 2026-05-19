import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Edit2, Briefcase, X, Check, MapPin, Clock, ChevronDown, ChevronUp, Layers, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { bidangLowongan as seedBidang, tipeLowongan } from '../../data/lowongan'
import { supabase } from '@/lib/supabase'

function KelolaBidangModal({ bidangs, onClose, onAdd, onDelete }) {
  const [newLabel, setNewLabel] = useState('')
  const [newValue, setNewValue] = useState('')

  function handleAdd() {
    const label = newLabel.trim()
    const value = newValue.trim() || label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (!label || bidangs.find(b => b.value === value)) return
    onAdd({ value, label })
    setNewLabel('')
    setNewValue('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Kelola Bidang Lowongan</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bidang Tersedia</p>
            <div className="flex flex-wrap gap-2">
              {bidangs.map(b => (
                <span key={b.value} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {b.label}
                  <button onClick={() => onDelete(b.value)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tambah Bidang Baru</p>
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Label bidang, cth: Keamanan" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Nilai (opsional, cth: keamanan)" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 text-gray-400" />
            <button onClick={handleAdd} disabled={!newLabel.trim()} className="w-full py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>
              Tambah Bidang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LowonganModal({ item, onClose, onSave, bidangs }) {
  const isEdit = !!item?.id
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState(
    item ?? {
      judul: '', instansi: '', tipe: 'full-time', bidang: 'pendidikan',
      lokasi: '', deskripsi: '', syarat: [''],
      gaji_min: '', gaji_max: '', deadline: '', tanggalPosting: today, aktif: true, slug: '',
    }
  )
  const [syaratInput, setSyaratInput] = useState((item?.syarat ?? ['']).join('\n'))

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  function handleSave() {
    if (!form.judul.trim() || !form.instansi.trim()) return
    const syarat = syaratInput.split('\n').map(s => s.trim()).filter(Boolean)
    const slug = form.slug || form.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    onSave({ ...form, syarat, slug })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Lowongan' : 'Buat Lowongan Baru'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Judul Lowongan</label>
            <input value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="cth. Guru Matematika – MTs Daarul Mughni" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Instansi / Unit Kerja</label>
            <input value={form.instansi} onChange={e => set('instansi', e.target.value)} placeholder="cth. MTs Daarul Mughni Al Maaliki" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Bidang</label>
              <select value={form.bidang} onChange={e => set('bidang', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 bg-white">
                {bidangs.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Tipe Pekerjaan</label>
              <select value={form.tipe} onChange={e => set('tipe', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 bg-white">
                {tipeLowongan.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Lokasi</label>
            <input value={form.lokasi} onChange={e => set('lokasi', e.target.value)} placeholder="cth. Klapanunggal, Bogor" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Gaji Min (Rp)</label>
              <input type="number" min="0" value={form.gaji_min} onChange={e => set('gaji_min', e.target.value)} placeholder="cth. 3000000" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Gaji Max (Rp)</label>
              <input type="number" min="0" value={form.gaji_max} onChange={e => set('gaji_max', e.target.value)} placeholder="cth. 5000000" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Deskripsi Pekerjaan</label>
            <textarea value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)} rows={3} placeholder="Jelaskan tugas dan tanggung jawab posisi ini..." className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Persyaratan (satu per baris)</label>
            <textarea value={syaratInput} onChange={e => setSyaratInput(e.target.value)} rows={4} placeholder={'S1 Pendidikan atau relevan\nPengalaman min. 1 tahun\nMuslim/ah, berakhlak mulia'} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 resize-none font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Tanggal Posting</label>
              <input type="date" value={form.tanggalPosting} onChange={e => set('tanggalPosting', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Batas Pendaftaran</label>
              <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.aktif} onChange={e => set('aktif', e.target.checked)} className="w-4 h-4 accent-green-700" />
            <span className="text-sm text-gray-700">Lowongan aktif / tampilkan ke publik</span>
          </label>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200">Batal</button>
          <button onClick={handleSave} className="px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5" style={{ backgroundColor: '#1A5C38' }}>
            <Check className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailCard({ item, onEdit, onDelete, onToggle, bidangs }) {
  const [open, setOpen] = useState(false)
  const tipeLabel = tipeLowongan.find(t => t.value === item.tipe)?.label ?? item.tipe
  const bidangLabel = bidangs.find(b => b.value === item.bidang)?.label ?? item.bidang
  const deadlinePast = item.deadline && new Date(item.deadline) < new Date()
  const gajiDisplay = item.gaji_min ? `Rp ${(item.gaji_min / 1e6).toFixed(0)}–${(item.gaji_max / 1e6).toFixed(0)} jt/bln` : null

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${!item.aktif ? 'opacity-70' : ''} ${deadlinePast && item.aktif ? 'border-orange-200' : 'border-gray-100'}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{tipeLabel}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{bidangLabel}</span>
              {!item.aktif && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Nonaktif</span>}
              {deadlinePast && item.aktif && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">Deadline Lewat</span>}
            </div>
            <p className="font-bold text-gray-900">{item.judul}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.instansi}</p>
          </div>
          <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-gray-50 flex-shrink-0">
            {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          <div className="flex items-center gap-1 text-[11px] text-gray-500"><MapPin className="w-3 h-3" />{item.lokasi}</div>
          {gajiDisplay && <div className="flex items-center gap-1 text-[11px] text-gray-500"><span className="font-semibold">Gaji:</span> {gajiDisplay}</div>}
          {item.deadline && <div className="flex items-center gap-1 text-[11px] text-gray-500"><Clock className="w-3 h-3" />Deadline: {new Date(item.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
        </div>
        {open && (
          <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
            {item.deskripsi && <p className="text-sm text-gray-600">{item.deskripsi}</p>}
            {item.syarat?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1.5">Persyaratan:</p>
                <ul className="space-y-1">
                  {item.syarat.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
          <button onClick={() => onToggle(item.id)}
            className="flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors"
            style={item.aktif
              ? { color: '#DC2626', borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }
              : { color: '#16A34A', borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }
            }>
            {item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button onClick={() => onEdit(item)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-600 flex items-center gap-1 hover:bg-gray-50">
            <Edit2 className="w-3 h-3" /> Edit
          </button>
          <button onClick={() => onDelete(item.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-100 bg-red-50 text-red-500 flex items-center gap-1 hover:bg-red-100">
            <Trash2 className="w-3 h-3" /> Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

function mapLowongan(row) {
  return {
    id: row.id,
    judul: row.judul ?? '',
    instansi: row.perusahaan ?? '',
    tipe: row.tipe ?? 'full-time',
    bidang: 'pendidikan',
    lokasi: row.lokasi ?? '',
    deskripsi: row.deskripsi ?? '',
    syarat: row.persyaratan ?? [],
    gaji_min: row.gaji_min ?? '',
    gaji_max: row.gaji_max ?? '',
    deadline: row.deadline ?? '',
    tanggalPosting: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
    tags: [],
    aktif: row.is_aktif,
    slug: '',
  }
}

export default function AdminKarirPage() {
  const [lowongan, setLowongan] = useState([])
  const [bidangs, setBidangs] = useState(seedBidang)
  const [search, setSearch] = useState('')
  const [filterBidang, setFilterBidang] = useState('semua')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [modal, setModal] = useState(null)
  const [bidangModal, setBidangModal] = useState(false)
  const [confirm, setConfirm] = useState({ open: false })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('lowongan')
      .select('id, judul, perusahaan, lokasi, tipe, deskripsi, persyaratan, gaji_min, gaji_max, deadline, is_aktif, created_at')
      .order('created_at', { ascending: false })
    if (err) { setError(err.message); if (!silent) setLoading(false); return }
    setLowongan((data ?? []).map(mapLowongan))
    if (!silent) setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function refreshData() {
    setRefreshing(true)
    await loadData({ silent: true })
    setRefreshing(false)
  }

  const filtered = lowongan.filter(l => {
    const matchSearch = l.judul.toLowerCase().includes(search.toLowerCase()) || l.instansi.toLowerCase().includes(search.toLowerCase())
    const matchBidang = filterBidang === 'semua' || l.bidang === filterBidang
    const matchStatus = filterStatus === 'semua' || (filterStatus === 'aktif' ? l.aktif : !l.aktif)
    return matchSearch && matchBidang && matchStatus
  })

  function handleSave(form) {
    const isEdit = !!form.id
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Lowongan' : 'Tambah Lowongan Baru',
      message: isEdit
        ? 'Apakah Anda yakin ingin menyimpan perubahan pada lowongan ini?'
        : 'Apakah Anda yakin ingin menambahkan lowongan baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const syarat = (form.syarat ?? []).filter(Boolean)
        const dbData = {
          judul: form.judul,
          perusahaan: form.instansi,
          lokasi: form.lokasi || null,
          tipe: form.tipe || null,
          deskripsi: form.deskripsi || null,
          persyaratan: syarat,
          gaji_min: form.gaji_min ? parseInt(form.gaji_min) : null,
          gaji_max: form.gaji_max ? parseInt(form.gaji_max) : null,
          deadline: form.deadline || null,
          is_aktif: form.aktif,
        }
        if (isEdit) {
          const { error: err } = await supabase.from('lowongan').update(dbData).eq('id', form.id)
          if (!err) setLowongan(l => l.map(x => x.id === form.id ? { ...x, ...form } : x))
        } else {
          const { data, error: err } = await supabase.from('lowongan').insert(dbData).select('id').single()
          if (!err && data) setLowongan(l => [...l, { ...form, id: data.id }])
        }
        setModal(null)
        closeConfirm()
      },
    })
  }

  function handleDelete(id) {
    askConfirm({
      title: 'Hapus Lowongan', message: 'Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak dapat dibatalkan.',
      confirmLabel: 'Ya, Hapus', variant: 'danger',
      onConfirm: async () => {
        await supabase.from('lowongan').delete().eq('id', id)
        setLowongan(l => l.filter(x => x.id !== id))
        closeConfirm()
      },
    })
  }

  function toggleAktif(id) {
    const item = lowongan.find(x => x.id === id)
    if (!item) return
    askConfirm({
      title: item.aktif ? 'Nonaktifkan Lowongan' : 'Aktifkan Lowongan',
      message: item.aktif
        ? 'Lowongan ini tidak akan tampil ke publik setelah dinonaktifkan. Apakah Anda yakin ingin melanjutkan?'
        : 'Lowongan ini akan ditampilkan ke publik. Pastikan data sudah lengkap dan benar sebelum mengaktifkan.',
      confirmLabel: item.aktif ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan',
      variant: item.aktif ? 'danger' : 'success',
      onConfirm: async () => {
        await supabase.from('lowongan').update({ is_aktif: !item.aktif }).eq('id', id)
        setLowongan(l => l.map(x => x.id === id ? { ...x, aktif: !x.aktif } : x))
        closeConfirm()
      },
    })
  }

  const aktifCount = lowongan.filter(l => l.aktif).length

  return (
    <>
        <AdminHeader
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari lowongan..."
        />

        <motion.div
          className="flex-1 p-6 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Page title + actions */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Kelola Lowongan Karir</h1>
              <p className="text-sm text-gray-500 mt-0.5">Lowongan pekerjaan dari unit-unit pesantren.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setBidangModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                <Layers className="w-4 h-4" /> Kelola Bidang
              </button>
              <button onClick={refreshData} disabled={refreshing} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh
              </button>
              <button onClick={() => setModal({})} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#1A5C38' }}>
                <Plus className="w-4 h-4" /> Buat Lowongan
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Lowongan', value: lowongan.length, color: '#1A5C38' },
              { label: 'Lowongan Aktif', value: aktifCount, color: '#059669' },
              { label: 'Tidak Aktif', value: lowongan.length - aktifCount, color: '#D97706' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <select value={filterBidang} onChange={e => setFilterBidang(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-green-400">
              <option value="semua">Semua Bidang</option>
              {bidangs.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
            <div className="flex gap-1.5">
              {[{ value: 'semua', label: 'Semua' }, { value: 'aktif', label: 'Aktif' }, { value: 'nonaktif', label: 'Nonaktif' }].map(f => (
                <button key={f.value} onClick={() => setFilterStatus(f.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                  style={filterStatus === f.value ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
              <button onClick={loadData} className="ml-auto text-xs font-semibold underline">Coba lagi</button>
            </div>
          )}

          {/* List */}
          {(loading || refreshing) ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Tidak ada lowongan ditemukan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(l => (
                <DetailCard key={l.id} item={l} onEdit={setModal} onDelete={handleDelete} onToggle={toggleAktif} bidangs={bidangs} />
              ))}
            </div>
          )}
        </motion.div>

      {modal !== null && (
        <LowonganModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} bidangs={bidangs} />
      )}

      {bidangModal && (
        <KelolaBidangModal
          bidangs={bidangs}
          onClose={() => setBidangModal(false)}
          onAdd={b => setBidangs(prev => [...prev, b])}
          onDelete={v => {
            setBidangs(prev => prev.filter(b => b.value !== v))
            if (filterBidang === v) setFilterBidang('semua')
          }}
        />
      )}

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </>
  )
}
