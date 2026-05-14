-- =====================================================================
-- Portal Alumni Daarul Mughni — Drop All Custom Objects
-- File: 00_drop_all.sql
-- Jalankan file ini SEBELUM re-run 01–04 dari awal
-- JANGAN jalankan 05_migration.sql setelah ini (sudah include di 01–04)
-- =====================================================================

-- ─── TABEL (urutan terbalik dari FK dependency) ───────────────────────

DROP TABLE IF EXISTS public.log_aktivitas       CASCADE;
DROP TABLE IF EXISTS public.notifikasi          CASCADE;
DROP TABLE IF EXISTS public.pimpinan            CASCADE;
DROP TABLE IF EXISTS public.testimoni           CASCADE;
DROP TABLE IF EXISTS public.organisasi          CASCADE;
DROP TABLE IF EXISTS public.lowongan            CASCADE;
DROP TABLE IF EXISTS public.galeri              CASCADE;
DROP TABLE IF EXISTS public.agenda              CASCADE;
DROP TABLE IF EXISTS public.berita              CASCADE;
DROP TABLE IF EXISTS public.berkas_alumni       CASCADE;
DROP TABLE IF EXISTS public.lembaga_alumni      CASCADE;
DROP TABLE IF EXISTS public.bahasa_alumni       CASCADE;
DROP TABLE IF EXISTS public.keahlian_alumni     CASCADE;
DROP TABLE IF EXISTS public.dokumen_verifikasi  CASCADE;
DROP TABLE IF EXISTS public.publikasi           CASCADE;
DROP TABLE IF EXISTS public.sertifikasi         CASCADE;
DROP TABLE IF EXISTS public.pekerjaan           CASCADE;
DROP TABLE IF EXISTS public.pendidikan          CASCADE;
DROP TABLE IF EXISTS public.alumni_profiles     CASCADE;
DROP TABLE IF EXISTS public.angkatan            CASCADE;
DROP TABLE IF EXISTS public.profiles            CASCADE;

-- ─── ENUM TYPES ───────────────────────────────────────────────────────

DROP TYPE IF EXISTS public.user_role            CASCADE;
DROP TYPE IF EXISTS public.verification_status  CASCADE;
DROP TYPE IF EXISTS public.content_status       CASCADE;
DROP TYPE IF EXISTS public.notif_type           CASCADE;
DROP TYPE IF EXISTS public.pendidikan_jenjang   CASCADE;
DROP TYPE IF EXISTS public.lowongan_tipe        CASCADE;
DROP TYPE IF EXISTS public.publikasi_jenis      CASCADE;
DROP TYPE IF EXISTS public.lembaga_jenis        CASCADE;
DROP TYPE IF EXISTS public.berkas_kategori      CASCADE;

-- ─── FUNCTIONS ────────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS public.set_updated_at()         CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user()        CASCADE;
DROP FUNCTION IF EXISTS public.handle_alumni_verified() CASCADE;
DROP FUNCTION IF EXISTS public.my_role()                CASCADE;
DROP FUNCTION IF EXISTS public.is_super_admin()         CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_above()      CASCADE;
DROP FUNCTION IF EXISTS public.is_editor_or_above()     CASCADE;
DROP FUNCTION IF EXISTS public.is_verified_alumni()     CASCADE;

-- ─── STORAGE BUCKETS ──────────────────────────────────────────────────

DELETE FROM storage.buckets
WHERE id IN (
  'alumni-photos', 'berita-images', 'galeri-images',
  'documents', 'berkas-alumni', 'site-assets'
);

-- ─── SELESAI ──────────────────────────────────────────────────────────
-- Lanjut jalankan: 01_schema.sql → 02_rls.sql → 03_storage.sql → 04_seed.sql
-- LEWATI 05_migration.sql (sudah include di file-file di atas)
