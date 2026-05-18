-- ── 1. Auto-isi ip_address dari request headers PostgREST ─────────────────────
-- Supabase meneruskan header client (x-forwarded-for) ke dalam trigger via
-- current_setting('request.headers'). Trigger ini mengisi kolom ip_address
-- otomatis sehingga logAksi.js tidak perlu ubah apapun.

CREATE OR REPLACE FUNCTION fill_log_ip()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  hdrs  json;
  ip    text;
BEGIN
  BEGIN
    hdrs := current_setting('request.headers', true)::json;
    ip   := COALESCE(
              hdrs->>'x-forwarded-for',
              hdrs->>'x-real-ip',
              inet_client_addr()::text
            );
    -- x-forwarded-for bisa berisi list "IP1, IP2, ..." — ambil yang pertama
    ip := trim(split_part(ip, ',', 1));
  EXCEPTION WHEN OTHERS THEN
    ip := NULL;
  END;
  NEW.ip_address := ip;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_fill_log_ip ON log_aktivitas;
CREATE TRIGGER trg_fill_log_ip
  BEFORE INSERT ON log_aktivitas
  FOR EACH ROW
  EXECUTE FUNCTION fill_log_ip();

-- ── 2. Batasi tabel log_aktivitas ke maksimal 500 baris terbaru ────────────────
-- Triggered setiap kali ada insert baru (FOR EACH STATEMENT = efisien)

CREATE INDEX IF NOT EXISTS idx_log_aktivitas_created_at ON log_aktivitas(created_at);

CREATE OR REPLACE FUNCTION auto_cleanup_log_aktivitas()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Hapus semua baris kecuali 500 terbaru
  DELETE FROM log_aktivitas
  WHERE id IN (
    SELECT id FROM log_aktivitas
    ORDER BY created_at DESC
    OFFSET 500
  );
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_cleanup_log_aktivitas ON log_aktivitas;
CREATE TRIGGER trg_auto_cleanup_log_aktivitas
  AFTER INSERT ON log_aktivitas
  FOR EACH STATEMENT
  EXECUTE FUNCTION auto_cleanup_log_aktivitas();
