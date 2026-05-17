-- Migration: add rich fields to agenda table
ALTER TABLE public.agenda
  ADD COLUMN IF NOT EXISTS maps_url             TEXT,
  ADD COLUMN IF NOT EXISTS pembicara            JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status_pendaftaran   TEXT,
  ADD COLUMN IF NOT EXISTS htm                  TEXT,
  ADD COLUMN IF NOT EXISTS has_sertifikat       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_by         TEXT,
  ADD COLUMN IF NOT EXISTS image_hero           TEXT,
  ADD COLUMN IF NOT EXISTS pamflet_url          TEXT;
