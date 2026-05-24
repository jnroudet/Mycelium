import { supabase } from './supabase'

export async function categorizeNote(content) {
  const { data, error } = await supabase.functions.invoke('categorize-note', {
    body: { content },
  })

  if (error) throw new Error(error.message)
  return data
}
