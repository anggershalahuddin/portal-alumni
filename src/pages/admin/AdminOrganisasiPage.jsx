import { useState } from 'react'
import { Plus, Trash2, Edit2, Building2, X, Check, Users, Mail, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ImageUploadBox from '../../components/admin/ImageUploadBox'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { initialOrganisasi } from '../../data/organisasi'

function OrganisasiModal({ item, onClose, onSave }) {
  const isEdit = !!item?.id
  const [form, setForm] = useState(
    item ?? {
      nama: '', namaLengkap: '', tahunBerdiri: new Date().getFullYear(),
      deskripsi: '', logo: '', ketua: '', kontak: '', aktif: true,
    }
  )

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  function handleSave() {
    if (!form.nama.trim() || !form.namaLengkap.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{isEdit ? 'Edit Organisasi' : 'Tambah Organisasi'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Singkatan / Nama Pendek</label>
              <input value={form.nama} onChange={e => set('nama', e.target.value)} placeholder="cth. HIKMAD" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Tahun Berdiri</label>
              <input type="number" value={form.tahunBerdiri} onChange={e => set('tahunBerdiri', parseInt(e.target.value))} min="1990" max="2030" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Nama Lengkap Organisasi</label>
            <input value={form.namaLengkap} onChange={e => set('namaLengkap', e.target.value)} placeholder="Nama lengkap organisasi..." className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
          </div>
          <ImageUploadBox label="Logo Organisasi" hint="Upload file atau paste URL" value={form.logo} onChange={url => set('logo', url)} />
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={e => set('deskripsi', e.target.value)} rows={3} placeholder="Deskripsi singkat organisasi..." className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Nama Ketua</label>
              <input value={form.ketua} onChange={e => set('ketua', e.target.value)} placeholder="Nama ketua..." className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Email Kontak</label>
              <input type="email" value={form.kontak} onChange={e => set('kontak', e.target.value)} placeholder="email@domain.com" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.aktif} onChange={e => set('aktif', e.target.checked)} className="w-4 h-4 accent-green-700" />
            <span className="text-sm text-gray-700">Organisasi masih aktif</span>
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

export default function AdminOrganisasiPage() {
  const [organisasi, setOrganisasi] = useState(initialOrganisasi)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [filterAktif, setFilterAktif] = useState('semua')
  const [confirm, setConfirm] = useState({ open: false })

  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  const filtered = organisasi.filter(o => {
    const matchSearch = o.nama.toLowerCase().includes(search.toLowerCase()) || o.namaLengkap.toLowerCase().includes(search.toLowerCase())
    const matchAktif = filterAktif === 'semua' || (filterAktif === 'aktif' ? o.aktif : !o.aktif)
    return matchSearch && matchAktif
  })

  function handleSave(form) {
    const isEdit = !!form.id
    askConfirm({
      title: isEdit ? 'Simpan Perubahan Organisasi' : 'Tambah Organisasi Baru',
      message: isEdit
        ? 'Apakah Anda yakin ingin menyimpan perubahan pada organisasi ini?'
        : 'Apakah Anda yakin ingin menambahkan organisasi baru ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: () => {
        if (isEdit) {
          setOrganisasi(o => o.map(x => x.id === form.id ? form : x))
        } else {
          setOrganisasi(o => [...o, { ...form, id: Date.now() }])
        }
        setModal(null)
        closeConfirm()
      },
    })
  }

  function handleDelete(id) {
    askConfirm({ title: 'Hapus Organisasi', message: 'Apakah Anda yakin ingin menghapus organisasi ini? Data tidak dapat dipulihkan kembali.', confirmLabel: 'Ya, Hapus', variant: 'danger', onConfirm: () => { setOrganisasi(o => o.filter(x => x.id !== id)); closeConfirm() } })
  }

  function toggleAktif(id) {
    const item = organisasi.find(x => x.id === id)
    if (!item) return
    askConfirm({ title: item.aktif ? 'Nonaktifkan Organisasi' : 'Aktifkan Organisasi', message: item.aktif ? 'Organisasi ini akan ditandai nonaktif. Lanjutkan?' : 'Organisasi ini akan ditandai aktif dan tampil di portal. Lanjutkan?', confirmLabel: 'Ya, Lanjutkan', variant: 'warning', onConfirm: () => { setOrganisasi(o => o.map(x => x.id === id ? { ...x, aktif: !x.aktif } : x)); closeConfirm() } })
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="organisasi" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari organisasi..."
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
              <h1 className="text-2xl font-extrabold text-gray-900">Kelola Organisasi Alumni</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manajemen organisasi dan lembaga alumni.</p>
            </div>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#1A5C38' }}>
              <Plus className="w-4 h-4" /> Tambah Organisasi
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Organisasi', value: organisasi.length, color: '#1A5C38' },
              { label: 'Aktif', value: organisasi.filter(o => o.aktif).length, color: '#059669' },
              { label: 'Tidak Aktif', value: organisasi.filter(o => !o.aktif).length, color: '#D97706' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100">
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center">
            <div className="flex gap-1.5">
              {[{ value: 'semua', label: 'Semua' }, { value: 'aktif', label: 'Aktif' }, { value: 'nonaktif', label: 'Nonaktif' }].map(f => (
                <button key={f.value} onClick={() => setFilterAktif(f.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                  style={filterAktif === f.value ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Tidak ada organisasi ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filtered.map(o => (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start gap-4">
                    {o.logo ? (
                      <img src={o.logo} alt={o.nama} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-gray-100"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=100&h=100&q=80' }} />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#1A5C38' }}>
                        {o.nama.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <p className="text-base font-bold text-gray-900">{o.nama}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{o.namaLengkap}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${o.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {o.aktif ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{o.deskripsi}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                        {o.ketua && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Users className="w-3 h-3" /> {o.ketua}
                          </div>
                        )}
                        {o.kontak && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Mail className="w-3 h-3" /> {o.kontak}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Calendar className="w-3 h-3" /> Berdiri {o.tahunBerdiri}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button onClick={() => toggleAktif(o.id)}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors"
                      style={o.aktif ? { color: '#D97706', borderColor: '#FDE68A', backgroundColor: '#FFFBEB' } : { color: '#059669', borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }}>
                      {o.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button onClick={() => setModal(o)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-600 flex items-center gap-1 hover:bg-gray-50">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(o.id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-100 bg-red-50 text-red-500 flex items-center gap-1 hover:bg-red-100">
                      <Trash2 className="w-3 h-3" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {modal !== null && (
        <OrganisasiModal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />
      )}

      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </div>
  )
}
