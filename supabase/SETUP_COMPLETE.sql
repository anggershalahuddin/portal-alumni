-- =====================================================================
-- Portal Alumni Daarul Mughni — COMPLETE DATABASE SETUP
-- File tunggal: jalankan 1x di Supabase SQL Editor untuk setup penuh
-- Mencakup: schema, RLS, storage, seed data
-- =====================================================================

-- ═══════════════════════════════════════════════════════════════════
-- 1. ENUM TYPES
-- ═══════════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════════
-- 2. HELPER FUNCTIONS (set_updated_at & role checks)
-- ═══════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin'))
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_above()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin','admin','editor'))
$$;

CREATE OR REPLACE FUNCTION public.is_verified_alumni()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'alumni' AND status = 'disetujui')
$$;

-- ═══════════════════════════════════════════════════════════════════
-- 3. TABLES
-- ═══════════════════════════════════════════════════════════════════

-- ── profiles ──────────────────────────────────────────────────────

CREATE TABLE public.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role            public.user_role          NOT NULL DEFAULT 'user',
  status          public.verification_status NOT NULL DEFAULT 'menunggu',
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  permissions     JSONB       DEFAULT '[]'::jsonb,
  pesan_admin     TEXT,
  nama_lengkap    TEXT,
  email           TEXT,
  foto_url        TEXT,
  no_hp           TEXT,
  angkatan        SMALLINT,
  domisili        TEXT,
  bidang          TEXT,
  tempat_lahir    TEXT,
  tanggal_lahir   DATE,
  alamat_lengkap  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── angkatan ──────────────────────────────────────────────────────

CREATE TABLE public.angkatan (
  id            SERIAL    PRIMARY KEY,
  tahun_masuk   SMALLINT  NOT NULL,
  tahun_lulus   SMALLINT  NOT NULL UNIQUE,
  nama_angkatan TEXT,
  logo_url      TEXT,
  keterangan    TEXT,
  is_aktif      BOOLEAN   NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── alumni_profiles ───────────────────────────────────────────────

CREATE TABLE public.alumni_profiles (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID    NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  angkatan_id   INTEGER REFERENCES public.angkatan(id),
  id_alumni     TEXT    UNIQUE,
  no_hp         TEXT,
  bio           TEXT,
  bidang        TEXT,
  domisili      TEXT,
  linkedin_url  TEXT,
  website_url   TEXT,
  instagram_url TEXT,
  youtube_url   TEXT,
  twitter_url   TEXT,
  facebook_url  TEXT,
  is_publik     BOOLEAN NOT NULL DEFAULT true,
  verified_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER alumni_profiles_set_updated_at
  BEFORE UPDATE ON public.alumni_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── id_alumni_seq (sequence anti-collision) ───────────────────────

CREATE TABLE public.id_alumni_seq (
  tahun    INTEGER PRIMARY KEY,
  last_seq INTEGER NOT NULL DEFAULT 0
);

-- ── pendidikan ────────────────────────────────────────────────────

CREATE TABLE public.pendidikan (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id     UUID    NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  institusi     TEXT    NOT NULL,
  jurusan       TEXT,
  jenjang       public.pendidikan_jenjang,
  gelar         TEXT,
  tahun         TEXT,
  tahun_mulai   SMALLINT,
  tahun_selesai SMALLINT,
  lokasi        TEXT,
  deskripsi     TEXT,
  is_current    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── pekerjaan ─────────────────────────────────────────────────────

CREATE TABLE public.pekerjaan (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id     UUID    NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  perusahaan    TEXT    NOT NULL,
  posisi        TEXT    NOT NULL,
  bidang        TEXT,
  lokasi        TEXT,
  periode       TEXT,
  tahun_mulai   SMALLINT,
  tahun_selesai SMALLINT,
  is_current    BOOLEAN NOT NULL DEFAULT false,
  deskripsi     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── sertifikasi ───────────────────────────────────────────────────

CREATE TABLE public.sertifikasi (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID    NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama      TEXT    NOT NULL,
  penerbit  TEXT,
  tahun     SMALLINT,
  no_cert   TEXT,
  url       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── publikasi ─────────────────────────────────────────────────────

CREATE TABLE public.publikasi (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID    NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  judul     TEXT    NOT NULL,
  jenis     public.publikasi_jenis,
  penerbit  TEXT,
  tahun     SMALLINT,
  url       TEXT,
  deskripsi TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── keahlian_alumni ───────────────────────────────────────────────

CREATE TABLE public.keahlian_alumni (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama      TEXT NOT NULL,
  tingkat   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── bahasa_alumni ─────────────────────────────────────────────────

CREATE TABLE public.bahasa_alumni (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama      TEXT NOT NULL,
  tingkat   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── lembaga_alumni ────────────────────────────────────────────────

CREATE TABLE public.lembaga_alumni (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id      UUID    NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama           TEXT    NOT NULL,
  jenis          public.lembaga_jenis,
  sebagai        TEXT,
  bidang         TEXT,
  lokasi         TEXT,
  tahun_berdiri  SMALLINT,
  website        TEXT,
  deskripsi      TEXT,
  open_kerjasama BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER lembaga_alumni_set_updated_at
  BEFORE UPDATE ON public.lembaga_alumni
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── berkas_alumni ─────────────────────────────────────────────────

CREATE TABLE public.berkas_alumni (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID    NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama      TEXT    NOT NULL,
  kategori  public.berkas_kategori,
  tipe      TEXT,
  ukuran    TEXT,
  file_url  TEXT    NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── alumni_organisasi ─────────────────────────────────────────────

CREATE TABLE public.alumni_organisasi (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id     UUID    NOT NULL REFERENCES public.alumni_profiles(id) ON DELETE CASCADE,
  nama_org      TEXT    NOT NULL,
  jabatan       TEXT,
  tahun_mulai   SMALLINT,
  tahun_selesai SMALLINT,
  is_current    BOOLEAN NOT NULL DEFAULT false,
  deskripsi     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── dokumen_verifikasi ────────────────────────────────────────────

CREATE TABLE public.dokumen_verifikasi (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  jenis     TEXT    NOT NULL DEFAULT 'foto_bukti',
  file_url  TEXT    NOT NULL,
  auto_hapus BOOLEAN NOT NULL DEFAULT true,
  catatan   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT dokumen_verifikasi_user_id_jenis_key UNIQUE (user_id, jenis)
);

-- ── berita ────────────────────────────────────────────────────────

CREATE TABLE public.berita (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  judul       TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  ringkasan   TEXT,
  konten      TEXT,
  foto_url    TEXT,
  kategori    TEXT,
  tag         TEXT[]  NOT NULL DEFAULT '{}',
  penulis     TEXT,
  status      public.content_status NOT NULL DEFAULT 'draft',
  author_id   UUID    REFERENCES public.profiles(id),
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER berita_set_updated_at
  BEFORE UPDATE ON public.berita
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── komentar_berita ───────────────────────────────────────────────

CREATE TABLE public.komentar_berita (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  berita_id   UUID    NOT NULL REFERENCES public.berita(id) ON DELETE CASCADE,
  user_id     UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  isi         TEXT    NOT NULL CHECK (char_length(isi) BETWEEN 3 AND 1000),
  is_disetujui BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── agenda ────────────────────────────────────────────────────────

CREATE TABLE public.agenda (
  id                  UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  judul               TEXT    NOT NULL,
  deskripsi           TEXT,
  lokasi              TEXT,
  lokasi_kategori     TEXT,
  maps_url            TEXT,
  tanggal_mulai       TIMESTAMPTZ NOT NULL,
  tanggal_selesai     TIMESTAMPTZ,
  kategori            TEXT,
  foto_url            TEXT,
  image_hero          TEXT,
  pamflet_url         TEXT,
  pembicara           JSONB   NOT NULL DEFAULT '[]'::jsonb,
  status_pendaftaran  TEXT,
  htm                 TEXT,
  has_sertifikat      BOOLEAN NOT NULL DEFAULT false,
  link_registrasi     TEXT,
  published_by        TEXT,
  is_aktif            BOOLEAN NOT NULL DEFAULT true,
  organizer_id        UUID    REFERENCES public.profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER agenda_set_updated_at
  BEFORE UPDATE ON public.agenda
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── galeri ────────────────────────────────────────────────────────

CREATE TABLE public.galeri (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  judul       TEXT    NOT NULL,
  deskripsi   TEXT,
  foto_url    TEXT    NOT NULL,
  kategori    TEXT,
  is_aktif    BOOLEAN NOT NULL DEFAULT true,
  uploader_id UUID    REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── lowongan ──────────────────────────────────────────────────────

CREATE TABLE public.lowongan (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  judul         TEXT    NOT NULL,
  perusahaan    TEXT    NOT NULL,
  lokasi        TEXT,
  tipe          public.lowongan_tipe,
  deskripsi     TEXT,
  persyaratan   TEXT[]  NOT NULL DEFAULT '{}',
  gaji_min      INTEGER,
  gaji_max      INTEGER,
  deadline      DATE,
  is_aktif      BOOLEAN NOT NULL DEFAULT true,
  poster_id     UUID    REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER lowongan_set_updated_at
  BEFORE UPDATE ON public.lowongan
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── organisasi ────────────────────────────────────────────────────

CREATE TABLE public.organisasi (
  id            SERIAL  PRIMARY KEY,
  nama          TEXT    NOT NULL,
  deskripsi     TEXT,
  logo_url      TEXT,
  singkatan     TEXT,
  kategori      TEXT,
  tahun_berdiri SMALLINT,
  ketua         TEXT,
  kontak        TEXT,
  is_aktif      BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── testimoni ─────────────────────────────────────────────────────

CREATE TABLE public.testimoni (
  id           SERIAL  PRIMARY KEY,
  nama         TEXT    NOT NULL,
  angkatan     TEXT,
  foto_url     TEXT,
  inisial      TEXT,
  warna_avatar TEXT    NOT NULL DEFAULT '#1A5C38',
  isi          TEXT    NOT NULL,
  jabatan      TEXT,
  is_aktif     BOOLEAN NOT NULL DEFAULT true,
  urutan       SMALLINT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── pimpinan ──────────────────────────────────────────────────────

CREATE TABLE public.pimpinan (
  id        SERIAL  PRIMARY KEY,
  nama      TEXT    NOT NULL,
  gelar     TEXT,
  foto_url  TEXT,
  jabatan   TEXT,
  pesan     TEXT,
  urutan    SMALLINT NOT NULL DEFAULT 0,
  is_aktif  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── guru ──────────────────────────────────────────────────────────

CREATE TABLE public.guru (
  id          SERIAL  PRIMARY KEY,
  nama        TEXT    NOT NULL,
  jabatan     TEXT,
  deskripsi   TEXT,
  foto_url    TEXT,
  is_pengasuh BOOLEAN NOT NULL DEFAULT false,
  is_aktif    BOOLEAN NOT NULL DEFAULT true,
  urutan      SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── milestone ─────────────────────────────────────────────────────

CREATE TABLE public.milestone (
  id         SERIAL  PRIMARY KEY,
  tahun      SMALLINT NOT NULL,
  judul      TEXT    NOT NULL,
  keterangan TEXT,
  is_aktif   BOOLEAN NOT NULL DEFAULT true,
  urutan     SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── notifikasi ────────────────────────────────────────────────────

CREATE TABLE public.notifikasi (
  id             UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  judul          TEXT  NOT NULL,
  pesan          TEXT,
  tipe           public.notif_type NOT NULL DEFAULT 'sistem',
  target_role    public.user_role,
  target_user_id UUID  REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_dibaca      BOOLEAN NOT NULL DEFAULT false,
  data           JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── log_aktivitas ─────────────────────────────────────────────────

CREATE TABLE public.log_aktivitas (
  id         UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID  REFERENCES public.profiles(id) ON DELETE SET NULL,
  aksi       TEXT  NOT NULL,
  entitas    TEXT,
  entitas_id TEXT,
  detail     JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── pengaturan ────────────────────────────────────────────────────

CREATE TABLE public.pengaturan (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── laporan_masalah ───────────────────────────────────────────────

CREATE TABLE public.laporan_masalah (
  id         UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  nama       TEXT  NOT NULL,
  email      TEXT  NOT NULL,
  judul      TEXT  NOT NULL,
  detail     TEXT,
  status     TEXT  NOT NULL DEFAULT 'menunggu',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER laporan_masalah_set_updated_at
  BEFORE UPDATE ON public.laporan_masalah
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- 4. INDEXES
-- ═══════════════════════════════════════════════════════════════════

CREATE INDEX idx_profiles_role            ON public.profiles(role);
CREATE INDEX idx_profiles_status          ON public.profiles(status);
CREATE INDEX idx_alumni_profiles_user     ON public.alumni_profiles(user_id);
CREATE INDEX idx_alumni_profiles_angkatan ON public.alumni_profiles(angkatan_id);
CREATE INDEX idx_berita_slug              ON public.berita(slug);
CREATE INDEX idx_berita_status            ON public.berita(status);
CREATE INDEX idx_berita_published_at      ON public.berita(published_at DESC);
CREATE INDEX idx_agenda_tanggal           ON public.agenda(tanggal_mulai);
CREATE INDEX idx_agenda_aktif             ON public.agenda(is_aktif);
CREATE INDEX idx_lowongan_aktif           ON public.lowongan(is_aktif);
CREATE INDEX idx_notifikasi_target        ON public.notifikasi(target_user_id);
CREATE INDEX idx_log_user                 ON public.log_aktivitas(user_id);
CREATE INDEX idx_log_created              ON public.log_aktivitas(created_at DESC);
CREATE INDEX idx_keahlian_alumni          ON public.keahlian_alumni(alumni_id);
CREATE INDEX idx_bahasa_alumni            ON public.bahasa_alumni(alumni_id);
CREATE INDEX idx_lembaga_alumni           ON public.lembaga_alumni(alumni_id);
CREATE INDEX idx_berkas_alumni            ON public.berkas_alumni(alumni_id);
CREATE INDEX idx_dokver_user              ON public.dokumen_verifikasi(user_id);
CREATE INDEX idx_komentar_berita          ON public.komentar_berita(berita_id);
CREATE INDEX idx_komentar_user            ON public.komentar_berita(user_id);
CREATE INDEX idx_log_aktivitas_created_at ON public.log_aktivitas(created_at);

-- ═══════════════════════════════════════════════════════════════════
-- 5. TRIGGER FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

-- ── Auto-buat profile saat user baru mendaftar ────────────────────
-- (dengan email, auto_verify dari pengaturan, ON CONFLICT DO NOTHING)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  meta        JSONB   := NEW.raw_user_meta_data;
  cfg_raw     TEXT;
  cfg         JSONB;
  auto_verify BOOLEAN := false;
BEGIN
  BEGIN
    SELECT value INTO cfg_raw FROM public.pengaturan WHERE key = 'site_config';
    IF cfg_raw IS NOT NULL THEN
      cfg         := cfg_raw::jsonb;
      auto_verify := COALESCE((cfg->>'verifikasiOtomatis')::boolean, false);
    END IF;
  EXCEPTION WHEN others THEN
    auto_verify := false;
  END;

  INSERT INTO public.profiles (
    id, email, nama_lengkap, no_hp, angkatan,
    tempat_lahir, tanggal_lahir, domisili, bidang, alamat_lengkap,
    status, role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(meta->>'nama_lengkap', NEW.email),
    meta->>'no_hp',
    CASE WHEN meta->>'angkatan' IS NOT NULL THEN (meta->>'angkatan')::SMALLINT ELSE NULL END,
    meta->>'tempat_lahir',
    CASE WHEN meta->>'tanggal_lahir' IS NOT NULL THEN (meta->>'tanggal_lahir')::DATE ELSE NULL END,
    meta->>'domisili',
    meta->>'bidang',
    meta->>'alamat_lengkap',
    CASE WHEN auto_verify THEN 'disetujui'::public.verification_status ELSE 'menunggu'::public.verification_status END,
    CASE WHEN auto_verify THEN 'alumni'::public.user_role ELSE 'user'::public.user_role END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Sinkronisasi email jika user ubah email di Supabase Auth ──────

CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_email_sync ON auth.users;
CREATE TRIGGER on_auth_email_sync
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_email();

-- ── Auto-hapus dokumen verifikasi setelah alumni disetujui ────────

CREATE OR REPLACE FUNCTION public.handle_alumni_verified()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'disetujui' AND OLD.status != 'disetujui' THEN
    DELETE FROM public.dokumen_verifikasi WHERE user_id = NEW.id AND auto_hapus = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_alumni_verified
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (NEW.status = 'disetujui' AND OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.handle_alumni_verified();

-- ── Generate id_alumni (format DM-YYYY-NNN) ───────────────────────

CREATE OR REPLACE FUNCTION public.generate_id_alumni(p_user_id UUID)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_tahun INTEGER;
  v_seq   INTEGER;
BEGIN
  SELECT angkatan INTO v_tahun FROM public.profiles WHERE id = p_user_id;
  IF v_tahun IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.id_alumni_seq (tahun, last_seq)
  VALUES (v_tahun, 1)
  ON CONFLICT (tahun) DO UPDATE SET last_seq = id_alumni_seq.last_seq + 1
  RETURNING last_seq INTO v_seq;

  RETURN 'DM-' || v_tahun::TEXT || '-' || LPAD(v_seq::TEXT, 3, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_set_id_alumni()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_ap_id    UUID;
  v_existing TEXT;
  v_new_id   TEXT;
BEGIN
  IF NOT (
    (NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'disetujui')
    OR (NEW.angkatan IS DISTINCT FROM OLD.angkatan AND NEW.status = 'disetujui')
  ) THEN RETURN NEW; END IF;

  SELECT id, id_alumni INTO v_ap_id, v_existing
  FROM public.alumni_profiles WHERE user_id = NEW.id;

  IF v_ap_id IS NULL THEN RETURN NEW; END IF;

  IF NEW.angkatan IS DISTINCT FROM OLD.angkatan AND v_existing IS NOT NULL THEN
    UPDATE public.alumni_profiles SET id_alumni = NULL WHERE id = v_ap_id;
    v_existing := NULL;
  END IF;

  IF v_existing IS NULL THEN
    v_new_id := public.generate_id_alumni(NEW.id);
    IF v_new_id IS NOT NULL THEN
      UPDATE public.alumni_profiles SET id_alumni = v_new_id WHERE id = v_ap_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_id_alumni ON public.profiles;
CREATE TRIGGER trg_set_id_alumni
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_set_id_alumni();

-- ── Hapus user dari auth.users (admin only) ───────────────────────

CREATE OR REPLACE FUNCTION public.delete_auth_user(user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  IF NOT public.is_admin_or_above() THEN RAISE EXCEPTION 'Access denied'; END IF;
  DELETE FROM public.profiles WHERE id = user_id;
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- ── Auto-isi ip_address di log_aktivitas ──────────────────────────

CREATE OR REPLACE FUNCTION public.fill_log_ip()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE hdrs json; ip text;
BEGIN
  BEGIN
    hdrs := current_setting('request.headers', true)::json;
    ip   := COALESCE(hdrs->>'x-forwarded-for', hdrs->>'x-real-ip', inet_client_addr()::text);
    ip   := trim(split_part(ip, ',', 1));
  EXCEPTION WHEN OTHERS THEN ip := NULL; END;
  NEW.ip_address := ip;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_fill_log_ip ON public.log_aktivitas;
CREATE TRIGGER trg_fill_log_ip
  BEFORE INSERT ON public.log_aktivitas
  FOR EACH ROW EXECUTE FUNCTION public.fill_log_ip();

-- ── Auto-bersihkan log_aktivitas (maks 500 baris) ─────────────────

CREATE OR REPLACE FUNCTION public.auto_cleanup_log_aktivitas()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.log_aktivitas
  WHERE id IN (SELECT id FROM public.log_aktivitas ORDER BY created_at DESC OFFSET 500);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_cleanup_log_aktivitas ON public.log_aktivitas;
CREATE TRIGGER trg_auto_cleanup_log_aktivitas
  AFTER INSERT ON public.log_aktivitas
  FOR EACH STATEMENT EXECUTE FUNCTION public.auto_cleanup_log_aktivitas();

-- ═══════════════════════════════════════════════════════════════════
-- 6. ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.angkatan             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendidikan           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pekerjaan            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sertifikasi          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publikasi            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keahlian_alumni      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bahasa_alumni        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lembaga_alumni       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berkas_alumni        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_organisasi    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dokumen_verifikasi   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_alumni_seq        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.komentar_berita      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lowongan             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisasi           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimoni            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pimpinan             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guru                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifikasi           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_aktivitas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaturan           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan_masalah      ENABLE ROW LEVEL SECURITY;

-- ── profiles ──────────────────────────────────────────────────────

CREATE POLICY "profiles: baca sendiri"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin_or_above());

CREATE POLICY "profiles: update sendiri"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin_or_above());

CREATE POLICY "profiles: hapus super_admin"
  ON public.profiles FOR DELETE
  USING (public.is_super_admin());

-- ── angkatan ──────────────────────────────────────────────────────

CREATE POLICY "angkatan: publik bisa baca"
  ON public.angkatan FOR SELECT USING (true);

CREATE POLICY "angkatan: admin bisa kelola"
  ON public.angkatan FOR ALL USING (public.is_admin_or_above());

-- ── alumni_profiles ───────────────────────────────────────────────

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

CREATE POLICY "alumni: update sendiri"
  ON public.alumni_profiles FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin_or_above());

CREATE POLICY "alumni: insert sendiri"
  ON public.alumni_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "alumni: hapus admin"
  ON public.alumni_profiles FOR DELETE
  USING (public.is_admin_or_above());

-- ── pendidikan ────────────────────────────────────────────────────

CREATE POLICY "pendidikan: baca publik"
  ON public.pendidikan FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = pendidikan.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

CREATE POLICY "pendidikan: kelola sendiri"
  ON public.pendidikan FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = pendidikan.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── pekerjaan ─────────────────────────────────────────────────────

CREATE POLICY "pekerjaan: baca publik"
  ON public.pekerjaan FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = pekerjaan.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

CREATE POLICY "pekerjaan: kelola sendiri"
  ON public.pekerjaan FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = pekerjaan.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── sertifikasi ───────────────────────────────────────────────────

CREATE POLICY "sertifikasi: baca publik"
  ON public.sertifikasi FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = sertifikasi.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

CREATE POLICY "sertifikasi: kelola sendiri"
  ON public.sertifikasi FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = sertifikasi.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── publikasi ─────────────────────────────────────────────────────

CREATE POLICY "publikasi: baca publik"
  ON public.publikasi FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = publikasi.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

CREATE POLICY "publikasi: kelola sendiri"
  ON public.publikasi FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = publikasi.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── keahlian_alumni ───────────────────────────────────────────────

CREATE POLICY "keahlian: baca publik"
  ON public.keahlian_alumni FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = keahlian_alumni.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

CREATE POLICY "keahlian: kelola sendiri"
  ON public.keahlian_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = keahlian_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── bahasa_alumni ─────────────────────────────────────────────────

CREATE POLICY "bahasa: baca publik"
  ON public.bahasa_alumni FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = bahasa_alumni.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

CREATE POLICY "bahasa: kelola sendiri"
  ON public.bahasa_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = bahasa_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── lembaga_alumni ────────────────────────────────────────────────

CREATE POLICY "lembaga: baca publik"
  ON public.lembaga_alumni FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = lembaga_alumni.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

CREATE POLICY "lembaga: kelola sendiri"
  ON public.lembaga_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = lembaga_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── berkas_alumni (PRIVATE — hanya pemilik & admin) ───────────────

CREATE POLICY "berkas: baca pemilik atau admin"
  ON public.berkas_alumni FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = berkas_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

CREATE POLICY "berkas: kelola sendiri"
  ON public.berkas_alumni FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = berkas_alumni.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── alumni_organisasi ─────────────────────────────────────────────

CREATE POLICY "alumni_org: baca publik"
  ON public.alumni_organisasi FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.alumni_profiles ap JOIN public.profiles p ON p.id = ap.user_id
      WHERE ap.id = alumni_organisasi.alumni_id
        AND (ap.is_publik = true AND p.status = 'disetujui' OR p.id = auth.uid())
    ) OR public.is_admin_or_above()
  );

CREATE POLICY "alumni_org: kelola sendiri"
  ON public.alumni_organisasi FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.alumni_profiles ap WHERE ap.id = alumni_organisasi.alumni_id AND ap.user_id = auth.uid())
    OR public.is_admin_or_above()
  );

-- ── dokumen_verifikasi ────────────────────────────────────────────

CREATE POLICY "dokumen: lihat sendiri atau admin"
  ON public.dokumen_verifikasi FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin_or_above());

CREATE POLICY "dokumen: upload sendiri"
  ON public.dokumen_verifikasi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dokumen: hapus sendiri"
  ON public.dokumen_verifikasi FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "dokumen: hapus admin"
  ON public.dokumen_verifikasi FOR DELETE
  USING (public.is_admin_or_above());

-- ── id_alumni_seq ─────────────────────────────────────────────────

CREATE POLICY "id_alumni_seq: admin baca"
  ON public.id_alumni_seq FOR SELECT
  USING (public.is_admin_or_above());

-- ── berita ────────────────────────────────────────────────────────

CREATE POLICY "berita: publik baca published"
  ON public.berita FOR SELECT
  USING (status = 'published' OR public.is_editor_or_above());

CREATE POLICY "berita: editor bisa buat"
  ON public.berita FOR INSERT
  WITH CHECK (public.is_editor_or_above());

CREATE POLICY "berita: editor update milik sendiri"
  ON public.berita FOR UPDATE
  USING ((author_id = auth.uid() AND public.is_editor_or_above()) OR public.is_admin_or_above());

CREATE POLICY "berita: admin hapus"
  ON public.berita FOR DELETE
  USING (public.is_admin_or_above());

-- ── komentar_berita ───────────────────────────────────────────────

CREATE POLICY "komentar_berita_select"
  ON public.komentar_berita FOR SELECT
  USING (is_disetujui = true);

CREATE POLICY "komentar_berita_insert"
  ON public.komentar_berita FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND status = 'disetujui' AND is_active = true
    )
  );

CREATE POLICY "komentar_berita_delete_own"
  ON public.komentar_berita FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "komentar_berita_admin"
  ON public.komentar_berita FOR ALL
  USING (public.is_editor_or_above());

-- ── agenda ────────────────────────────────────────────────────────

CREATE POLICY "agenda: publik baca aktif"
  ON public.agenda FOR SELECT
  USING (is_aktif = true OR public.is_editor_or_above());

CREATE POLICY "agenda: editor bisa kelola"
  ON public.agenda FOR ALL
  USING (public.is_editor_or_above());

-- ── galeri ────────────────────────────────────────────────────────

CREATE POLICY "galeri: publik baca aktif"
  ON public.galeri FOR SELECT
  USING (is_aktif = true OR public.is_editor_or_above());

CREATE POLICY "galeri: editor bisa kelola"
  ON public.galeri FOR ALL
  USING (public.is_editor_or_above());

-- ── lowongan ──────────────────────────────────────────────────────

CREATE POLICY "lowongan: publik baca aktif"
  ON public.lowongan FOR SELECT
  USING (is_aktif = true OR public.is_admin_or_above());

CREATE POLICY "lowongan: admin kelola"
  ON public.lowongan FOR ALL
  USING (public.is_admin_or_above());

-- ── organisasi ────────────────────────────────────────────────────

CREATE POLICY "organisasi: publik baca aktif"
  ON public.organisasi FOR SELECT
  USING (is_aktif = true OR public.is_admin_or_above());

CREATE POLICY "organisasi: admin kelola"
  ON public.organisasi FOR ALL
  USING (public.is_admin_or_above());

-- ── testimoni ─────────────────────────────────────────────────────

CREATE POLICY "testimoni: publik baca aktif"
  ON public.testimoni FOR SELECT
  USING (is_aktif = true OR public.is_admin_or_above());

CREATE POLICY "testimoni: admin kelola"
  ON public.testimoni FOR ALL
  USING (public.is_admin_or_above());

-- ── pimpinan ──────────────────────────────────────────────────────

CREATE POLICY "pimpinan: publik baca aktif"
  ON public.pimpinan FOR SELECT
  USING (is_aktif = true OR public.is_admin_or_above());

CREATE POLICY "pimpinan: admin kelola"
  ON public.pimpinan FOR ALL
  USING (public.is_admin_or_above());

-- ── guru ──────────────────────────────────────────────────────────

CREATE POLICY "guru: publik bisa baca"
  ON public.guru FOR SELECT USING (true);

CREATE POLICY "guru: admin bisa kelola"
  ON public.guru FOR ALL
  USING (public.is_admin_or_above()) WITH CHECK (public.is_admin_or_above());

-- ── milestone ─────────────────────────────────────────────────────

CREATE POLICY "milestone: publik bisa baca"
  ON public.milestone FOR SELECT USING (true);

CREATE POLICY "milestone: admin bisa kelola"
  ON public.milestone FOR ALL
  USING (public.is_admin_or_above()) WITH CHECK (public.is_admin_or_above());

-- ── notifikasi ────────────────────────────────────────────────────
-- (versi terbaru — alumni bisa menerima notifikasi bertarget role)

CREATE POLICY "notif: lihat milik sendiri"
  ON public.notifikasi FOR SELECT
  USING (
    target_user_id = auth.uid()
    OR (
      target_user_id IS NULL AND target_role IS NULL
      AND public.is_editor_or_above()
    )
    OR (
      target_user_id IS NULL AND target_role IS NOT NULL
      AND auth.uid() IS NOT NULL
      AND target_role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "notif: admin buat"
  ON public.notifikasi FOR INSERT
  WITH CHECK (public.is_admin_or_above());

CREATE POLICY "notif: update dibaca sendiri"
  ON public.notifikasi FOR UPDATE
  USING (
    target_user_id = auth.uid()
    OR (
      target_role IS NOT NULL AND auth.uid() IS NOT NULL
      AND target_role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    )
    OR public.is_admin_or_above()
  );

CREATE POLICY "notif: admin hapus"
  ON public.notifikasi FOR DELETE
  USING (public.is_admin_or_above());

-- ── log_aktivitas ─────────────────────────────────────────────────

CREATE POLICY "log: admin bisa baca"
  ON public.log_aktivitas FOR SELECT
  USING (public.is_admin_or_above());

CREATE POLICY "log: editor insert"
  ON public.log_aktivitas FOR INSERT
  WITH CHECK (public.is_editor_or_above());

-- ── pengaturan ────────────────────────────────────────────────────

CREATE POLICY "pengaturan: publik bisa baca"
  ON public.pengaturan FOR SELECT USING (true);

CREATE POLICY "pengaturan: admin bisa kelola"
  ON public.pengaturan FOR ALL
  USING (public.is_admin_or_above()) WITH CHECK (public.is_admin_or_above());

-- ── laporan_masalah ───────────────────────────────────────────────

CREATE POLICY "laporan: siapa pun bisa kirim"
  ON public.laporan_masalah FOR INSERT
  WITH CHECK (true);

CREATE POLICY "laporan: admin bisa kelola"
  ON public.laporan_masalah FOR ALL
  USING (public.is_admin_or_above());

-- ═══════════════════════════════════════════════════════════════════
-- 7. GRANT PERMISSIONS
-- ═══════════════════════════════════════════════════════════════════

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL    ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

-- ═══════════════════════════════════════════════════════════════════
-- 8. STORAGE BUCKETS
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('alumni-photos', 'alumni-photos', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public=EXCLUDED.public, file_size_limit=EXCLUDED.file_size_limit, allowed_mime_types=EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('berita-images', 'berita-images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public=EXCLUDED.public, file_size_limit=EXCLUDED.file_size_limit, allowed_mime_types=EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('galeri-images', 'galeri-images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public=EXCLUDED.public, file_size_limit=EXCLUDED.file_size_limit, allowed_mime_types=EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', false, 2097152, ARRAY['image/jpeg','image/webp'])
ON CONFLICT (id) DO UPDATE SET public=EXCLUDED.public, file_size_limit=EXCLUDED.file_size_limit, allowed_mime_types=EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('berkas-alumni', 'berkas-alumni', false, 5242880, ARRAY['application/pdf','image/jpeg','image/webp'])
ON CONFLICT (id) DO UPDATE SET public=EXCLUDED.public, file_size_limit=EXCLUDED.file_size_limit, allowed_mime_types=EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-assets', 'site-assets', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public=EXCLUDED.public, file_size_limit=EXCLUDED.file_size_limit, allowed_mime_types=EXCLUDED.allowed_mime_types;

-- ═══════════════════════════════════════════════════════════════════
-- 9. STORAGE POLICIES
-- ═══════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "alumni-photos: baca publik"           ON storage.objects;
DROP POLICY IF EXISTS "alumni-photos: alumni upload sendiri" ON storage.objects;
DROP POLICY IF EXISTS "alumni-photos: alumni update sendiri" ON storage.objects;
DROP POLICY IF EXISTS "alumni-photos: alumni hapus sendiri"  ON storage.objects;
DROP POLICY IF EXISTS "berita-images: baca publik"           ON storage.objects;
DROP POLICY IF EXISTS "berita-images: editor upload"         ON storage.objects;
DROP POLICY IF EXISTS "berita-images: editor hapus"          ON storage.objects;
DROP POLICY IF EXISTS "galeri-images: baca publik"           ON storage.objects;
DROP POLICY IF EXISTS "galeri-images: editor upload"         ON storage.objects;
DROP POLICY IF EXISTS "galeri-images: editor hapus"          ON storage.objects;
DROP POLICY IF EXISTS "documents: baca sendiri atau admin"   ON storage.objects;
DROP POLICY IF EXISTS "documents: user upload sendiri"       ON storage.objects;
DROP POLICY IF EXISTS "documents: user update sendiri"       ON storage.objects;
DROP POLICY IF EXISTS "documents: user hapus sendiri"        ON storage.objects;
DROP POLICY IF EXISTS "documents: admin hapus"               ON storage.objects;
DROP POLICY IF EXISTS "berkas-alumni: baca sendiri atau admin" ON storage.objects;
DROP POLICY IF EXISTS "berkas-alumni: alumni upload sendiri" ON storage.objects;
DROP POLICY IF EXISTS "berkas-alumni: alumni hapus sendiri"  ON storage.objects;
DROP POLICY IF EXISTS "site-assets: baca publik"             ON storage.objects;
DROP POLICY IF EXISTS "site-assets: admin upload"            ON storage.objects;
DROP POLICY IF EXISTS "site-assets: admin hapus"             ON storage.objects;

-- alumni-photos
CREATE POLICY "alumni-photos: baca publik" ON storage.objects FOR SELECT USING (bucket_id='alumni-photos');
CREATE POLICY "alumni-photos: alumni upload sendiri" ON storage.objects FOR INSERT WITH CHECK (bucket_id='alumni-photos' AND auth.uid()::text=(storage.foldername(name))[1]);
CREATE POLICY "alumni-photos: alumni update sendiri" ON storage.objects FOR UPDATE USING (bucket_id='alumni-photos' AND auth.uid()::text=(storage.foldername(name))[1]) WITH CHECK (bucket_id='alumni-photos' AND auth.uid()::text=(storage.foldername(name))[1]);
CREATE POLICY "alumni-photos: alumni hapus sendiri" ON storage.objects FOR DELETE USING (bucket_id='alumni-photos' AND auth.uid()::text=(storage.foldername(name))[1]);

-- berita-images
CREATE POLICY "berita-images: baca publik" ON storage.objects FOR SELECT USING (bucket_id='berita-images');
CREATE POLICY "berita-images: editor upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id='berita-images' AND public.is_editor_or_above());
CREATE POLICY "berita-images: editor hapus" ON storage.objects FOR DELETE USING (bucket_id='berita-images' AND public.is_editor_or_above());

-- galeri-images
CREATE POLICY "galeri-images: baca publik" ON storage.objects FOR SELECT USING (bucket_id='galeri-images');
CREATE POLICY "galeri-images: editor upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id='galeri-images' AND public.is_editor_or_above());
CREATE POLICY "galeri-images: editor hapus" ON storage.objects FOR DELETE USING (bucket_id='galeri-images' AND public.is_editor_or_above());

-- documents (PRIVATE)
CREATE POLICY "documents: baca sendiri atau admin" ON storage.objects FOR SELECT USING (bucket_id='documents' AND (auth.uid()::text=(storage.foldername(name))[1] OR public.is_admin_or_above()));
CREATE POLICY "documents: user upload sendiri" ON storage.objects FOR INSERT WITH CHECK (bucket_id='documents' AND auth.uid()::text=(storage.foldername(name))[1]);
CREATE POLICY "documents: user update sendiri" ON storage.objects FOR UPDATE USING (bucket_id='documents' AND auth.uid()::text=(storage.foldername(name))[1]) WITH CHECK (bucket_id='documents' AND auth.uid()::text=(storage.foldername(name))[1]);
CREATE POLICY "documents: user hapus sendiri" ON storage.objects FOR DELETE USING (bucket_id='documents' AND auth.uid()::text=(storage.foldername(name))[1]);
CREATE POLICY "documents: admin hapus" ON storage.objects FOR DELETE USING (bucket_id='documents' AND public.is_admin_or_above());

-- berkas-alumni (PRIVATE)
CREATE POLICY "berkas-alumni: baca sendiri atau admin" ON storage.objects FOR SELECT USING (bucket_id='berkas-alumni' AND (auth.uid()::text=(storage.foldername(name))[1] OR public.is_admin_or_above()));
CREATE POLICY "berkas-alumni: alumni upload sendiri" ON storage.objects FOR INSERT WITH CHECK (bucket_id='berkas-alumni' AND auth.uid()::text=(storage.foldername(name))[1]);
CREATE POLICY "berkas-alumni: alumni hapus sendiri" ON storage.objects FOR DELETE USING (bucket_id='berkas-alumni' AND (auth.uid()::text=(storage.foldername(name))[1] OR public.is_admin_or_above()));

-- site-assets
CREATE POLICY "site-assets: baca publik" ON storage.objects FOR SELECT USING (bucket_id='site-assets');
CREATE POLICY "site-assets: admin upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id='site-assets' AND public.is_admin_or_above());
CREATE POLICY "site-assets: admin hapus" ON storage.objects FOR DELETE USING (bucket_id='site-assets' AND public.is_admin_or_above());

-- ═══════════════════════════════════════════════════════════════════
-- 10. SEED DATA
-- ═══════════════════════════════════════════════════════════════════

-- ── Angkatan (lulusan pertama 2006) ───────────────────────────────

INSERT INTO public.angkatan (tahun_masuk, tahun_lulus, nama_angkatan) VALUES
  (2002,2006,'Angkatan 1 — Perintis'), (2003,2007,'Angkatan 2'),
  (2004,2008,'Angkatan 3'),            (2005,2009,'Angkatan 4'),
  (2006,2010,'Angkatan 5'),            (2007,2011,'Angkatan 6'),
  (2008,2012,'Angkatan 7'),            (2009,2013,'Angkatan 8'),
  (2010,2014,'Angkatan 9'),            (2011,2015,'Angkatan 10'),
  (2012,2016,'Angkatan 11'),           (2013,2017,'Angkatan 12'),
  (2014,2018,'Angkatan 13'),           (2015,2019,'Angkatan 14'),
  (2016,2020,'Angkatan 15'),           (2017,2021,'Angkatan 16'),
  (2018,2022,'Angkatan 17'),           (2019,2023,'Angkatan 18'),
  (2020,2024,'Angkatan 19'),           (2021,2025,'Angkatan 20');

-- ── Pimpinan ──────────────────────────────────────────────────────

INSERT INTO public.pimpinan (nama, gelar, jabatan, pesan, urutan, is_aktif) VALUES
  ('KH. Mustopa Mughni', 'MA.', 'Pengasuh Pondok Pesantren',
   'Jadilah alumni yang membawa manfaat bagi umat dan bangsa. Ilmu yang kalian peroleh di sini adalah amanah yang harus diteruskan, bukan sekadar bekal untuk diri sendiri.',
   1, true);

-- ── Testimoni ─────────────────────────────────────────────────────

INSERT INTO public.testimoni (nama, angkatan, jabatan, isi, urutan, is_aktif) VALUES
  ('Ahmad Fauzi','Angkatan 5 (2010)','Software Engineer di Tokopedia',
   'Nilai-nilai keislaman dan kedisiplinan yang ditanamkan Daarul Mughni menjadi fondasi karir saya. Portal ini memudahkan saya terhubung kembali dengan kawan-kawan lama.',
   1, true),
  ('Siti Maryam','Angkatan 8 (2013)','Dokter Umum RS Cipto Mangunkusumo',
   'Pondok mengajarkan saya untuk tidak pernah berhenti belajar. Senang sekali ada wadah resmi seperti ini untuk alumni Daarul Mughni.',
   2, true),
  ('Rizky Pratama','Angkatan 12 (2017)','Pengusaha & Founder Startup EdTech',
   'Portal alumni ini bukan hanya tempat nostalgia, tapi juga jembatan peluang. Saya sudah merekrut 3 alumni lewat fitur karir di sini!',
   3, true);

-- ── Organisasi ────────────────────────────────────────────────────

INSERT INTO public.organisasi (nama, kategori, tahun_berdiri, is_aktif) VALUES
  ('Ikatan Alumni Daarul Mughni (IADM)', 'Induk Organisasi Alumni', 2008, true),
  ('Forum Alumni Daarul Mughni Jabodetabek', 'Regional', 2012, true),
  ('Komunitas Alumni IT Daarul Mughni', 'Profesional', 2018, true),
  ('Forum Wirausaha Alumni Daarul Mughni', 'Profesional', 2019, true);

-- ── Pengaturan Situs ──────────────────────────────────────────────

INSERT INTO public.pengaturan (key, value)
VALUES (
  'site_config',
  '{"namaSite":"Portal Alumni Daarul Mughni Al Maaliki","deskripsiSite":"Wadah silaturahmi dan pengembangan alumni Pondok Pesantren Modern Perpaduan Daarul Mughni Al Maaliki.","emailKontak":"ppdaaarulmughni@gmail.com","telepon":"(021) 2921 9666","alamat":"Jl. Klapanunggal Kp. Cibeber II Ds. Cikahuripan Kec. Klapanunggal Kabupaten Bogor Jawa Barat 16710","verifikasiOtomatis":false}'
)
ON CONFLICT (key) DO NOTHING;

-- =====================================================================
-- SELESAI — Database siap digunakan
-- =====================================================================
