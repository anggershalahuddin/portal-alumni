-- =====================================================================
-- Portal Alumni Daarul Mughni — Migration: Sinkronisasi Frontend v2
-- File: 05_migration.sql
-- Jalankan file ini di Supabase Dashboard → SQL Editor
-- AMAN dijalankan di atas schema yang sudah ada (menggunakan IF NOT EXISTS)
-- =====================================================================

-- ─── 1. ENUM BARU ─────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.lembaga_jenis AS ENUM (
    'Perusahaan (PT/CV/UD)',
    'Pesantren / Lembaga Pendidikan',
    'Yayasan / Lembaga Sosial',
    'Toko / UMKM',
    'Koperasi',
    'Lainnya'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.berkas_kategori AS ENUM (
    'CV / Resume', 'Ijazah', 'Sertifikat',
    'Foto / Scan', 'Company Profile', 'Lainnya'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── 2. KOLOM BARU DI TABEL profiles ─────────────────────────────────
-- Biodata dari form pendaftaran (belum ada di schema awal)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS no_hp          TEXT,
  ADD COLUMN IF NOT EXISTS angkatan       SMALLINT,
  ADD COLUMN IF NOT EXISTS domisili       TEXT,
  ADD COLUMN IF NOT EXISTS bidang         TEXT,
  ADD COLUMN IF NOT EXISTS tempat_lahir   TEXT,
  ADD COLUMN IF NOT EXISTS tanggal_lahir  DATE,
  ADD COLUMN IF NOT EXISTS alamat_lengkap TEXT;

-- ─── 3. KOLOM BARU DI TABEL alumni_profiles ──────────────────────────
-- Sosial media alumni

ALTER TABLE public.alumni_profiles
  ADD COLUMN IF NOT EXISTS instagram_url  TEXT,
  ADD COLUMN IF NOT EXISTS youtube_url    TEXT,
  ADD COLUMN IF NOT EXISTS twitter_url    TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url   TEXT;

-- ─── 4. KOLOM BARU DI TABEL dokumen_verifikasi ───────────────────────

ALTER TABLE public.dokumen_verifikasi
  ADD COLUMN IF NOT EXISTS auto_hapus BOOLEAN NOT NULL DEFAULT true;

-- ─── 5. TABEL BARU ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.keahlian_alumni (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id   UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama        TEXT        NOT NULL,
  tingkat     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bahasa_alumni (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id   UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama        TEXT        NOT NULL,
  tingkat     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lembaga_alumni (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id       UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama            TEXT        NOT NULL,
  jenis           public.lembaga_jenis,
  sebagai         TEXT,
  bidang          TEXT,
  lokasi          TEXT,
  tahun_berdiri   SMALLINT,
  website         TEXT,
  deskripsi       TEXT,
  open_kerjasama  BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.berkas_alumni (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id   UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama        TEXT        NOT NULL,
  kategori    public.berkas_kategori,
  tipe        TEXT,
  ukuran      TEXT,
  file_url    TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 6. TRIGGER UNTUK lembaga_alumni ─────────────────────────────────

DROP TRIGGER IF EXISTS lembaga_alumni_set_updated_at ON public.lembaga_alumni;
CREATE TRIGGER lembaga_alumni_set_updated_at
  BEFORE UPDATE ON public.lembaga_alumni
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 7. UPDATE FUNGSI handle_new_user ────────────────────────────────
-- Sekarang mempopulasi semua field biodata dari user metadata

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  meta JSONB := NEW.raw_user_meta_data;
BEGIN
  INSERT INTO public.profiles (
    id, nama_lengkap, no_hp, angkatan,
    tempat_lahir, tanggal_lahir, domisili, bidang, alamat_lengkap
  )
  VALUES (
    NEW.id,
    COALESCE(meta->>'nama_lengkap', NEW.email),
    meta->>'no_hp',
    CASE WHEN meta->>'angkatan' IS NOT NULL
         THEN (meta->>'angkatan')::SMALLINT ELSE NULL END,
    meta->>'tempat_lahir',
    CASE WHEN meta->>'tanggal_lahir' IS NOT NULL
         THEN (meta->>'tanggal_lahir')::DATE ELSE NULL END,
    meta->>'domisili',
    meta->>'bidang',
    meta->>'alamat_lengkap'
  );
  RETURN NEW;
END;
$$;

-- ─── 8. FUNGSI + TRIGGER AUTO-HAPUS FOTO VERIFIKASI ──────────────────

CREATE OR REPLACE FUNCTION public.handle_alumni_verified()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'disetujui' AND OLD.status IS DISTINCT FROM NEW.status THEN
    DELETE FROM public.dokumen_verifikasi
    WHERE user_id = NEW.id AND auto_hapus = true;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_alumni_verified ON public.profiles;
CREATE TRIGGER on_alumni_verified
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (NEW.status = 'disetujui' AND OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.handle_alumni_verified();

-- ─── 9. INDEXES BARU ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_keahlian_alumni  ON public.keahlian_alumni(alumni_id);
CREATE INDEX IF NOT EXISTS idx_bahasa_alumni    ON public.bahasa_alumni(alumni_id);
CREATE INDEX IF NOT EXISTS idx_lembaga_alumni   ON public.lembaga_alumni(alumni_id);
CREATE INDEX IF NOT EXISTS idx_berkas_alumni    ON public.berkas_alumni(alumni_id);
CREATE INDEX IF NOT EXISTS idx_dokver_user      ON public.dokumen_verifikasi(user_id);

-- ─── 10. RLS UNTUK TABEL BARU ─────────────────────────────────────────

ALTER TABLE public.keahlian_alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bahasa_alumni   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lembaga_alumni  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berkas_alumni   ENABLE ROW LEVEL SECURITY;

-- KEAHLIAN
DROP POLICY IF EXISTS "keahlian: baca publik alumni terverifikasi" ON public.keahlian_alumni;
CREATE POLICY "keahlian: baca publik alumni terverifikasi"
  ON public.keahlian_alumni FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = keahlian_alumni.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

DROP POLICY IF EXISTS "keahlian: kelola sendiri" ON public.keahlian_alumni;
CREATE POLICY "keahlian: kelola sendiri"
  ON public.keahlian_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = keahlian_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- BAHASA
DROP POLICY IF EXISTS "bahasa: baca publik alumni terverifikasi" ON public.bahasa_alumni;
CREATE POLICY "bahasa: baca publik alumni terverifikasi"
  ON public.bahasa_alumni FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = bahasa_alumni.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

DROP POLICY IF EXISTS "bahasa: kelola sendiri" ON public.bahasa_alumni;
CREATE POLICY "bahasa: kelola sendiri"
  ON public.bahasa_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = bahasa_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- LEMBAGA
DROP POLICY IF EXISTS "lembaga: baca publik alumni terverifikasi" ON public.lembaga_alumni;
CREATE POLICY "lembaga: baca publik alumni terverifikasi"
  ON public.lembaga_alumni FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = lembaga_alumni.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

DROP POLICY IF EXISTS "lembaga: kelola sendiri" ON public.lembaga_alumni;
CREATE POLICY "lembaga: kelola sendiri"
  ON public.lembaga_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = lembaga_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- BERKAS (hanya pemilik & admin)
DROP POLICY IF EXISTS "berkas: baca pemilik atau admin" ON public.berkas_alumni;
CREATE POLICY "berkas: baca pemilik atau admin"
  ON public.berkas_alumni FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = berkas_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

DROP POLICY IF EXISTS "berkas: kelola sendiri" ON public.berkas_alumni;
CREATE POLICY "berkas: kelola sendiri"
  ON public.berkas_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = berkas_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ─── 11. STORAGE BUCKETS BARU ─────────────────────────────────────────

-- Update bucket documents: kurangi limit dan mime types (foto bukti saja)
UPDATE storage.buckets
SET
  file_size_limit    = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/webp']
WHERE id = 'documents';

-- Bucket baru untuk berkas portofolio alumni
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'berkas-alumni', 'berkas-alumni', false,
  5242880,
  ARRAY['application/pdf', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies untuk berkas-alumni
DROP POLICY IF EXISTS "berkas-alumni: baca sendiri atau admin" ON storage.objects;
CREATE POLICY "berkas-alumni: baca sendiri atau admin"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'berkas-alumni'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.is_admin_or_above()
    )
  );

DROP POLICY IF EXISTS "berkas-alumni: alumni upload sendiri" ON storage.objects;
CREATE POLICY "berkas-alumni: alumni upload sendiri"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'berkas-alumni'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "berkas-alumni: alumni hapus sendiri" ON storage.objects;
CREATE POLICY "berkas-alumni: alumni hapus sendiri"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'berkas-alumni'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.is_admin_or_above()
    )
  );

-- ─── SELESAI ──────────────────────────────────────────────────────────
-- Verifikasi: cek tabel baru berhasil dibuat
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('keahlian_alumni','bahasa_alumni','lembaga_alumni','berkas_alumni')
ORDER BY table_name;
