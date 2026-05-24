import { useState } from 'react'
import { Card, CardBody } from './ui/Card'
import { Badge } from './ui/Badge'
import { LinkSelector } from './LinkSelector'
import { LinkSuggestions } from './LinkSuggestions'
import { Trash2, Link2, Sparkles, X } from 'lucide-react'
import { suggestLinks } from '../lib/api'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const PANEL = { NONE: 'none', LINK: 'link', SUGGEST: 'suggest' }

export function NoteCard({ note, allNotes, linkedIds, notesById, onDelete, onLink, onUnlink }) {
  const [activePanel, setActivePanel] = useState(PANEL.NONE)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [dismissedIds, setDismissedIds] = useState([])

  function togglePanel(panel) {
    setActivePanel((prev) => (prev === panel ? PANEL.NONE : panel))
  }

  async function handleSuggest() {
    if (activePanel === PANEL.SUGGEST) {
      setActivePanel(PANEL.NONE)
      return
    }
    setActivePanel(PANEL.SUGGEST)
    setSuggestions([])
    setDismissedIds([])
    setLoadingSuggest(true)

    try {
      const candidates = allNotes
        .filter((n) => n.id !== note.id && !linkedIds.includes(n.id))
      const result = await suggestLinks(note.content, candidates)
      setSuggestions(result.links ?? [])
    } catch {
      setSuggestions([])
    } finally {
      setLoadingSuggest(false)
    }
  }

  function handleAcceptSuggestion(targetId) {
    onLink(note.id, targetId)
    setSuggestions((prev) => prev.filter((s) => s.id !== targetId))
  }

  function handleDismiss(targetId) {
    setDismissedIds((prev) => [...prev, targetId])
    setSuggestions((prev) => prev.filter((s) => s.id !== targetId))
  }

  const visibleLinkedIds = linkedIds.filter((id) => notesById[id])

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardBody className="space-y-3">
        <p className="text-sm leading-relaxed text-stone-800 whitespace-pre-wrap">
          {note.content}
        </p>

        {visibleLinkedIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleLinkedIds.map((id) => {
              const linked = notesById[id]
              return (
                <span
                  key={id}
                  className="group/chip inline-flex items-center gap-1 rounded-full
                             bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600
                             border border-stone-200"
                >
                  <Link2 className="size-2.5 text-stone-400" />
                  <span className="max-w-[120px] truncate">{linked.content}</span>
                  <button
                    onClick={() => onUnlink(note.id, id)}
                    className="ml-0.5 text-stone-300 hover:text-red-400 transition-colors"
                  >
                    <X className="size-2.5" />
                  </button>
                </span>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {note.category && <Badge>{note.category}</Badge>}
            <span className="text-xs text-stone-400">{formatDate(note.created_at)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => togglePanel(PANEL.LINK)}
              className={`p-1.5 rounded-lg transition-colors ${
                activePanel === PANEL.LINK
                  ? 'bg-stone-100 text-stone-700'
                  : 'text-stone-300 hover:text-stone-600 hover:bg-stone-50'
              }`}
              aria-label="Lier à une note"
            >
              <Link2 className="size-3.5" />
            </button>
            <button
              onClick={handleSuggest}
              className={`p-1.5 rounded-lg transition-colors ${
                activePanel === PANEL.SUGGEST
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-stone-300 hover:text-emerald-500 hover:bg-emerald-50'
              }`}
              aria-label="Suggestions IA"
            >
              <Sparkles className="size-3.5" />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => { onDelete(note.id); setConfirmDelete(false) }}
                  className="rounded px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded px-2 py-0.5 text-xs text-stone-500 hover:bg-stone-100"
                >
                  Non
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50
                           rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {activePanel === PANEL.LINK && (
          <LinkSelector
            currentNoteId={note.id}
            notes={allNotes}
            linkedIds={linkedIds}
            onLink={(targetId) => {
              onLink(note.id, targetId)
              setActivePanel(PANEL.NONE)
            }}
            onClose={() => setActivePanel(PANEL.NONE)}
          />
        )}

        {activePanel === PANEL.SUGGEST && (
          <LinkSuggestions
            suggestions={suggestions}
            notesById={notesById}
            loading={loadingSuggest}
            onAccept={handleAcceptSuggestion}
            onDismiss={handleDismiss}
            onClose={() => setActivePanel(PANEL.NONE)}
          />
        )}
      </CardBody>
    </Card>
  )
}
