-- ─────────────────────────────────────────────────────────────────────────────
-- 08_pengaturan_access.sql
-- Izinkan anon (pengunjung publik) membaca tabel pengaturan agar
-- SiteConfigContext bisa load site_config tanpa login.
-- Jalankan di Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────────────────────

-- Aktifkan RLS
ALTER TABLE public.pengaturan ENABLE ROW LEVEL SECURITY;

-- Siapa pun (termasuk pengunjung tanpa login) boleh baca
CREATE POLICY "pengaturan_select_public"
  ON public.pengaturan FOR SELECT
  USING (true);

-- Hanya user yang sudah login yang boleh ubah
CREATE POLICY "pengaturan_write_authenticated"
  ON public.pengaturan FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed nilai awal agar langsung tersedia (upsert aman dijalankan berulang)
INSERT INTO public.pengaturan (key, value)
VALUES (
  'site_config',
  '{"namaSite":"Portal Alumni Daarul Mughni Al Maaliki","deskripsiSite":"Wadah silaturahmi dan pengembangan alumni Pondok Pesantren Modern Perpaduan Daarul Mughni Al Maaliki.","emailKontak":"ppdaaarulmughni@gmail.com","telepon":"(021) 2921 9666","alamat":"Jl. Klapanunggal Kp. Cibeber II Ds. Cikahuripan Kec. Klapanunggal Kabupaten Bogor Jawa Barat 16710","verifikasiOtomatis":false}'
)
ON CONFLICT (key) DO NOTHING;
