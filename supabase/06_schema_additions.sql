-- =====================================================================
-- Portal Alumni Daarul Mughni — Schema Additions for Dashboard
-- File: 06_schema_additions.sql
-- Jalankan setelah 01–04 di Supabase Dashboard → SQL Editor
-- AMAN dijalankan berulang (menggunakan IF NOT EXISTS)
-- =====================================================================

-- pendidikan: kolom tambahan agar cocok dengan form dashboard
ALTER TABLE public.pendidikan
  ADD COLUMN IF NOT EXISTS gelar       TEXT,   -- "S1 Teknik Informatika"
  ADD COLUMN IF NOT EXISTS tahun       TEXT,   -- "2018 - 2022" (free text)
  ADD COLUMN IF NOT EXISTS lokasi      TEXT,
  ADD COLUMN IF NOT EXISTS deskripsi   TEXT;

-- pekerjaan: periode sebagai teks bebas + kolom display jabatan
ALTER TABLE public.pekerjaan
  ADD COLUMN IF NOT EXISTS periode     TEXT;   -- "Jan 2023 - Sekarang"
  -- jabatan disimpan di kolom posisi (sudah ada), di-alias saat fetch

-- sertifikasi: nomor sertifikat
ALTER TABLE public.sertifikasi
  ADD COLUMN IF NOT EXISTS no_cert     TEXT;

-- publikasi: deskripsi singkat
ALTER TABLE public.publikasi
  ADD COLUMN IF NOT EXISTS deskripsi   TEXT;

-- Verifikasi kolom berhasil ditambahkan
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'pendidikan'  AND column_name IN ('gelar','tahun','lokasi','deskripsi'))
 OR (table_name = 'pekerjaan'  AND column_name = 'periode')
 OR (table_name = 'sertifikasi' AND column_name = 'no_cert')
 OR (table_name = 'publikasi'  AND column_name = 'deskripsi')
  )
ORDER BY table_name, column_name;
