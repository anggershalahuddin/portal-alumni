-- Migration: tambah kolom lokasi_kategori ke tabel agenda
-- Nilai: 'pondok' | 'online' | 'luar' (sesuai filter di halaman publik AgendaPage)

ALTER TABLE public.agenda
  ADD COLUMN IF NOT EXISTS lokasi_kategori TEXT;
