-- =====================================================================
-- Portal Alumni Daarul Mughni — Row Level Security (RLS)
-- File: 02_rls.sql
-- Jalankan setelah 01_schema.sql
-- =====================================================================

-- ─── HELPER FUNCTIONS ─────────────────────────────────────────────────
-- Fungsi-fungsi ini dipanggil di dalam policy untuk cek role user aktif

CREATE OR REPLACE FUNCTION public.my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_above()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_verified_alumni()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'alumni' AND status = 'disetujui'
  )
$$;

-- ─── AKTIFKAN RLS ─────────────────────────────────────────────────────

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.angkatan             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendidikan           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pekerjaan            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sertifikasi          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publikasi            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dokumen_verifikasi   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lowongan             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisasi           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimoni            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pimpinan             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifikasi           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_aktivitas        ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- PROFILES
-- =====================================================================

-- Siapa saja bisa lihat profil sendiri; admin bisa lihat semua
CREATE POLICY "profiles: baca sendiri"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin_or_above());

-- User bisa update profil sendiri; admin bisa update semua
CREATE POLICY "profiles: update sendiri"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin_or_above());

-- Insert hanya lewat trigger handle_new_user (service role)
-- Tidak ada policy INSERT manual untuk user biasa

-- Super admin bisa hapus profil (soft delete via status lebih baik)
CREATE POLICY "profiles: hapus super_admin"
  ON public.profiles FOR DELETE
  USING (public.is_super_admin());

-- =====================================================================
-- ANGKATAN
-- =====================================================================

CREATE POLICY "angkatan: publik bisa baca"
  ON public.angkatan FOR SELECT USING (true);

CREATE POLICY "angkatan: admin bisa kelola"
  ON public.angkatan FOR ALL
  USING (public.is_admin_or_above());

-- =====================================================================
-- ALUMNI PROFILES
-- =====================================================================

-- Publik bisa lihat alumni yang sudah disetujui & is_publik=true
CREATE POLICY "alumni: publik lihat yang terverifikasi"
  ON public.alumni_profiles FOR SELECT
  USING (
    (is_publik = true AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = alumni_profiles.user_id AND p.status = 'disetujui'
    ))
    OR auth.uid() = user_id
    OR public.is_admin_or_above()
  );

-- Alumni bisa update profilnya sendiri
CREATE POLICY "alumni: update sendiri"
  ON public.alumni_profiles FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin_or_above());

-- Alumni bisa insert profil sendiri (hanya 1x, dijaga UNIQUE constraint)
CREATE POLICY "alumni: insert sendiri"
  ON public.alumni_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin bisa hapus
CREATE POLICY "alumni: hapus admin"
  ON public.alumni_profiles FOR DELETE
  USING (public.is_admin_or_above());

-- =====================================================================
-- PENDIDIKAN, PEKERJAAN, SERTIFIKASI, PUBLIKASI
-- (pola yang sama: milik alumni itu sendiri atau admin)
-- =====================================================================

-- PENDIDIKAN
CREATE POLICY "pendidikan: baca publik alumni terverifikasi"
  ON public.pendidikan FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = pendidikan.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui'
             OR p.id = auth.uid())
    )
    OR public.is_admin_or_above()
  );

CREATE POLICY "pendidikan: kelola sendiri"
  ON public.pendidikan FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      WHERE ap.id = pendidikan.alumni_id AND ap.user_id = auth.uid()
    )
    OR public.is_admin_or_above()
  );

-- PEKERJAAN
CREATE POLICY "pekerjaan: baca publik alumni terverifikasi"
  ON public.pekerjaan FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = pekerjaan.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui'
             OR p.id = auth.uid())
    )
    OR public.is_admin_or_above()
  );

CREATE POLICY "pekerjaan: kelola sendiri"
  ON public.pekerjaan FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      WHERE ap.id = pekerjaan.alumni_id AND ap.user_id = auth.uid()
    )
    OR public.is_admin_or_above()
  );

-- SERTIFIKASI
CREATE POLICY "sertifikasi: baca publik"
  ON public.sertifikasi FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = sertifikasi.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui'
             OR p.id = auth.uid())
    )
    OR public.is_admin_or_above()
  );

CREATE POLICY "sertifikasi: kelola sendiri"
  ON public.sertifikasi FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      WHERE ap.id = sertifikasi.alumni_id AND ap.user_id = auth.uid()
    )
    OR public.is_admin_or_above()
  );

-- PUBLIKASI
CREATE POLICY "publikasi: baca publik"
  ON public.publikasi FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = publikasi.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui'
             OR p.id = auth.uid())
    )
    OR public.is_admin_or_above()
  );

CREATE POLICY "publikasi: kelola sendiri"
  ON public.publikasi FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap
      WHERE ap.id = publikasi.alumni_id AND ap.user_id = auth.uid()
    )
    OR public.is_admin_or_above()
  );

-- =====================================================================
-- KEAHLIAN, BAHASA, LEMBAGA, BERKAS ALUMNI
-- Pola sama: publik bisa baca (jika alumni terverifikasi), pemilik bisa kelola
-- =====================================================================

-- Helper macro untuk cek apakah alumni_id milik user aktif & terverifikasi
-- (inline, tidak dibuat fungsi karena parameternya dinamis)

-- KEAHLIAN
ALTER TABLE public.keahlian_alumni ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "keahlian: kelola sendiri"
  ON public.keahlian_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = keahlian_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- BAHASA
ALTER TABLE public.bahasa_alumni ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "bahasa: kelola sendiri"
  ON public.bahasa_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = bahasa_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- LEMBAGA
ALTER TABLE public.lembaga_alumni ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "lembaga: kelola sendiri"
  ON public.lembaga_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = lembaga_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- BERKAS (dokumen portofolio — hanya pemilik & admin yang bisa baca)
ALTER TABLE public.berkas_alumni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "berkas: baca pemilik atau admin"
  ON public.berkas_alumni FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = berkas_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

CREATE POLICY "berkas: kelola sendiri"
  ON public.berkas_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap
            WHERE ap.id = berkas_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- =====================================================================
-- DOKUMEN VERIFIKASI
-- =====================================================================

-- Pemilik dokumen dan admin bisa lihat
CREATE POLICY "dokumen: lihat sendiri atau admin"
  ON public.dokumen_verifikasi FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_or_above());

-- Pemilik bisa upload (insert)
CREATE POLICY "dokumen: upload sendiri"
  ON public.dokumen_verifikasi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin bisa hapus dokumen
CREATE POLICY "dokumen: hapus admin"
  ON public.dokumen_verifikasi FOR DELETE
  USING (public.is_admin_or_above());

-- =====================================================================
-- BERITA
-- =====================================================================

-- Publik bisa baca berita yang sudah published
CREATE POLICY "berita: publik baca published"
  ON public.berita FOR SELECT
  USING (status = 'published' OR public.is_editor_or_above());

-- Editor ke atas bisa insert
CREATE POLICY "berita: editor bisa buat"
  ON public.berita FOR INSERT
  WITH CHECK (public.is_editor_or_above());

-- Editor bisa update berita miliknya; admin bisa update semua
CREATE POLICY "berita: editor update milik sendiri"
  ON public.berita FOR UPDATE
  USING (
    (author_id = auth.uid() AND public.is_editor_or_above())
    OR public.is_admin_or_above()
  );

-- Admin bisa hapus berita
CREATE POLICY "berita: admin hapus"
  ON public.berita FOR DELETE
  USING (public.is_admin_or_above());

-- =====================================================================
-- AGENDA
-- =====================================================================

CREATE POLICY "agenda: publik baca aktif"
  ON public.agenda FOR SELECT
  USING (is_aktif = true OR public.is_editor_or_above());

CREATE POLICY "agenda: editor bisa kelola"
  ON public.agenda FOR ALL
  USING (public.is_editor_or_above());

-- =====================================================================
-- GALERI
-- =====================================================================

CREATE POLICY "galeri: publik baca aktif"
  ON public.galeri FOR SELECT
  USING (is_aktif = true OR public.is_editor_or_above());

CREATE POLICY "galeri: editor bisa kelola"
  ON public.galeri FOR ALL
  USING (public.is_editor_or_above());

-- =====================================================================
-- LOWONGAN
-- =====================================================================

CREATE POLICY "lowongan: publik baca aktif"
  ON public.lowongan FOR SELECT
  USING (is_aktif = true OR public.is_admin_or_above());

CREATE POLICY "lowongan: admin kelola"
  ON public.lowongan FOR ALL
  USING (public.is_admin_or_above());

-- =====================================================================
-- ORGANISASI
-- =====================================================================

CREATE POLICY "organisasi: publik baca aktif"
  ON public.organisasi FOR SELECT
  USING (is_aktif = true OR public.is_admin_or_above());

CREATE POLICY "organisasi: admin kelola"
  ON public.organisasi FOR ALL
  USING (public.is_admin_or_above());

-- =====================================================================
-- TESTIMONI & PIMPINAN
-- =====================================================================

CREATE POLICY "testimoni: publik baca aktif"
  ON public.testimoni FOR SELECT
  USING (is_aktif = true OR public.is_admin_or_above());

CREATE POLICY "testimoni: admin kelola"
  ON public.testimoni FOR ALL
  USING (public.is_admin_or_above());

CREATE POLICY "pimpinan: publik baca aktif"
  ON public.pimpinan FOR SELECT
  USING (is_aktif = true OR public.is_admin_or_above());

CREATE POLICY "pimpinan: admin kelola"
  ON public.pimpinan FOR ALL
  USING (public.is_admin_or_above());

-- =====================================================================
-- NOTIFIKASI
-- =====================================================================

-- User melihat notifikasi yang ditujukan ke dirinya atau ke rolenya
CREATE POLICY "notif: lihat milik sendiri"
  ON public.notifikasi FOR SELECT
  USING (
    target_user_id = auth.uid()
    OR (
      target_user_id IS NULL
      AND public.is_editor_or_above()
      AND (target_role IS NULL OR target_role::text = public.my_role())
    )
  );

-- Admin ke atas bisa buat notifikasi
CREATE POLICY "notif: admin buat"
  ON public.notifikasi FOR INSERT
  WITH CHECK (public.is_admin_or_above());

-- User bisa tandai notifikasinya sebagai dibaca
CREATE POLICY "notif: update dibaca sendiri"
  ON public.notifikasi FOR UPDATE
  USING (target_user_id = auth.uid() OR public.is_admin_or_above());

CREATE POLICY "notif: admin hapus"
  ON public.notifikasi FOR DELETE
  USING (public.is_admin_or_above());

-- =====================================================================
-- LOG AKTIVITAS
-- =====================================================================

-- Admin ke atas bisa lihat log
CREATE POLICY "log: admin bisa baca"
  ON public.log_aktivitas FOR SELECT
  USING (public.is_admin_or_above());

-- Insert log hanya via service role (dari trigger atau server-side function)
-- Tidak ada INSERT policy untuk user biasa
CREATE POLICY "log: service role insert"
  ON public.log_aktivitas FOR INSERT
  WITH CHECK (public.is_admin_or_above());

-- =====================================================================
-- GRANT PERMISSIONS
-- Harus dijalankan agar role authenticated & anon bisa mengakses tabel.
-- RLS saja tidak cukup tanpa GRANT di level tabel.
-- =====================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL    ON ALL TABLES IN SCHEMA public TO authenticated;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
