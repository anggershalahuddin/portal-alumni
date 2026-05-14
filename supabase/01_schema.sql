-- =====================================================================
-- Portal Alumni Daarul Mughni — Database Schema
-- File: 01_schema.sql
-- Jalankan file ini pertama kali di Supabase SQL Editor
-- =====================================================================

-- ─── ENUM TYPES ───────────────────────────────────────────────────────

CREATE TYPE public.user_role AS ENUM (
  'super_admin', 'admin', 'editor', 'alumni', 'user'
);

CREATE TYPE public.verification_status AS ENUM (
  'menunggu', 'disetujui', 'ditolak'
);

CREATE TYPE public.content_status AS ENUM (
  'draft', 'published', 'archived'
);

CREATE TYPE public.notif_type AS ENUM (
  'verifikasi', 'berita', 'agenda', 'user', 'sistem'
);

CREATE TYPE public.pendidikan_jenjang AS ENUM (
  'SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3', 'Lainnya'
);

CREATE TYPE public.lowongan_tipe AS ENUM (
  'full-time', 'part-time', 'remote', 'magang', 'freelance'
);

CREATE TYPE public.publikasi_jenis AS ENUM (
  'artikel', 'buku', 'penelitian', 'opini', 'lainnya'
);

CREATE TYPE public.lembaga_jenis AS ENUM (
  'Perusahaan (PT/CV/UD)',
  'Pesantren / Lembaga Pendidikan',
  'Yayasan / Lembaga Sosial',
  'Toko / UMKM',
  'Koperasi',
  'Lainnya'
);

CREATE TYPE public.berkas_kategori AS ENUM (
  'CV / Resume', 'Ijazah', 'Sertifikat',
  'Foto / Scan', 'Company Profile', 'Lainnya'
);

-- ─── HELPER FUNCTION: auto-update updated_at ──────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─── PROFILES ─────────────────────────────────────────────────────────
-- Extends auth.users. Satu baris per akun, dibuat otomatis via trigger.

CREATE TABLE public.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role            public.user_role          NOT NULL DEFAULT 'user',
  status          public.verification_status NOT NULL DEFAULT 'menunggu',
  pesan_admin     TEXT,                     -- catatan/alasan dari admin (verifikasi/penolakan)
  nama_lengkap    TEXT,
  foto_url        TEXT,
  -- Biodata dari form pendaftaran
  no_hp           TEXT,
  angkatan        SMALLINT,                 -- tahun angkatan (raw), FK ke angkatan ada di alumni_profiles
  domisili        TEXT,                     -- kota domisili — ditampilkan publik
  bidang          TEXT,                     -- bidang/profesi — ditampilkan publik
  -- Data internal (hanya admin yang lihat, tidak ditampilkan publik)
  tempat_lahir    TEXT,
  tanggal_lahir   DATE,
  alamat_lengkap  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger: buat profile otomatis saat user baru mendaftar
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── ANGKATAN ─────────────────────────────────────────────────────────

CREATE TABLE public.angkatan (
  id              SERIAL      PRIMARY KEY,
  tahun_masuk     SMALLINT    NOT NULL,
  tahun_lulus     SMALLINT    NOT NULL UNIQUE,
  nama_angkatan   TEXT,                     -- e.g., "Angkatan 1 (Perintis)"
  keterangan      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── ALUMNI PROFILES ──────────────────────────────────────────────────
-- Profil lengkap alumni (hanya ada jika role = 'alumni' & sudah diverifikasi)

CREATE TABLE public.alumni_profiles (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  angkatan_id     INTEGER     REFERENCES public.angkatan(id),
  id_alumni       TEXT        UNIQUE,       -- e.g., "DM-2018-042"
  no_hp           TEXT,
  bio             TEXT,
  bidang          TEXT,                     -- bidang keahlian
  domisili        TEXT,
  linkedin_url    TEXT,
  website_url     TEXT,
  instagram_url   TEXT,
  youtube_url     TEXT,
  twitter_url     TEXT,
  facebook_url    TEXT,
  is_publik       BOOLEAN     NOT NULL DEFAULT true,
  verified_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER alumni_profiles_set_updated_at
  BEFORE UPDATE ON public.alumni_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── PENDIDIKAN ───────────────────────────────────────────────────────

CREATE TABLE public.pendidikan (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id       UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  institusi       TEXT        NOT NULL,
  jurusan         TEXT,
  jenjang         public.pendidikan_jenjang,
  tahun_mulai     SMALLINT,
  tahun_selesai   SMALLINT,
  is_current      BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── PEKERJAAN ────────────────────────────────────────────────────────

CREATE TABLE public.pekerjaan (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id       UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  perusahaan      TEXT        NOT NULL,
  posisi          TEXT        NOT NULL,
  bidang          TEXT,
  lokasi          TEXT,
  tahun_mulai     SMALLINT,
  tahun_selesai   SMALLINT,
  is_current      BOOLEAN     NOT NULL DEFAULT false,
  deskripsi       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── SERTIFIKASI ──────────────────────────────────────────────────────

CREATE TABLE public.sertifikasi (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id       UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama            TEXT        NOT NULL,
  penerbit        TEXT,
  tahun           SMALLINT,
  url             TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── PUBLIKASI ────────────────────────────────────────────────────────

CREATE TABLE public.publikasi (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id       UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  judul           TEXT        NOT NULL,
  jenis           public.publikasi_jenis,
  penerbit        TEXT,
  tahun           SMALLINT,
  url             TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── KEAHLIAN ALUMNI ──────────────────────────────────────────────────

CREATE TABLE public.keahlian_alumni (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id   UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama        TEXT        NOT NULL,          -- e.g., 'React', 'Machine Learning'
  tingkat     TEXT,                          -- 'Pemula' | 'Menengah' | 'Mahir' | 'Ahli'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── BAHASA ALUMNI ────────────────────────────────────────────────────

CREATE TABLE public.bahasa_alumni (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id   UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama        TEXT        NOT NULL,          -- e.g., 'English', 'Arabic'
  tingkat     TEXT,                          -- 'Dasar' | 'Percakapan' | 'Profesional' | 'Native'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── LEMBAGA / USAHA ALUMNI ───────────────────────────────────────────
-- Kepemilikan bisnis, yayasan, atau organisasi milik alumni

CREATE TABLE public.lembaga_alumni (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id       UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama            TEXT        NOT NULL,
  jenis           public.lembaga_jenis,
  sebagai         TEXT,                      -- 'Pendiri / Founder' | 'Direktur / CEO' | dsb.
  bidang          TEXT,
  lokasi          TEXT,
  tahun_berdiri   SMALLINT,
  website         TEXT,
  deskripsi       TEXT,
  open_kerjasama  BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER lembaga_alumni_set_updated_at
  BEFORE UPDATE ON public.lembaga_alumni
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── BERKAS ALUMNI ────────────────────────────────────────────────────
-- Dokumen portofolio alumni (CV, sertifikat, dsb.) — BERBEDA dari dokumen verifikasi

CREATE TABLE public.berkas_alumni (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id   UUID        NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama        TEXT        NOT NULL,          -- nama tampil, e.g., 'CV 2024'
  kategori    public.berkas_kategori,
  tipe        TEXT,                          -- 'PDF' | 'IMG'
  ukuran      TEXT,                          -- string display, e.g., '1.2 MB'
  file_url    TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── DOKUMEN VERIFIKASI ───────────────────────────────────────────────
-- Foto bukti alumni yang diunggah saat mendaftar (hanya 1 foto JPEG/WebP)

CREATE TABLE public.dokumen_verifikasi (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  jenis       TEXT        NOT NULL DEFAULT 'foto_bukti', -- selalu 'foto_bukti'
  file_url    TEXT        NOT NULL,
  auto_hapus  BOOLEAN     NOT NULL DEFAULT true,  -- dihapus otomatis setelah status = 'disetujui'
  catatan     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── BERITA ───────────────────────────────────────────────────────────

CREATE TABLE public.berita (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  judul           TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  ringkasan       TEXT,
  konten          TEXT,                     -- konten berita (markdown/HTML)
  foto_url        TEXT,
  kategori        TEXT,
  tag             TEXT[]      NOT NULL DEFAULT '{}',
  status          public.content_status NOT NULL DEFAULT 'draft',
  author_id       UUID        REFERENCES public.profiles(id),
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER berita_set_updated_at
  BEFORE UPDATE ON public.berita
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── AGENDA ───────────────────────────────────────────────────────────

CREATE TABLE public.agenda (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  judul           TEXT        NOT NULL,
  deskripsi       TEXT,
  lokasi          TEXT,
  tanggal_mulai   TIMESTAMPTZ NOT NULL,
  tanggal_selesai TIMESTAMPTZ,
  kategori        TEXT,
  foto_url        TEXT,
  link_registrasi TEXT,
  is_aktif        BOOLEAN     NOT NULL DEFAULT true,
  organizer_id    UUID        REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER agenda_set_updated_at
  BEFORE UPDATE ON public.agenda
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── GALERI ───────────────────────────────────────────────────────────

CREATE TABLE public.galeri (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  judul           TEXT        NOT NULL,
  deskripsi       TEXT,
  foto_url        TEXT        NOT NULL,
  kategori        TEXT,
  is_aktif        BOOLEAN     NOT NULL DEFAULT true,
  uploader_id     UUID        REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── LOWONGAN ─────────────────────────────────────────────────────────

CREATE TABLE public.lowongan (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  judul           TEXT        NOT NULL,
  perusahaan      TEXT        NOT NULL,
  lokasi          TEXT,
  tipe            public.lowongan_tipe,
  deskripsi       TEXT,
  persyaratan     TEXT[]      NOT NULL DEFAULT '{}',
  gaji_min        INTEGER,
  gaji_max        INTEGER,
  deadline        DATE,
  is_aktif        BOOLEAN     NOT NULL DEFAULT true,
  poster_id       UUID        REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER lowongan_set_updated_at
  BEFORE UPDATE ON public.lowongan
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── ORGANISASI ───────────────────────────────────────────────────────

CREATE TABLE public.organisasi (
  id              SERIAL      PRIMARY KEY,
  nama            TEXT        NOT NULL,
  deskripsi       TEXT,
  logo_url        TEXT,
  singkatan       TEXT,
  kategori        TEXT,
  tahun_berdiri   SMALLINT,
  ketua           TEXT,
  kontak          TEXT,
  is_aktif        BOOLEAN     NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── TESTIMONI ────────────────────────────────────────────────────────

CREATE TABLE public.testimoni (
  id              SERIAL      PRIMARY KEY,
  nama            TEXT        NOT NULL,
  angkatan        TEXT,
  foto_url        TEXT,
  isi             TEXT        NOT NULL,
  jabatan         TEXT,
  is_aktif        BOOLEAN     NOT NULL DEFAULT true,
  urutan          SMALLINT    NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── PIMPINAN ─────────────────────────────────────────────────────────

CREATE TABLE public.pimpinan (
  id              SERIAL      PRIMARY KEY,
  nama            TEXT        NOT NULL,
  gelar           TEXT,
  foto_url        TEXT,
  jabatan         TEXT,
  pesan           TEXT,
  urutan          SMALLINT    NOT NULL DEFAULT 0,
  is_aktif        BOOLEAN     NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── NOTIFIKASI ───────────────────────────────────────────────────────

CREATE TABLE public.notifikasi (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  judul           TEXT        NOT NULL,
  pesan           TEXT,
  tipe            public.notif_type NOT NULL DEFAULT 'sistem',
  -- target_role: null = semua admin; diisi = role tertentu saja
  target_role     public.user_role,
  -- target_user_id: notifikasi personal untuk satu user
  target_user_id  UUID        REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_dibaca       BOOLEAN     NOT NULL DEFAULT false,
  data            JSONB,                    -- metadata tambahan (misal: id entitas terkait)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── LOG AKTIVITAS ────────────────────────────────────────────────────

CREATE TABLE public.log_aktivitas (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  aksi            TEXT        NOT NULL,     -- 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'VERIFY'
  entitas         TEXT,                     -- nama tabel: 'berita', 'alumni_profiles', dsb.
  entitas_id      TEXT,
  detail          JSONB,                    -- before/after values atau info tambahan
  ip_address      INET,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── TRIGGER: auto-hapus foto verifikasi setelah alumni disetujui ─────
-- Menghapus baris dokumen_verifikasi (dan file di storage via application layer)

CREATE OR REPLACE FUNCTION public.handle_alumni_verified()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Hapus dokumen verifikasi jika status berubah menjadi 'disetujui'
  IF NEW.status = 'disetujui' AND OLD.status != 'disetujui' THEN
    DELETE FROM public.dokumen_verifikasi
    WHERE user_id = NEW.id AND auto_hapus = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_alumni_verified
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (NEW.status = 'disetujui' AND OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.handle_alumni_verified();

-- ─── ALTER: tambah kolom tipe ke pekerjaan ───────────────────────────
-- Jalankan ini jika tabel pekerjaan sudah ada di database:
-- ALTER TABLE public.pekerjaan ADD COLUMN IF NOT EXISTS tipe TEXT;

-- ─── GURU PESANTREN ──────────────────────────────────────────────────

CREATE TABLE public.guru (
  id              SERIAL      PRIMARY KEY,
  nama            TEXT        NOT NULL,
  jabatan         TEXT,
  deskripsi       TEXT,
  foto_url        TEXT,
  is_pengasuh     BOOLEAN     NOT NULL DEFAULT false,
  is_aktif        BOOLEAN     NOT NULL DEFAULT true,
  urutan          SMALLINT    NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── MILESTONE PESANTREN ─────────────────────────────────────────────

CREATE TABLE public.milestone (
  id              SERIAL      PRIMARY KEY,
  tahun           SMALLINT    NOT NULL,
  judul           TEXT        NOT NULL,
  keterangan      TEXT,
  is_aktif        BOOLEAN     NOT NULL DEFAULT true,
  urutan          SMALLINT    NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── PENGATURAN (key-value config) ───────────────────────────────────

CREATE TABLE public.pengaturan (
  key             TEXT        PRIMARY KEY,
  value           TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── LAPORAN MASALAH ─────────────────────────────────────────────────

CREATE TABLE public.laporan_masalah (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nama            TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  judul           TEXT        NOT NULL,
  detail          TEXT,
  status          TEXT        NOT NULL DEFAULT 'menunggu',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER laporan_masalah_set_updated_at
  BEFORE UPDATE ON public.laporan_masalah
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── INDEXES ──────────────────────────────────────────────────────────

CREATE INDEX idx_profiles_role           ON public.profiles(role);
CREATE INDEX idx_profiles_status         ON public.profiles(status);
CREATE INDEX idx_alumni_profiles_user    ON public.alumni_profiles(user_id);
CREATE INDEX idx_alumni_profiles_angkatan ON public.alumni_profiles(angkatan_id);
CREATE INDEX idx_berita_slug             ON public.berita(slug);
CREATE INDEX idx_berita_status           ON public.berita(status);
CREATE INDEX idx_berita_published_at     ON public.berita(published_at DESC);
CREATE INDEX idx_agenda_tanggal          ON public.agenda(tanggal_mulai);
CREATE INDEX idx_agenda_aktif            ON public.agenda(is_aktif);
CREATE INDEX idx_lowongan_aktif          ON public.lowongan(is_aktif);
CREATE INDEX idx_notifikasi_target       ON public.notifikasi(target_user_id);
CREATE INDEX idx_log_user                ON public.log_aktivitas(user_id);
CREATE INDEX idx_log_created             ON public.log_aktivitas(created_at DESC);
CREATE INDEX idx_keahlian_alumni         ON public.keahlian_alumni(alumni_id);
CREATE INDEX idx_bahasa_alumni           ON public.bahasa_alumni(alumni_id);
CREATE INDEX idx_lembaga_alumni          ON public.lembaga_alumni(alumni_id);
CREATE INDEX idx_berkas_alumni           ON public.berkas_alumni(alumni_id);
CREATE INDEX idx_dokver_user             ON public.dokumen_verifikasi(user_id);
