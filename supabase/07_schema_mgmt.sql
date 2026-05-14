-- =====================================================================
-- Portal Alumni Daarul Mughni — Schema Additions for User Management
-- File: 07_schema_mgmt.sql
-- Jalankan setelah 06 di Supabase Dashboard → SQL Editor
-- AMAN dijalankan berulang (menggunakan IF NOT EXISTS / ALTER TYPE ... IF NOT EXISTS)
-- =====================================================================

-- Tambah kolom is_active untuk toggle aktif/nonaktif admin panel
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Tambah kolom permissions (JSONB array of permission IDs) untuk admin/editor
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;

-- Verifikasi
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('is_active', 'permissions')
ORDER BY column_name;
