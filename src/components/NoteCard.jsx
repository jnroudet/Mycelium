import { useState } from 'react'
import { Card, CardBody } from './ui/Card'
import { Badge } from './ui/Badge'
import { Trash2 } from 'lucide-react'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function NoteCard({ note, onDelete }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardBody className="space-y-2">
        <p className="text-sm leading-relaxed text-stone-800 whitespace-pre-wrap">{note.content}</p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            {note.category && <Badge>{note.category}</Badge>}
            <span className="text-xs text-stone-400">{formatDate(note.created_at)}</span>
          </div>
          {confirming ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onDelete(note.id); setConfirming(false) }}
                className="rounded px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Supprimer
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded px-2 py-0.5 text-xs text-stone-500 hover:bg-stone-100"
              >
                Non
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="p-1.5 text-stone-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
              aria-label="Supprimer la note"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
