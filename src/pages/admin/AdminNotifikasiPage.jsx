import { useState, useEffect, useCallback } from 'react'
import { Bell, Check, CheckCheck, Trash2, Shield, Newspaper, CalendarDays, Users, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { supabase } from '@/lib/supabase'

const TIPE_CONFIG = {
  verifikasi: { icon: Shield,       color: '#1A5C38', bg: '#F0FDF4', label: 'Verifikasi' },
  berita:     { icon: Newspaper,    color: '#7C3AED', bg: '#FAF5FF', label: 'Berita' },
  agenda:     { icon: CalendarDays, color: '#0E7490', bg: '#ECFEFF', label: 'Agenda' },
  user:       { icon: Users,        color: '#D97706', bg: '#FFFBEB', label: 'Pengguna' },
  sistem:     { icon: AlertCircle,  color: '#6B7280', bg: '#F9FAFB', label: 'Sistem' },
}

function formatWaktu(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d) / 1000)
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function mapNotif(row) {
  return {
    id: row.id,
    judul: row.judul,
    pesan: row.pesan ?? '',
    tipe: row.tipe ?? 'sistem',
    dibaca: row.is_dibaca,
    waktu: formatWaktu(row.created_at),
  }
}

export default function AdminNotifikasiPage() {
  const [notif, setNotif] = useState([])
  const [filter, setFilter] = useState('semua')
  const [filterTipe, setFilterTipe] = useState('semua')
  const [confirm, setConfirm] = useState({ open: false })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    const { data } = await supabase
      .from('notifikasi')
      .select('id, judul, pesan, tipe, is_dibaca, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    setNotif((data ?? []).map(mapNotif))
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

  const unread = notif.filter(n => !n.dibaca).length

  const filtered = notif.filter(n => {
    const matchStatus = filter === 'semua' || (filter === 'belum-dibaca' ? !n.dibaca : n.dibaca)
    const matchTipe = filterTipe === 'semua' || n.tipe === filterTipe
    return matchStatus && matchTipe
  })

  async function markRead(id) {
    await supabase.from('notifikasi').update({ is_dibaca: true }).eq('id', id)
    setNotif(n => n.map(x => x.id === id ? { ...x, dibaca: true } : x))
  }

  async function markAllRead() {
    const unreadIds = notif.filter(n => !n.dibaca).map(n => n.id)
    if (unreadIds.length === 0) return
    await supabase.from('notifikasi').update({ is_dibaca: true }).in('id', unreadIds)
    setNotif(n => n.map(x => ({ ...x, dibaca: true })))
  }

  async function deleteNotif(id) {
    await supabase.from('notifikasi').delete().eq('id', id)
    setNotif(n => n.filter(x => x.id !== id))
  }

  return (
    <>
        <AdminHeader searchPlaceholder="Cari notifikasi..." />

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
                <h1 className="text-2xl font-extrabold text-gray-900">Notifikasi</h1>
                <p className="text-sm text-gray-500 mt-0.5">{unread > 0 ? `${unread} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}</p>
              </div>
              {unread > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#1A5C38' }}>{unread}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refreshData} disabled={refreshing} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh
              </button>
              {unread > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  <CheckCheck className="w-4 h-4" /> Tandai Semua Dibaca
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs — status */}
          <div className="flex gap-1.5 flex-wrap">
            {[{ value: 'semua', label: 'Semua' }, { value: 'belum-dibaca', label: 'Belum Dibaca' }, { value: 'dibaca', label: 'Sudah Dibaca' }].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
                style={filter === f.value ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Filter chips — kategori */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterTipe('semua')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
              style={filterTipe === 'semua' ? { backgroundColor: '#374151', color: '#fff', borderColor: '#374151' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
              Semua Kategori
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={filterTipe === 'semua' ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' } : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }}>
                {notif.length}
              </span>
            </button>
            {Object.entries(TIPE_CONFIG).map(([key, cfg]) => {
              const count = notif.filter(n => n.tipe === key).length
              const Icon = cfg.icon
              const active = filterTipe === key
              return (
                <button key={key} onClick={() => setFilterTipe(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                  style={active ? { backgroundColor: cfg.color, color: '#fff', borderColor: cfg.color } : { backgroundColor: cfg.bg, color: cfg.color, borderColor: 'transparent' }}>
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={active ? { backgroundColor: 'rgba(255,255,255,0.25)', color: '#fff' } : { backgroundColor: 'rgba(255,255,255,0.6)', color: cfg.color }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* List */}
          <div className="space-y-2">
            {(loading || refreshing) ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Tidak ada notifikasi</p>
              </div>
            ) : filtered.map((n, i) => {
              const cfg = TIPE_CONFIG[n.tipe] ?? TIPE_CONFIG.sistem
              const Icon = cfg.icon
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.28 }}
                  className={`bg-white rounded-2xl border p-4 flex items-start gap-4 ${!n.dibaca ? 'border-green-200' : 'border-gray-100'}`}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
                    <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${!n.dibaca ? 'text-gray-900' : 'text-gray-700'}`}>{n.judul}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                      {!n.dibaca && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{n.pesan}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.waktu}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.dibaca && (
                      <button onClick={() => markRead(n.id)} title="Tandai dibaca" className="p-1.5 rounded-lg hover:bg-gray-100">
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                    <button onClick={() => askConfirm({ title: 'Hapus Notifikasi', message: 'Apakah Anda yakin ingin menghapus notifikasi ini?', confirmLabel: 'Ya, Hapus', variant: 'danger', onConfirm: () => { deleteNotif(n.id); closeConfirm() } })} title="Hapus" className="p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
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
