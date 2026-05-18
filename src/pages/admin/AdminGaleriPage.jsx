import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Edit2, Image, X, Check, Eye, Tag, Layers, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ImageUploadBox from '../../components/admin/ImageUploadBox'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { kategoriGaleri } from '../../data/galeri'
import { supabase } from '@/lib/supabase'

const PER_PAGE_OPTS = [6, 12, 24]

function KelolаKategoriModal({ kategoris, onClose, onAdd, onDelete }) {
  const [newLabel, setNewLabel] = useState('')
  const [newValue, setNewValue] = useState('')

  function handleAdd() {
    const label = newLabel.trim()
    const value = newValue.trim() || label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (!label || kategoris.find(k => k.value === value)) return
    onAdd({ value, label })
    setNewLabel('')
    setNewValue('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Kelola Kategori Galeri</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Kategori Tersedia</p>
            <div className="flex flex-wrap gap-2">
              {kategoris.map(k => (
                <span key={k.value} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                  {k.label}
                  <button onClick={() => onDelete(k.value)} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tambah Kategori Baru</p>
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Label kategori, cth: Reuni" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Nilai (opsional, cth: reuni)" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 text-gray-400" />
            <button onClick={handleAdd} disabled={!newLabel.trim()} className="w-full py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>
              Tambah Kategori
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GaleriModal({ item, onClose, onSave, kategoris }) {
  const isEdit = !!item?.id
  const [form, setForm] = useState(
    item ?? { judul: '', kategori: 'kegiatan', tanggal: '', url: '', deskripsi: '', tags: [], aktif: true }
  )
  const [tagInput, setTagInput] = useState('')

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  function addTag() {
    const t = tagInput.trim()
    if (t && !(form.tags ?? []).includes(t)) set('tags', [...(form.tags ?? []), t])
    setTagInput('')
  }

  function removeTag(t) { set('tags', (form.tags ?? []).filter(x => x !== t)) }

  function handleSave() {
    if (!form.judul.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <ImageUploadBox label="Foto" hint="JPG/PNG · Upload atau paste URL" value={form.url} onChange={url => set('url', url)} bucket="galeri-images" pathPrefix="galeri" />
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Judul Foto</label>
            <input value={form.judul} onChange={e => set('judul', e.target.value)} placeholder="Judul foto..." className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Kategori</label>
              <select value={form.kategori} onChange={e => set('kategori', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 bg-white">
                {kategoris.map(k => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Tanggal</label>
              <input type="date" value={form.tanggal} onChange={e => set('tanggal', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)} rows={3} placeholder="Deskripsi singkat..." className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Tag</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.tags ?? []).map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {t}<button type="button" onClick={() => removeTag(t)} className="opacity-60 hover:opacity-100"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} placeholder="Tambah tag, tekan Enter..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
              <button type="button" onClick={addTag} className="px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.aktif} onChange={e => set('aktif', e.target.checked)} className="w-4 h-4 accent-green-700" />
            <span className="text-sm text-gray-700">Aktif / tampilkan di halaman pesantren</span>
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

export default function AdminGaleriPage() {
  const [galeri, setGaleri] = useState([])
  const [kategoris, setKategoris] = useState([{ value: 'semua', label: 'Semua' }, ...kategoriGaleri])
  const [search, setSearch] = useState('')
  const [filterKat, setFilterKat] = useState('semua')
  const [modal, setModal] = useState(null)
  const [kategoriModal, setKategoriModal] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(6)
  const [preview, setPreview] = useState(null)
  const [confirm, setConfirm] = useState({ open: false })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('galeri')
      .select('id, judul, deskripsi, foto_url, kategori, is_aktif, created_at')
      .order('created_at', { ascending: false })
    if (err) { setError(err.message); if (!silent) setLoading(false); return }
    setGaleri((data ?? []).map(row => ({
      id: row.id,
      judul: row.judul,
      deskripsi: row.deskripsi ?? '',
      url: row.foto_url,
      kategori: row.kategori ?? 'kegiatan',
      tanggal: '',
      tags: [],
      aktif: row.is_aktif,
    })))
    if (!silent) setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function refreshData() {
    setRefreshing(true)
    await loadData({ silent: true })
    setRefreshing(false)
  }

  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  const filtered = galeri.filter(g => {
    const matchKat = filterKat === 'semua' || g.kategori === filterKat
    const matchSearch = g.judul.toLowerCase().includes(search.toLowerCase())
    return matchKat && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const shown = filtered.slice((page - 1) * perPage, page * perPage)

  function handleSave(form) {
    const isEdit = !!form.id
    if (!isEdit && galeri.length >= MAX_GALERI) {
      alert(`Batas maksimal ${MAX_GALERI} foto telah tercapai. Hapus foto yang ada terlebih dahulu.`)
      return
    }
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Foto' : 'Tambah Foto Baru',
      message: isEdit
        ? 'Apakah Anda yakin ingin menyimpan perubahan pada foto ini?'
        : 'Apakah Anda yakin ingin menambahkan foto baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const dbData = {
          judul: form.judul,
          deskripsi: form.deskripsi || null,
          foto_url: form.url,
          kategori: form.kategori,
          is_aktif: form.aktif,
        }
        if (isEdit) {
          const { error: err } = await supabase.from('galeri').update(dbData).eq('id', form.id)
          if (!err) setGaleri(g => g.map(x => x.id === form.id ? { ...x, ...form } : x))
        } else {
          const { data, error: err } = await supabase.from('galeri').insert(dbData).select('id').single()
          if (!err && data) setGaleri(g => [...g, { ...form, id: data.id }])
        }
        setModal(null)
        closeConfirm()
      },
    })
  }

  function handleDelete(id) {
    askConfirm({
      title: 'Hapus Foto', message: 'Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak dapat dibatalkan.',
      confirmLabel: 'Ya, Hapus', variant: 'danger',
      onConfirm: async () => {
        await supabase.from('galeri').delete().eq('id', id)
        setGaleri(g => g.filter(x => x.id !== id))
        closeConfirm()
      },
    })
  }

  function toggleAktif(id) {
    const item = galeri.find(x => x.id === id)
    if (!item) return
    askConfirm({
      title: item.aktif ? 'Sembunyikan Foto' : 'Tampilkan Foto',
      message: item.aktif ? 'Foto ini akan disembunyikan dari halaman publik. Lanjutkan?' : 'Foto ini akan ditampilkan di halaman pesantren publik. Lanjutkan?',
      confirmLabel: 'Ya, Lanjutkan', variant: 'warning',
      onConfirm: async () => {
        await supabase.from('galeri').update({ is_aktif: !item.aktif }).eq('id', id)
        setGaleri(g => g.map(x => x.id === id ? { ...x, aktif: !x.aktif } : x))
        closeConfirm()
      },
    })
  }

  const aktifCount = galeri.filter(g => g.aktif).length
  const MAX_GALERI = 10
  const isAtLimit  = galeri.length >= MAX_GALERI

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="galeri" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Cari foto..."
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
              <h1 className="text-2xl font-extrabold text-gray-900">Kelola Galeri</h1>
              <p className="text-sm text-gray-500 mt-0.5">Dokumentasi foto kegiatan alumni &amp; pesantren.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setKategoriModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                <Layers className="w-4 h-4" /> Kelola Kategori
              </button>
              <button
                onClick={() => !isAtLimit && setModal({})}
                disabled={isAtLimit}
                title={isAtLimit ? `Maksimal ${MAX_GALERI} foto. Hapus foto dulu.` : undefined}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: '#1A5C38' }}
              >
                <Plus className="w-4 h-4" /> Tambah Foto
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: `Total Foto (maks. ${MAX_GALERI})`, value: `${galeri.length} / ${MAX_GALERI}`, color: isAtLimit ? '#BE123C' : '#1A5C38' },
              { label: 'Ditampilkan', value: aktifCount, color: '#059669' },
              { label: 'Disembunyikan', value: galeri.length - aktifCount, color: '#D97706' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Limit warning */}
          {isAtLimit && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Batas maksimal <strong>{MAX_GALERI} foto</strong> telah tercapai. Hapus foto yang ada sebelum menambahkan foto baru.</span>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={refreshData} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Refresh
            </button>
            <div className="flex flex-wrap gap-1.5">
              {kategoris.map(k => (
                <button key={k.value} onClick={() => { setFilterKat(k.value); setPage(1) }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                  style={filterKat === k.value
                    ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' }
                    : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
              <button onClick={loadData} className="ml-auto text-xs font-semibold underline">Coba lagi</button>
            </div>
          )}

          {/* Grid */}
          {(loading || refreshing) ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
          ) : shown.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Image className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Tidak ada foto ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {shown.map(g => (
                <div key={g.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
                  <div className="relative h-44 overflow-hidden">
                    <img src={g.url} alt={g.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80' }} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => setPreview(g)} className="p-2 bg-white rounded-xl shadow-sm"><Eye className="w-4 h-4 text-gray-700" /></button>
                      <button onClick={() => setModal(g)} className="p-2 bg-white rounded-xl shadow-sm"><Edit2 className="w-4 h-4 text-gray-700" /></button>
                      <button onClick={() => handleDelete(g.id)} className="p-2 bg-white rounded-xl shadow-sm"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-700 capitalize">{g.kategori}</span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button onClick={() => toggleAktif(g.id)} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.aktif ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                        {g.aktif ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{g.judul}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{g.tanggal ? new Date(g.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p>
                    {g.deskripsi && <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{g.deskripsi}</p>}
                    {g.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {g.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Per halaman:</span>
              {PER_PAGE_OPTS.map(n => (
                <button key={n} onClick={() => { setPerPage(n); setPage(1) }}
                  className="px-3 py-1 rounded-lg text-xs font-semibold border"
                  style={perPage === n ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
                  {n}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="w-7 h-7 rounded-lg text-xs font-semibold border"
                  style={page === p ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {modal !== null && (
        <GaleriModal
          item={modal?.id ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          kategoris={kategoris.filter(k => k.value !== 'semua')}
        />
      )}

      {kategoriModal && (
        <KelolаKategoriModal
          kategoris={kategoris.filter(k => k.value !== 'semua')}
          onClose={() => setKategoriModal(false)}
          onAdd={k => setKategoris(prev => [...prev, k])}
          onDelete={v => {
            setKategoris(prev => prev.filter(k => k.value !== v))
            if (filterKat === v) setFilterKat('semua')
          }}
        />
      )}

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }} onClick={() => setPreview(null)}>
          <div className="max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <img src={preview.url} alt={preview.judul} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            <p className="text-white text-center mt-3 text-sm font-semibold">{preview.judul}</p>
            <button onClick={() => setPreview(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-xl p-2"><X className="w-5 h-5 text-white" /></button>
          </div>
        </div>
      )}
    </div>
  )
}
