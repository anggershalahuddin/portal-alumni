-- Migration 20: Fix id_alumni — anti-collision + regenerasi saat angkatan diubah

-- 1. Perbaiki generate_id_alumni: pakai MAX nomor urut, bukan COUNT
--    → mencegah duplikat jika ada ID yang pernah dihapus atau dipindah tahun
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

  -- MAX dari nomor urut yang sudah ada untuk tahun ini
  SELECT COALESCE(
    MAX(CAST(SPLIT_PART(id_alumni, '-', 3) AS INTEGER)), 0
  ) + 1 INTO v_seq
  FROM public.alumni_profiles
  WHERE id_alumni ~ ('^DM-' || v_tahun::TEXT || '-[0-9]+$');

  RETURN 'DM-' || v_tahun::TEXT || '-' || LPAD(v_seq::TEXT, 3, '0');
END;
$$;

-- 2. Update trigger function: tangani dua kasus
--    a) status berubah ke 'disetujui'  → generate ID baru
--    b) angkatan diubah + status sudah 'disetujui' → reset & regenerasi
CREATE OR REPLACE FUNCTION public.handle_set_id_alumni()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ap_id    UUID;
  v_existing TEXT;
  v_new_id   TEXT;
BEGIN
  IF NOT (
    (NEW.status IS DISTINCT FROM OLD.status AND NEW.status = 'disetujui')
    OR
    (NEW.angkatan IS DISTINCT FROM OLD.angkatan AND NEW.status = 'disetujui')
  ) THEN
    RETURN NEW;
  END IF;

  SELECT id, id_alumni INTO v_ap_id, v_existing
  FROM public.alumni_profiles
  WHERE user_id = NEW.id;

  IF v_ap_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Jika angkatan berubah, hapus ID lama agar bisa di-generate ulang
  IF NEW.angkatan IS DISTINCT FROM OLD.angkatan AND v_existing IS NOT NULL THEN
    UPDATE public.alumni_profiles SET id_alumni = NULL WHERE id = v_ap_id;
    v_existing := NULL;
  END IF;

  -- Generate ID baru jika belum ada
  IF v_existing IS NULL THEN
    v_new_id := public.generate_id_alumni(NEW.id);
    IF v_new_id IS NOT NULL THEN
      UPDATE public.alumni_profiles SET id_alumni = v_new_id WHERE id = v_ap_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger sudah terpasang dari migration 19, tidak perlu dibuat ulang
-- (REPLACE FUNCTION di atas sudah memperbarui logikanya)
