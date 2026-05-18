-- Migration: fix email tidak tersimpan di profiles
--
-- Root cause: on_auth_email_sync trigger (migration 14) fires BEFORE
-- on_auth_user_created trigger karena PostgreSQL mengurutkan AFTER triggers
-- secara alfabetis ('e' < 'u'). Saat on_auth_email_sync jalan, profile belum
-- dibuat, sehingga UPDATE tidak menemukan baris dan email tidak tersimpan.
--
-- Fix: masukkan email langsung di INSERT dalam handle_new_user, sehingga tidak
-- bergantung pada urutan trigger.

-- 1. Update fungsi handle_new_user agar langsung isi kolom email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  meta JSONB := NEW.raw_user_meta_data;
BEGIN
  INSERT INTO public.profiles (
    id, email, nama_lengkap, no_hp, angkatan,
    tempat_lahir, tanggal_lahir, domisili, bidang, alamat_lengkap
  )
  VALUES (
    NEW.id,
    NEW.email,
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
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2. Backfill email untuk profiles yang masih kosong (termasuk user lama)
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
  AND (p.email IS NULL OR p.email = '');
