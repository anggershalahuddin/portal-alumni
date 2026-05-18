-- Migration 21: sequence table untuk id_alumni — nomor tidak pernah dipakai ulang
-- Sebelumnya pakai MAX() → kalau ID dihapus/pindah tahun, nomor bisa dipakai ulang
-- Solusi: tabel id_alumni_seq yang hanya naik, tidak pernah turun

-- 1. Tabel sequence per tahun lulus
CREATE TABLE IF NOT EXISTS public.id_alumni_seq (
  tahun    INTEGER PRIMARY KEY,
  last_seq INTEGER NOT NULL DEFAULT 0
);

-- RLS: admin bisa baca, hanya SECURITY DEFINER function yang boleh tulis
ALTER TABLE public.id_alumni_seq ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "id_alumni_seq: admin baca" ON public.id_alumni_seq;
CREATE POLICY "id_alumni_seq: admin baca"
  ON public.id_alumni_seq FOR SELECT
  USING (public.is_admin_or_above());

-- 2. Ganti generate_id_alumni: pakai sequence table (atomic increment)
CREATE OR REPLACE FUNCTION public.generate_id_alumni(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tahun INTEGER;
  v_seq   INTEGER;
BEGIN
  SELECT angkatan INTO v_tahun
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_tahun IS NULL THEN
    RETURN NULL;
  END IF;

  -- Atomic upsert: jika tahun belum ada, mulai dari 1; jika ada, naikkan +1
  -- Nomor ini TIDAK PERNAH dikembalikan meski ID-nya nanti dihapus/pindah tahun
  INSERT INTO public.id_alumni_seq (tahun, last_seq)
  VALUES (v_tahun, 1)
  ON CONFLICT (tahun) DO UPDATE
    SET last_seq = id_alumni_seq.last_seq + 1
  RETURNING last_seq INTO v_seq;

  RETURN 'DM-' || v_tahun::TEXT || '-' || LPAD(v_seq::TEXT, 3, '0');
END;
$$;

-- 3. Sinkronisasi: isi id_alumni_seq dari data yang sudah ada
--    Agar sequence tidak bentrok dengan ID lama yang sudah ada sebelum migration ini
INSERT INTO public.id_alumni_seq (tahun, last_seq)
SELECT
  CAST(SPLIT_PART(id_alumni, '-', 2) AS INTEGER)                       AS tahun,
  MAX(CAST(SPLIT_PART(id_alumni, '-', 3) AS INTEGER))                  AS last_seq
FROM public.alumni_profiles
WHERE id_alumni ~ '^DM-[0-9]{4}-[0-9]+$'
GROUP BY CAST(SPLIT_PART(id_alumni, '-', 2) AS INTEGER)
ON CONFLICT (tahun) DO UPDATE
  SET last_seq = GREATEST(id_alumni_seq.last_seq, EXCLUDED.last_seq);
