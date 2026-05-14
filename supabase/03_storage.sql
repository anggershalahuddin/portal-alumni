-- =====================================================================
-- Portal Alumni Daarul Mughni — Storage Buckets
-- File: 03_storage.sql
-- Jalankan setelah 02_rls.sql
-- =====================================================================
-- Catatan: bucket juga bisa dibuat via Supabase Dashboard > Storage.
-- File ini untuk referensi + bisa dijalankan di SQL Editor.

-- ─── BUAT BUCKETS ─────────────────────────────────────────────────────

-- Foto profil alumni (public read, upload hanya oleh pemilik)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'alumni-photos', 'alumni-photos', true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Foto berita (public read, editor/admin upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'berita-images', 'berita-images', true,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Foto galeri (public read, editor/admin upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'galeri-images', 'galeri-images', true,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Foto bukti alumni saat mendaftar (PRIVATE — hanya admin & pemilik, auto-delete setelah verifikasi)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 'documents', false,
  2097152,  -- 2 MB (foto JPEG/WebP saja, sesuai validasi DaftarPage)
  ARRAY['image/jpeg', 'image/webp']
);

-- Berkas portofolio alumni (CV, sertifikat, company profile, dsb.) — PRIVATE
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'berkas-alumni', 'berkas-alumni', false,
  5242880,  -- 5 MB
  ARRAY['application/pdf', 'image/jpeg', 'image/webp']
);

-- Foto pimpinan & aset situs (admin saja yang upload)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets', 'site-assets', true,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- ─── STORAGE RLS POLICIES ─────────────────────────────────────────────

-- ALUMNI-PHOTOS: publik bisa baca, alumni bisa upload ke folder {user_id}/
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

-- BERITA-IMAGES: publik baca, editor ke atas upload
CREATE POLICY "berita-images: baca publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'berita-images');

CREATE POLICY "berita-images: editor upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'berita-images' AND public.is_editor_or_above()
  );

CREATE POLICY "berita-images: editor hapus"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'berita-images' AND public.is_editor_or_above()
  );

-- GALERI-IMAGES: publik baca, editor ke atas upload
CREATE POLICY "galeri-images: baca publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'galeri-images');

CREATE POLICY "galeri-images: editor upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'galeri-images' AND public.is_editor_or_above()
  );

CREATE POLICY "galeri-images: editor hapus"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'galeri-images' AND public.is_editor_or_above()
  );

-- DOCUMENTS (PRIVATE): hanya pemilik atau admin
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
  USING (
    bucket_id = 'documents' AND public.is_admin_or_above()
  );

-- BERKAS-ALUMNI (PRIVATE): hanya pemilik dan admin
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

-- SITE-ASSETS: publik baca, admin upload
CREATE POLICY "site-assets: baca publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "site-assets: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'site-assets' AND public.is_admin_or_above()
  );

CREATE POLICY "site-assets: admin hapus"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'site-assets' AND public.is_admin_or_above()
  );
