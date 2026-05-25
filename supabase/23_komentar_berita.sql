-- Tabel komentar berita (hanya alumni terverifikasi yang bisa komentar)
CREATE TABLE public.komentar_berita (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  berita_id    UUID        NOT NULL REFERENCES public.berita(id) ON DELETE CASCADE,
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  isi          TEXT        NOT NULL CHECK (char_length(isi) BETWEEN 3 AND 1000),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_disetujui BOOLEAN     NOT NULL DEFAULT true
);

CREATE INDEX ON public.komentar_berita(berita_id);
CREATE INDEX ON public.komentar_berita(user_id);

ALTER TABLE public.komentar_berita ENABLE ROW LEVEL SECURITY;

-- Publik bisa baca komentar yang sudah disetujui
CREATE POLICY "komentar_berita_select" ON public.komentar_berita
  FOR SELECT USING (is_disetujui = true);

-- Alumni terverifikasi bisa insert komentar sendiri
CREATE POLICY "komentar_berita_insert" ON public.komentar_berita
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND status = 'disetujui'
        AND is_active = true
    )
  );

-- Alumni bisa hapus komentar sendiri
CREATE POLICY "komentar_berita_delete_own" ON public.komentar_berita
  FOR DELETE USING (auth.uid() = user_id);

-- Admin / editor bisa kelola semua komentar
CREATE POLICY "komentar_berita_admin" ON public.komentar_berita
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'editor')
    )
  );
