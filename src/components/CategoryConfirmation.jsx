import { useState } from 'react'
import { Card, CardBody } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Sparkles, Check, Pencil, X } from 'lucide-react'

export function CategoryConfirmation({ suggestion, onConfirm, onCancel }) {
  const [editing, setEditing] = useState(false)
  const [customCategory, setCustomCategory] = useState(suggestion.category)

  function handleConfirm() {
    onConfirm(editing ? customCategory.trim() : suggestion.category)
  }

  return (
    <Card className="border-emerald-200 bg-emerald-50/40">
      <CardBody className="space-y-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <p className="text-sm text-stone-700">
            <span className="font-medium text-stone-900">Catégorie proposée</span>
            {' '}&mdash; {suggestion.reason}
          </p>
        </div>

        {editing ? (
          <input
            autoFocus
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm
                       text-stone-900 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Modifier la catégorie…"
          />
        ) : (
          <div className="flex items-center gap-2">
            <Badge className="text-sm px-3 py-1">{suggestion.category}</Badge>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Modifier"
            >
              <Pencil className="size-3.5" />
            </button>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button onClick={handleConfirm} className="flex-1">
            <Check className="size-4" />
            Valider
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            <X className="size-4" />
            Annuler
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
