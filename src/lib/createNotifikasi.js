import { supabase } from './supabase'

export async function createNotifikasi({
  judul, pesan,
  tipe = 'sistem',
  target_role = null,
  target_user_id = null,
  data = null,
}) {
  try {
    await supabase.from('notifikasi').insert({
      judul,
      pesan,
      tipe,
      target_role,
      target_user_id,
      data,
      is_dibaca: false,
    })
  } catch (e) {
    console.warn('[createNotifikasi] failed', e)
  }
}
