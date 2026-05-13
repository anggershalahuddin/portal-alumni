import { useState } from 'react'
import { Settings, Edit2, Check, X, AlertTriangle, Send, RefreshCw, Save, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminHeader from '../../components/admin/AdminHeader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { siteConfig as defaultConfig } from '../../data/siteConfig'

const defaultRoles = [
  { id: 'superadmin', label: 'Super Admin', desc: 'Akses penuh ke seluruh fitur dan data sistem', editable: false },
  { id: 'admin', label: 'Admin', desc: 'Dapat mengelola konten, verifikasi, dan data alumni', editable: true },
  { id: 'editor', label: 'Editor', desc: 'Dapat membuat dan mengedit berita serta agenda', editable: true },
  { id: 'alumni', label: 'Alumni', desc: 'Akses profil alumni dan direktori (sudah terverifikasi)', editable: true },
  { id: 'user', label: 'Pengguna', desc: 'Akun alumni yang belum terverifikasi', editable: true },
]

const initialLaporan = [
  { id: 1, nama: 'Ahmad Fauzi', email: 'ahmad@email.com', judul: 'Link profil tidak dapat dibuka', detail: 'Ketika mengklik link profil alumni, halaman blank putih muncul.', waktu: '2025-05-11 10:22', status: 'menunggu' },
  { id: 2, nama: 'Siti Rahmah', email: 'siti@email.com', judul: 'Foto profil tidak tersimpan', detail: 'Setelah mengunggah foto profil baru, foto tetap menampilkan avatar lama setelah refresh.', waktu: '2025-05-10 14:05', status: 'diproses' },
  { id: 3, nama: 'Budi Santoso', email: 'budi@email.com', judul: 'Tidak bisa login setelah ganti password', detail: 'Saat reset password melalui email, link yang dikirim tidak berfungsi.', waktu: '2025-05-09 08:30', status: 'selesai' },
]

const STATUS_CONFIG = {
  menunggu: { label: 'Menunggu', bg: '#FFFBEB', color: '#D97706' },
  diproses: { label: 'Diproses', bg: '#EFF6FF', color: '#1D4ED8' },
  selesai: { label: 'Selesai', bg: '#F0FDF4', color: '#15803D' },
}

function RoleRow({ role, onSave }) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(role.label)
  const [desc, setDesc] = useState(role.desc)

  function handleSave() {
    onSave(role.id, { label, desc })
    setEditing(false)
  }

  function handleCancel() {
    setLabel(role.label)
    setDesc(role.desc)
    setEditing(false)
  }

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0FDF4' }}>
        <Shield className="w-4 h-4" style={{ color: '#1A5C38' }} />
      </div>
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="space-y-2">
            <input value={label} onChange={e => setLabel(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold outline-none focus:border-green-400" />
            <input value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none focus:border-green-400" />
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-900">{role.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{role.desc}</p>
          </>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {!role.editable ? (
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Sistem</span>
        ) : editing ? (
          <>
            <button onClick={handleSave} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100"><Check className="w-3.5 h-3.5 text-green-600" /></button>
            <button onClick={handleCancel} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"><X className="w-3.5 h-3.5 text-gray-500" /></button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 className="w-3.5 h-3.5 text-gray-400" /></button>
        )}
      </div>
    </div>
  )
}

export default function AdminPengaturanPage() {
  const [roles, setRoles] = useState(defaultRoles)
  const [laporan, setLaporan] = useState(initialLaporan)
  const [activeTab, setActiveTab] = useState('peran')
  const [siteConfig, setSiteConfig] = useState(defaultConfig)
  const [saved, setSaved] = useState(false)
  const [confirm, setConfirm] = useState({ open: false })

  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  function updateRole(id, updates) {
    setRoles(r => r.map(x => x.id === id ? { ...x, ...updates } : x))
  }

  function updateStatus(id, status) {
    setLaporan(l => l.map(x => x.id === id ? { ...x, status } : x))
  }

  function handleSaveConfig() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const tabs = [
    { key: 'peran', label: 'Kelola Peran' },
    { key: 'umum', label: 'Pengaturan Umum' },
    { key: 'laporan', label: 'Laporan Masalah' },
  ]

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      <AdminSidebar active="pengaturan" />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader searchPlaceholder="Cari pengaturan..." />

        <motion.div
          className="flex-1 p-6 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Pengaturan</h1>
            <p className="text-sm text-gray-500 mt-0.5">Konfigurasi sistem dan portal alumni.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 border-b border-gray-200 pb-0">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-colors ${activeTab === t.key ? 'border-green-700 text-green-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Kelola Peran */}
          {activeTab === 'peran' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-gray-900">Kelola Nama Peran</h2>
                <p className="text-xs text-gray-400 mt-0.5">Ubah label dan deskripsi peran pengguna. Peran sistem tidak dapat diubah namanya.</p>
              </div>
              <div className="divide-y divide-gray-50">
                {roles.map(role => (
                  <RoleRow key={role.id} role={role} onSave={updateRole} />
                ))}
              </div>
            </div>
          )}

          {/* Pengaturan Umum */}
          {activeTab === 'umum' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="text-sm font-bold text-gray-900">Informasi Portal</h2>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Nama Portal</label>
                  <input value={siteConfig.namaSite} onChange={e => setSiteConfig(s => ({ ...s, namaSite: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Deskripsi</label>
                  <textarea value={siteConfig.deskripsiSite} onChange={e => setSiteConfig(s => ({ ...s, deskripsiSite: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">Email Kontak</label>
                    <input type="email" value={siteConfig.emailKontak} onChange={e => setSiteConfig(s => ({ ...s, emailKontak: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">No. Telepon</label>
                    <input value={siteConfig.telepon} onChange={e => setSiteConfig(s => ({ ...s, telepon: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 block">Alamat</label>
                  <input value={siteConfig.alamat} onChange={e => setSiteConfig(s => ({ ...s, alamat: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="text-sm font-bold text-gray-900">Konfigurasi Sistem</h2>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Verifikasi Alumni Otomatis</p>
                    <p className="text-xs text-gray-400">Jika aktif, akun alumni baru langsung diverifikasi tanpa perlu persetujuan admin</p>
                  </div>
                  <button onClick={() => setSiteConfig(s => ({ ...s, verifikasiOtomatis: !s.verifikasiOtomatis }))}
                    className="w-10 h-6 rounded-full transition-colors flex-shrink-0 relative"
                    style={{ backgroundColor: siteConfig.verifikasiOtomatis ? '#1A5C38' : '#D1D5DB' }}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${siteConfig.verifikasiOtomatis ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Notifikasi Email Admin</p>
                    <p className="text-xs text-gray-400">Kirim email ke admin setiap ada permintaan verifikasi atau laporan masalah baru</p>
                  </div>
                  <button onClick={() => setSiteConfig(s => ({ ...s, notifikasiEmail: !s.notifikasiEmail }))}
                    className="w-10 h-6 rounded-full transition-colors flex-shrink-0 relative"
                    style={{ backgroundColor: siteConfig.notifikasiEmail ? '#1A5C38' : '#D1D5DB' }}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${siteConfig.notifikasiEmail ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => askConfirm({ title: 'Simpan Pengaturan Sistem', message: 'Apakah Anda yakin ingin menyimpan perubahan pengaturan ini? Perubahan akan segera diterapkan ke seluruh sistem.', confirmLabel: 'Ya, Simpan', variant: 'success', onConfirm: () => { handleSaveConfig(); closeConfirm() } })}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: saved ? '#059669' : '#1A5C38' }}>
                  {saved ? <><Check className="w-4 h-4" /> Tersimpan</> : <><Save className="w-4 h-4" /> Simpan Pengaturan</>}
                </button>
              </div>
            </div>
          )}

          {/* Laporan Masalah */}
          {activeTab === 'laporan' && (
            <div className="space-y-3">
              {laporan.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Tidak ada laporan masalah</p>
                </div>
              ) : laporan.map(l => {
                const cfg = STATUS_CONFIG[l.status] ?? STATUS_CONFIG.menunggu
                return (
                  <div key={l.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-900">{l.judul}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{l.nama} · {l.email} · {l.waktu}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-xl">{l.detail}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-gray-500 font-semibold">Ubah status:</span>
                      {['menunggu', 'diproses', 'selesai'].map(s => (
                        <button key={s} onClick={() => updateStatus(l.id, s)}
                          className="px-3 py-1 rounded-full text-[10px] font-bold border"
                          style={l.status === s
                            ? { backgroundColor: STATUS_CONFIG[s].bg, color: STATUS_CONFIG[s].color, borderColor: STATUS_CONFIG[s].color }
                            : { backgroundColor: '#fff', color: '#9CA3AF', borderColor: '#E5E7EB' }}>
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                      <a href={`mailto:${l.email}?subject=Re: ${l.judul}`}
                        className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Send className="w-3 h-3" /> Balas Email
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
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
