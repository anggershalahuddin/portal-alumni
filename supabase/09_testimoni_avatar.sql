-- Tambah kolom inisial dan warna_avatar ke tabel testimoni
-- Kolom inisial: override manual; null = auto-compute dari nama
-- Kolom warna_avatar: warna background avatar jika tidak ada foto

ALTER TABLE public.testimoni
  ADD COLUMN IF NOT EXISTS inisial      TEXT,
  ADD COLUMN IF NOT EXISTS warna_avatar TEXT NOT NULL DEFAULT '#1A5C38';
