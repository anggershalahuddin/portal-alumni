-- Migration: auto-generate id_alumni format DM-YYYY-NNN
-- DM   = Daarul Mughni (tetap)
-- YYYY = tahun lulus (profiles.angkatan)
-- NNN  = urutan pendaftaran dalam tahun tsb (001, 002, ...)

-- 1. Function: generate id_alumni untuk user tertentu
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

  -- Hitung ID yang sudah ada untuk tahun ini → seq = jumlah + 1
  SELECT COUNT(*) + 1 INTO v_seq
  FROM public.alumni_profiles
  WHERE id_alumni LIKE 'DM-' || v_tahun::TEXT || '-%';

  RETURN 'DM-' || v_tahun::TEXT || '-' || LPAD(v_seq::TEXT, 3, '0');
END;
$$;

-- 2. Trigger function: jalankan saat profiles.status berubah menjadi 'disetujui'
CREATE OR REPLACE FUNCTION public.handle_set_id_alumni()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ap_id     UUID;
  v_existing  TEXT;
  v_new_id    TEXT;
BEGIN
  -- Hanya proses saat status baru = 'disetujui' dan status lama berbeda
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'disetujui' THEN
    SELECT id, id_alumni INTO v_ap_id, v_existing
    FROM public.alumni_profiles
    WHERE user_id = NEW.id;

    -- Hanya generate kalau alumni_profiles ada dan id_alumni belum di-set
    IF v_ap_id IS NOT NULL AND v_existing IS NULL THEN
      v_new_id := public.generate_id_alumni(NEW.id);
      IF v_new_id IS NOT NULL THEN
        UPDATE public.alumni_profiles
        SET id_alumni = v_new_id
        WHERE id = v_ap_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Pasang trigger di tabel profiles
DROP TRIGGER IF EXISTS trg_set_id_alumni ON public.profiles;
CREATE TRIGGER trg_set_id_alumni
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_set_id_alumni();
