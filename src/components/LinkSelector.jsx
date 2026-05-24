import { useState } from 'react'
import { Button } from './ui/Button'
import { X, Link2 } from 'lucide-react'

export function LinkSelector({ currentNoteId, notes, linkedIds, onLink, onClose }) {
  const [search, setSearch] = useState('')

  const candidates = notes.filter(
    (n) =>
      n.id !== currentNoteId &&
      !linkedIds.includes(n.id) &&
      n.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <span className="text-sm font-medium text-stone-700 flex items-center gap-2">
          <Link2 className="size-4 text-emerald-600" />
          Lier à une note
        </span>
        <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
          <X className="size-4" />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-stone-100">
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="w-full text-sm bg-stone-50 rounded-lg px-3 py-1.5 outline-none
                     border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <ul className="max-h-52 overflow-y-auto divide-y divide-stone-50">
        {candidates.length === 0 ? (
          <li className="px-4 py-3 text-sm text-stone-400 text-center">
            Aucune note disponible
          </li>
        ) : (
          candidates.map((note) => (
            <li key={note.id}>
              <button
                onClick={() => onLink(note.id)}
                className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors"
              >
                <p className="text-sm text-stone-800 line-clamp-2">{note.content}</p>
                {note.category && (
                  <span className="mt-1 inline-block text-xs text-emerald-600">
                    {note.category}
                  </span>
                )}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
