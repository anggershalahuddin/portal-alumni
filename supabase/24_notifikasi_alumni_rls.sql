-- Perbaiki RLS notifikasi agar alumni bisa menerima & menandai notifikasi
-- yang ditargetkan ke role mereka

-- ── SELECT ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "notif: lihat milik sendiri" ON public.notifikasi;

CREATE POLICY "notif: lihat milik sendiri"
  ON public.notifikasi FOR SELECT
  USING (
    -- 1) Notifikasi personal langsung ke user ini
    target_user_id = auth.uid()
    OR (
      -- 2) Broadcast ke semua admin (target_role = null, target_user_id = null)
      target_user_id IS NULL
      AND target_role IS NULL
      AND public.is_editor_or_above()
    )
    OR (
      -- 3) Notifikasi bertarget role tertentu (termasuk alumni)
      target_user_id IS NULL
      AND target_role IS NOT NULL
      AND auth.uid() IS NOT NULL
      AND target_role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    )
  );

-- ── UPDATE (tandai dibaca) ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "notif: update dibaca sendiri" ON public.notifikasi;

CREATE POLICY "notif: update dibaca sendiri"
  ON public.notifikasi FOR UPDATE
  USING (
    target_user_id = auth.uid()
    OR (
      target_role IS NOT NULL
      AND auth.uid() IS NOT NULL
      AND target_role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    )
    OR public.is_admin_or_above()
  );
