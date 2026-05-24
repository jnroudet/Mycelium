import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useNoteLinks() {
  const [links, setLinks] = useState([])

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    const { data, error } = await supabase
      .from('note_links')
      .select('source_id, target_id, created_at')

    if (!error && data) setLinks(data)
  }

  function getLinkedIds(noteId) {
    return links
      .filter((l) => l.source_id === noteId || l.target_id === noteId)
      .map((l) => (l.source_id === noteId ? l.target_id : l.source_id))
  }

  async function createLink(sourceId, targetId) {
    const [a, b] = [sourceId, targetId].sort()
    const { error } = await supabase
      .from('note_links')
      .insert({ source_id: a, target_id: b })

    if (error) throw new Error(error.message)
    setLinks((prev) => [...prev, { source_id: a, target_id: b }])
  }

  async function deleteLink(sourceId, targetId) {
    const [a, b] = [sourceId, targetId].sort()
    const { error } = await supabase
      .from('note_links')
      .delete()
      .eq('source_id', a)
      .eq('target_id', b)

    if (error) throw new Error(error.message)
    setLinks((prev) =>
      prev.filter((l) => !(l.source_id === a && l.target_id === b))
    )
  }

  function isLinked(idA, idB) {
    const [a, b] = [idA, idB].sort()
    return links.some((l) => l.source_id === a && l.target_id === b)
  }

  return { links, getLinkedIds, createLink, deleteLink, isLinked }
}
