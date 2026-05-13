# Supabase Setup — Portal Alumni Daarul Mughni

## Urutan Eksekusi

Jalankan file SQL berikut secara berurutan di **Supabase Dashboard → SQL Editor**:

| File | Isi |
|------|-----|
| `01_schema.sql` | Semua tabel, enum, trigger, index |
| `02_rls.sql` | Helper functions + Row Level Security policies |
| `03_storage.sql` | Storage buckets & policies |
| `04_seed.sql` | Data awal: angkatan, pimpinan, testimoni |

---

## Struktur Tabel

```
auth.users (Supabase built-in)
    │
    └── profiles (role, status verifikasi, foto)
            │
            └── alumni_profiles (profil lengkap alumni)
                    ├── pendidikan       (riwayat pendidikan)
                    ├── pekerjaan        (riwayat karir)
                    ├── sertifikasi
                    └── publikasi

angkatan              ← referensi tahun masuk/lulus
dokumen_verifikasi    ← KTP, ijazah, foto (private bucket)

berita                ← konten, author FK → profiles
agenda                ← kegiatan, organizer FK → profiles
galeri                ← foto dokumentasi
lowongan              ← info karir
organisasi            ← lembaga/komunitas alumni
testimoni             ← untuk landing page
pimpinan              ← untuk landing page

notifikasi            ← per-user atau per-role
log_aktivitas         ← audit trail admin
```

---

## Hak Akses per Role

| Fitur | Super Admin | Admin | Editor | Alumni | Publik |
|-------|:-----------:|:-----:|:------:|:------:|:------:|
| Lihat direktori alumni (terverifikasi) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kelola profil sendiri | ✅ | ✅ | ✅ | ✅ | — |
| Verifikasi alumni | ✅ | ✅ | — | — | — |
| Kelola berita/agenda/galeri | ✅ | ✅ | ✅ | — | — |
| Kelola lowongan/organisasi | ✅ | ✅ | — | — | — |
| Manajemen User & Roles | ✅ | — | — | — | — |
| Pengaturan sistem | ✅ | — | — | — | — |
| Lihat log aktivitas | ✅ | ✅ | — | — | — |

---

## Storage Buckets

| Bucket | Akses | Ukuran max | Tipe file |
|--------|-------|-----------|-----------|
| `alumni-photos` | Public read | 5 MB | JPEG, PNG, WebP |
| `berita-images` | Public read | 10 MB | JPEG, PNG, WebP |
| `galeri-images` | Public read | 10 MB | JPEG, PNG, WebP |
| `documents` | **Private** | 10 MB | JPEG, PNG, WebP, PDF |
| `site-assets` | Public read | 10 MB | JPEG, PNG, WebP, SVG |

Folder struktur upload: `{bucket}/{user_id}/{filename}`

---

## Environment Variables

Tambahkan ke `.env.local` (jangan commit file ini!):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## Langkah Selanjutnya

1. Buat project di [supabase.com](https://supabase.com)
2. Jalankan 4 file SQL di atas (urut)
3. Copy URL + anon key ke `.env.local`
4. Install Supabase JS client: `npm install @supabase/supabase-js`
5. Buat `src/lib/supabase.js` dan mulai integrasikan auth
