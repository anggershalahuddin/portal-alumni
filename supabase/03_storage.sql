-- =====================================================================
-- Portal Alumni Daarul Mughni — Storage Buckets
-- File: 03_storage.sql
-- Jalankan setelah 02_rls.sql
-- =====================================================================
-- Catatan: bucket juga bisa dibuat via Supabase Dashboard > Storage.
-- File ini menggunakan ON CONFLICT DO UPDATE sehingga aman dijalankan
-- berulang kali tanpa error duplicate key.

-- ─── BUAT / UPDATE BUCKETS ────────────────────────────────────────────

-- Foto profil alumni (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('alumni-photos', 'alumni-photos', true, 5242880,
        ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Foto berita (public read, editor/admin upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('berita-images', 'berita-images', true, 10485760,
        ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Foto galeri (public read, editor/admin upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('galeri-images', 'galeri-images', true, 10485760,
        ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Foto bukti alumni (PRIVATE — auto-delete setelah verifikasi, 2 MB, JPEG/WebP)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', false, 2097152,
        ARRAY['image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Berkas portofolio alumni — CV, sertifikat, dsb. (PRIVATE, 5 MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('berkas-alumni', 'berkas-alumni', false, 5242880,
        ARRAY['application/pdf', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Foto pimpinan & aset situs (public read, admin upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-assets', 'site-assets', true, 10485760,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ─── STORAGE RLS POLICIES ─────────────────────────────────────────────
-- Semua policy didahului DROP IF EXISTS agar aman dijalankan ulang

-- ALUMNI-PHOTOS
DROP POLICY IF EXISTS "alumni-photos: baca publik"         ON storage.objects;
DROP POLICY IF EXISTS "alumni-photos: alumni upload sendiri" ON storage.objects;
DROP POLICY IF EXISTS "alumni-photos: alumni hapus sendiri"  ON storage.objects;

CREATE POLICY "alumni-photos: baca publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'alumni-photos');

CREATE POLICY "alumni-photos: alumni upload sendiri"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'alumni-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "alumni-photos: alumni hapus sendiri"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'alumni-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- BERITA-IMAGES
DROP POLICY IF EXISTS "berita-images: baca publik"   ON storage.objects;
DROP POLICY IF EXISTS "berita-images: editor upload" ON storage.objects;
DROP POLICY IF EXISTS "berita-images: editor hapus"  ON storage.objects;

CREATE POLICY "berita-images: baca publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'berita-images');

CREATE POLICY "berita-images: editor upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'berita-images' AND public.is_editor_or_above());

CREATE POLICY "berita-images: editor hapus"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'berita-images' AND public.is_editor_or_above());

-- GALERI-IMAGES
DROP POLICY IF EXISTS "galeri-images: baca publik"   ON storage.objects;
DROP POLICY IF EXISTS "galeri-images: editor upload" ON storage.objects;
DROP POLICY IF EXISTS "galeri-images: editor hapus"  ON storage.objects;

CREATE POLICY "galeri-images: baca publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'galeri-images');

CREATE POLICY "galeri-images: editor upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'galeri-images' AND public.is_editor_or_above());

CREATE POLICY "galeri-images: editor hapus"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'galeri-images' AND public.is_editor_or_above());

-- DOCUMENTS (PRIVATE)
DROP POLICY IF EXISTS "documents: baca sendiri atau admin" ON storage.objects;
DROP POLICY IF EXISTS "documents: user upload sendiri"     ON storage.objects;
DROP POLICY IF EXISTS "documents: admin hapus"             ON storage.objects;

CREATE POLICY "documents: baca sendiri atau admin"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.is_admin_or_above()
    )
  );

CREATE POLICY "documents: user upload sendiri"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "documents: admin hapus"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND public.is_admin_or_above());

-- BERKAS-ALUMNI (PRIVATE)
DROP POLICY IF EXISTS "berkas-alumni: baca sendiri atau admin" ON storage.objects;
DROP POLICY IF EXISTS "berkas-alumni: alumni upload sendiri"   ON storage.objects;
DROP POLICY IF EXISTS "berkas-alumni: alumni hapus sendiri"    ON storage.objects;

CREATE POLICY "berkas-alumni: baca sendiri atau admin"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'berkas-alumni'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.is_admin_or_above()
    )
  );

CREATE POLICY "berkas-alumni: alumni upload sendiri"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'berkas-alumni'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "berkas-alumni: alumni hapus sendiri"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'berkas-alumni'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.is_admin_or_above()
    )
  );

-- SITE-ASSETS
DROP POLICY IF EXISTS "site-assets: baca publik"  ON storage.objects;
DROP POLICY IF EXISTS "site-assets: admin upload" ON storage.objects;
DROP POLICY IF EXISTS "site-assets: admin hapus"  ON storage.objects;

CREATE POLICY "site-assets: baca publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "site-assets: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND public.is_admin_or_above());

CREATE POLICY "site-assets: admin hapus"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-assets' AND public.is_admin_or_above());
