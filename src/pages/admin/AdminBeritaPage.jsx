import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Download, Tag, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ImageUploadBox from '../../components/admin/ImageUploadBox'
import { PaginationBar, PerPageSelector } from '../../components/PaginationBar'
import { categories as initialKategoriData } from '../../data/news'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const STATUS_DB_TO_UI = { published: 'Terbit', draft: 'Menunggu Verifikasi Admin', archived: 'Diarsipkan' }
const STATUS_UI_TO_DB = { 'Terbit': 'published', 'Menunggu Verifikasi Admin': 'draft', 'Diarsipkan': 'archived' }

function generateSlug(judul) {
  return judul.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36)
}

function formatTanggal(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getInitials(name) {
  if (!name) return 'A'
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

const STATUS_LIST = ['Terbit', 'Menunggu Verifikasi Admin', 'Diarsipkan']

const STATUS_STYLE = {
  'Terbit':                   { bg: '#F0FDF4', text: '#15803D' },
  'Menunggu Verifikasi Admin':{ bg: '#FFFBEB', text: '#D97706' },
  'Diarsipkan':               { bg: '#FFF1F2', text: '#BE123C' },
}

// Preset color schemes for news category badges (light bg + dark text)
const WARNA_KATEGORI = [
  { bg: '#E8F5EE', text: '#1A5C38', border: 'rgba(26,92,56,0.15)' },
  { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  { bg: '#EFF6FF', text: '#1D4ED8', border: '#DBEAFE' },
  { bg: '#FDF4FF', text: '#7E22CE', border: '#F3E8FF' },
  { bg: '#FFF1F2', text: '#BE123C', border: '#FFE4E6' },
  { bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' },
  { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
]

// Seed from news.js categories (skip "semua")
const seedKategoris = initialKategoriData
  .filter(c => c.value !== 'semua')
  .map(c => ({ id: c.value, label: c.label, bg: c.bg, text: c.text, border: c.border }))

function SectionLabel({ children }) {
  return <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{children}</p>
}

// ── Kategori Manager Modal ─────────────────────────────────────────────────────
function KategoriManagerModal({ kategoris, onClose, onAdd, onDelete }) {
  const [newLabel, setNewLabel] = useState('')
  const [newWarna, setNewWarna] = useState(WARNA_KATEGORI[0])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleAdd() {
    const label = newLabel.trim()
    if (!label) return
    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (kategoris.find(k => k.id === id)) return
    onAdd({ id, label, ...newWarna })
    setNewLabel('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Kelola Kategori Berita</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <SectionLabel>Kategori Tersedia</SectionLabel>
            <div className="mt-3 flex flex-wrap gap-2">
              {kategoris.map((k) => (
                <span
                  key={k.id}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: k.bg, color: k.text, border: `1px solid ${k.border}` }}
                >
                  {k.label}
                  <button
                    onClick={() => onDelete(k.id)}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {kategoris.length === 0 && (
                <p className="text-xs text-gray-400 italic">Belum ada kategori.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <SectionLabel>Tambah Kategori Baru</SectionLabel>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="contoh: Kegiatan Alumni"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors"
            />
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Pilih Warna</p>
              <div className="flex flex-wrap gap-2">
                {WARNA_KATEGORI.map((w, i) => (
                  <button
                    key={i}
                    onClick={() => setNewWarna(w)}
                    className="w-6 h-6 rounded-full transition-all"
                    style={{
                      backgroundColor: w.text,
                      outline: newWarna === w ? `3px solid ${w.text}` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
            {newLabel.trim() && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Preview:</span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: newWarna.bg, color: newWarna.text, border: `1px solid ${newWarna.border}` }}
                >
                  {newLabel.trim()}
                </span>
              </div>
            )}
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim()}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: '#1A5C38' }}
            >
              Tambah Kategori
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Berita Modal ───────────────────────────────────────────────────────────────
function BeritaModal({ berita, kategoris, onClose, onSave }) {
  const isEdit = !!berita
  const [form, setForm] = useState(isEdit
    ? {
        judul: berita.judul,
        kategori: berita.kategori || '',
        status: berita.status,
        tanggal: berita.published_at_raw ? berita.published_at_raw.slice(0, 10) : '',
        penulis: berita.penulis || '',
        banner: berita.banner || '',
      }
    : {
        judul: '',
        kategori: '',
        status: 'Menunggu Verifikasi Admin',
        tanggal: '',
        penulis: '',
        banner: '',
      }
  )
  const [blocks, setBlocks] = useState(isEdit ? (berita.content || []) : [])
  const [articleTags, setArticleTags] = useState(isEdit ? (berita.tags || []) : [])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Block management
  function addBlock(type) {
    const id = Date.now()
    const newBlock = type === 'paragraph'
      ? { id, type: 'paragraph', text: '' }
      : type === 'quote'
      ? { id, type: 'quote', text: '', author: '' }
      : { id, type: 'images', items: [] }
    setBlocks(prev => [...prev, newBlock])
  }

  function updateBlock(id, updates) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  function removeBlock(id) {
    setBlocks(prev => prev.filter(b => b.id !== id))
  }

  function moveBlock(id, dir) {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id)
      if (idx < 0) return prev
      const next = [...prev]
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= next.length) return prev
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })
  }

  // Tag management
  function addTag() {
    const t = tagInput.trim()
    if (t && !articleTags.includes(t)) setArticleTags(prev => [...prev, t])
    setTagInput('')
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* Informasi Dasar */}
          <div className="space-y-4">
            <SectionLabel>Informasi Dasar</SectionLabel>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Berita</label>
              <input type="text" value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })}
                placeholder="Tulis judul berita..." className={inputCls} />
            </div>

            {/* Kategori chips */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
              {kategoris.length === 0
                ? <p className="text-xs text-gray-400 italic">Belum ada kategori. Tambahkan lewat "Kelola Kategori".</p>
                : (
                  <div className="flex flex-wrap gap-2">
                    {kategoris.map(k => {
                      const sel = form.kategori === k.id
                      return (
                        <button
                          key={k.id}
                          type="button"
                          onClick={() => setForm({ ...form, kategori: sel ? '' : k.id })}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all"
                          style={sel
                            ? { backgroundColor: k.bg, color: k.text, borderColor: k.text }
                            : { backgroundColor: 'transparent', color: k.text, borderColor: k.text, opacity: 0.6 }
                          }
                        >
                          {k.label}
                        </button>
                      )
                    })}
                  </div>
                )
              }
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tanggal Terbit</label>
                <input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                  {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Penulis */}
          <div className="pt-1 border-t border-gray-100 space-y-3">
            <SectionLabel>Penulis</SectionLabel>
            <input
              type="text"
              value={form.penulis}
              onChange={e => setForm({ ...form, penulis: e.target.value })}
              placeholder="Nama penulis artikel..."
              className={inputCls}
            />
          </div>

          {/* Konten */}
          <div className="space-y-3 pt-1 border-t border-gray-100">
            <SectionLabel>Isi Berita</SectionLabel>
            <p className="text-[11px] text-gray-400">Susun konten dari blok-blok di bawah. Paragraf tampil sebagai teks biasa, Kutipan tampil dengan garis emas di sisi kiri, Foto tampil sebagai grid 2 kolom.</p>

            {/* Blocks */}
            <div className="space-y-2">
              {blocks.map((block, idx) => (
                <div key={block.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Block header */}
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {block.type === 'paragraph' ? '¶ Paragraf' : block.type === 'quote' ? '" Kutipan' : '🖼 Foto'}
                    </span>
                    <div className="flex items-center gap-1">
                      {idx > 0 && (
                        <button onClick={() => moveBlock(block.id, 'up')} className="text-gray-400 hover:text-gray-600 text-xs px-1">↑</button>
                      )}
                      {idx < blocks.length - 1 && (
                        <button onClick={() => moveBlock(block.id, 'down')} className="text-gray-400 hover:text-gray-600 text-xs px-1">↓</button>
                      )}
                      <button onClick={() => removeBlock(block.id)} className="text-red-400 hover:text-red-600 ml-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block content */}
                  <div className="p-3">
                    {block.type === 'paragraph' && (
                      <textarea
                        value={block.text}
                        onChange={e => updateBlock(block.id, { text: e.target.value })}
                        placeholder="Tulis paragraf di sini..."
                        rows={3}
                        className="w-full text-sm text-gray-700 leading-relaxed outline-none resize-none"
                      />
                    )}
                    {block.type === 'quote' && (
                      <div className="pl-3 border-l-[3px] border-[#F0A500] space-y-2">
                        <textarea
                          value={block.text}
                          onChange={e => updateBlock(block.id, { text: e.target.value })}
                          placeholder="Isi kutipan..."
                          rows={2}
                          className="w-full text-sm italic text-gray-600 leading-relaxed outline-none resize-none"
                        />
                        <input
                          type="text"
                          value={block.author}
                          onChange={e => updateBlock(block.id, { author: e.target.value })}
                          placeholder="Nama & jabatan narasumber"
                          className="w-full text-xs font-bold text-[#1A5C38] outline-none"
                        />
                      </div>
                    )}
                    {block.type === 'images' && (
                      <div className="grid grid-cols-2 gap-2">
                        <ImageUploadBox
                          hint="Foto 1"
                          value={block.items?.[0] || ''}
                          onChange={url => {
                            const items = [...(block.items || [])]
                            items[0] = url
                            updateBlock(block.id, { items })
                          }}
                          bucket="berita-images"
                          pathPrefix="berita/konten"
                        />
                        <ImageUploadBox
                          hint="Foto 2 (opsional)"
                          value={block.items?.[1] || ''}
                          onChange={url => {
                            const items = [...(block.items || [])]
                            items[1] = url
                            updateBlock(block.id, { items })
                          }}
                          bucket="berita-images"
                          pathPrefix="berita/konten"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add block buttons */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-gray-400 shrink-0">Tambah blok:</span>
              {[
                { type: 'paragraph', label: '+ Paragraf' },
                { type: 'quote',     label: '+ Kutipan' },
                { type: 'images',    label: '+ Foto' },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50/40 transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3 pt-1 border-t border-gray-100">
            <SectionLabel>Tag Artikel</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {articleTags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">
                  {t}
                  <button onClick={() => setArticleTags(prev => prev.filter(x => x !== t))}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Ketik tag lalu Enter (contoh: Beasiswa, Reuni)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 transition-colors"
              />
              <button onClick={addTag} className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gambar */}
          <div className="space-y-3 pt-1 border-t border-gray-100">
            <SectionLabel>Gambar Berita</SectionLabel>
            <ImageUploadBox
              label="Gambar Berita"
              hint="Rasio 16:9 · JPG/PNG · maks. 5MB · Digunakan sebagai thumbnail kartu dan gambar header halaman detail"
              value={form.banner}
              onChange={url => setForm(f => ({ ...f, banner: url }))}
              bucket="berita-images"
              pathPrefix="berita"
            />
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            onClick={() => form.judul && onSave({ ...form, content: blocks, tags: articleTags })}
            disabled={!form.judul}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#1A5C38' }}
          >
            {isEdit ? 'Simpan Perubahan' : 'Tambah Berita'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdminBeritaPage() {
  const { profile } = useAuth()
  const [berita, setBerita] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [kategoris, setKategoris] = useState(seedKategoris)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modal, setModal] = useState(null)
  const [kategoriModal, setKategoriModal] = useState(false)
  const [confirm, setConfirm] = useState({ open: false })

  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('berita')
        .select('id, judul, slug, konten, foto_url, kategori, tag, status, published_at, author_id, penulis')
        .order('created_at', { ascending: false })
      if (err) throw err
      setBerita((data ?? []).map((row) => {
        let content = []
        try { const p = JSON.parse(row.konten); if (Array.isArray(p)) content = p } catch {}
        return {
          id: row.id,
          judul: row.judul,
          slug: row.slug,
          kategori: row.kategori ?? '',
          status: STATUS_DB_TO_UI[row.status] ?? 'Menunggu Verifikasi Admin',
          penulis: row.penulis ?? '',
          penulisSingkatan: getInitials(row.penulis ?? ''),
          tanggal: formatTanggal(row.published_at),
          published_at_raw: row.published_at ?? null,
          banner: row.foto_url ?? '',
          tags: row.tag ?? [],
          content,
        }
      }))
    } catch (e) {
      setError(e.message ?? 'Gagal memuat data berita')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = berita.filter((b) => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.judul.toLowerCase().includes(q) || b.kategori.toLowerCase().includes(q)
    const matchStatus = !filterStatus || b.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const startIdx = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const endIdx = Math.min(page * perPage, filtered.length)

  function handleSave(form) {
    const isEdit = modal && modal !== 'tambah'
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Berita' : 'Tambah Berita Baru',
      message: isEdit
        ? 'Apakah Anda yakin ingin menyimpan perubahan pada berita ini?'
        : 'Apakah Anda yakin ingin menambahkan berita baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const dbStatus = STATUS_UI_TO_DB[form.status] ?? 'draft'
        const publishedAt = form.tanggal
          ? new Date(form.tanggal).toISOString()
          : (dbStatus === 'published' ? new Date().toISOString() : null)
        const payload = {
          judul: form.judul,
          penulis: form.penulis || null,
          konten: JSON.stringify(form.content ?? []),
          foto_url: form.banner || null,
          kategori: form.kategori || null,
          tag: form.tags ?? [],
          status: dbStatus,
          published_at: publishedAt,
          author_id: profile?.id ?? null,
        }
        if (!isEdit) {
          payload.slug = generateSlug(form.judul)
          const { error: err } = await supabase.from('berita').insert(payload)
          if (err) { alert('Gagal menyimpan: ' + err.message); closeConfirm(); return }
        } else {
          const { error: err } = await supabase.from('berita').update(payload).eq('id', modal.id)
          if (err) { alert('Gagal menyimpan: ' + err.message); closeConfirm(); return }
        }
        setModal(null)
        closeConfirm()
        loadData()
      },
    })
  }

  async function handleDelete(id) {
    askConfirm({
      title: 'Hapus Berita',
      message: 'Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        const { error: err } = await supabase.from('berita').delete().eq('id', id)
        if (err) { alert('Gagal menghapus: ' + err.message) }
        closeConfirm()
        loadData()
      },
    })
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="berita" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Cari berita..."
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
              <h1 className="text-2xl font-extrabold text-gray-900">Kelola Berita</h1>
              <p className="text-sm text-gray-500 mt-0.5">Buat, edit, dan kelola artikel berita portal alumni.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setKategoriModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Tag className="w-4 h-4" /> Kelola Kategori
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" /> Ekspor
              </button>
              <button
                onClick={() => setModal('tambah')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1A5C38' }}
              >
                <Plus className="w-4 h-4" /> Tambah Berita
              </button>
            </div>
          </div>

          {/* Filter + PerPage */}
          <div className="flex items-center gap-2 flex-wrap">
            {['', 'Terbit', 'Menunggu Verifikasi Admin', 'Diarsipkan'].map((s) => (
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
              <PerPageSelector value={perPage} options={[5, 10, 20]} onChange={n => { setPerPage(n); setPage(1) }} />
              <span className="text-xs text-gray-400">{startIdx}–{endIdx} dari {filtered.length} artikel</span>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
              <button onClick={loadData} className="ml-auto font-bold hover:underline">Coba lagi</button>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-7 h-7 animate-spin text-[#1A5C38]" />
              </div>
            ) : (
            <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Judul', 'Kategori', 'Status', 'Penulis', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map((b) => {
                  const st = STATUS_STYLE[b.status] ?? { bg: '#F9FAFB', text: '#6B7280' }
                  const kat = kategoris.find(k => k.id === b.kategori)
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{b.judul}</p>
                        {b.tags?.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {b.tags.slice(0, 3).map(t => (
                              <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded">{t}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {kat ? (
                          <span
                            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                            style={{ backgroundColor: kat.bg, color: kat.text, border: `1px solid ${kat.border}` }}
                          >
                            {kat.label}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: st.bg, color: st.text }}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {b.penulisSingkatan && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#1A5C38' }}>
                              {b.penulisSingkatan}
                            </div>
                          )}
                          <span className="text-sm text-gray-500">{b.penulis}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{b.tanggal}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setModal(b)} className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-blue-500 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-400">Tidak ada berita yang ditemukan.</p>
              </div>
            )}
            </>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center">
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

      {kategoriModal && (
        <KategoriManagerModal
          kategoris={kategoris}
          onClose={() => setKategoriModal(false)}
          onAdd={(k) => setKategoris(prev => [...prev, k])}
          onDelete={(id) => setKategoris(prev => prev.filter(k => k.id !== id))}
        />
      )}

      {modal && (
        <BeritaModal
          berita={modal === 'tambah' ? null : modal}
          kategoris={kategoris}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </div>
  )
}
