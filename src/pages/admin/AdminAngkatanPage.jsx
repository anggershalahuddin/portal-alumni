import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, GraduationCap, Upload, X, ChevronUp, ChevronDown, Loader2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminHeader from '@/components/admin/AdminHeader'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { PaginationBar, PerPageSelector } from '@/components/PaginationBar'
import { getAngkatanKe } from '@/data/angkatan'
import { supabase } from '@/lib/supabase'

const CURRENT_YEAR = new Date().getFullYear()

function LogoBox({ previewUrl, onChange }) {
  const inputRef = useRef()
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#1A5C38] transition-colors bg-gray-50 overflow-hidden"
        onClick={() => inputRef.current?.click()}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Logo angkatan" className="w-full h-full object-contain" />
        ) : (
          <>
            <Upload className="w-5 h-5 text-gray-300 mb-1" />
            <span className="text-[10px] text-gray-400">Unggah logo</span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (!file) return
          onChange({ previewUrl: URL.createObjectURL(file), file })
        }}
      />
      {previewUrl && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-[10px] text-red-400 hover:text-red-600"
        >
          Hapus logo
        </button>
      )}
    </div>
  )
}

const EMPTY_FORM = { tahunLulusan: '', angkatanKe: '', nama: '', logoPreview: null, logoFile: null }

function AngkatanModal({ data, onClose, onSave }) {
  const isEdit = !!data
  const [form, setForm] = useState(
    isEdit
      ? { tahunLulusan: String(data.tahunLulusan), angkatanKe: String(data.angkatanKe), nama: data.nama, logoPreview: data.logoUrl ?? null, logoFile: null }
      : { ...EMPTY_FORM }
  )

  function handleTahun(val) {
    const ke = getAngkatanKe(val)
    setForm(f => ({ ...f, tahunLulusan: val, angkatanKe: ke ? String(ke) : '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.tahunLulusan || !form.angkatanKe || !form.nama.trim()) return
    onSave({
      tahunLulusan: parseInt(form.tahunLulusan),
      angkatanKe: parseInt(form.angkatanKe),
      nama: form.nama.trim(),
      logoPreview: form.logoPreview,
      logoFile: form.logoFile,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(6,15,9,0.55)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#0A2415]">
            {isEdit ? 'Edit Angkatan' : 'Tambah Angkatan'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5">
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-4">
                {/* Tahun lulusan */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Tahun Lulusan <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max={CURRENT_YEAR + 5}
                    value={form.tahunLulusan}
                    onChange={e => handleTahun(e.target.value)}
                    placeholder="contoh: 2010"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A5C38]"
                    required
                  />
                </div>

                {/* Angkatan ke */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Angkatan Ke
                    <span className="ml-1 text-[10px] font-normal text-gray-400">(otomatis terisi)</span>
                  </label>
                  <input
                    type="number"
                    value={form.angkatanKe}
                    onChange={e => setForm(f => ({ ...f, angkatanKe: e.target.value }))}
                    placeholder="—"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A5C38] bg-gray-50"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Dihitung dari tahun lulusan pertama (2006 = Angkatan 1)</p>
                </div>

                {/* Nama angkatan */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Nama Angkatan <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                    placeholder="contoh: Angkatan Al-Fatih"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1A5C38]"
                    required
                  />
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 text-center">Logo</label>
                <LogoBox
                  previewUrl={form.logoPreview}
                  onChange={v => {
                    if (v) setForm(f => ({ ...f, logoPreview: v.previewUrl, logoFile: v.file }))
                    else setForm(f => ({ ...f, logoPreview: null, logoFile: null }))
                  }}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#1A5C38' }}
            >
              {isEdit ? 'Simpan Perubahan' : 'Tambah Angkatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function mapAngkatan(row) {
  return {
    id: row.id,
    tahunLulusan: row.tahun_lulus,
    angkatanKe: row.tahun_lulus - 2005,
    nama: row.nama_angkatan ?? `Angkatan ${row.tahun_lulus - 2005}`,
    logoUrl: row.logo_url ?? null,
  }
}

export default function AdminAngkatanPage() {
  const [angkatan, setAngkatan] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [modal, setModal] = useState(null) // null | { type: 'tambah' } | { type: 'edit', data }
  const [sortDir, setSortDir] = useState('asc') // sort by tahun lulusan
  const [confirm, setConfirm] = useState({ open: false })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    const { data } = await supabase.from('angkatan').select('*').order('tahun_lulus', { ascending: true })
    setAngkatan((data ?? []).map(mapAngkatan))
    if (!silent) setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function refreshData() {
    setRefreshing(true)
    await loadData({ silent: true })
    setRefreshing(false)
  }

  const filtered = angkatan
    .filter(a => {
      const q = search.toLowerCase()
      return (
        q === '' ||
        a.nama.toLowerCase().includes(q) ||
        String(a.tahunLulusan).includes(q) ||
        String(a.angkatanKe).includes(q)
      )
    })
    .sort((a, b) => sortDir === 'asc' ? a.tahunLulusan - b.tahunLulusan : b.tahunLulusan - a.tahunLulusan)

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)
  const startIdx = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const endIdx = Math.min(page * perPage, filtered.length)

  function resetPage() { setPage(1) }

  function handleSave(formData) {
    const isEdit = modal?.type === 'edit'
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Angkatan' : 'Tambah Angkatan Baru',
      message: isEdit
        ? 'Apakah Anda yakin ingin menyimpan perubahan data angkatan ini?'
        : 'Apakah Anda yakin ingin menambahkan angkatan baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        // Upload logo jika ada file baru
        let logoUrl = formData.logoPreview // URL lama (jika tidak diganti)
        if (formData.logoFile) {
          const ext = formData.logoFile.name.split('.').pop().toLowerCase()
          const filePath = `angkatan/${formData.tahunLulusan}_logo.${ext}`
          const { error: upErr } = await supabase.storage
            .from('site-assets')
            .upload(filePath, formData.logoFile, { upsert: true })
          if (!upErr) {
            const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(filePath)
            logoUrl = urlData.publicUrl
          } else {
            console.error('Upload logo angkatan gagal:', upErr)
          }
        } else if (formData.logoPreview === null) {
          logoUrl = null // user hapus logo
        }

        const dbData = {
          tahun_lulus:   formData.tahunLulusan,
          tahun_masuk:   formData.tahunLulusan - 4,
          nama_angkatan: formData.nama,
          logo_url:      logoUrl ?? null,
        }
        if (isEdit) {
          const { error } = await supabase.from('angkatan').update(dbData).eq('id', modal.data.id)
          if (!error) setAngkatan(prev => prev.map(a => a.id === modal.data.id
            ? { ...a, tahunLulusan: formData.tahunLulusan, angkatanKe: formData.angkatanKe, nama: formData.nama, logoUrl }
            : a))
        } else {
          const { data, error } = await supabase.from('angkatan').insert(dbData).select('id').single()
          if (!error && data) setAngkatan(prev => [...prev, {
            id: data.id,
            tahunLulusan: formData.tahunLulusan,
            angkatanKe: formData.angkatanKe,
            nama: formData.nama,
            logoUrl,
          }])
        }
        setModal(null)
        closeConfirm()
      },
    })
  }

  function handleDelete(id) {
    askConfirm({
      title: 'Hapus Angkatan',
      message: 'Apakah Anda yakin ingin menghapus data angkatan ini? Tindakan ini tidak dapat dibatalkan.',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        await supabase.from('angkatan').delete().eq('id', id)
        setAngkatan(prev => prev.filter(a => a.id !== id))
        closeConfirm()
      },
    })
  }

  function toggleSort() {
    setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    resetPage()
  }

  return (
    <>
        {/* Header */}
        <AdminHeader
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); resetPage() }}
          searchPlaceholder="Cari angkatan..."
        />

        <motion.div
          className="flex-1 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Page title + action */}
          <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Kelola Angkatan</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manajemen data angkatan lulusan pondok pesantren.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refreshData} disabled={refreshing} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh
              </button>
              <button
                onClick={() => setModal({ type: 'tambah' })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: '#1A5C38' }}
              >
                <Plus className="w-4 h-4" />
                Tambah Angkatan
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Angkatan', value: angkatan.length, color: '#1A5C38' },
              { label: 'Angkatan Terbaru', value: angkatan.length ? `${Math.max(...angkatan.map(a => a.angkatanKe))}` : '—', color: '#F0A500' },
              { label: 'Tahun Pertama', value: angkatan.length ? Math.min(...angkatan.map(a => a.tahunLulusan)) : '—', color: '#0A2415' },
              { label: 'Tahun Terakhir', value: angkatan.length ? Math.max(...angkatan.map(a => a.tahunLulusan)) : '—', color: '#2A7A4F' },
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
              <div className="ml-auto flex items-center gap-3">
                <PerPageSelector value={perPage} options={[5, 10, 20]} onChange={n => { setPerPage(n); resetPage() }} />
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-10">No</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Logo</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">
                      <button
                        className="inline-flex items-center gap-1 hover:text-[#1A5C38] transition-colors"
                        onClick={toggleSort}
                      >
                        Angkatan Ke
                        {sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Tahun Lulusan</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Nama Angkatan</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {(loading || refreshing) ? (
                    <tr><td colSpan={6} className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" /></td></tr>
                  ) : paged.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-gray-400">
                        <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Tidak ada data angkatan ditemukan</p>
                      </td>
                    </tr>
                  ) : paged.map((item, i) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {(page - 1) * perPage + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50">
                          {item.logoUrl ? (
                            <img src={item.logoUrl} alt={item.nama} className="w-full h-full object-contain" />
                          ) : (
                            <GraduationCap className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold"
                          style={{ backgroundColor: '#E8F5EE', color: '#1A5C38' }}
                        >
                          {item.angkatanKe}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono font-bold text-[#0A2415]">{item.tahunLulusan}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#0A2415] text-sm">{item.nama}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setModal({ type: 'edit', data: item })}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1A5C38] hover:bg-[#E8F5EE] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 flex justify-center">
                <PaginationBar page={page} totalPages={totalPages} onPage={setPage} />
              </div>
            )}
          </div>
        </motion.div>

      {modal && (
        <AngkatanModal
          data={modal.type === 'edit' ? modal.data : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </>
  )
}
