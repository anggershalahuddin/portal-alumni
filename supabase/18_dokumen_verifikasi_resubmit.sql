-- Migration: izinkan alumni replace/hapus dokumen verifikasi miliknya sendiri
-- Dibutuhkan untuk fitur "Ajukan Perbaikan" di VerifikasiStatusPage

-- 1. Bersihkan duplikat dulu (simpan yang paling baru per user_id+jenis)
--    Wajib dilakukan sebelum menambah UNIQUE constraint
DELETE FROM public.dokumen_verifikasi
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, jenis) id
  FROM public.dokumen_verifikasi
  ORDER BY user_id, jenis, created_at DESC
);

-- 2. Tambah unique constraint agar upsert tidak duplikat
ALTER TABLE public.dokumen_verifikasi
  DROP CONSTRAINT IF EXISTS dokumen_verifikasi_user_id_jenis_key;

ALTER TABLE public.dokumen_verifikasi
  ADD CONSTRAINT dokumen_verifikasi_user_id_jenis_key UNIQUE (user_id, jenis);

-- 3. Izinkan pemilik menghapus dokumen verifikasi miliknya sendiri
DROP POLICY IF EXISTS "dokumen: hapus sendiri" ON public.dokumen_verifikasi;
CREATE POLICY "dokumen: hapus sendiri"
  ON public.dokumen_verifikasi FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Storage documents: izinkan user UPDATE (overwrite) file miliknya sendiri
DROP POLICY IF EXISTS "documents: user update sendiri" ON storage.objects;
CREATE POLICY "documents: user update sendiri"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Storage documents: izinkan user DELETE file miliknya sendiri
DROP POLICY IF EXISTS "documents: user hapus sendiri" ON storage.objects;
CREATE POLICY "documents: user hapus sendiri"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
