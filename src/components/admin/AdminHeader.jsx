import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, Bell, Shield, CheckCheck,
  Newspaper, CalendarDays, Users, AlertCircle,
  User, Settings, LogOut, GraduationCap,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '@/lib/supabase'

function formatWaktu(iso) {
  if (!iso) return '—'
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const TIPE_CONFIG = {
  verifikasi: { Icon: Shield,       color: '#1A5C38', bg: '#F0FDF4' },
  berita:     { Icon: Newspaper,    color: '#7C3AED', bg: '#FAF5FF' },
  agenda:     { Icon: CalendarDays, color: '#0E7490', bg: '#ECFEFF' },
  user:       { Icon: Users,        color: '#D97706', bg: '#FFFBEB' },
  sistem:     { Icon: AlertCircle,  color: '#6B7280', bg: '#F9FAFB' },
}

const dropAnim = {
  initial: { opacity: 0, y: 8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit:    { opacity: 0, y: 8, scale: 0.96 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

function NotifDropdown({ notif, unread, onMarkRead, onMarkAllRead, onClose }) {
  const top5 = notif.slice(0, 5)
  return (
    <motion.div
      {...dropAnim}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">Notifikasi</span>
          {unread > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#1A5C38' }}>
              {unread}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <CheckCheck className="w-3 h-3" /> Semua Dibaca
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
        {top5.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">Tidak ada notifikasi</div>
        ) : top5.map((n) => {
          const cfg = TIPE_CONFIG[n.tipe] ?? TIPE_CONFIG.sistem
          const { Icon } = cfg
          return (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${!n.dibaca ? 'bg-green-50/60 hover:bg-green-50' : 'hover:bg-gray-50'}`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
                <Icon className="w-4 h-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-semibold truncate ${!n.dibaca ? 'text-gray-900' : 'text-gray-600'}`}>{n.judul}</p>
                  {!n.dibaca && <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{n.pesan}</p>
                <p className="text-[10px] text-gray-400 mt-1">{n.waktu}</p>
              </div>
            </div>
          )
        })}
      </div>

      <Link
        to="/admin/notifikasi"
        onClick={onClose}
        className="flex items-center justify-center py-3 text-xs font-semibold border-t border-gray-100 text-green-700 hover:bg-green-50 transition-colors"
      >
        Lihat Semua Notifikasi →
      </Link>
    </motion.div>
  )
}

function ProfileDropdown({ user, fotoUrl, onClose, onLogout, onGoAlumni }) {
  const { hasPermission } = useAuth()

  return (
    <motion.div
      {...dropAnim}
      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
      <div className="px-4 py-4 border-b border-gray-100 text-center">
        {fotoUrl
          ? <img src={fotoUrl} alt={user?.name} className="w-12 h-12 rounded-full object-cover mx-auto mb-2 bg-gray-100" />
          : <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-base font-bold" style={{ backgroundColor: '#0A2415' }}>{user?.initials ?? 'A'}</div>
        }
        <p className="text-sm font-bold text-gray-900">{user?.name ?? 'Admin'}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{user?.role ?? '-'}</p>
      </div>

      <div className="py-1">
        <Link
          to="/admin/pengaturan"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <User className="w-4 h-4 text-gray-400" />
          Profil Saya
        </Link>
        {hasPermission('pengaturan') && (
          <Link
            to="/admin/pengaturan"
            onClick={onClose}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            Pengaturan
          </Link>
        )}
        <button
          onClick={onGoAlumni}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <GraduationCap className="w-4 h-4 text-gray-400" />
          Buka Dashboard Alumni
        </button>
      </div>

      <div className="border-t border-gray-100 py-1">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </motion.div>
  )
}

export default function AdminHeader({ searchValue = '', onSearchChange, searchPlaceholder = 'Cari...' }) {
  const { user, profile, signOut } = useAuth()
  const fotoUrl = profile?.foto_url ?? null
  const navigate = useNavigate()

  const [notif, setNotif] = useState([])
  const [showBell, setShowBell] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const bellRef = useRef(null)
  const profileRef = useRef(null)

  const unread = notif.filter((n) => !n.dibaca).length

  useEffect(() => {
    supabase
      .from('notifikasi')
      .select('id, judul, pesan, tipe, is_dibaca, created_at')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setNotif((data ?? []).map(row => ({
          id: row.id, judul: row.judul, pesan: row.pesan ?? '',
          tipe: row.tipe ?? 'sistem', dibaca: row.is_dibaca,
          waktu: formatWaktu(row.created_at),
        })))
      })
  }, [])

  useEffect(() => {
    function handler(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowBell(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function markRead(id) {
    await supabase.from('notifikasi').update({ is_dibaca: true }).eq('id', id)
    setNotif((n) => n.map((x) => (x.id === id ? { ...x, dibaca: true } : x)))
  }

  async function markAllRead() {
    const ids = notif.filter(n => !n.dibaca).map(n => n.id)
    if (ids.length === 0) return
    await supabase.from('notifikasi').update({ is_dibaca: true }).in('id', ids)
    setNotif((n) => n.map((x) => ({ ...x, dibaca: true })))
  }

  function handleGoAlumni() {
    setShowProfile(false)
    navigate('/dashboard')
  }

  async function handleLogout() {
    setShowProfile(false)
    await signOut()
    window.location.href = '/masuk'
  }

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Search */}
      <div className="relative w-52">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-green-400 focus:bg-white transition-all"
        />
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0A500' }}>
          <Shield className="w-3.5 h-3.5" style={{ color: '#0A2415' }} />
        </div>
        <span className="font-bold text-gray-900 text-sm">Portal Alumni Daarul Mughni Admin</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => { setShowBell((v) => !v); setShowProfile(false) }}
            className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />}
          </button>
          <AnimatePresence>
            {showBell && (
              <NotifDropdown
                notif={notif}
                unread={unread}
                onMarkRead={markRead}
                onMarkAllRead={markAllRead}
                onClose={() => setShowBell(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile((v) => !v); setShowBell(false) }}
            className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900 leading-none mb-0.5">{user?.name ?? 'Admin'}</p>
              <p className="text-[10px] text-gray-400">{user?.role ?? '-'}</p>
            </div>
            {fotoUrl
              ? <img src={fotoUrl} alt={user?.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-gray-100" />
              : <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold" style={{ backgroundColor: '#0A2415' }}>{user?.initials ?? 'A'}</div>
            }
          </button>
          <AnimatePresence>
            {showProfile && (
              <ProfileDropdown
                user={user}
                fotoUrl={fotoUrl}
                onClose={() => setShowProfile(false)}
                onLogout={handleLogout}
                onGoAlumni={handleGoAlumni}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
