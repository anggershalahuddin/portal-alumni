-- =====================================================================
-- Portal Alumni Daarul Mughni — Seed Data
-- File: 04_seed.sql
-- Data awal: angkatan, pimpinan, testimoni
-- =====================================================================

-- ─── ANGKATAN ─────────────────────────────────────────────────────────
-- Daarul Mughni lulusan pertama tahun 2006

INSERT INTO public.angkatan (tahun_masuk, tahun_lulus, nama_angkatan) VALUES
  (2002, 2006, 'Angkatan 1 — Perintis'),
  (2003, 2007, 'Angkatan 2'),
  (2004, 2008, 'Angkatan 3'),
  (2005, 2009, 'Angkatan 4'),
  (2006, 2010, 'Angkatan 5'),
  (2007, 2011, 'Angkatan 6'),
  (2008, 2012, 'Angkatan 7'),
  (2009, 2013, 'Angkatan 8'),
  (2010, 2014, 'Angkatan 9'),
  (2011, 2015, 'Angkatan 10'),
  (2012, 2016, 'Angkatan 11'),
  (2013, 2017, 'Angkatan 12'),
  (2014, 2018, 'Angkatan 13'),
  (2015, 2019, 'Angkatan 14'),
  (2016, 2020, 'Angkatan 15'),
  (2017, 2021, 'Angkatan 16'),
  (2018, 2022, 'Angkatan 17'),
  (2019, 2023, 'Angkatan 18'),
  (2020, 2024, 'Angkatan 19'),
  (2021, 2025, 'Angkatan 20');

-- ─── PIMPINAN ─────────────────────────────────────────────────────────

INSERT INTO public.pimpinan (nama, gelar, jabatan, pesan, urutan, is_aktif) VALUES
  (
    'KH. Mustopa Mughni',
    'MA.',
    'Pengasuh Pondok Pesantren',
    'Jadilah alumni yang membawa manfaat bagi umat dan bangsa. Ilmu yang kalian peroleh di sini adalah amanah yang harus diteruskan, bukan sekadar bekal untuk diri sendiri.',
    1,
    true
  );

-- ─── TESTIMONI ────────────────────────────────────────────────────────

INSERT INTO public.testimoni (nama, angkatan, jabatan, isi, urutan, is_aktif) VALUES
  (
    'Ahmad Fauzi',
    'Angkatan 5 (2010)',
    'Software Engineer di Tokopedia',
    'Nilai-nilai keislaman dan kedisiplinan yang ditanamkan Daarul Mughni menjadi fondasi karir saya. Portal ini memudahkan saya terhubung kembali dengan kawan-kawan lama.',
    1, true
  ),
  (
    'Siti Maryam',
    'Angkatan 8 (2013)',
    'Dokter Umum RS Cipto Mangunkusumo',
    'Pondok mengajarkan saya untuk tidak pernah berhenti belajar. Senang sekali ada wadah resmi seperti ini untuk alumni Daarul Mughni.',
    2, true
  ),
  (
    'Rizky Pratama',
    'Angkatan 12 (2017)',
    'Pengusaha & Founder Startup EdTech',
    'Portal alumni ini bukan hanya tempat nostalgia, tapi juga jembatan peluang. Saya sudah merekrut 3 alumni lewat fitur karir di sini!',
    3, true
  );

-- ─── ORGANISASI ───────────────────────────────────────────────────────

INSERT INTO public.organisasi (nama, kategori, tahun_berdiri, is_aktif) VALUES
  ('Ikatan Alumni Daarul Mughni (IADM)', 'Induk Organisasi Alumni', 2008, true),
  ('Forum Alumni Daarul Mughni Jabodetabek', 'Regional', 2012, true),
  ('Komunitas Alumni IT Daarul Mughni', 'Profesional', 2018, true),
  ('Forum Wirausaha Alumni Daarul Mughni', 'Profesional', 2019, true);
