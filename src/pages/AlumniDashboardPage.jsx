import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Cropper from 'react-easy-crop'
import logoUrl from '@/assets/Logo DM Fix.jpg'
import {
  Bell, GraduationCap, Briefcase, Plus, Pencil, Trash2,
  BookOpen, Award, MapPin, Calendar, UserPlus, X, Download,
  Check, CheckCheck, ChevronRight, LogOut, Settings,
  FileText, Globe, Users, Clock, Newspaper, CalendarDays,
  Shield, AlertCircle, ExternalLink, Loader2, Star, Image as ImageIcon,
  Phone, Mail, Building2, ShoppingBag, Heart, Handshake, Layers, Upload, Paperclip,
} from 'lucide-react'
import { kategoriStyle } from '../data/agenda'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import ConfirmDialog from '../components/admin/ConfirmDialog'

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
  })
}

async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height)
  canvas.width = size
  canvas.height = size
  ctx.drawImage(
    image,
    croppedAreaPixels.x, croppedAreaPixels.y,
    croppedAreaPixels.width, croppedAreaPixels.height,
    0, 0, size, size,
  )
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92))
}

const SEBAGAI_OPTIONS = [
  'Pendiri / Founder',
  'Direktur / CEO',
  'Pengasuh',
  'Ketua / Pengurus',
  'Sekretaris / Bendahara',
  'Anggota Aktif',
  'Lainnya',
]

// Konfigurasi visual per jenis usaha
const JENIS_USAHA = [
  { value: 'Perusahaan (PT/CV/UD)',        icon: Building2,    color: '#1D4ED8', bg: '#EFF6FF' },
  { value: 'Pesantren / Lembaga Pendidikan', icon: BookOpen,    color: '#1A5C38', bg: '#F0FDF4' },
  { value: 'Yayasan / Lembaga Sosial',      icon: Heart,        color: '#DB2777', bg: '#FDF2F8' },
  { value: 'Toko / UMKM',                   icon: ShoppingBag,  color: '#D97706', bg: '#FFFBEB' },
  { value: 'Koperasi',                       icon: Users,        color: '#0E7490', bg: '#ECFEFF' },
  { value: 'Lainnya',                        icon: Layers,       color: '#6B7280', bg: '#F9FAFB' },
]

function jenisConfig(jenis) {
  return JENIS_USAHA.find(j => j.value === jenis) ?? JENIS_USAHA[JENIS_USAHA.length - 1]
}

const JENJANG_OPTIONS = ['SD/MI', 'SMP/MTs/Sederajat', 'SMA/MA/Sederajat', 'D3', 'S1', 'S2', 'S3', 'Lainnya']

const TIPE_PEKERJAAN = [
  { value: 'full-time', label: 'Full-time', color: '#1D4ED8', bg: '#EFF6FF' },
  { value: 'part-time', label: 'Part-time', color: '#7C3AED', bg: '#FAF5FF' },
  { value: 'remote',    label: 'Remote',    color: '#0E7490', bg: '#ECFEFF' },
  { value: 'magang',    label: 'Magang',    color: '#D97706', bg: '#FFFBEB' },
  { value: 'freelance', label: 'Freelance', color: '#15803D', bg: '#F0FDF4' },
]
function tipeConfig(tipe) {
  return TIPE_PEKERJAAN.find(t => t.value === tipe) ?? TIPE_PEKERJAAN[0]
}

// ── Alumni notifications ───────────────────────────────────────────────────────
const initNotif = [
  { id: 1, icon: Shield, color: '#1A5C38', bg: '#F0FDF4', judul: 'Akun Anda Terverifikasi', pesan: 'Selamat! Akun alumni Anda telah berhasil diverifikasi oleh admin portal.', waktu: '1 hari lalu', dibaca: false },
  { id: 2, icon: CalendarDays, color: '#0E7490', bg: '#ECFEFF', judul: 'Agenda Mendatang', pesan: 'Reuni Akbar Lintas Angkatan 2024 akan berlangsung minggu depan. Segera daftar!', waktu: '2 hari lalu', dibaca: false },
  { id: 3, icon: Briefcase, color: '#7C3AED', bg: '#FAF5FF', judul: 'Lowongan Baru Sesuai Profil', pesan: 'Terdapat 2 lowongan baru yang sesuai dengan bidang teknologi Anda.', waktu: '3 hari lalu', dibaca: true },
  { id: 4, icon: Newspaper, color: '#D97706', bg: '#FFFBEB', judul: 'Berita Terbaru', pesan: 'Pondok Pesantren Daarul Mughni resmikan Gedung Laboratorium Bahasa Baru.', waktu: '4 hari lalu', dibaca: true },
  { id: 5, icon: AlertCircle, color: '#6B7280', bg: '#F9FAFB', judul: 'Profil Belum Lengkap', pesan: 'Lengkapi foto profil dan LinkedIn Anda untuk meningkatkan visibilitas di direktori alumni.', waktu: '5 hari lalu', dibaca: true },
]

// ── Utilities ──────────────────────────────────────────────────────────────────
function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function useScrollLock() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
}

const dropAnim = {
  initial: { opacity: 0, y: 8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.96 },
  transition: { duration: 0.15, ease: 'easeOut' },
}

// ── Circular progress ──────────────────────────────────────────────────────────
function CircularProgress({ pct }) {
  const r = 42
  const circ = 2 * Math.PI * r
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="9" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F0A500" strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-[#0A2415]">{pct}%</span>
      </div>
    </div>
  )
}

// ── Modals ─────────────────────────────────────────────────────────────────────
function ModalWrapper({ onClose, children }) {
  useScrollLock()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {children}
    </div>
  )
}

function MF({ label, children }) {
  return <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>{children}</div>
}

const inp = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#1A5C38] transition-colors'

function SvgInstagram() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <defs><radialGradient id="ig2" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#ffd600"/><stop offset="20%" stopColor="#ff7a00"/><stop offset="45%" stopColor="#ff0069"/><stop offset="75%" stopColor="#d300c5"/><stop offset="100%" stopColor="#7638fa"/></radialGradient></defs>
      <rect width="24" height="24" rx="6" fill="url(#ig2)"/>
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.5" stroke="white" strokeWidth="1.5" fill="none"/>
      <circle cx="12" cy="12" r="2.8" stroke="white" strokeWidth="1.5" fill="none"/>
      <circle cx="16.2" cy="7.8" r="0.9" fill="white"/>
    </svg>
  )
}
function SvgYouTube() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#FF0000"/>
      <path d="M19.6 8.4a2 2 0 0 0-1.4-1.4C16.9 6.6 12 6.6 12 6.6s-4.9 0-6.2.4A2 2 0 0 0 4.4 8.4C4 9.7 4 12 4 12s0 2.3.4 3.6a2 2 0 0 0 1.4 1.4c1.3.4 6.2.4 6.2.4s4.9 0 6.2-.4a2 2 0 0 0 1.4-1.4C20 14.3 20 12 20 12s0-2.3-.4-3.6z" fill="white"/>
      <polygon points="10,9.5 10,14.5 15,12" fill="#FF0000"/>
    </svg>
  )
}
function SvgTwitterX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#000"/>
      <path d="M17.5 5h-2.2l-3.3 4.2L8.8 5H4.5l5.5 7L4.5 19h2.2l3.6-4.5L14 19h4.3l-5.8-7.4L17.5 5z" fill="white"/>
    </svg>
  )
}
function SvgFacebook() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#1877F2"/>
      <path d="M15.5 8H13.5V6.5C13.5 5.95 13.95 5.5 14.5 5.5H15.5V3H13.5C11.84 3 10.5 4.34 10.5 6V8H8.5V11H10.5V21H13.5V11H15.5L16 8H15.5Z" fill="white"/>
    </svg>
  )
}

function EditProfilModal({ profil, onSave, onClose }) {
  const [form, setForm] = useState({ ...profil })
  const [fotoFile, setFotoFile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(profil.fotoUrl ?? null)
  const fileRef = useRef(null)
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  // Crop state
  const [cropSrc, setCropSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), [])

  function handleFotoChange(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { alert('Ukuran foto maks. 5MB'); return }
    setCropSrc(URL.createObjectURL(f))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  async function handleConfirmCrop() {
    if (!cropSrc || !croppedAreaPixels) return
    const blob = await getCroppedImg(cropSrc, croppedAreaPixels)
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(blob))
    setCropSrc(null)
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{cropSrc ? 'Crop Foto Profil' : 'Edit Profil'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* ── Crop mode ── */}
        {cropSrc ? (
          <>
            <div className="relative bg-black" style={{ height: 300 }}>
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Zoom</label>
              <input
                type="range" min={1} max={3} step={0.01}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-full accent-[#1A5C38]"
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setCropSrc(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
              <button onClick={handleConfirmCrop} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#1A5C38' }}>Gunakan Foto</button>
            </div>
          </>
        ) : (<>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">

          {/* Foto Profil */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Foto Profil</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-[#1A5C38] flex items-center justify-center">
                {fotoPreview
                  ? <img src={fotoPreview} alt="preview" className="w-full h-full object-cover" />
                  : <span className="text-xl font-bold text-white">{profil.nama?.[0]?.toUpperCase() ?? '?'}</span>}
              </div>
              <div className="flex-1">
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> {fotoPreview ? 'Ganti Foto' : 'Pilih Foto'}
                </button>
                <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, WebP — maks. 5MB</p>
                <input ref={fileRef} type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={handleFotoChange} />
              </div>
            </div>
          </div>

          <MF label="Nama Lengkap"><input className={inp} value={form.nama} onChange={s('nama')} /></MF>
          <MF label="Bio Singkat"><textarea className={`${inp} resize-none`} rows={3} value={form.bio} onChange={s('bio')} placeholder="Ceritakan tentang diri Anda..." /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Bidang / Profesi"><input className={inp} value={form.bidang} onChange={s('bidang')} /></MF>
            <MF label="Domisili"><input className={inp} value={form.domisili} onChange={s('domisili')} /></MF>
          </div>
          <MF label="Email"><input className={inp} type="email" value={form.email} onChange={s('email')} /></MF>
          <MF label="No. HP / WhatsApp"><input className={inp} type="tel" value={form.phone} onChange={s('phone')} /></MF>
          <MF label="URL LinkedIn"><input className={inp} value={form.linkedin} onChange={s('linkedin')} placeholder="linkedin.com/in/username" /></MF>
          <MF label="Website / Portofolio"><input className={inp} value={form.website} onChange={s('website')} placeholder="portofolio.com" /></MF>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sosial Media</p>
            <div className="space-y-3">
              {[
                { key: 'instagram', label: 'Instagram', placeholder: 'username', prefix: '@', icon: <SvgInstagram /> },
                { key: 'youtube',   label: 'YouTube',   placeholder: '@channelname', prefix: '', icon: <SvgYouTube /> },
                { key: 'twitter',   label: 'Twitter / X', placeholder: 'username', prefix: '@', icon: <SvgTwitterX /> },
                { key: 'facebook',  label: 'Facebook',  placeholder: 'username atau URL', prefix: '', icon: <SvgFacebook /> },
              ].map(({ key, label, placeholder, prefix, icon }) => (
                <MF key={key} label={<span className="flex items-center gap-1.5">{icon} {label}</span>}>
                  <div className="relative">
                    {prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">{prefix}</span>}
                    <input className={`${inp} ${prefix ? 'pl-8' : ''}`} value={form[key]} onChange={s(key)} placeholder={placeholder} />
                  </div>
                </MF>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => onSave({ ...form, fotoFile })}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
        </>)}
      </div>
    </ModalWrapper>
  )
}

function PendidikanModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    jenjang:      item?.jenjang      ?? 'S1',
    jurusan:      item?.jurusan      ?? '',
    institusi:    item?.institusi    ?? '',
    lokasi:       item?.lokasi       ?? '',
    gelar_depan:  item?.gelar_depan  ?? '',
    gelar_belakang: item?.gelar_belakang ?? '',
    tahun_mulai:  item?.tahun_mulai  ? String(item.tahun_mulai)  : '',
    tahun_selesai:item?.tahun_selesai? String(item.tahun_selesai): '',
    is_current:   item?.is_current   ?? false,
  })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const showGelar = ['D3', 'S1', 'S2', 'S3'].includes(form.jenjang)
  const curYear = new Date().getFullYear()

  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Riwayat Pendidikan</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <MF label="Jenjang Pendidikan *">
            <select className={inp} value={form.jenjang} onChange={s('jenjang')}>
              {JENJANG_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </MF>
          {showGelar && (
            <div className="grid grid-cols-2 gap-3">
              <MF label="Gelar Depan">
                <input className={inp} value={form.gelar_depan} onChange={s('gelar_depan')} placeholder="cth. Dr." />
              </MF>
              <MF label="Gelar Belakang">
                <input className={inp} value={form.gelar_belakang} onChange={s('gelar_belakang')} placeholder="cth. S.Kom., M.T." />
              </MF>
            </div>
          )}
          <MF label="Jurusan / Program Studi">
            <input className={inp} value={form.jurusan} onChange={s('jurusan')} placeholder="cth. Teknik Informatika" />
          </MF>
          <MF label="Institusi / Nama Sekolah *">
            <input className={inp} value={form.institusi} onChange={s('institusi')} placeholder="Nama universitas, sekolah, atau pesantren" />
          </MF>
          <MF label="Lokasi Sekolah / Kota">
            <input className={inp} value={form.lokasi} onChange={s('lokasi')} placeholder="cth. Bandung, Jawa Barat" />
          </MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Tahun Mulai">
              <input className={inp} type="number" value={form.tahun_mulai} onChange={s('tahun_mulai')} placeholder={String(curYear - 4)} min="1970" max={curYear} />
            </MF>
            <MF label="Tahun Selesai">
              <input className={inp} type="number" value={form.tahun_selesai} onChange={s('tahun_selesai')}
                placeholder={form.is_current ? 'Sekarang' : String(curYear)}
                disabled={form.is_current} min="1970" max={curYear + 10} />
            </MF>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={form.is_current}
              onChange={e => setForm(p => ({ ...p, is_current: e.target.checked, tahun_selesai: e.target.checked ? '' : p.tahun_selesai }))}
              className="w-4 h-4 accent-green-600" />
            Masih menempuh pendidikan ini
          </label>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.institusi && onSave(form)} disabled={!form.institusi}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function KarirModal({ item, onSave, onClose }) {
  const curYear = new Date().getFullYear()
  const [form, setForm] = useState({
    posisi:       item?.posisi       ?? item?.jabatan ?? '',
    perusahaan:   item?.perusahaan   ?? '',
    tipe:         item?.tipe         ?? 'full-time',
    lokasi:       item?.lokasi       ?? '',
    tahun_mulai:  item?.tahun_mulai  ? String(item.tahun_mulai)  : '',
    tahun_selesai:item?.tahun_selesai? String(item.tahun_selesai): '',
    is_current:   item?.is_current   ?? item?.current ?? false,
    deskripsi:    item?.deskripsi    ?? '',
  })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const tc = tipeConfig(form.tipe)

  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Riwayat Pekerjaan</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <MF label="Jabatan / Posisi *">
            <input className={inp} value={form.posisi} onChange={s('posisi')} placeholder="Software Engineer" />
          </MF>
          <MF label="Perusahaan / Instansi *">
            <input className={inp} value={form.perusahaan} onChange={s('perusahaan')} placeholder="Nama perusahaan" />
          </MF>
          <MF label="Tipe Pekerjaan">
            <select className={inp} value={form.tipe} onChange={s('tipe')}>
              {TIPE_PEKERJAAN.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            {form.tipe && (
              <span className="inline-flex items-center mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: tc.bg, color: tc.color }}>{tc.label}</span>
            )}
          </MF>
          <MF label="Lokasi">
            <input className={inp} value={form.lokasi} onChange={s('lokasi')} placeholder="Jakarta" />
          </MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Tahun Mulai">
              <input className={inp} type="number" value={form.tahun_mulai} onChange={s('tahun_mulai')}
                placeholder={String(curYear - 2)} min="1970" max={curYear} />
            </MF>
            <MF label="Tahun Selesai">
              <input className={inp} type="number" value={form.tahun_selesai} onChange={s('tahun_selesai')}
                placeholder={form.is_current ? 'Sekarang' : String(curYear)}
                disabled={form.is_current} min="1970" max={curYear + 5} />
            </MF>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={form.is_current}
              onChange={e => setForm(p => ({ ...p, is_current: e.target.checked, tahun_selesai: e.target.checked ? '' : p.tahun_selesai }))}
              className="w-4 h-4 accent-green-600" />
            Masih bekerja di sini
          </label>
          <MF label="Deskripsi">
            <textarea className={`${inp} resize-none`} rows={3} value={form.deskripsi} onChange={s('deskripsi')} />
          </MF>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.posisi && form.perusahaan && onSave(form)} disabled={!form.posisi || !form.perusahaan}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function SertifikasiModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({ nama: item?.nama ?? '', penerbit: item?.penerbit ?? '', tahun: item?.tahun ?? '', noCert: item?.noCert ?? '', url: item?.url ?? '' })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Sertifikasi</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <MF label="Nama Sertifikasi"><input className={inp} value={form.nama} onChange={s('nama')} placeholder="Google Professional Cloud Architect" /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Penerbit"><input className={inp} value={form.penerbit} onChange={s('penerbit')} placeholder="Google, AWS, dll" /></MF>
            <MF label="Tahun"><input className={inp} type="number" value={form.tahun} onChange={s('tahun')} placeholder="2024" /></MF>
          </div>
          <MF label="Nomor Sertifikat (opsional)"><input className={inp} value={form.noCert} onChange={s('noCert')} /></MF>
          <MF label="URL Verifikasi (opsional)"><input className={inp} type="url" value={form.url} onChange={s('url')} placeholder="https://..." /></MF>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.nama && onSave(form)} disabled={!form.nama}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function PublikasiModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({ judul: item?.judul ?? '', penerbit: item?.penerbit ?? '', tahun: item?.tahun ?? '', url: item?.url ?? '', deskripsi: item?.deskripsi ?? '' })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Publikasi</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <MF label="Judul Publikasi / Karya"><input className={inp} value={form.judul} onChange={s('judul')} placeholder="Judul artikel, jurnal, buku..." /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Penerbit / Media"><input className={inp} value={form.penerbit} onChange={s('penerbit')} /></MF>
            <MF label="Tahun Terbit"><input className={inp} type="number" value={form.tahun} onChange={s('tahun')} placeholder="2024" /></MF>
          </div>
          <MF label="URL / Tautan"><input className={inp} type="url" value={form.url} onChange={s('url')} placeholder="https://..." /></MF>
          <MF label="Deskripsi Singkat"><textarea className={`${inp} resize-none`} rows={2} value={form.deskripsi} onChange={s('deskripsi')} /></MF>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => form.judul && onSave(form)} disabled={!form.judul}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

// ── Usaha & Kepemilikan Modal ──────────────────────────────────────────────────
function UsahaModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    nama: item?.nama ?? '',
    jenis: item?.jenis ?? JENIS_USAHA[0].value,
    sebagai: item?.sebagai ?? SEBAGAI_OPTIONS[0],
    bidang: item?.bidang ?? '',
    lokasi: item?.lokasi ?? '',
    tahun: item?.tahun ?? '',
    deskripsi: item?.deskripsi ?? '',
    website: item?.website ?? '',
    openKerjasama: item?.openKerjasama ?? false,
  })
  const s = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const cfg = jenisConfig(form.jenis)
  const Icon = cfg.icon

  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
              <Icon className="w-4 h-4" style={{ color: cfg.color }} />
            </div>
            <h2 className="text-base font-bold text-gray-900">{item ? 'Edit' : 'Tambah'} Lembaga / Badan Usaha</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <MF label="Nama Lembaga / Badan Usaha *">
            <input className={inp} value={form.nama} onChange={s('nama')} placeholder="Nama pesantren, yayasan, perusahaan..." />
          </MF>

          <MF label="Jenis *">
            <select className={inp} value={form.jenis} onChange={s('jenis')}>
              {JENIS_USAHA.map(j => (
                <option key={j.value} value={j.value}>{j.value}</option>
              ))}
            </select>
          </MF>

          <MF label="Sebagai *">
            <select className={inp} value={form.sebagai} onChange={s('sebagai')}>
              {SEBAGAI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </MF>

          <div className="grid grid-cols-2 gap-3">
            <MF label="Bidang / Sektor">
              <input className={inp} value={form.bidang} onChange={s('bidang')} placeholder="Teknologi, Kuliner..." />
            </MF>
            <MF label="Lokasi">
              <input className={inp} value={form.lokasi} onChange={s('lokasi')} placeholder="Kota, Provinsi" />
            </MF>
          </div>

          <MF label="Tahun Berdiri">
            <input className={inp} type="number" value={form.tahun} onChange={s('tahun')} placeholder="2020" min="1900" max={new Date().getFullYear()} />
          </MF>

          <MF label="Deskripsi Singkat">
            <textarea className={`${inp} resize-none`} rows={3} value={form.deskripsi} onChange={s('deskripsi')}
              placeholder="Jelaskan kegiatan utama, produk, atau layanan..." />
          </MF>

          <MF label="Website / Media Sosial">
            <input className={inp} type="url" value={form.website} onChange={s('website')} placeholder="https://..." />
          </MF>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:border-[#1A5C38]/30 transition-colors">
            <input
              type="checkbox"
              checked={form.openKerjasama}
              onChange={e => setForm(p => ({ ...p, openKerjasama: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">Terbuka untuk Kerjasama Alumni</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Tandai jika usaha ini membuka peluang magang, rekrutmen, atau kerjasama dengan alumni lain
              </p>
            </div>
          </label>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button
            onClick={() => form.nama && onSave(form)}
            disabled={!form.nama}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: '#1A5C38' }}
          >Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

// ── Keahlian & Bahasa Modal ────────────────────────────────────────────────────
function KeahlianBahasaModal({ keahlian, bahasa, onSave, onClose }) {
  const [listK, setListK] = useState([...keahlian])
  const [listB, setListB] = useState([...bahasa])
  const [inputK, setInputK] = useState('')
  const [inputB, setInputB] = useState('')

  function addK() {
    const v = inputK.trim()
    if (v && !listK.includes(v)) { setListK(p => [...p, v]); setInputK('') }
  }
  function addB() {
    const v = inputB.trim()
    if (v && !listB.includes(v)) { setListB(p => [...p, v]); setInputB('') }
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Keahlian & Bahasa</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* Keahlian */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2.5">Keahlian / Skills</label>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
              {listK.map(k => (
                <span key={k} className="inline-flex items-center gap-1 text-xs text-[#1A5C38] border border-[#1A5C38]/30 bg-[#E8F5EE] px-2.5 py-1 rounded-full">
                  {k}
                  <button onClick={() => setListK(p => p.filter(x => x !== k))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {listK.length === 0 && <p className="text-xs text-gray-300">Belum ada keahlian</p>}
            </div>
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} placeholder="React, Python, Public Speaking..." value={inputK}
                onChange={e => setInputK(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addK() } }} />
              <button onClick={addK} className="px-3 py-2 rounded-xl text-white text-sm font-bold shrink-0" style={{ backgroundColor: '#1A5C38' }}>Tambah</button>
            </div>
          </div>

          {/* Bahasa */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bahasa</label>
            <p className="text-[10px] text-gray-400 mb-2.5">Contoh: Indonesia (Native) · English (Professional) · Arabic (Academic)</p>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
              {listB.map(b => (
                <span key={b} className="inline-flex items-center gap-1 text-xs text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full">
                  {b}
                  <button onClick={() => setListB(p => p.filter(x => x !== b))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {listB.length === 0 && <p className="text-xs text-gray-300">Belum ada bahasa</p>}
            </div>
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} placeholder="English (Professional)" value={inputB}
                onChange={e => setInputB(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addB() } }} />
              <button onClick={addB} className="px-3 py-2 rounded-xl text-white text-sm font-bold shrink-0" style={{ backgroundColor: '#1A5C38' }}>Tambah</button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={() => { onSave(listK, listB); onClose() }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

// ── Berkas / Dokumen Modal ────────────────────────────────────────────────────
const KATEGORI_BERKAS = {
  'CV / Resume':     { accept: '.pdf', formatLabel: 'PDF', maxMB: 2,  tipe: 'PDF' },
  'Ijazah':          { accept: '.pdf', formatLabel: 'PDF', maxMB: 2,  tipe: 'PDF' },
  'Sertifikat':      { accept: '.pdf', formatLabel: 'PDF', maxMB: 2,  tipe: 'PDF' },
  'Foto / Scan':     { accept: '.webp,.jpg,.jpeg', formatLabel: 'WebP / JPEG', maxMB: 1, tipe: 'IMG' },
  'Company Profile': { accept: '.pdf', formatLabel: 'PDF', maxMB: 5,  tipe: 'PDF' },
  'Lainnya':         { accept: '.pdf', formatLabel: 'PDF', maxMB: 2,  tipe: 'PDF' },
}

function BerkasModal({ onSave, onClose }) {
  const [kategori, setKategori] = useState('CV / Resume')
  const [file, setFile]         = useState(null)
  const [nama, setNama]         = useState('')
  const [error, setError]       = useState('')
  const fileRef = useRef(null)

  const cfg = KATEGORI_BERKAS[kategori]

  function handleKategori(val) {
    setKategori(val)
    setFile(null)
    setError('')
    setNama('')
  }

  function handleFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setError('')

    const ext = f.name.split('.').pop().toLowerCase()
    const allowed = cfg.accept.split(',').map(a => a.replace('.', ''))
    if (!allowed.includes(ext)) {
      setError(`Format tidak didukung. Gunakan ${cfg.formatLabel}.`)
      e.target.value = ''
      return
    }
    const maxBytes = cfg.maxMB * 1024 * 1024
    if (f.size > maxBytes) {
      setError(`Ukuran file melebihi batas ${cfg.maxMB} MB.`)
      e.target.value = ''
      return
    }
    setFile(f)
    setNama(f.name.replace(/\.[^/.]+$/, ''))
  }

  function formatUkuran(bytes) {
    return bytes > 1048576
      ? `${(bytes / 1048576).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`
  }

  function handleSave() {
    onSave({ nama: nama.trim() || kategori, tipe: cfg.tipe, ukuran: formatUkuran(file.size), kategori, file })
    onClose()
  }

  const canSave = !!file && !!nama.trim() && !error

  return (
    <ModalWrapper onClose={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Unggah Dokumen</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Kategori</label>
            <select className={inp} value={kategori} onChange={e => handleKategori(e.target.value)}>
              {Object.keys(KATEGORI_BERKAS).map(k => <option key={k}>{k}</option>)}
            </select>
          </div>

          {/* Info format */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#F0FAF5] rounded-lg text-[11px] text-[#1A5C38] font-medium">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            Format: <span className="font-bold">{cfg.formatLabel}</span> · Maks <span className="font-bold">{cfg.maxMB} MB</span>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-[#1A5C38]/40 hover:bg-[#F8FAF9]'
            }`}
          >
            <Upload className={`w-7 h-7 mx-auto mb-2 ${error ? 'text-red-300' : 'text-gray-300'}`} />
            {file ? (
              <>
                <p className="text-sm font-semibold text-[#1A5C38]">{file.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatUkuran(file.size)}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Klik untuk pilih file <span className="text-[#1A5C38] font-semibold">Browse</span></p>
            )}
            <input ref={fileRef} type="file" className="hidden" accept={cfg.accept} onChange={handleFile} />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
            </p>
          )}

          {/* Nama */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nama Dokumen</label>
            <input className={inp} value={nama} onChange={e => setNama(e.target.value)}
              placeholder="Contoh: Curriculum Vitae 2024" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
          <button onClick={handleSave} disabled={!canSave}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: '#1A5C38' }}>Simpan</button>
        </div>
      </div>
    </ModalWrapper>
  )
}

// ── Kartu Alumni Modal ─────────────────────────────────────────────────────────
function KartuAlumniModal({ user, profil, pekerjaan = [], onClose }) {
  useScrollLock()
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const angkatanLabel = user.angkatan
    ? `Angkatan ${user.angkatanKe ?? user.angkatan} · Lulusan ${user.tahunLulus ?? user.angkatan}`
    : 'Alumni'

  // Ambil pekerjaan aktif, atau pekerjaan paling akhir jika tidak ada yang aktif
  const currentJob = pekerjaan.find(p => p.is_current || p.current)
    ?? pekerjaan.sort((a, b) => (b.tahun_selesai ?? 9999) - (a.tahun_selesai ?? 9999))[0]
    ?? null

  const jobLine = currentJob
    ? `${currentJob.posisi} · ${currentJob.perusahaan}`
    : profil.bidang || null

  async function imgToBase64(src) {
    const res = await fetch(src, { mode: 'cors', cache: 'no-cache' })
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.onerror = reject
      fr.readAsDataURL(blob)
    })
  }

  async function handleDownload() {
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      await document.fonts.ready

      // Clone card ke off-screen agar card asli tidak berubah tampilannya
      const clone = cardRef.current.cloneNode(true)
      clone.style.position = 'fixed'
      clone.style.top = '-9999px'
      clone.style.left = '-9999px'
      clone.style.zIndex = '-1'
      document.body.appendChild(clone)

      // Pre-fetch semua gambar di clone ke base64 (bypass CORS html2canvas)
      for (const img of clone.querySelectorAll('img')) {
        try { img.src = await imgToBase64(img.src) } catch { /* pakai src asli */ }
      }

      await new Promise(r => setTimeout(r, 80))

      const canvas = await html2canvas(clone, {
        scale: 4,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#0A2415',
        imageTimeout: 10000,
      })

      document.body.removeChild(clone)

      // Download sebagai JPG
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `kartu-alumni-${user.id}.jpg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 'image/jpeg', 0.96)
    } catch (e) {
      console.error('[KartuDownload]', e)
      alert('Gagal mengunduh kartu. Coba lagi.')
    }
    finally { setDownloading(false) }
  }

  // KTP ratio: 85.6 × 54mm → width 360px → height ≈ 227px
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-white/70 text-xs font-semibold">Pratinjau Kartu Alumni · Ukuran KTP (85.6 × 54 mm)</p>

        {/* Card — 360 × 227px = KTP proportions */}
        <div
          ref={cardRef}
          style={{
            width: 360, height: 227,
            background: 'linear-gradient(135deg, #0A2415 0%, #1A5C38 55%, #226B44 100%)',
            borderRadius: 12, overflow: 'hidden', position: 'relative',
            fontFamily: 'Inter, sans-serif', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: '50%', border: '1.5px solid rgba(240,165,0,0.18)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -18, right: -18, width: 78, height: 78, borderRadius: '50%', border: '1.5px solid rgba(240,165,0,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -28, left: -28, width: 90, height: 90, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <img
                src={logoUrl}
                alt="Logo DM"
                crossOrigin="anonymous"
                style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'contain', flexShrink: 0, backgroundColor: '#fff', padding: 2 }}
              />
              <div>
                <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 2 }}>KARTU ALUMNI RESMI</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#fff', lineHeight: 1.35 }}>Pondok Pesantren<br />Daarul Mughni Al Maaliki</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginBottom: 2 }}>TAHUN LULUS</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#F0A500', lineHeight: 1 }}>{user.tahunLulus ?? user.angkatan ?? '—'}</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ margin: '10px 18px 0', height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />

          {/* Main info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px' }}>
            {/* Photo */}
            <div style={{
              width: 62, height: 62, borderRadius: '50%',
              border: '2.5px solid rgba(240,165,0,0.6)',
              overflow: 'hidden', flexShrink: 0,
              backgroundColor: '#0A2415',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {profil.fotoUrl
                ? <img src={profil.fotoUrl} alt={user.name} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{initials(user.name)}</span>
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 900, color: '#fff', marginBottom: 2, letterSpacing: -0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              {jobLine && (
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{jobLine}</div>
              )}
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginBottom: 1 }}>{angkatanLabel}</div>
              {profil.domisili && (
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{profil.domisili}, Indonesia</div>
              )}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, backgroundColor: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 20, padding: '2px 8px' }}>
                <div style={{ width: 4.5, height: 4.5, borderRadius: '50%', backgroundColor: '#4ADE80', flexShrink: 0 }} />
                <span style={{ fontSize: 7, color: '#4ADE80', fontWeight: 700, letterSpacing: 0.5 }}>TERVERIFIKASI</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.35)', padding: '6px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 1.5 }}>ID ALUMNI</div>
              <div style={{ fontSize: 11.5, fontWeight: 900, color: '#F0A500', fontFamily: 'monospace', letterSpacing: 1 }}>{user.id}</div>
            </div>
            <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 20 }}>
              {[9, 15, 7, 19, 11, 21, 8, 17, 10, 15, 7, 13].map((h, i) => (
                <div key={i} style={{ width: 2, height: h, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 1 }} />
              ))}
            </div>
            <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.2)', textAlign: 'right' }}>
              {profil.domisili || 'Bogor'}, Jawa Barat<br />© 2026 Daarul Mughni
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-[#0A2415] hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ backgroundColor: '#F0A500' }}
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {downloading ? 'Mengunduh...' : 'Unduh Kartu (JPG)'}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-white/30 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            Tutup
          </button>
        </div>
        <p className="text-white/35 text-[10px]">File JPG resolusi tinggi — ukuran fisik KTP (85.6 × 54 mm)</p>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AlumniDashboardPage() {
  const navigate = useNavigate()
  const { user, profile: authProfile, profileReady, signOut, refreshProfile, isAdminUser } = useAuth()

  const [alumniId, setAlumniId]   = useState(null)
  const [idAlumni, setIdAlumni]   = useState(null)
  const [angkatanInfo, setAngkatanInfo] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)

  // Section states (mulai kosong, diisi dari Supabase)
  const [profil, setProfil] = useState({
    nama: '', email: '', phone: '', bio: '',
    bidang: '', domisili: '', linkedin: '', website: '',
    instagram: '', youtube: '', twitter: '', facebook: '',
    foto: false, fotoUrl: '',
  })
  const [pendidikan, setPendidikan] = useState([])
  const [pekerjaan, setPekerjaan]   = useState([])
  const [sertifikasi, setSertifikasi] = useState([])
  const [publikasi, setPublikasi]   = useState([])
  const [usaha, setUsaha]           = useState([])
  const [keahlian, setKeahlian]     = useState([])
  const [bahasa, setBahasa]         = useState([])
  const [dokumen, setDokumen]       = useState([])
  const [notif, setNotif]           = useState(initNotif)

  // Sidebar widget data (loaded from Supabase)
  const [recentNews, setRecentNews]         = useState([])
  const [upcomingAgenda, setUpcomingAgenda] = useState([])
  const [activeJobs, setActiveJobs]         = useState([])
  const [recentGaleri, setRecentGaleri]     = useState([])

  // UI states
  const [modal, setModal]           = useState(null)
  const [showBell, setShowBell]     = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [aksiOpen, setAksiOpen]     = useState(false)
  const bellRef    = useRef(null)
  const profileRef = useRef(null)

  // Confirm dialog
  const [confirm, setConfirm] = useState({ open: false })
  function askConfirm(opts) { setConfirm({ open: true, ...opts }) }
  function closeConfirm() { setConfirm({ open: false }) }

  // ── Load data dari Supabase ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !profileReady) return
    loadDashboard()
    loadWidgets()
  }, [user?.id, profileReady]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadWidgets() {
    const now = new Date().toISOString()
    const [newsRes, agendaRes, jobsRes, galeriRes] = await Promise.all([
      supabase.from('berita').select('slug, judul, foto_url, published_at').eq('status', 'published').order('published_at', { ascending: false }).limit(3),
      supabase.from('agenda').select('id, judul, kategori, foto_url, tanggal_mulai').eq('is_aktif', true).gte('tanggal_mulai', now).order('tanggal_mulai', { ascending: true }).limit(3),
      supabase.from('lowongan').select('id, judul, perusahaan, tipe, lokasi, gaji_min, gaji_max').eq('is_aktif', true).order('created_at', { ascending: false }).limit(3),
      supabase.from('galeri').select('id, judul, foto_url').eq('is_aktif', true).order('created_at', { ascending: false }).limit(4),
    ])
    const monthShort = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
    setRecentNews((newsRes.data ?? []).map(b => ({
      slug: b.slug,
      title: b.judul,
      image: b.foto_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      date: b.published_at ? new Date(b.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
    })))
    setUpcomingAgenda((agendaRes.data ?? []).map(a => {
      const tgl = new Date(a.tanggal_mulai)
      return {
        id: a.id,
        title: a.judul,
        kategori: a.kategori ?? 'edukasi',
        kategoriLabel: a.kategori ?? 'Umum',
        image: a.foto_url || null,
        tanggalLabel: `${tgl.getDate()} ${monthShort[tgl.getMonth()]} ${tgl.getFullYear()}`,
      }
    }))
    setActiveJobs((jobsRes.data ?? []).map(j => ({
      id: j.id,
      judul: j.judul,
      instansi: j.perusahaan,
      tipe: j.tipe ?? 'fulltime',
      lokasi: j.lokasi ?? '—',
      gaji: j.gaji_min ? `Rp ${(j.gaji_min / 1e6).toFixed(0)}–${(j.gaji_max / 1e6).toFixed(0)} jt` : null,
    })))
    setRecentGaleri((galeriRes.data ?? []).map(g => ({
      id: g.id,
      judul: g.judul,
      url: g.foto_url,
    })))
  }

  async function loadDashboard() {
    setPageLoading(true)
    try {
      // 1. Ambil atau buat alumni_profiles
      let { data: ap } = await supabase
        .from('alumni_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!ap) {
        const { data: newAp } = await supabase
          .from('alumni_profiles')
          .insert({ user_id: user.id })
          .select()
          .single()
        ap = newAp
      }

      const aid = ap?.id
      setAlumniId(aid)
      const currentIdAlumni = ap?.id_alumni ?? null
      setIdAlumni(currentIdAlumni)

      // 2. Load angkatan info
      let angk = null
      if (ap?.angkatan_id) {
        const { data: a } = await supabase.from('angkatan').select('*').eq('id', ap.angkatan_id).maybeSingle()
        angk = a
      } else if (authProfile?.angkatan || ap?.angkatan) {
        const tahun = authProfile?.angkatan ?? ap?.angkatan
        const { data: a } = await supabase.from('angkatan').select('*').eq('tahun_lulus', tahun).maybeSingle()
        angk = a
      }
      setAngkatanInfo(angk)

      // 3. Auto-generate id_alumni if missing
      if (!currentIdAlumni && angk && aid) {
        const { count } = await supabase.from('alumni_profiles').select('id', { count: 'exact', head: true }).eq('angkatan_id', angk.id)
        const prefix = (angk.nama_angkatan ?? 'ALUMNI').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        const newId = `${prefix}-${String((count ?? 1)).padStart(3, '0')}`
        await supabase.from('alumni_profiles').update({ id_alumni: newId }).eq('id', aid)
        setIdAlumni(newId)
      }

      // 4. Fetch profil langsung dari Supabase (hindari race condition authProfile)
      const { data: freshProfile } = await supabase
        .from('profiles')
        .select('id, nama_lengkap, foto_url, no_hp, bidang, domisili, angkatan')
        .eq('id', user.id)
        .single()

      const fotoUrl = freshProfile?.foto_url ?? ''
      setProfil({
        nama:      freshProfile?.nama_lengkap ?? '',
        email:     user.email ?? '',
        phone:     freshProfile?.no_hp ?? ap?.no_hp ?? '',
        bio:       ap?.bio ?? '',
        bidang:    ap?.bidang ?? freshProfile?.bidang ?? '',
        domisili:  ap?.domisili ?? freshProfile?.domisili ?? '',
        linkedin:  ap?.linkedin_url ?? '',
        website:   ap?.website_url ?? '',
        instagram: ap?.instagram_url ?? '',
        youtube:   ap?.youtube_url ?? '',
        twitter:   ap?.twitter_url ?? '',
        facebook:  ap?.facebook_url ?? '',
        foto:      !!fotoUrl,
        fotoUrl,
      })

      if (!aid) { setPageLoading(false); return }

      // 3. Fetch semua section secara paralel
      const [pend, pekj, sert, publ, keahl, bah, lemb, berk] = await Promise.all([
        supabase.from('pendidikan').select('*').eq('alumni_id', aid).order('created_at'),
        supabase.from('pekerjaan').select('*').eq('alumni_id', aid).order('created_at', { ascending: false }),
        supabase.from('sertifikasi').select('*').eq('alumni_id', aid).order('tahun', { ascending: false }),
        supabase.from('publikasi').select('*').eq('alumni_id', aid).order('tahun', { ascending: false }),
        supabase.from('keahlian_alumni').select('*').eq('alumni_id', aid),
        supabase.from('bahasa_alumni').select('*').eq('alumni_id', aid),
        supabase.from('lembaga_alumni').select('*').eq('alumni_id', aid),
        supabase.from('berkas_alumni').select('*').eq('alumni_id', aid),
      ])

      setPendidikan(pend.data ?? [])
      // Normalisasi field agar cocok dengan form modal
      setPekerjaan((pekj.data ?? []).map(r => ({ ...r, jabatan: r.posisi, current: r.is_current })))
      setSertifikasi((sert.data ?? []).map(r => ({ ...r, noCert: r.no_cert })))
      setPublikasi(publ.data ?? [])
      setKeahlian((keahl.data ?? []).map(k => k.nama))
      setBahasa((bah.data ?? []).map(b => b.nama))
      setUsaha((lemb.data ?? []).map(r => ({ ...r, tahun: r.tahun_berdiri, openKerjasama: r.open_kerjasama })))
      setDokumen(berk.data ?? [])
    } catch (e) {
      console.error('loadDashboard:', e)
    }
    setPageLoading(false)
  }

  // Click outside untuk dropdown
  useEffect(() => {
    function handler(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowBell(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keluar
  async function handleSignOut() {
    await signOut()
    window.location.href = '/masuk'
  }

  // Profile completion
  const completionItems = [
    { label: 'Foto Profil', weight: 10, done: profil.foto },
    { label: 'Bio', weight: 10, done: !!profil.bio },
    { label: 'Bidang/Profesi', weight: 10, done: !!profil.bidang },
    { label: 'Domisili', weight: 5, done: !!profil.domisili },
    { label: 'LinkedIn', weight: 10, done: !!profil.linkedin },
    { label: 'Riwayat Pendidikan', weight: 15, done: pendidikan.length > 0 },
    { label: 'Riwayat Pekerjaan', weight: 15, done: pekerjaan.length > 0 },
    { label: 'Keahlian', weight: 5, done: keahlian.length > 0 },
    { label: 'Sertifikasi', weight: 5, done: sertifikasi.length > 0 },
    { label: 'Publikasi', weight: 5, done: publikasi.length > 0 },
    { label: 'Lembaga/Badan Usaha', weight: 5, done: usaha.length > 0 },
    { label: 'Dokumen & Lampiran', weight: 5, done: dokumen.length > 0 },
  ]
  const profileCompletion = completionItems.reduce((a, i) => a + (i.done ? i.weight : 0), 0)
  const missing = completionItems.filter(i => !i.done)

  const unreadCount = notif.filter(n => !n.dibaca).length

  // ── CRUD — Supabase ──────────────────────────────────────────────────────────

  function handleSaveProfil(form) {
    askConfirm({
      title: 'Simpan Perubahan Profil',
      message: 'Apakah Anda yakin ingin menyimpan perubahan profil ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        let fotoUrl = form.fotoUrl ?? profil.fotoUrl ?? null

        if (form.fotoFile) {
          // Hapus semua file foto lama milik user ini sebelum upload baru
          const { data: oldFiles } = await supabase.storage.from('alumni-photos').list(user.id)
          if (oldFiles?.length > 0) {
            await supabase.storage.from('alumni-photos').remove(oldFiles.map(f => `${user.id}/${f.name}`))
          }
          const ext = form.fotoFile.name.split('.').pop().toLowerCase()
          const filePath = `${user.id}/avatar.${ext}`
            const { error: upErr } = await supabase.storage.from('alumni-photos').upload(filePath, form.fotoFile, { upsert: true })
          if (!upErr) {
            const { data: urlData } = supabase.storage.from('alumni-photos').getPublicUrl(filePath)
            // Tambahkan cache-buster agar browser tidak pakai versi lama
            fotoUrl = urlData.publicUrl + '?t=' + Date.now()
          } else {
            console.error('[upload foto]', upErr)
          }
        }

        const profilesPayload = { nama_lengkap: form.nama, no_hp: form.phone, bidang: form.bidang, domisili: form.domisili }
        if (fotoUrl) profilesPayload.foto_url = fotoUrl
        const { error: profErr } = await supabase.from('profiles').update(profilesPayload).eq('id', user.id)
        if (profErr) console.error('[update profiles]', profErr)

        const { error: apErr, data: apData } = await supabase.from('alumni_profiles').update({
          bio: form.bio, bidang: form.bidang, domisili: form.domisili, no_hp: form.phone,
          linkedin_url: form.linkedin, website_url: form.website,
          instagram_url: form.instagram, youtube_url: form.youtube,
          twitter_url: form.twitter, facebook_url: form.facebook,
        }).eq('user_id', user.id).select('website_url')
        if (apErr) {
          console.error('[update alumni_profiles]', apErr)
          alert('Gagal menyimpan data profil: ' + apErr.message)
        } else {
          console.log('[update alumni_profiles] website_url tersimpan:', apData?.[0]?.website_url)
        }

        setProfil({ ...form, foto: !!fotoUrl, fotoUrl: fotoUrl ?? '' })
        await refreshProfile()
        closeConfirm()
        setModal(null)
      },
    })
  }

  function addPendidikan(form) {
    askConfirm({
      title: 'Tambah Riwayat Pendidikan',
      message: 'Apakah Anda yakin ingin menyimpan riwayat pendidikan ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('pendidikan').insert({
          alumni_id: alumniId, jenjang: form.jenjang, jurusan: form.jurusan || null,
          institusi: form.institusi, lokasi: form.lokasi || null,
          gelar_depan: form.gelar_depan || null, gelar_belakang: form.gelar_belakang || null,
          tahun_mulai:  form.tahun_mulai  ? Number(form.tahun_mulai)  : null,
          tahun_selesai:form.is_current   ? null : (form.tahun_selesai ? Number(form.tahun_selesai) : null),
          is_current: !!form.is_current,
        }).select().single()
        if (data) setPendidikan(p => [...p, data])
        closeConfirm(); setModal(null)
      },
    })
  }
  function editPendidikan(id, form) {
    askConfirm({
      title: 'Simpan Perubahan Pendidikan',
      message: 'Apakah Anda yakin ingin menyimpan perubahan riwayat pendidikan ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('pendidikan').update({
          jenjang: form.jenjang, jurusan: form.jurusan || null, institusi: form.institusi,
          lokasi: form.lokasi || null,
          gelar_depan: form.gelar_depan || null, gelar_belakang: form.gelar_belakang || null,
          tahun_mulai:  form.tahun_mulai  ? Number(form.tahun_mulai)  : null,
          tahun_selesai:form.is_current   ? null : (form.tahun_selesai ? Number(form.tahun_selesai) : null),
          is_current: !!form.is_current,
        }).eq('id', id).select().single()
        if (data) setPendidikan(p => p.map(x => x.id === id ? data : x))
        closeConfirm(); setModal(null)
      },
    })
  }
  function delPendidikan(id) {
    askConfirm({
      title: 'Hapus Riwayat Pendidikan',
      message: 'Data riwayat pendidikan ini akan dihapus permanen. Lanjutkan?',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        await supabase.from('pendidikan').delete().eq('id', id)
        setPendidikan(p => p.filter(x => x.id !== id))
        closeConfirm()
      },
    })
  }

  function addPekerjaan(form) {
    askConfirm({
      title: 'Tambah Riwayat Pekerjaan',
      message: 'Apakah Anda yakin ingin menyimpan riwayat pekerjaan ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('pekerjaan').insert({
          alumni_id: alumniId, posisi: form.posisi, perusahaan: form.perusahaan,
          lokasi: form.lokasi || null, tipe: form.tipe || null,
          tahun_mulai:  form.tahun_mulai  ? Number(form.tahun_mulai)  : null,
          tahun_selesai:form.is_current   ? null : (form.tahun_selesai ? Number(form.tahun_selesai) : null),
          is_current: !!form.is_current, deskripsi: form.deskripsi || null,
        }).select().single()
        if (data) setPekerjaan(p => [{ ...data, jabatan: data.posisi, current: data.is_current }, ...p])
        closeConfirm(); setModal(null)
      },
    })
  }
  function editPekerjaan(id, form) {
    askConfirm({
      title: 'Simpan Perubahan Pekerjaan',
      message: 'Apakah Anda yakin ingin menyimpan perubahan riwayat pekerjaan ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('pekerjaan').update({
          posisi: form.posisi, perusahaan: form.perusahaan,
          lokasi: form.lokasi || null, tipe: form.tipe || null,
          tahun_mulai:  form.tahun_mulai  ? Number(form.tahun_mulai)  : null,
          tahun_selesai:form.is_current   ? null : (form.tahun_selesai ? Number(form.tahun_selesai) : null),
          is_current: !!form.is_current, deskripsi: form.deskripsi || null,
        }).eq('id', id).select().single()
        if (data) setPekerjaan(p => p.map(x => x.id === id ? { ...data, jabatan: data.posisi, current: data.is_current } : x))
        closeConfirm(); setModal(null)
      },
    })
  }
  function delPekerjaan(id) {
    askConfirm({
      title: 'Hapus Riwayat Pekerjaan',
      message: 'Data riwayat pekerjaan ini akan dihapus permanen. Lanjutkan?',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        await supabase.from('pekerjaan').delete().eq('id', id)
        setPekerjaan(p => p.filter(x => x.id !== id))
        closeConfirm()
      },
    })
  }

  function addSertifikasi(form) {
    askConfirm({
      title: 'Tambah Sertifikasi',
      message: 'Apakah Anda yakin ingin menyimpan sertifikasi ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('sertifikasi').insert({
          alumni_id: alumniId, nama: form.nama, penerbit: form.penerbit,
          tahun: form.tahun ? Number(form.tahun) : null, no_cert: form.noCert, url: form.url,
        }).select().single()
        if (data) setSertifikasi(p => [...p, { ...data, noCert: data.no_cert }])
        closeConfirm(); setModal(null)
      },
    })
  }
  function editSertifikasi(id, form) {
    askConfirm({
      title: 'Simpan Perubahan Sertifikasi',
      message: 'Apakah Anda yakin ingin menyimpan perubahan sertifikasi ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('sertifikasi').update({
          nama: form.nama, penerbit: form.penerbit,
          tahun: form.tahun ? Number(form.tahun) : null, no_cert: form.noCert, url: form.url,
        }).eq('id', id).select().single()
        if (data) setSertifikasi(p => p.map(x => x.id === id ? { ...data, noCert: data.no_cert } : x))
        closeConfirm(); setModal(null)
      },
    })
  }
  function delSertifikasi(id) {
    askConfirm({
      title: 'Hapus Sertifikasi',
      message: 'Data sertifikasi ini akan dihapus permanen. Lanjutkan?',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        await supabase.from('sertifikasi').delete().eq('id', id)
        setSertifikasi(p => p.filter(x => x.id !== id))
        closeConfirm()
      },
    })
  }

  function addPublikasi(form) {
    askConfirm({
      title: 'Tambah Publikasi',
      message: 'Apakah Anda yakin ingin menyimpan publikasi ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('publikasi').insert({
          alumni_id: alumniId, judul: form.judul, penerbit: form.penerbit,
          tahun: form.tahun ? Number(form.tahun) : null, url: form.url, deskripsi: form.deskripsi,
        }).select().single()
        if (data) setPublikasi(p => [...p, data])
        closeConfirm(); setModal(null)
      },
    })
  }
  function editPublikasi(id, form) {
    askConfirm({
      title: 'Simpan Perubahan Publikasi',
      message: 'Apakah Anda yakin ingin menyimpan perubahan publikasi ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('publikasi').update({
          judul: form.judul, penerbit: form.penerbit,
          tahun: form.tahun ? Number(form.tahun) : null, url: form.url, deskripsi: form.deskripsi,
        }).eq('id', id).select().single()
        if (data) setPublikasi(p => p.map(x => x.id === id ? data : x))
        closeConfirm(); setModal(null)
      },
    })
  }
  function delPublikasi(id) {
    askConfirm({
      title: 'Hapus Publikasi',
      message: 'Data publikasi ini akan dihapus permanen. Lanjutkan?',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        await supabase.from('publikasi').delete().eq('id', id)
        setPublikasi(p => p.filter(x => x.id !== id))
        closeConfirm()
      },
    })
  }

  function addUsaha(form) {
    askConfirm({
      title: 'Tambah Lembaga / Badan Usaha',
      message: 'Apakah Anda yakin ingin menyimpan data lembaga ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('lembaga_alumni').insert({
          alumni_id: alumniId, nama: form.nama, jenis: form.jenis, sebagai: form.sebagai,
          bidang: form.bidang, lokasi: form.lokasi,
          tahun_berdiri: form.tahun ? Number(form.tahun) : null,
          website: form.website, deskripsi: form.deskripsi, open_kerjasama: !!form.openKerjasama,
        }).select().single()
        if (data) setUsaha(p => [...p, { ...data, tahun: data.tahun_berdiri, openKerjasama: data.open_kerjasama }])
        closeConfirm(); setModal(null)
      },
    })
  }
  function editUsaha(id, form) {
    askConfirm({
      title: 'Simpan Perubahan Lembaga',
      message: 'Apakah Anda yakin ingin menyimpan perubahan data lembaga ini?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        const { data } = await supabase.from('lembaga_alumni').update({
          nama: form.nama, jenis: form.jenis, sebagai: form.sebagai,
          bidang: form.bidang, lokasi: form.lokasi,
          tahun_berdiri: form.tahun ? Number(form.tahun) : null,
          website: form.website, deskripsi: form.deskripsi, open_kerjasama: !!form.openKerjasama,
        }).eq('id', id).select().single()
        if (data) setUsaha(p => p.map(x => x.id === id ? { ...data, tahun: data.tahun_berdiri, openKerjasama: data.open_kerjasama } : x))
        closeConfirm(); setModal(null)
      },
    })
  }
  function delUsaha(id) {
    askConfirm({
      title: 'Hapus Lembaga / Badan Usaha',
      message: 'Data lembaga ini akan dihapus permanen. Lanjutkan?',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        await supabase.from('lembaga_alumni').delete().eq('id', id)
        setUsaha(p => p.filter(x => x.id !== id))
        closeConfirm()
      },
    })
  }

  function handleSaveKeahlianBahasa(listK, listB) {
    askConfirm({
      title: 'Simpan Keahlian & Bahasa',
      message: 'Apakah Anda yakin ingin menyimpan perubahan keahlian dan bahasa?',
      confirmLabel: 'Ya, Simpan',
      variant: 'success',
      onConfirm: async () => {
        await supabase.from('keahlian_alumni').delete().eq('alumni_id', alumniId)
        if (listK.length > 0)
          await supabase.from('keahlian_alumni').insert(listK.map(nama => ({ alumni_id: alumniId, nama })))
        await supabase.from('bahasa_alumni').delete().eq('alumni_id', alumniId)
        if (listB.length > 0)
          await supabase.from('bahasa_alumni').insert(listB.map(nama => ({ alumni_id: alumniId, nama })))
        setKeahlian(listK); setBahasa(listB)
        closeConfirm(); setModal(null)
      },
    })
  }

  function addDokumen({ nama, tipe, ukuran, kategori, file }) {
    askConfirm({
      title: 'Unggah Dokumen',
      message: `Apakah Anda yakin ingin mengunggah dokumen "${nama}"?`,
      confirmLabel: 'Ya, Unggah',
      variant: 'success',
      onConfirm: async () => {
        const ext      = file.name.split('.').pop().toLowerCase()
        const filePath = `${user.id}/${Date.now()}_${nama.replace(/\s+/g, '_')}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('berkas-alumni').upload(filePath, file, { contentType: file.type, upsert: false })
        if (uploadErr) { console.error('upload berkas:', uploadErr); closeConfirm(); setModal(null); return }
        const { data } = await supabase.from('berkas_alumni').insert({
          alumni_id: alumniId, nama, kategori, tipe, ukuran, file_url: filePath,
        }).select().single()
        if (data) setDokumen(p => [...p, data])
        closeConfirm(); setModal(null)
      },
    })
  }

  function delDokumen(id, fileUrl) {
    askConfirm({
      title: 'Hapus Dokumen',
      message: 'Dokumen ini akan dihapus permanen dari penyimpanan. Lanjutkan?',
      confirmLabel: 'Ya, Hapus',
      variant: 'danger',
      onConfirm: async () => {
        if (fileUrl) await supabase.storage.from('berkas-alumni').remove([fileUrl])
        await supabase.from('berkas_alumni').delete().eq('id', id)
        setDokumen(p => p.filter(x => x.id !== id))
        closeConfirm()
      },
    })
  }

  // Loading screen
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #E8F5EE 0%, #F4F9F6 40%, #EEF2FF 100%)' }}>

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logoUrl} alt="Logo Daarul Mughni" className="w-8 h-8 object-contain rounded flex-shrink-0" />
            <span className="text-sm font-bold text-[#0A2415] hidden sm:inline">
              Alumni Portal — <span className="text-[#1A5C38]">Daarul Mughni</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            <Link to="/direktori" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">Direktori</Link>
            <Link to="/berita" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">Berita</Link>
            <Link to="/agenda" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">Agenda</Link>
            <Link to="/karir" className="text-sm text-gray-500 hover:text-[#1A5C38] transition-colors">Karir</Link>
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Bell */}
            <div ref={bellRef} className="relative">
              <button onClick={() => { setShowBell(v => !v); setShowProfile(false) }}
                className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showBell && (
                  <motion.div {...dropAnim}
                    className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                      <span className="text-sm font-bold text-gray-900">Notifikasi</span>
                      {unreadCount > 0 && (
                        <button onClick={() => setNotif(n => n.map(x => ({ ...x, dibaca: true })))}
                          className="text-[10px] font-semibold text-[#1A5C38] flex items-center gap-1 hover:underline">
                          <CheckCheck className="w-3 h-3" /> Semua Dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notif.map(n => {
                        const Icon = n.icon
                        return (
                          <div key={n.id} onClick={() => setNotif(prev => prev.map(x => x.id === n.id ? { ...x, dibaca: true } : x))}
                            className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.dibaca ? 'bg-green-50/40' : ''}`}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: n.bg }}>
                              <Icon className="w-4 h-4" style={{ color: n.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-800">{n.judul}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{n.pesan}</p>
                              <p className="text-[9px] text-gray-400 mt-1">{n.waktu}</p>
                            </div>
                            {!n.dibaca && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1" />}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button onClick={() => { setShowProfile(v => !v); setShowBell(false) }}
                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#1A5C38' }}>
                {profil.fotoUrl
                  ? <img src={profil.fotoUrl} alt={profil.nama} className="w-full h-full object-cover" />
                  : initials(profil.nama)}
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div {...dropAnim}
                    className="absolute right-0 top-11 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#1A5C38' }}>
                          {profil.fotoUrl
                            ? <img src={profil.fotoUrl} alt={profil.nama} className="w-full h-full object-cover" />
                            : initials(profil.nama)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{profil.nama}</p>
                          <p className="text-[10px] text-[#1A5C38] font-semibold">Alumni Terverifikasi</p>
                          <p className="text-[9px] text-gray-400 font-mono">{idAlumni ?? '-'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setModal({ type: 'editProfil' }); setShowProfile(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings className="w-3.5 h-3.5 text-gray-400" /> Edit Profil
                      </button>
                      {user?.id && (
                        <Link to={`/direktori/${user.id}`} onClick={() => setShowProfile(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Users className="w-3.5 h-3.5 text-gray-400" /> Halaman Profil Publik
                        </Link>
                      )}
                      <button onClick={() => { setModal({ type: 'kartu' }); setShowProfile(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <FileText className="w-3.5 h-3.5 text-gray-400" /> Unduh Kartu Alumni
                      </button>
                    </div>
                    {(isAdminUser || !authProfile) && (
                      <div className="border-t border-gray-50 py-1">
                        <button onClick={() => { setShowProfile(false); navigate('/admin/dashboard') }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Shield className="w-3.5 h-3.5 text-gray-400" /> Buka Dashboard Admin
                        </button>
                      </div>
                    )}
                    <div className="border-t border-gray-50 py-1">
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Keluar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px] gap-6">

            {/* ── LEFT COLUMN ── */}
            <div className="space-y-5 order-1">

              {/* Welcome + Stats */}
              <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'linear-gradient(135deg, #FEFCE8 0%, #F0FDF4 100%)', border: '1px solid #E9F5EE' }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A2415] mb-1.5">
                      Assalamu'alaikum, {profil.nama.split(' ').slice(0, 2).join(' ')}!
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed mb-1">{profil.bio || 'Lengkapi bio profil Anda.'}</p>
                    <div className="flex flex-col gap-1 text-xs text-gray-400 mb-4">
                      {profil.bidang && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{profil.bidang}</span>}
                      {profil.domisili && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profil.domisili}</span>}
                      {(angkatanInfo || authProfile?.angkatan) && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {angkatanInfo?.nama_angkatan ?? `Angkatan ${authProfile?.angkatan}`}
                          {angkatanInfo
                            ? ` · Lulusan ${angkatanInfo.tahun_lulus}`
                            : authProfile?.angkatan ? ` · Ke-${authProfile.angkatan - 2005}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-5">
                      {[
                        { label: 'ID: ' + (idAlumni ?? '-'), icon: FileText, color: '#7C3AED' },
                        { label: `${pekerjaan.length} Pengalaman`, icon: Briefcase, color: '#D97706' },
                        { label: `${sertifikasi.length} Sertifikasi`, icon: Award, color: '#0E7490' },
                      ].map(({ label, icon: Icon, color }) => (
                        <span key={label} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                          style={{ color, backgroundColor: color + '10', borderColor: color + '25' }}>
                          <Icon className="w-3 h-3" />{label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Link to="/direktori" className="px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#1A5C38' }}>
                        Jelajahi Direktori
                      </Link>
                      <button onClick={() => setModal({ type: 'kartu' })}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border text-[#1A5C38] hover:bg-[#1A5C38]/5 transition-colors" style={{ borderColor: '#1A5C38' }}>
                        <Download className="w-3.5 h-3.5 inline mr-1.5" />Kartu Alumni
                      </button>
                      <button onClick={() => setModal({ type: 'editProfil' })}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                        <Pencil className="w-3.5 h-3.5 inline mr-1.5" />Edit Profil
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <CircularProgress pct={profileCompletion} />
                    <p className="text-xs font-bold text-[#0A2415]">Kelengkapan Profil</p>
                    {missing.length > 0 && (
                      <p className="text-[10px] text-gray-400 text-center max-w-[96px] leading-snug">
                        Belum: {missing.slice(0, 2).map(m => m.label).join(', ')}{missing.length > 2 ? ` +${missing.length - 2}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Aksi Cepat — accordion khusus mobile */}
              <div className="lg:hidden rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A2415 0%, #1A5C38 100%)', border: '1px solid #1A5C38' }}>
                <button
                  onClick={() => setAksiOpen(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3.5"
                >
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Aksi Cepat</span>
                  <ChevronRight className={`w-4 h-4 text-white/60 transition-transform ${aksiOpen ? 'rotate-90' : ''}`} />
                </button>
                <div className={`${aksiOpen ? 'block' : 'hidden'} px-3 pb-3`}>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Edit Profil',       icon: Pencil,     action: () => setModal({ type: 'editProfil' }) },
                      { label: 'Tambah Karir',       icon: Briefcase,  action: () => setModal({ type: 'addPekerjaan' }) },
                      { label: 'Keahlian & Bahasa',  icon: Star,       action: () => setModal({ type: 'editKeahlianBahasa' }) },
                      { label: 'Sertifikasi',        icon: Award,      action: () => setModal({ type: 'addSertifikasi' }) },
                      { label: 'Publikasi',          icon: BookOpen,   action: () => setModal({ type: 'addPublikasi' }) },
                      { label: 'Lembaga',            icon: Building2,  action: () => setModal({ type: 'addUsaha' }) },
                      { label: 'Berkas',             icon: Paperclip,  action: () => setModal({ type: 'addBerkas' }) },
                      { label: 'Kartu Alumni',       icon: FileText,   action: () => setModal({ type: 'kartu' }) },
                      { label: 'Direktori',          icon: Users,      action: () => navigate('/direktori') },
                    ].map(({ label, icon: Icon, action }) => (
                      <button key={label} onClick={action}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl hover:bg-white/30 transition-all"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)' }}>
                        <Icon className="w-4 h-4 text-[#F0A500]" />
                        <span className="text-[10px] font-semibold text-white/90 text-center leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Riwayat Pendidikan */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 border-l-4" style={{ borderLeftColor: '#F0A500' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF8EE' }}>
                      <GraduationCap className="w-4 h-4" style={{ color: '#F0A500' }} />
                    </div>
                    <h2 className="text-sm font-bold text-[#0A2415]">Riwayat Pendidikan</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addPendidikan' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {pendidikan.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada riwayat pendidikan. Tambahkan sekarang.</p>
                ) : (
                  <div className="space-y-4">
                    {pendidikan.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                        {i > 0 && <div className="border-t border-gray-100 mb-4" />}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-[#0A2415]">{p.jenjang}</h3>
                              {p.is_current && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Saat Ini</span>}
                            </div>
                            {(p.gelar_depan || p.gelar_belakang) && (
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {[p.gelar_depan, p.gelar_belakang].filter(Boolean).join(' · ')}
                              </p>
                            )}
                            <p className="text-xs font-semibold text-[#1A5C38] mt-0.5">
                              {p.jurusan ? `${p.jurusan} · ` : ''}{p.institusi}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                              {(p.tahun_mulai || p.tahun_selesai) && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {p.tahun_mulai ?? '?'} – {p.is_current ? 'Sekarang' : (p.tahun_selesai ?? '?')}
                                </span>
                              )}
                              {p.lokasi && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {p.lokasi}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setModal({ type: 'editPendidikan', item: p })}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A5C38] transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => delPendidikan(p.id)}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Riwayat Pekerjaan */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 border-l-4" style={{ borderLeftColor: '#1D4ED8' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                      <Briefcase className="w-4 h-4" style={{ color: '#1D4ED8' }} />
                    </div>
                    <h2 className="text-sm font-bold text-[#0A2415]">Riwayat Pekerjaan</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addPekerjaan' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {pekerjaan.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada riwayat pekerjaan.</p>
                ) : (
                  <div className="space-y-4">
                    {pekerjaan.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                        {i > 0 && <div className="border-t border-gray-100 mb-4" />}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-[#0A2415]">{p.jabatan ?? p.posisi}</h3>
                              {p.is_current && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Saat Ini</span>}
                              {p.tipe && (() => { const tc = tipeConfig(p.tipe); return (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: tc.bg, color: tc.color }}>{tc.label}</span>
                              )})()}
                            </div>
                            <p className="text-xs font-semibold text-[#1A5C38] mt-0.5">{p.perusahaan}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                              {(p.tahun_mulai || p.tahun_selesai) && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {p.tahun_mulai ?? '?'} – {p.is_current ? 'Sekarang' : (p.tahun_selesai ?? '?')}
                                </span>
                              )}
                              {p.lokasi && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.lokasi}</span>}
                            </div>
                            {p.deskripsi && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{p.deskripsi}</p>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setModal({ type: 'editPekerjaan', item: p })}
                              className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A5C38] transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => delPekerjaan(p.id)}
                              className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Sertifikasi */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 border-l-4" style={{ borderLeftColor: '#0E7490' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ECFEFF' }}>
                      <Award className="w-4 h-4" style={{ color: '#0E7490' }} />
                    </div>
                    <h2 className="text-sm font-bold text-[#0A2415]">Sertifikasi & Kompetensi</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addSertifikasi' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {sertifikasi.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada sertifikasi. Tambahkan untuk meningkatkan profil.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sertifikasi.map((s, i) => (
                      <motion.div key={s.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-[#1A5C38]/20 transition-colors group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0FDF4' }}>
                          <Star className="w-4 h-4 text-[#1A5C38]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 leading-snug">{s.nama}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{s.penerbit} · {s.tahun}</p>
                          {s.noCert && <p className="text-[9px] text-gray-400 font-mono mt-0.5">{s.noCert}</p>}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
                          <button onClick={() => setModal({ type: 'editSertifikasi', item: s })}
                            className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A5C38] transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => delSertifikasi(s.id)}
                            className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Keahlian & Bahasa */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 border-l-4" style={{ borderLeftColor: '#7C3AED' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FAF5FF' }}>
                      <Star className="w-4 h-4" style={{ color: '#7C3AED' }} />
                    </div>
                    <h2 className="text-sm font-bold text-[#0A2415]">Keahlian & Bahasa</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'editKeahlianBahasa' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Keahlian / Skills</p>
                    {keahlian.length === 0 ? (
                      <p className="text-sm text-gray-400">Belum ada keahlian. Klik Edit untuk menambahkan.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {keahlian.map(k => (
                          <span key={k} className="text-xs text-[#1A5C38] border border-[#1A5C38]/30 bg-[#E8F5EE] px-3 py-1 rounded-full">{k}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Bahasa</p>
                    {bahasa.length === 0 ? (
                      <p className="text-sm text-gray-400">Belum ada bahasa. Klik Edit untuk menambahkan.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {bahasa.map(b => (
                          <span key={b} className="text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-full">{b}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Publikasi */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 border-l-4" style={{ borderLeftColor: '#DB2777' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FDF2F8' }}>
                      <BookOpen className="w-4 h-4" style={{ color: '#DB2777' }} />
                    </div>
                    <h2 className="text-sm font-bold text-[#0A2415]">Publikasi & Karya</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addPublikasi' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {publikasi.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada publikasi atau karya.</p>
                ) : (
                  <div className="space-y-3">
                    {publikasi.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 group hover:border-[#1A5C38]/20 transition-colors">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FAF5FF' }}>
                          <FileText className="w-4 h-4 text-[#7C3AED]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 leading-snug">{p.judul}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{p.penerbit}{p.tahun ? ` · ${p.tahun}` : ''}</p>
                          {p.deskripsi && <p className="text-[10px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{p.deskripsi}</p>}
                          {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="text-[10px] text-[#1A5C38] font-semibold flex items-center gap-1 mt-1 hover:underline"><ExternalLink className="w-3 h-3" />Lihat Publikasi</a>}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
                          <button onClick={() => setModal({ type: 'editPublikasi', item: p })}
                            className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A5C38] transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => delPublikasi(p.id)}
                            className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Usaha & Kepemilikan */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 border-l-4" style={{ borderLeftColor: '#D97706' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFBEB' }}>
                      <Building2 className="w-4 h-4" style={{ color: '#D97706' }} />
                    </div>
                    <h2 className="text-sm font-bold text-[#0A2415]">Lembaga & Badan Usaha</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addUsaha' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>
                {usaha.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Belum ada lembaga atau badan usaha yang ditambahkan.</p>
                ) : (
                  <div className="space-y-3">
                    {usaha.map((u, i) => {
                      const cfg = jenisConfig(u.jenis)
                      const Icon = cfg.icon
                      return (
                        <motion.div key={u.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 group hover:border-[#1A5C38]/20 transition-colors">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
                            <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-sm font-bold text-[#0A2415]">{u.nama}</h3>
                                  {u.openKerjasama && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                      style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                                      <Handshake className="w-2.5 h-2.5" /> Buka Kerjasama
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <p className="text-xs font-semibold" style={{ color: cfg.color }}>{u.jenis}</p>
                                  {u.sebagai && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                      {u.sebagai}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 flex-wrap">
                                  {u.bidang && <span>{u.bidang}</span>}
                                  {u.lokasi && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{u.lokasi}</span>}
                                  {u.tahun && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Est. {u.tahun}</span>}
                                </div>
                                {u.deskripsi && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{u.deskripsi}</p>}
                                {u.website && (
                                  <a href={u.website} target="_blank" rel="noreferrer"
                                    className="text-[10px] text-[#1A5C38] font-semibold flex items-center gap-1 mt-1 hover:underline">
                                    <Globe className="w-3 h-3" />Website
                                  </a>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => setModal({ type: 'editUsaha', item: u })}
                                  className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-300 hover:text-[#1A5C38] transition-colors">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => delUsaha(u.id)}
                                  className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-200 hover:text-red-400 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* Dokumen & Lampiran */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 border-l-4" style={{ borderLeftColor: '#DC2626' }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
                      <Paperclip className="w-4 h-4" style={{ color: '#DC2626' }} />
                    </div>
                    <h2 className="text-sm font-bold text-[#0A2415]">Dokumen & Lampiran</h2>
                  </div>
                  <button onClick={() => setModal({ type: 'addBerkas' })}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1A5C38] hover:text-[#0A2415] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Unggah
                  </button>
                </div>
                {dokumen.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Belum ada dokumen. Unggah CV, ijazah, atau sertifikat.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dokumen.map(doc => (
                      <motion.div key={doc.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 bg-[#F8FAF9] rounded-xl group hover:bg-[#E8F5EE] transition-colors">
                        <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-red-500">{doc.tipe}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#0A2415] truncate">{doc.nama}</p>
                          <p className="text-[10px] text-gray-400">{doc.tipe} · {doc.ukuran}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-400 hover:text-[#1A5C38] transition-colors">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => delDokumen(doc.id, doc.file_url)}
                            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Banner Penghargaan */}
              <div className="rounded-2xl p-5 sm:p-6 flex items-center gap-5" style={{ background: 'linear-gradient(135deg, #1A5C38 0%, #0A2415 100%)' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Award className="w-3.5 h-3.5 text-[#F0A500]" />
                    <span className="text-[10px] font-bold text-[#F0A500] uppercase tracking-widest">Penghargaan Terkini</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">Alumni Inspiratif 2024</h3>
                  <p className="text-xs text-white/55 leading-relaxed">Anda terpilih sebagai kandidat Alumni Inspiratif bidang Teknologi. Pastikan profil lengkap untuk meningkatkan visibilitas Anda.</p>
                </div>
                <button className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold text-[#0A2415] hover:opacity-90 transition-opacity whitespace-nowrap" style={{ backgroundColor: '#F0A500' }}>
                  Lihat Detil
                </button>
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="space-y-4 order-2">

              {/* Aksi Cepat — hanya tampil di desktop */}
              <div className="hidden lg:block rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A2415 0%, #1A5C38 100%)', border: '1px solid #1A5C38' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.6)' }}>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Aksi Cepat</h3>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Edit Profil',       icon: Pencil,     action: () => setModal({ type: 'editProfil' }) },
                      { label: 'Tambah Karir',       icon: Briefcase,  action: () => setModal({ type: 'addPekerjaan' }) },
                      { label: 'Keahlian & Bahasa',  icon: Star,       action: () => setModal({ type: 'editKeahlianBahasa' }) },
                      { label: 'Sertifikasi',        icon: Award,      action: () => setModal({ type: 'addSertifikasi' }) },
                      { label: 'Publikasi',          icon: BookOpen,   action: () => setModal({ type: 'addPublikasi' }) },
                      { label: 'Lembaga',            icon: Building2,  action: () => setModal({ type: 'addUsaha' }) },
                      { label: 'Berkas',             icon: Paperclip,  action: () => setModal({ type: 'addBerkas' }) },
                      { label: 'Kartu Alumni',       icon: FileText,   action: () => setModal({ type: 'kartu' }) },
                      { label: 'Direktori',          icon: Users,      action: () => navigate('/direktori') },
                    ].map(({ label, icon: Icon, action }) => (
                      <button key={label} onClick={action}
                        className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl hover:bg-white/30 transition-all"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)' }}>
                        <Icon className="w-4 h-4 text-[#F0A500]" />
                        <span className="text-[10px] font-semibold text-white/90 text-center leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Informasi Kontak */}
              {(profil.email || profil.phone || profil.linkedin || profil.website ||
                profil.instagram || profil.youtube || profil.twitter || profil.facebook) && (
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider mb-3">Informasi Kontak</h3>
                  <div className="space-y-2">
                    {profil.email && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{profil.email}</span>
                      </div>
                    )}
                    {profil.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{profil.phone}</span>
                      </div>
                    )}
                    {profil.linkedin && (
                      <a href={profil.linkedin.startsWith('http') ? profil.linkedin : `https://${profil.linkedin}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{profil.linkedin}</span>
                      </a>
                    )}
                    {profil.website && (
                      <a href={profil.website.startsWith('http') ? profil.website : `https://${profil.website}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-[#1A5C38] hover:underline">
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{profil.website}</span>
                      </a>
                    )}
                  </div>
                  {(profil.instagram || profil.youtube || profil.twitter || profil.facebook) && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-50">
                      {profil.instagram && (
                        <a href={`https://instagram.com/${profil.instagram.replace('@', '')}`} target="_blank" rel="noreferrer"
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <SvgInstagram />
                        </a>
                      )}
                      {profil.youtube && (
                        <a href={`https://youtube.com/${profil.youtube}`} target="_blank" rel="noreferrer"
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <SvgYouTube />
                        </a>
                      )}
                      {profil.twitter && (
                        <a href={`https://twitter.com/${profil.twitter.replace('@', '')}`} target="_blank" rel="noreferrer"
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <SvgTwitterX />
                        </a>
                      )}
                      {profil.facebook && (
                        <a href={`https://facebook.com/${profil.facebook}`} target="_blank" rel="noreferrer"
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <SvgFacebook />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Agenda Mendatang */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider">Agenda Mendatang</h3>
                  <Link to="/agenda" className="text-[10px] font-semibold text-[#1A5C38] hover:underline flex items-center gap-0.5">
                    Semua <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingAgenda.map((a) => {
                    const kStyle = kategoriStyle[a.kategori] ?? { bg: 'bg-gray-200', text: 'text-gray-700' }
                    return (
                      <div key={a.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          {a.image && <img src={a.image} alt={a.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">{a.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />{a.tanggalLabel}
                          </p>
                          <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${kStyle.bg} ${kStyle.text}`}>{a.kategoriLabel}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Lowongan Tersedia */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider">Lowongan Tersedia</h3>
                  <Link to="/karir" className="text-[10px] font-semibold text-[#1A5C38] hover:underline flex items-center gap-0.5">
                    Semua <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {activeJobs.map(j => (
                    <div key={j.id} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">{j.judul}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{j.instansi}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[9px] font-semibold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{j.tipe}</span>
                        <span className="text-[9px] text-gray-400 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{j.lokasi}</span>
                      </div>
                      <p className="text-[10px] font-bold text-[#1A5C38] mt-1">{j.gaji}</p>
                    </div>
                  ))}
                </div>
                <Link to="/karir" className="mt-3 block w-full py-2 rounded-xl border border-[#1A5C38]/25 text-xs font-semibold text-[#1A5C38] text-center hover:bg-[#1A5C38]/5 transition-colors">
                  Lihat Semua Lowongan
                </Link>
              </div>

              {/* Galeri Pesantren */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider">Galeri Pesantren</h3>
                  <Link to="/pesantren" className="text-[10px] font-semibold text-[#1A5C38] hover:underline flex items-center gap-0.5">
                    Semua <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {recentGaleri.map(g => (
                    <div key={g.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-pointer">
                      <img src={g.url} alt={g.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Kabar Daarul Mughni */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#0A2415] uppercase tracking-wider">Kabar Terbaru</h3>
                  <Link to="/berita" className="text-[10px] font-semibold text-[#1A5C38] hover:underline flex items-center gap-0.5">
                    Semua <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentNews.map(b => (
                    <Link to={`/berita/${b.slug}`} key={b.slug} className="flex items-start gap-2.5 pb-3 border-b border-gray-50 last:border-0 last:pb-0 group">
                      <div className="w-12 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100">
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1A5C38] transition-colors">{b.title}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{b.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Status Keanggotaan */}
              <div className="rounded-2xl p-4 border" style={{ background: 'linear-gradient(135deg, #F0FDF4, #FEFCE8)', borderColor: '#D1FAE5' }}>
                <h3 className="text-xs font-bold text-[#0A2415] mb-3">Status Keanggotaan</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Terverifikasi
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">{idAlumni ?? '-'}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
                  ID Alumni Anda aktif dan terverifikasi. Gunakan ID ini untuk akses khusus ke fasilitas dan layanan alumni Daarul Mughni.
                </p>
                <button onClick={() => setModal({ type: 'kartu' })}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: '#1A5C38' }}>
                  <Download className="w-3.5 h-3.5" /> Unduh Kartu Alumni (PDF)
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-4 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-gray-400">
          <span>© 2026 Alumni Portal – Pondok Pesantren Daarul Mughni. All rights reserved.</span>
          <span>Powered by Daarul Mughni · 8.0</span>
        </div>
      </footer>

      {/* ── Modals ── */}
      {modal?.type === 'editProfil' && (
        <EditProfilModal profil={profil} onSave={handleSaveProfil} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addPendidikan' && (
        <PendidikanModal item={null} onSave={addPendidikan} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editPendidikan' && (
        <PendidikanModal item={modal.item} onSave={form => editPendidikan(modal.item.id, form)} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addPekerjaan' && (
        <KarirModal item={null} onSave={addPekerjaan} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editPekerjaan' && (
        <KarirModal item={modal.item} onSave={form => editPekerjaan(modal.item.id, form)} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addSertifikasi' && (
        <SertifikasiModal item={null} onSave={addSertifikasi} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editSertifikasi' && (
        <SertifikasiModal item={modal.item} onSave={form => editSertifikasi(modal.item.id, form)} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editKeahlianBahasa' && (
        <KeahlianBahasaModal keahlian={keahlian} bahasa={bahasa}
          onSave={handleSaveKeahlianBahasa}
          onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addBerkas' && (
        <BerkasModal onSave={addDokumen} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addPublikasi' && (
        <PublikasiModal item={null} onSave={addPublikasi} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editPublikasi' && (
        <PublikasiModal item={modal.item} onSave={form => editPublikasi(modal.item.id, form)} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'addUsaha' && (
        <UsahaModal item={null} onSave={addUsaha} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'editUsaha' && (
        <UsahaModal item={modal.item} onSave={form => editUsaha(modal.item.id, form)} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'kartu' && (
        <KartuAlumniModal
          user={{
            name: profil.nama,
            angkatan: authProfile?.angkatan,
            tahunLulus: angkatanInfo?.tahun_lulus ?? authProfile?.angkatan,
            angkatanKe: angkatanInfo
              ? angkatanInfo.tahun_lulus - 2005
              : authProfile?.angkatan ? authProfile.angkatan - 2005 : null,
            id: idAlumni ?? '-',
          }}
          profil={profil}
          pekerjaan={pekerjaan}
          onClose={() => setModal(null)} />
      )}

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
