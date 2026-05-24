import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setNotes(data)
    setLoading(false)
  }

  async function createNote({ content, category }) {
    const { data, error } = await supabase
      .from('notes')
      .insert({ content, category })
      .select()
      .single()

    if (error) throw new Error(error.message)
    setNotes((prev) => [data, ...prev])
    return data
  }

  async function deleteNote(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return { notes, loading, createNote, deleteNote, refetch: fetchNotes }
}
