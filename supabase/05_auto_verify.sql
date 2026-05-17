-- ─────────────────────────────────────────────────────────────────────────────
-- 05_auto_verify.sql
-- Update trigger handle_new_user agar membaca pengaturan verifikasiOtomatis.
-- Jalankan di Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  meta        JSONB    := NEW.raw_user_meta_data;
  cfg_raw     TEXT;
  cfg         JSONB;
  auto_verify BOOLEAN  := false;
BEGIN
  -- Baca pengaturan verifikasiOtomatis dari tabel pengaturan
  BEGIN
    SELECT value INTO cfg_raw
    FROM public.pengaturan
    WHERE key = 'site_config';

    IF cfg_raw IS NOT NULL THEN
      cfg         := cfg_raw::jsonb;
      auto_verify := COALESCE((cfg->>'verifikasiOtomatis')::boolean, false);
    END IF;
  EXCEPTION WHEN others THEN
    auto_verify := false;
  END;

  INSERT INTO public.profiles (
    id, nama_lengkap, no_hp, angkatan,
    tempat_lahir, tanggal_lahir, domisili, bidang, alamat_lengkap,
    status, role
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
    meta->>'alamat_lengkap',
    -- Auto-setujui jika pengaturan verifikasiOtomatis = true
    CASE WHEN auto_verify
         THEN 'disetujui'::public.verification_status
         ELSE 'menunggu'::public.verification_status END,
    CASE WHEN auto_verify
         THEN 'alumni'::public.user_role
         ELSE 'user'::public.user_role END
  );

  RETURN NEW;
END;
$$;
