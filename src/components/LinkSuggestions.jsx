import { Sparkles, Check, X, Loader2 } from 'lucide-react'
import { Button } from './ui/Button'

export function LinkSuggestions({ suggestions, notesById, onAccept, onDismiss, onClose, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 px-4 py-5 flex items-center gap-3">
        <Loader2 className="size-4 animate-spin text-emerald-600 shrink-0" />
        <p className="text-sm text-stone-600">Claude analyse les liens possibles…</p>
      </div>
    )
  }

  if (!suggestions.length) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 flex items-center justify-between gap-3">
        <p className="text-sm text-stone-500">Aucun lien pertinent trouvé.</p>
        <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-100">
        <span className="text-sm font-medium text-stone-700 flex items-center gap-2">
          <Sparkles className="size-4 text-emerald-600" />
          Liens suggérés par Claude
        </span>
        <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
          <X className="size-4" />
        </button>
      </div>

      <ul className="divide-y divide-emerald-100">
        {suggestions.map((s) => {
          const note = notesById[s.id]
          if (!note) return null
          return (
            <li key={s.id} className="px-4 py-3 space-y-1.5">
              <p className="text-sm text-stone-800 line-clamp-2">{note.content}</p>
              <p className="text-xs text-stone-500 italic">"{s.reason}"</p>
              <div className="flex gap-2 pt-0.5">
                <Button variant="primary" className="h-7 text-xs px-3" onClick={() => onAccept(s.id)}>
                  <Check className="size-3" />
                  Lier
                </Button>
                <Button variant="ghost" className="h-7 text-xs px-3" onClick={() => onDismiss(s.id)}>
                  <X className="size-3" />
                  Ignorer
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
