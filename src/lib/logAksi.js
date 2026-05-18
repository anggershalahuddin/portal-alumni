import { supabase } from './supabase'

export async function logAksi({ aksi, entitas = null, entitas_id = null, detail = null, user_id = null }) {
  try {
    await supabase.from('log_aktivitas').insert({
      aksi,
      entitas,
      entitas_id: entitas_id != null ? String(entitas_id) : null,
      detail,
      user_id: user_id ?? null,
    })
  } catch (e) {
    console.warn('[logAksi] failed', e)
  }
}
