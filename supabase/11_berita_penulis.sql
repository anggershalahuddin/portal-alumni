-- Migration: add penulis column to berita table
ALTER TABLE public.berita
  ADD COLUMN IF NOT EXISTS penulis TEXT;
