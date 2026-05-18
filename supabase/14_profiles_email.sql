-- Migration: tambah kolom email ke profiles + sinkronisasi otomatis dari auth.users
-- Jalankan di Supabase Dashboard → SQL Editor

-- 1. Tambah kolom email
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Backfill email dari auth.users untuk data yang sudah ada
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- 3. Trigger function: sinkronisasi email saat user baru dibuat / email diubah
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

-- 4. Pasang trigger ke auth.users
DROP TRIGGER IF EXISTS on_auth_email_sync ON auth.users;
CREATE TRIGGER on_auth_email_sync
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_email();
