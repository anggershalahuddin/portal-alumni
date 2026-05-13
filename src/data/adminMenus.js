import {
  LayoutDashboard, Shield, Users, Database,
  GraduationCap, Building2, Newspaper, CalendarDays,
  Image, Layers, Briefcase,
} from 'lucide-react'

/**
 * Single source of truth for all admin menu items.
 * Adding an entry here automatically registers it in:
 *   - AdminSidebar nav groups
 *   - PermissionModal checkbox list (hak akses)
 *   - DEFAULT_PERMISSIONS per role
 *
 * Fields:
 *   id          — unique key, used as permission ID
 *   label       — sidebar display text
 *   labelPerm   — label shown in permission modal (can differ from sidebar label)
 *   href        — route path
 *   icon        — lucide-react component
 *   group       — sidebar group heading
 *   desc        — description in permission modal
 *   defaultRoles — roles that get this permission by default
 */
export const ADMIN_MENUS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelPerm: 'Dashboard Admin',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    group: 'Utama',
    desc: 'Lihat statistik dan ringkasan portal',
    defaultRoles: ['Super Admin', 'Admin', 'Editor'],
  },
  {
    id: 'verifikasi',
    label: 'Verifikasi Alumni',
    labelPerm: 'Verifikasi Alumni',
    href: '/admin/verifikasi',
    icon: Shield,
    group: 'Data & Akun',
    desc: 'Proses permohonan verifikasi alumni baru',
    defaultRoles: ['Super Admin', 'Admin'],
  },
  {
    id: 'users',
    label: 'Manajemen User',
    labelPerm: 'Manajemen User',
    href: '/admin/users',
    icon: Users,
    group: 'Data & Akun',
    desc: 'Kelola akun, peran, dan hak akses pengguna',
    defaultRoles: ['Super Admin'],
  },
  {
    id: 'alumni-data',
    label: 'Data Alumni',
    labelPerm: 'Data Alumni',
    href: '/admin/alumni-data',
    icon: Database,
    group: 'Data & Akun',
    desc: 'Lihat dan kelola data lengkap seluruh alumni',
    defaultRoles: ['Super Admin', 'Admin'],
  },
  {
    id: 'angkatan',
    label: 'Kelola Angkatan',
    labelPerm: 'Kelola Angkatan',
    href: '/admin/angkatan',
    icon: GraduationCap,
    group: 'Data & Akun',
    desc: 'Tambah dan kelola data angkatan lulusan pondok',
    defaultRoles: ['Super Admin', 'Admin'],
  },
  {
    id: 'organisasi',
    label: 'Kelola Organisasi',
    labelPerm: 'Kelola Organisasi',
    href: '/admin/organisasi',
    icon: Building2,
    group: 'Data & Akun',
    desc: 'Kelola data organisasi dan lembaga alumni',
    defaultRoles: ['Super Admin', 'Admin'],
  },
  {
    id: 'berita',
    label: 'Kelola Berita',
    labelPerm: 'Kelola Berita',
    href: '/admin/berita',
    icon: Newspaper,
    group: 'Konten',
    desc: 'Buat, edit, arsip, dan hapus artikel berita',
    defaultRoles: ['Super Admin', 'Admin', 'Editor'],
  },
  {
    id: 'agenda',
    label: 'Kelola Agenda',
    labelPerm: 'Kelola Agenda',
    href: '/admin/agenda',
    icon: CalendarDays,
    group: 'Konten',
    desc: 'Tambah dan kelola jadwal acara & kegiatan',
    defaultRoles: ['Super Admin', 'Admin', 'Editor'],
  },
  {
    id: 'galeri',
    label: 'Kelola Galeri',
    labelPerm: 'Kelola Galeri',
    href: '/admin/galeri',
    icon: Image,
    group: 'Konten',
    desc: 'Unggah dan kelola foto dokumentasi kegiatan',
    defaultRoles: ['Super Admin', 'Admin', 'Editor'],
  },
  {
    id: 'landing',
    label: 'Kelola Landing',
    labelPerm: 'Kelola Halaman Depan',
    href: '/admin/landing',
    icon: Layers,
    group: 'Konten',
    desc: 'Edit konten halaman utama, testimoni & pengasuh',
    defaultRoles: ['Super Admin', 'Admin'],
  },
  {
    id: 'karir',
    label: 'Kelola Lowongan',
    labelPerm: 'Kelola Lowongan',
    href: '/admin/karir',
    icon: Briefcase,
    group: 'Operasional',
    desc: 'Buat dan kelola lowongan pekerjaan pesantren',
    defaultRoles: ['Super Admin', 'Admin'],
  },
]

// Sidebar nav groups — derived automatically from ADMIN_MENUS
export const NAV_GROUPS = ADMIN_MENUS.reduce((acc, item) => {
  const existing = acc.find(g => g.label === item.group)
  const navItem = { label: item.label, href: item.href, key: item.id, icon: item.icon }
  if (existing) existing.items.push(navItem)
  else acc.push({ label: item.group, items: [navItem] })
  return acc
}, [])

// Flat permission list for PermissionModal — derived automatically
export const ALL_PERMISSIONS = ADMIN_MENUS.map(({ id, labelPerm, desc }) => ({
  id,
  label: labelPerm,
  desc,
}))

// Default permissions per role — derived automatically from defaultRoles
export const DEFAULT_PERMISSIONS = {
  'Super Admin': ADMIN_MENUS.map(m => m.id),
  'Admin':       ADMIN_MENUS.filter(m => m.defaultRoles.includes('Admin')).map(m => m.id),
  'Editor':      ADMIN_MENUS.filter(m => m.defaultRoles.includes('Editor')).map(m => m.id),
  'Alumni':      [],
}
