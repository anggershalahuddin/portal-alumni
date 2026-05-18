-- Migration: fungsi SECURITY DEFINER untuk hapus user dari auth.users
-- Jalankan di Supabase Dashboard → SQL Editor

CREATE OR REPLACE FUNCTION public.delete_auth_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_admin_or_above() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  -- Hapus profiles dulu (jaga FK constraint)
  DELETE FROM public.profiles WHERE id = user_id;
  -- Hapus dari auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;
