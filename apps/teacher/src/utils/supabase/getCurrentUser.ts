import { createClient } from './server'
import { Database } from './database.types'

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const { data, error } = await supabase.from('users').select('*').eq('id', authUser.id).single()

  if (error) {
    console.error(error)
    return null
  }

  return data as Database['public']['Tables']['users']['Row']
}
