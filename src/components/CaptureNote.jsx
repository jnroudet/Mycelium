import { useState, useRef } from 'react'
import { Button } from './ui/Button'
import { NoteCard } from './NoteCard'
import { CategoryConfirmation } from './CategoryConfirmation'
import { useNotes } from '../hooks/useNotes'
import { categorizeNote } from '../lib/api'
import { Loader2, Send } from 'lucide-react'

const CAPTURE_STATES = {
  IDLE: 'idle',
  CATEGORIZING: 'categorizing',
  CONFIRMING: 'confirming',
  SAVING: 'saving',
}

export function CaptureNote() {
  const [content, setContent] = useState('')
  const [state, setState] = useState(CAPTURE_STATES.IDLE)
  const [suggestion, setSuggestion] = useState(null)
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)

  const { notes, loading: notesLoading, createNote, deleteNote } = useNotes()

  const isProcessing = state === CAPTURE_STATES.CATEGORIZING || state === CAPTURE_STATES.SAVING

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || isProcessing) return

    setError(null)
    setState(CAPTURE_STATES.CATEGORIZING)

    try {
      const result = await categorizeNote(trimmed)
      setSuggestion(result)
      setState(CAPTURE_STATES.CONFIRMING)
    } catch (err) {
      setError('Impossible de contacter l\'IA. Réessaie ou sauvegarde sans catégorie.')
      setState(CAPTURE_STATES.IDLE)
    }
  }

  async function handleSaveWithoutCategory() {
    const trimmed = content.trim()
    if (!trimmed) return
    setState(CAPTURE_STATES.SAVING)
    try {
      await createNote({ content: trimmed, category: null })
      setContent('')
      setState(CAPTURE_STATES.IDLE)
      textareaRef.current?.focus()
    } catch (err) {
      setError('Erreur lors de la sauvegarde.')
      setState(CAPTURE_STATES.IDLE)
    }
  }

  async function handleConfirmCategory(category) {
    const trimmed = content.trim()
    setState(CAPTURE_STATES.SAVING)
    setError(null)
    try {
      await createNote({ content: trimmed, category })
      setContent('')
      setSuggestion(null)
      setState(CAPTURE_STATES.IDLE)
      textareaRef.current?.focus()
    } catch (err) {
      setError('Erreur lors de la sauvegarde.')
      setState(CAPTURE_STATES.IDLE)
    }
  }

  function handleCancelCategory() {
    setSuggestion(null)
    setState(CAPTURE_STATES.IDLE)
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur border-b border-stone-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-stone-900 tracking-tight">
          🍄 Mycelium
        </h1>
      </header>

      <main className="flex-1 px-4 py-4 space-y-3 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Capture une idée, une pensée, un lien…"
            rows={4}
            disabled={isProcessing || state === CAPTURE_STATES.CONFIRMING}
            className="w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3
                       text-base text-stone-900 placeholder:text-stone-400 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       disabled:opacity-60 transition-all"
          />

          {error && (
            <p className="text-sm text-red-600 px-1">{error}</p>
          )}

          {state === CAPTURE_STATES.CONFIRMING && suggestion ? (
            <CategoryConfirmation
              suggestion={suggestion}
              onConfirm={handleConfirmCategory}
              onCancel={handleCancelCategory}
            />
          ) : (
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!content.trim() || isProcessing}
                className="flex-1"
              >
                {state === CAPTURE_STATES.CATEGORIZING ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Analyse en cours…
                  </>
                ) : state === CAPTURE_STATES.SAVING ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sauvegarde…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Capturer
                  </>
                )}
              </Button>
              {content.trim() && state === CAPTURE_STATES.IDLE && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveWithoutCategory}
                >
                  Sans catégorie
                </Button>
              )}
            </div>
          )}
        </form>

        <section className="space-y-2 pt-2">
          {notesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-stone-400" />
            </div>
          ) : notes.length === 0 ? (
            <p className="text-center text-sm text-stone-400 py-8">
              Tes notes apparaîtront ici.
            </p>
          ) : (
            notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={deleteNote} />
            ))
          )}
        </section>
      </main>
    </div>
  )
}
