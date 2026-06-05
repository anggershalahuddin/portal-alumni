import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, CheckCircle, XCircle, Trash2, Loader2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { supabase } from '@/lib/supabase'

const FILTER_OPTS = [
  { value: 'semua',    label: 'Semua' },
  { value: 'menunggu', label: 'Menunggu' },
  { value: 'disetujui',label: 'Disetujui' },
]

function formatTanggal(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminKomentarPage() {
  const [komentar, setKomentar] = useState([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter]     = useState('semua')
  const [confirm, setConfirm]   = useState({ open: false })

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    const { data } = await supabase
      .from('komentar_berita')
      .select(`
        id, isi, created_at, is_disetujui,
        berita:berita_id(judul, slug),
        penulis:user_id(nama_lengkap)
      `)
      .order('created_at', { ascending: false })
    setKomentar(data ?? [])
    if (!silent) setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function refreshData() {
    setRefreshing(true)
    await loadData({ silent: true })
    setRefreshing(false)
  }

  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm()   { setConfirm({ open: false }) }

  async function toggleApprove(id, current) {
    await supabase.from('komentar_berita').update({ is_disetujui: !current }).eq('id', id)
    setKomentar(k => k.map(x => x.id === id ? { ...x, is_disetujui: !current } : x))
  }

  async function deleteKomentar(id) {
    await supabase.from('komentar_berita').delete().eq('id', id)
    setKomentar(k => k.filter(x => x.id !== id))
  }

  const filtered = komentar.filter(k => {
    if (filter === 'disetujui') return k.is_disetujui
    if (filter === 'menunggu')  return !k.is_disetujui
    return true
  })

  const pendingCount = komentar.filter(k => !k.is_disetujui).length

  return (
    <>
      <AdminHeader searchPlaceholder="Cari komentar..." />

      <motion.div
        className="flex-1 p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Page title */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Moderasi Komentar</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {pendingCount > 0
                  ? `${pendingCount} komentar menunggu persetujuan`
                  : 'Semua komentar sudah ditinjau'}
              </p>
            </div>
            {pendingCount > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: '#D97706' }}
              >
                {pendingCount}
              </span>
            )}
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {refreshing
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <RefreshCw className="w-4 h-4" />}
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_OPTS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
              style={
                filter === f.value
                  ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' }
                  : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }
              }
            >
              {f.label}
              {f.value === 'menunggu' && pendingCount > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={
                    filter === 'menunggu'
                      ? { backgroundColor: 'rgba(255,255,255,0.3)', color: '#fff' }
                      : { backgroundColor: '#FEF3C7', color: '#D97706' }
                  }
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {(loading || refreshing) ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Tidak ada komentar</p>
            </div>
          ) : filtered.map((k, i) => (
            <motion.div
              key={k.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="bg-white rounded-2xl border border-gray-100 p-4"
            >
              <div className="flex items-start gap-4">
                {/* Avatar inisial */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ backgroundColor: '#1A5C38' }}
                >
                  {(k.penulis?.nama_lengkap ?? '?')[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">
                      {k.penulis?.nama_lengkap ?? 'Anonim'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        k.is_disetujui
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {k.is_disetujui ? 'Disetujui' : 'Menunggu'}
                    </span>
                  </div>
                  <p className="text-xs font-medium mb-1.5 truncate" style={{ color: '#1A5C38' }}>
                    {k.berita?.judul ?? '(berita dihapus)'}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {k.isi}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    {formatTanggal(k.created_at)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleApprove(k.id, k.is_disetujui)}
                    title={k.is_disetujui ? 'Batalkan persetujuan' : 'Setujui komentar'}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {k.is_disetujui
                      ? <XCircle className="w-4 h-4 text-amber-500" />
                      : <CheckCircle className="w-4 h-4 text-green-600" />}
                  </button>
                  <button
                    onClick={() => askConfirm({
                      title: 'Hapus Komentar',
                      message: 'Komentar ini akan dihapus permanen. Lanjutkan?',
                      confirmLabel: 'Ya, Hapus',
                      variant: 'danger',
                      onConfirm: () => { deleteKomentar(k.id); closeConfirm() },
                    })}
                    title="Hapus komentar"
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        variant={confirm.variant}
        onConfirm={confirm.onConfirm}
        onCancel={closeConfirm}
      />
    </>
  )
}
