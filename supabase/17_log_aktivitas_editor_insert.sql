-- Migration: izinkan editor+ INSERT ke log_aktivitas
-- Sebelumnya hanya is_admin_or_above() yang bisa insert,
-- sehingga aksi dari editor tidak tercatat.

DROP POLICY IF EXISTS "log: service role insert" ON public.log_aktivitas;

CREATE POLICY "log: editor insert"
  ON public.log_aktivitas FOR INSERT
  WITH CHECK (public.is_editor_or_above());
