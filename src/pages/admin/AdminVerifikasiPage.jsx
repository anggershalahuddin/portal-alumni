import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle, XCircle,
  Users, Download, ChevronDown,
  ChevronLeft, ChevronRight, FileText, X, Clock,
  AlertCircle, Filter, Trash2, ZoomIn,
} from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { supabase } from '@/lib/supabase'

/* ─── Helpers ─── */
const getAngkatanKe = (year) => year - 2005
const TAHUN_LIST = Array.from({ length: 2026 - 2006 + 1 }, (_, i) => 2006 + i)
const PER_PAGE = 5

const JENIS_LABEL = {
  foto_bukti:   'Foto Bukti Diri',
  ktp:          'Kartu Tanda Penduduk (KTP)',
  ijazah:       'Ijazah Pondok Pesantren',
  surat:        'Surat Keterangan Alumni',
}

function formatTanggal(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

/* ─── Modal: Lihat Berkas ─── */
function BerkasModal({ alumni, onClose }) {
  const [zoomed, setZoomed] = useState(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const uploadedCount = alumni.berkas.filter((b) => b.uploaded && b.url).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Berkas Dokumen</h2>
            <p className="text-xs text-gray-400 mt-0.5">{alumni.name} · {uploadedCount} dari {alumni.berkas.length} dokumen diunggah</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {alumni.berkas.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">Tidak ada berkas yang diunggah.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {alumni.berkas.map((b) => (
                <div key={b.key} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Label bar */}
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-700 truncate">{b.label}</span>
                    {b.uploaded && b.url ? (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">✓ Diunggah</span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">Belum</span>
                    )}
                  </div>

                  {/* Preview area */}
                  {b.uploaded && b.url ? (
                    <div className="relative group bg-gray-100">
                      <img
                        src={b.url}
                        alt={b.label}
                        className="w-full h-36 object-cover"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => setZoomed(b)}
                          className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                          title="Perbesar"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <a
                          href={b.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                          title="Unduh"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 flex flex-col items-center justify-center bg-gray-50 gap-2">
                      <FileText className="w-8 h-8 text-gray-300" />
                      <p className="text-xs text-gray-400">Belum diunggah</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Zoom overlay */}
      {zoomed && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setZoomed(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setZoomed(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomed.url}
            alt={zoomed.label}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">{zoomed.label}</p>
        </div>
      )}
    </div>
  )
}

/* ─── Modal: Form Penolakan ─── */
function RejectModal({ alumni, onClose, onSubmit }) {
  const [alasan, setAlasan] = useState('')
  const [kirimEmail, setKirimEmail] = useState(true)
  const TEMPLATES = ['Dokumen tidak lengkap', 'Data tidak sesuai', 'Tidak dapat diverifikasi']

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Form Pesan Penolakan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            Tuliskan alasan penolakan secara jelas. Pesan ini akan dikirimkan kepada pendaftar
            sebagai informasi untuk melakukan perbaikan data.
          </p>

          {/* Template cepat */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">
              Template Cepat
            </p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t}
                  onClick={() => setAlasan(t)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">{alasan.length}/500</span>
            </div>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value.slice(0, 500))}
              placeholder="Tuliskan alasan penolakan (wajib)..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {/* File upload */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">
              Lampiran Pendukung <span className="text-gray-400 font-normal text-xs">(Opsional)</span>
            </label>
            <div className="border border-dashed border-gray-300 rounded-xl py-4 flex items-center justify-center gap-2 text-sm text-gray-400 cursor-pointer hover:border-gray-400 transition-colors">
              <FileText className="w-4 h-4" />
              Klik untuk unggah dokumen (PDF, JPG, PNG)
            </div>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={kirimEmail}
              onChange={(e) => setKirimEmail(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700">Kirim email pemberitahuan ke alumni</span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => alasan.trim() && onSubmit(alasan)}
            disabled={!alasan.trim()}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: '#DC2626' }}
          >
            Kirim &amp; Tolak
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Modal: Berhasil Diverifikasi ─── */
function SuccessModal({ onClose }) {
  const [kirimEmail, setKirimEmail] = useState(true)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full border-2 border-green-200 bg-green-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Akun Berhasil Diverifikasi</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Selamat! Akun alumni telah berhasil diverifikasi dan kini telah aktif sepenuhnya di sistem.
        </p>

        <label className="flex items-center gap-2.5 cursor-pointer mb-4 text-left">
          <input
            type="checkbox"
            checked={kirimEmail}
            onChange={(e) => setKirimEmail(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-gray-700">Kirim email sambutan ke alumni</span>
        </label>

        <div className="rounded-xl px-4 py-3 mb-6 text-left bg-blue-50">
          <p className="text-xs text-blue-700 leading-relaxed">
            <span className="font-bold italic">Langkah selanjutnya:</span> Alumni kini dapat mengakses dashboard,
            mengisi profil lengkap, dan berinteraksi dengan komunitas.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#22C55E' }}
        >
          Tutup
        </button>
      </div>
    </div>
  )
}

/* ─── Modal: Berhasil Ditolak ─── */
function RejectedConfirmModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full border-2 border-red-200 bg-red-50 flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Akun Berhasil Ditolak</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Permintaan verifikasi alumni telah ditolak dan pesan penolakan telah dikirimkan kepada alumni.
        </p>

        <div className="rounded-xl px-4 py-3 mb-6 text-left bg-red-50">
          <p className="text-xs text-red-700 leading-relaxed">
            <span className="font-bold italic">Catatan:</span> Alumni masih dapat mengajukan ulang
            verifikasi dengan melengkapi dokumen yang diperlukan sesuai ketentuan.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#DC2626' }}
        >
          Tutup
        </button>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function AdminVerifikasiPage() {
  const [alumni, setAlumni]             = useState([])
  const [pageLoading, setPageLoading]   = useState(true)
  const [loadError, setLoadError]       = useState(null)
  const [search, setSearch]             = useState('')
  const [filterTahun, setFilterTahun]   = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selected, setSelected]         = useState([])
  const [page, setPage]                 = useState(1)
  const [statVerifiedToday, setStatVerifiedToday] = useState(0)
  const [statRejectionRate, setStatRejectionRate] = useState('0%')

  // Modal states
  const [rejectTarget, setRejectTarget]             = useState(null)
  const [berkasTarget, setBerkasTarget]             = useState(null)
  const [showSuccess, setShowSuccess]               = useState(false)
  const [showRejectedConfirm, setShowRejectedConfirm] = useState(false)
  const [confirm, setConfirm]                       = useState({ open: false })
  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm()   { setConfirm({ open: false }) }

  /* ── Load data from Supabase ── */
  const loadData = useCallback(async () => {
    setPageLoading(true)
    setLoadError(null)
    try {
      // Stats: semua status untuk hitung verifikasi hari ini + tingkat penolakan
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const { data: allStats } = await supabase
        .from('profiles')
        .select('status, updated_at')
        .in('status', ['disetujui', 'ditolak'])
      const totalDiputuskan = (allStats ?? []).length
      const totalDitolak    = (allStats ?? []).filter((p) => p.status === 'ditolak').length
      const verifiedToday   = (allStats ?? []).filter((p) => p.status === 'disetujui' && new Date(p.updated_at) >= today).length
      setStatVerifiedToday(verifiedToday)
      setStatRejectionRate(totalDiputuskan > 0 ? ((totalDitolak / totalDiputuskan) * 100).toFixed(1) + '%' : '0%')

      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('id, nama_lengkap, email, no_hp, angkatan, status, pesan_admin, created_at, foto_url')
        .in('status', ['menunggu', 'ditolak'])
        .not('no_hp', 'is', null)
        .order('created_at', { ascending: false })

      if (profErr) throw profErr
      if (!profiles?.length) { setAlumni([]); return }

      const ids = profiles.map((p) => p.id)
      const { data: docs, error: docErr } = await supabase
        .from('dokumen_verifikasi')
        .select('*')
        .in('user_id', ids)

      if (docErr) throw docErr

      // Batch signed URLs from private bucket
      const signedMap = {}
      const paths = (docs ?? []).filter((d) => d.file_url).map((d) => d.file_url)
      if (paths.length > 0) {
        const { data: signed } = await supabase.storage
          .from('documents')
          .createSignedUrls(paths, 3600)
        ;(signed ?? []).forEach((s) => { if (s.signedUrl) signedMap[s.path] = s.signedUrl })
      }

      const alumniData = profiles.map((p) => {
        const userDocs = (docs ?? []).filter((d) => d.user_id === p.id)
        const berkas = userDocs.map((d) => ({
          id:       d.id,
          label:    JENIS_LABEL[d.jenis] ?? d.jenis,
          key:      d.jenis,
          uploaded: !!d.file_url,
          url:      d.file_url ? (signedMap[d.file_url] ?? null) : null,
          file_url: d.file_url,
        }))
        return {
          id:           p.id,
          name:         p.nama_lengkap || '-',
          email:        p.email ?? '',
          phone:        p.no_hp ?? '',
          angkatan:     p.angkatan,
          status:       p.status,
          tanggal:      formatTanggal(p.created_at),
          rejectionMsg: p.pesan_admin ?? '',
          avatar:       p.foto_url ?? null,
          berkas,
        }
      })

      setAlumni(alumniData)
    } catch (err) {
      console.error('Error loading verifikasi data:', err)
      setLoadError(err.message)
    } finally {
      setPageLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  /* Filter */
  const filtered = alumni.filter((a) => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.name.toLowerCase().includes(q) || (a.email ?? '').toLowerCase().includes(q) || (a.phone ?? '').includes(q)
    const matchTahun  = !filterTahun  || String(a.angkatan) === filterTahun
    const matchStatus = !filterStatus || a.status === filterStatus
    return matchSearch && matchTahun && matchStatus
  })

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage    = Math.min(page, totalPages)
  const paged       = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const pendingCount = alumni.filter((a) => a.status === 'menunggu').length

  /* ── Actions ── */
  function handleApprove(id) {
    const a = alumni.find((x) => x.id === id)
    askConfirm({
      title: 'Verifikasi Alumni',
      message: `Apakah Anda yakin ingin memverifikasi ${a?.name ?? 'alumni ini'}? Akun akan segera diaktifkan dan alumni dapat mengakses portal.`,
      confirmLabel: 'Ya, Verifikasi',
      variant: 'success',
      onConfirm: async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ status: 'disetujui', role: 'alumni' })
          .eq('id', id)
        if (error) { console.error(error); closeConfirm(); return }
        setAlumni((prev) => prev.filter((x) => x.id !== id))
        setSelected((prev) => prev.filter((i) => i !== id))
        closeConfirm()
        setShowSuccess(true)
      },
    })
  }

  async function handleRejectSubmit(id, alasan) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'ditolak', pesan_admin: alasan })
      .eq('id', id)
    if (error) { console.error(error); return }
    setAlumni((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: 'ditolak', rejectionMsg: alasan } : a)
    )
    setRejectTarget(null)
    setShowRejectedConfirm(true)
  }

  function handleBulkVerify() {
    if (selected.length === 0) return
    askConfirm({
      title: `Verifikasi ${selected.length} Alumni`,
      message: `Apakah Anda yakin ingin memverifikasi ${selected.length} alumni sekaligus? Semua akun yang dipilih akan segera diaktifkan.`,
      confirmLabel: 'Ya, Verifikasi Semua',
      variant: 'success',
      onConfirm: async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ status: 'disetujui', role: 'alumni' })
          .in('id', selected)
        if (error) { console.error(error); closeConfirm(); return }
        setAlumni((prev) => prev.filter((a) => !selected.includes(a.id)))
        setSelected([])
        closeConfirm()
        setShowSuccess(true)
      },
    })
  }

  function handleDelete(id) {
    const a = alumni.find((x) => x.id === id)
    askConfirm({
      title: 'Hapus Data Pendaftaran',
      message: `Apakah Anda yakin ingin menghapus data pendaftaran atas nama ${a?.name ?? 'alumni ini'}? Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: 'Ya, Hapus Data',
      variant: 'danger',
      onConfirm: async () => {
        await supabase.from('dokumen_verifikasi').delete().eq('user_id', id)
        const { error } = await supabase.rpc('delete_auth_user', { user_id: id })
        if (error) { console.error(error); closeConfirm(); return }
        setAlumni((prev) => prev.filter((x) => x.id !== id))
        setSelected((prev) => prev.filter((i) => i !== id))
        closeConfirm()
      },
    })
  }

  function toggleSelect(id) {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  function toggleAll() {
    const pagedIds = paged.map((a) => a.id)
    const allSelected = pagedIds.every((id) => selected.includes(id))
    setSelected((prev) =>
      allSelected ? prev.filter((id) => !pagedIds.includes(id)) : [...new Set([...prev, ...pagedIds])]
    )
  }

  const statCards = [
    { icon: Clock,       iconColor: '#F59E0B', iconBg: '#FEF3C7', value: pendingCount,      label: 'Menunggu Verifikasi',   sub: 'Total pengajuan belum diproses' },
    { icon: CheckCircle, iconColor: '#22C55E', iconBg: '#F0FDF4', value: statVerifiedToday, label: 'Terverifikasi Hari Ini', sub: 'Alumni berhasil diaktifkan' },
    { icon: XCircle,     iconColor: '#EF4444', iconBg: '#FEF2F2', value: statRejectionRate, label: 'Tingkat Penolakan',      sub: 'Dari total yang sudah diputuskan' },
  ]

  /* ── Loading screen ── */
  if (pageLoading) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
        <AdminSidebar active="verifikasi" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>

      <AdminSidebar active="verifikasi" />

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        <AdminHeader
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1) }}
          searchPlaceholder="Cari alumni..."
        />

        {/* Content */}
        <motion.div
          className="flex flex-1 gap-5 p-6 items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >

          {/* ── Table Area ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Page title + actions */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Manajemen Pengguna</p>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-gray-900">Antrean Verifikasi</h1>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#F0A500' }}
                  >
                    {pendingCount} Pending
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Ekspor CSV
                  </button>
                  <button
                    onClick={selected.length > 0 ? handleBulkVerify : undefined}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: selected.length > 0 ? '#1A5C38' : '#6B7280' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Verifikasi Massal{selected.length > 0 ? ` (${selected.length})` : ''}
                  </button>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {loadError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {loadError}
                <button onClick={loadData} className="ml-auto underline text-xs">Coba lagi</button>
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select
                  value={filterTahun}
                  onChange={(e) => { setFilterTahun(e.target.value); setPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-green-400 cursor-pointer"
                >
                  <option value="">Semua Tahun</option>
                  {TAHUN_LIST.map((y) => (
                    <option key={y} value={y}>{y} (Ke-{getAngkatanKe(y)})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-green-400 cursor-pointer"
                >
                  <option value="">Semua Status</option>
                  <option value="menunggu">Menunggu Verifikasi</option>
                  <option value="ditolak">Ditolak</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filter Lanjut
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-900 text-sm">Daftar Pengajuan</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Menampilkan {paged.length} dari {filtered.length} alumni yang menunggu verifikasi
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50/50">
                      <th className="w-10 px-5 py-3">
                        <input
                          type="checkbox"
                          checked={paged.length > 0 && paged.every((a) => selected.includes(a.id))}
                          onChange={toggleAll}
                          className="w-4 h-4 rounded"
                        />
                      </th>
                      {['Alumni', 'Angkatan', 'Status Verifikasi', 'Dokumen', 'Tanggal Daftar', 'Aksi'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paged.map((a, i) => (
                      <motion.tr
                        key={a.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05, duration: 0.25 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Checkbox */}
                        <td className="px-5 py-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(a.id)}
                            onChange={() => toggleSelect(a.id)}
                            className="w-4 h-4 rounded"
                          />
                        </td>

                        {/* Alumni */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {a.avatar
                              ? <img src={a.avatar} alt={a.name} className="w-9 h-9 rounded-full flex-shrink-0 object-cover bg-gray-100" />
                              : (
                                <div className="w-9 h-9 rounded-full flex-shrink-0 bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 uppercase">
                                  {(a.name?.[0] ?? a.email?.[0] ?? '?').toUpperCase()}
                                </div>
                              )
                            }
                            <div>
                              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{a.name}</p>
                              {a.email && <p className="text-xs text-gray-400">{a.email}</p>}
                            </div>
                          </div>
                        </td>

                        {/* Angkatan */}
                        <td className="px-4 py-4">
                          {a.angkatan ? (
                            <>
                              <p className="text-sm font-semibold text-gray-900">{a.angkatan}</p>
                              <p className="text-xs text-gray-400">Angkatan Ke-{getAngkatanKe(a.angkatan)}</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-400">-</p>
                          )}
                        </td>

                        {/* Status dengan tooltip */}
                        <td className="px-4 py-4">
                          <div className="relative inline-block group">
                            {a.status === 'menunggu' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 whitespace-nowrap">
                                <Clock className="w-3 h-3" />
                                Menunggu Verifikasi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 cursor-help whitespace-nowrap">
                                <XCircle className="w-3 h-3" />
                                Ditolak
                              </span>
                            )}
                            {/* Tooltip alasan penolakan */}
                            {a.status === 'ditolak' && a.rejectionMsg && (
                              <div className="absolute bottom-full left-0 mb-2 w-60 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30 shadow-xl leading-relaxed">
                                <p className="font-semibold mb-1 text-gray-300">Alasan penolakan:</p>
                                {a.rejectionMsg}
                                <div className="absolute top-full left-4 border-4 border-transparent border-t-gray-900" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Dokumen */}
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setBerkasTarget(a)}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors whitespace-nowrap"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Lihat Berkas {a.berkas.length > 0 && `(${a.berkas.length})`}
                          </button>
                        </td>

                        {/* Tanggal */}
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600 whitespace-nowrap">{a.tanggal}</span>
                        </td>

                        {/* Aksi */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDelete(a.id)}
                              title="Hapus Data"
                              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRejectTarget(a)}
                              title="Tolak"
                              className="w-8 h-8 rounded-full flex items-center justify-center border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(a.id)}
                              title="Terima"
                              className="w-8 h-8 rounded-full flex items-center justify-center border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}

                    {paged.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-14 text-center">
                          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-400">
                            {alumni.length === 0 ? 'Tidak ada pengajuan verifikasi saat ini.' : 'Tidak ada data yang sesuai filter.'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  Menampilkan {filtered.length === 0 ? 0 : (safePage - 1) * PER_PAGE + 1}–
                  {Math.min(safePage * PER_PAGE, filtered.length)} dari {filtered.length} pengajuan
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
                      style={
                        safePage === n
                          ? { backgroundColor: '#1A5C38', color: '#fff' }
                          : { border: '1px solid #e5e7eb', color: '#4b5563' }
                      }
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats Panel ── */}
          <div className="w-60 flex-shrink-0 space-y-4">
            {statCards.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: s.iconBg }}>
                      <Icon className="w-5 h-5" style={{ color: s.iconColor }} />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900 mb-0.5">{s.value}</div>
                  <div className="text-xs font-semibold text-gray-700 mb-0.5">{s.label}</div>
                  <div className="text-[10px] text-gray-400">{s.sub}</div>
                </div>
              )
            })}

            {/* Quick links */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h4 className="text-xs font-bold text-gray-700 mb-3">Tautan Cepat</h4>
              <div className="space-y-2">
                {[
                  { label: 'Manajemen User',      icon: Users,       href: '/admin/users' },
                  { label: 'Log Aktivitas Admin',  icon: AlertCircle, href: '/admin/log' },
                  { label: 'Laporan Masalah',      icon: FileText,    href: '/admin/laporan' },
                ].map(({ label, icon: Icon, href }) => (
                  <Link key={label} to={href}
                    className="flex items-center gap-2 py-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors group">
                    <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Modals ── */}
      {berkasTarget && <BerkasModal alumni={berkasTarget} onClose={() => setBerkasTarget(null)} />}
      {rejectTarget && (
        <RejectModal
          alumni={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onSubmit={(alasan) => handleRejectSubmit(rejectTarget.id, alasan)}
        />
      )}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      {showRejectedConfirm && <RejectedConfirmModal onClose={() => setShowRejectedConfirm(false)} />}
      <ConfirmDialog open={confirm.open} title={confirm.title} message={confirm.message} confirmLabel={confirm.confirmLabel} variant={confirm.variant} onConfirm={confirm.onConfirm} onCancel={closeConfirm} />
    </div>
  )
}
