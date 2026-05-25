import { useQuery } from '@tanstack/react-query'
import { supabase } from './supabase'

// ── Berita ────────────────────────────────────────────────────────────────────

export function useBeritaList() {
  return useQuery({
    queryKey: ['berita', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('berita')
        .select('slug, judul, ringkasan, foto_url, kategori, tag, published_at, profiles(nama_lengkap)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useBeritaDetail(slug) {
  return useQuery({
    queryKey: ['berita', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()
      if (error) throw error
      return data
    },
    enabled: !!slug,
  })
}

// ── Agenda ────────────────────────────────────────────────────────────────────

export function useAgenda() {
  return useQuery({
    queryKey: ['agenda'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agenda')
        .select('*')
        .order('tanggal', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

// ── Karir / Lowongan ─────────────────────────────────────────────────────────

export function useLowongan() {
  return useQuery({
    queryKey: ['lowongan'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lowongan')
        .select('*')
        .eq('is_aktif', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

// ── Organisasi ────────────────────────────────────────────────────────────────

export function useOrganisasi() {
  return useQuery({
    queryKey: ['organisasi'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organisasi')
        .select('id, nama, singkatan, deskripsi, logo_url, tahun_berdiri, ketua, kontak')
        .eq('is_aktif', true)
        .order('id', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

// ── Angkatan ──────────────────────────────────────────────────────────────────

export function useAngkatanList() {
  return useQuery({
    queryKey: ['angkatan', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('angkatan')
        .select('tahun_lulus, nama_angkatan')
        .eq('is_aktif', true)
        .order('tahun_lulus', { ascending: false })
      if (error) throw error
      return (data ?? []).map(a => ({
        year: a.tahun_lulus,
        angkatanKe: a.tahun_lulus - 2005,
      }))
    },
    staleTime: 10 * 60 * 1000,
  })
}

// ── Direktori Alumni ──────────────────────────────────────────────────────────

export function useAlumniDirectory() {
  return useQuery({
    queryKey: ['alumni', 'directory'],
    queryFn: async () => {
      const { data: apRows } = await supabase
        .from('alumni_profiles')
        .select('id, user_id')
        .eq('is_publik', true)

      if (!apRows?.length) return []

      const userIds = apRows.map((ap) => ap.user_id)
      const apIds   = apRows.map((ap) => ap.id)
      const apIdByUserId = {}
      apRows.forEach((ap) => { apIdByUserId[ap.user_id] = ap.id })

      const [profilesRes, pekerjaanRes, keahlianRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, nama_lengkap, angkatan, bidang, domisili, foto_url')
          .in('id', userIds)
          .eq('status', 'disetujui'),
        supabase
          .from('pekerjaan')
          .select('alumni_id, posisi, perusahaan, is_current')
          .in('alumni_id', apIds),
        supabase
          .from('keahlian_alumni')
          .select('alumni_id, nama')
          .in('alumni_id', apIds),
      ])

      const pekerjaanMap = {}
      ;(pekerjaanRes.data ?? []).forEach((pek) => {
        const existing = pekerjaanMap[pek.alumni_id]
        if (!existing || pek.is_current) pekerjaanMap[pek.alumni_id] = pek
      })

      const keahlianMap = {}
      ;(keahlianRes.data ?? []).forEach((k) => {
        if (!keahlianMap[k.alumni_id]) keahlianMap[k.alumni_id] = []
        keahlianMap[k.alumni_id].push(k.nama)
      })

      return (profilesRes.data ?? []).map((p) => {
        const apId = apIdByUserId[p.id]
        return {
          id:         p.id,
          name:       p.nama_lengkap || p.id,
          angkatan:   p.angkatan,
          bidang:     p.bidang ?? '',
          profesi:    pekerjaanMap[apId]?.posisi ?? '',
          perusahaan: pekerjaanMap[apId]?.perusahaan ?? '',
          domisili:   p.domisili ?? '',
          wilayah:    p.domisili ?? '',
          keahlian:   keahlianMap[apId] ?? [],
          isVerified: true,
          avatar:     p.foto_url ?? null,
        }
      })
    },
    staleTime: 3 * 60 * 1000,
  })
}

// ── Profil Alumni Publik ──────────────────────────────────────────────────────

export function useAlumniProfile(profileId) {
  return useQuery({
    queryKey: ['alumni', 'profile', profileId],
    queryFn: async () => {
      const [profileRes, apRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', profileId).single(),
        supabase.from('alumni_profiles').select('*').eq('user_id', profileId).maybeSingle(),
      ])
      if (profileRes.error) throw profileRes.error
      const profile = profileRes.data
      const ap = apRes.data
      const apId = ap?.id ?? null

      const [
        keahlianRes, bahasaRes, pekerjaanRes, pendidikanRes,
        lembagaRes, berkasRes, publikasiRes, organisasiRes, angkatanRes, sertifikasiRes,
      ] = await Promise.all([
        apId ? supabase.from('keahlian_alumni').select('nama').eq('alumni_id', apId) : { data: [] },
        apId ? supabase.from('bahasa_alumni').select('nama').eq('alumni_id', apId) : { data: [] },
        apId ? supabase.from('pekerjaan').select('*').eq('alumni_id', apId).order('is_current', { ascending: false }) : { data: [] },
        apId ? supabase.from('pendidikan').select('*').eq('alumni_id', apId).order('tahun_selesai', { ascending: false }) : { data: [] },
        apId ? supabase.from('lembaga_alumni').select('*').eq('alumni_id', apId) : { data: [] },
        apId ? supabase.from('berkas_alumni').select('nama, tipe, ukuran, kategori, file_url').eq('alumni_id', apId) : { data: [] },
        apId ? supabase.from('publikasi').select('*').eq('alumni_id', apId).order('tahun', { ascending: false }) : { data: [] },
        apId ? supabase.from('alumni_organisasi').select('*').eq('alumni_id', apId).order('tahun_mulai', { ascending: false }) : { data: [] },
        supabase.from('angkatan').select('id, tahun_lulus, nama_angkatan').order('tahun_lulus'),
        apId ? supabase.from('sertifikasi').select('*').eq('alumni_id', apId).order('tahun', { ascending: false }) : { data: [] },
      ])

      const { data: similar } = await supabase
        .from('profiles')
        .select('id, nama_lengkap, angkatan, bidang, domisili, foto_url, alumni_profiles!inner(id)')
        .eq('status', 'disetujui')
        .neq('id', profileId)
        .or(`angkatan.eq.${profile.angkatan},bidang.eq.${profile.bidang ?? ''}`)
        .limit(3)

      return {
        profile, ap, apId,
        keahlianRes, bahasaRes, pekerjaanRes, pendidikanRes,
        lembagaRes, berkasRes, publikasiRes, organisasiRes,
        angkatanRes, sertifikasiRes, alumniSerupa: similar ?? [],
      }
    },
    enabled: !!profileId,
    staleTime: 3 * 60 * 1000,
  })
}

// ── Galeri ────────────────────────────────────────────────────────────────────

export function useGaleri() {
  return useQuery({
    queryKey: ['galeri'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('galeri')
        .select('id, judul, deskripsi, foto_url, kategori, created_at')
        .eq('is_aktif', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}
