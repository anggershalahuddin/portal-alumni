import { useState } from 'react'
import { Bell, Check, CheckCheck, Trash2, Filter, Shield, Newspaper, CalendarDays, Users, AlertCircle, Search } from 'lucide-react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const initialNotif = [
  { id: 1, tipe: 'verifikasi', judul: 'Permintaan Verifikasi Baru', pesan: 'Siti Maryam (angkatan 2018) mengajukan permintaan verifikasi akun alumni.', waktu: '5 menit lalu', dibaca: false },
  { id: 2, tipe: 'verifikasi', judul: 'Permintaan Verifikasi Baru', pesan: 'Ahmad Fauzi (angkatan 2015) mengajukan permintaan verifikasi akun alumni.', waktu: '1 jam lalu', dibaca: false },
  { id: 3, tipe: 'berita', judul: 'Berita Menunggu Persetujuan', pesan: 'Editor "Panitia Reuni" mengajukan berita "Reuni Akbar 25 Tahun" untuk disetujui.', waktu: '2 jam lalu', dibaca: false },
  { id: 4, tipe: 'user', judul: 'Akun Baru Terdaftar', pesan: '3 akun alumni baru telah mendaftar hari ini dan menunggu verifikasi.', waktu: '3 jam lalu', dibaca: true },
  { id: 5, tipe: 'sistem', judul: 'Backup Data Berhasil', pesan: 'Backup data otomatis portal alumni telah berhasil dilakukan pada pukul 03:00 WIB.', waktu: '8 jam lalu', dibaca: true },
  { id: 6, tipe: 'agenda', judul: 'Agenda Akan Segera Berlangsung', pesan: 'Reuni Akbar Lintas Angkatan 2024 dijadwalkan 3 hari lagi. Ingatkan admin dan panitia.', waktu: '1 hari lalu', dibaca: true },
  { id: 7, tipe: 'berita', judul: 'Berita Menunggu Persetujuan', pesan: 'Editor "Tim Redaksi" mengajukan berita "Santri Raih Juara Musabaqah" untuk disetujui.', waktu: '1 hari lalu', dibaca: true },
  { id: 8, tipe: 'sistem', judul: 'Pembaruan Sistem', pesan: 'Sistem portal alumni telah berhasil diperbarui ke versi 2.1.0.', waktu: '3 hari lalu', dibaca: true },
]

const TIPE_CONFIG = {
  verifikasi: { icon: Shield, color: '#1A5C38', bg: '#F0FDF4', label: 'Verifikasi' },
  berita: { icon: Newspaper, color: '#7C3AED', bg: '#FAF5FF', label: 'Berita' },
  agenda: { icon: CalendarDays, color: '#0E7490', bg: '#ECFEFF', label: 'Agenda' },
  user: { icon: Users, color: '#D97706', bg: '#FFFBEB', label: 'Pengguna' },
  sistem: { icon: AlertCircle, color: '#6B7280', bg: '#F9FAFB', label: 'Sistem' },
}

export default function AdminNotifikasiPage() {
  const [notif, setNotif] = useState(initialNotif)
  const [filter, setFilter] = useState('semua')
  const [confirm, setConfirm] = useState({ open: false })

  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  const unread = notif.filter(n => !n.dibaca).length

  const filtered = notif.filter(n => {
    if (filter === 'belum-dibaca') return !n.dibaca
    if (filter === 'dibaca') return n.dibaca
    return true
  })

  function markRead(id) {
    setNotif(n => n.map(x => x.id === id ? { ...x, dibaca: true } : x))
  }

  function markAllRead() {
    setNotif(n => n.map(x => ({ ...x, dibaca: true })))
  }

  function deleteNotif(id) {
    setNotif(n => n.filter(x => x.id !== id))
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="notifikasi" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Cari notifikasi..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-green-400 focus:bg-white transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0A500' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: '#0A2415' }} />
            </div>
            <span className="font-bold text-gray-900 text-sm">Portal Alumni Daarul Mughni Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />}
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#0A2415' }}>A</div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-4">
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
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                <CheckCheck className="w-4 h-4" /> Tandai Semua Dibaca
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5">
            {[{ value: 'semua', label: 'Semua' }, { value: 'belum-dibaca', label: 'Belum Dibaca' }, { value: 'dibaca', label: 'Sudah Dibaca' }].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
                style={filter === f.value ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Tidak ada notifikasi</p>
              </div>
            ) : filtered.map(n => {
              const cfg = TIPE_CONFIG[n.tipe] ?? TIPE_CONFIG.sistem
              const Icon = cfg.icon
              return (
                <div key={n.id} className={`bg-white rounded-2xl border p-4 flex items-start gap-4 ${!n.dibaca ? 'border-green-200' : 'border-gray-100'}`}>
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
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        variant={confirm.variant}
        onConfirm={confirm.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  )
}
