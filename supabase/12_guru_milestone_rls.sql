-- Migration: enable RLS + policies for guru, milestone, pengaturan
-- Jalankan di Supabase Dashboard → SQL Editor

ALTER TABLE public.guru        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaturan  ENABLE ROW LEVEL SECURITY;

-- Guru
CREATE POLICY "guru: publik bisa baca"
  ON public.guru FOR SELECT USING (true);

CREATE POLICY "guru: admin bisa kelola"
  ON public.guru FOR ALL
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- Milestone
CREATE POLICY "milestone: publik bisa baca"
  ON public.milestone FOR SELECT USING (true);

CREATE POLICY "milestone: admin bisa kelola"
  ON public.milestone FOR ALL
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- Pengaturan (visi misi, tentang kami, dll.)
CREATE POLICY "pengaturan: publik bisa baca"
  ON public.pengaturan FOR SELECT USING (true);

CREATE POLICY "pengaturan: admin bisa kelola"
  ON public.pengaturan FOR ALL
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());
