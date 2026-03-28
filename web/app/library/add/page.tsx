'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ── 8 old-money color swatches (per D-07, D-08, UI-SPEC) ─────────
const COVER_COLORS = [
  { label: 'Parchment',    hex: '#F5F0E8' },
  { label: 'Forest Green', hex: '#2D4A3E' },
  { label: 'Burgundy',     hex: '#8B1A1A' },
  { label: 'Navy',         hex: '#0B3D91' },
  { label: 'Aged Gold',    hex: '#D4AF37' },
  { label: 'Charcoal',     hex: '#2C2C2C' },
  { label: 'Rust',         hex: '#A0522D' },
  { label: 'Cream',        hex: '#F5E6D3' },
]

export default function AddBookPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle]           = useState('')
  const [author, setAuthor]         = useState('')
  const [coverColor, setCoverColor] = useState<string | null>(null)
  const [notes, setNotes]           = useState('')
  const [titleError, setTitleError]   = useState('')
  const [authorError, setAuthorError] = useState('')
  const [colorError, setColorError]   = useState('')
  const [saveError, setSaveError]     = useState('')
  const [saving, setSaving]           = useState(false)

  const validate = (): boolean => {
    let valid = true
    if (!title.trim()) {
      setTitleError('Title is required')
      valid = false
    } else {
      setTitleError('')
    }
    if (!author.trim()) {
      setAuthorError('Author is required')
      valid = false
    } else {
      setAuthorError('')
    }
    if (!coverColor) {
      setColorError('Cover color is required')
      valid = false
    } else {
      setColorError('')
    }
    return valid
  }

  const handleSave = async () => {
    if (!validate()) return

    setSaving(true)
    setSaveError('')

    // Get current user for user_id
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      setSaveError('Failed to save. Please try again.')
      setSaving(false)
      return
    }

    // Determine position: fetch max position for user's library books, add 1
    const { data: existingBooks } = await supabase
      .from('books')
      .select('position')
      .eq('is_wishlist', false)
      .order('position', { ascending: false })
      .limit(1)

    const maxPosition =
      existingBooks && existingBooks.length > 0
        ? (existingBooks[0].position as number)
        : 0
    const newPosition = maxPosition + 1

    const { error } = await supabase.from('books').insert({
      user_id: user.id,
      title: title.trim(),
      author: author.trim(),
      cover_color: coverColor!,
      notes: notes.trim() || null,
      position: newPosition,
      is_wishlist: false,
    })

    setSaving(false)

    if (error) {
      setSaveError('Failed to save. Please try again.')
      return
    }

    // Success: navigate back to library — SSR re-fetch will show the new book (BOOK-02)
    router.push('/library')
  }

  const handleCancel = () => {
    router.push('/library')
  }

  return (
    <main className="min-h-screen bg-parchment">
      <div className="px-md py-lg">

        {/* Page heading */}
        <h1
          className="font-georgia mb-xl"
          style={{ fontSize: '48px', fontWeight: 700, lineHeight: '1.0', color: '#222222' }}
        >
          Add Book
        </h1>

        {/* Form container: max-width 600px, centered */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

          {/* Supabase save error */}
          {saveError && (
            <p
              className="font-georgia mb-md"
              style={{ color: '#8B1A1A', fontSize: '13px', lineHeight: '1.4' }}
              role="alert"
            >
              {saveError}
            </p>
          )}

          {/* ── Title field ─────────────────────────────────── */}
          <div className="mb-md">
            <label
              htmlFor="title"
              className="font-georgia"
              style={{ display: 'block', fontSize: '14px', lineHeight: '1.4', color: '#222222', marginBottom: '8px' }}
            >
              Title <span aria-hidden="true">*</span>
            </label>
            {titleError && (
              <p
                className="font-georgia"
                style={{ color: '#8B1A1A', fontSize: '13px', lineHeight: '1.4', marginBottom: '4px' }}
                role="alert"
              >
                {titleError}
              </p>
            )}
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-required="true"
              aria-invalid={!!titleError}
              className="w-full font-georgia bg-parchment"
              style={{
                height: '52px',
                padding: '0 16px',
                border: titleError ? '2px solid #8B1A1A' : '2px solid #000000',
                fontSize: '16px',
                lineHeight: '1.5',
                color: '#222222',
                outline: 'none',
              }}
              onFocus={(e) => { if (!titleError) e.target.style.border = '2px solid #D4AF37' }}
              onBlur={(e)  => { if (!titleError) e.target.style.border = '2px solid #000000' }}
            />
          </div>

          {/* ── Author field ────────────────────────────────── */}
          <div className="mb-md">
            <label
              htmlFor="author"
              className="font-georgia"
              style={{ display: 'block', fontSize: '14px', lineHeight: '1.4', color: '#222222', marginBottom: '8px' }}
            >
              Author <span aria-hidden="true">*</span>
            </label>
            {authorError && (
              <p
                className="font-georgia"
                style={{ color: '#8B1A1A', fontSize: '13px', lineHeight: '1.4', marginBottom: '4px' }}
                role="alert"
              >
                {authorError}
              </p>
            )}
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              aria-required="true"
              aria-invalid={!!authorError}
              className="w-full font-georgia bg-parchment"
              style={{
                height: '52px',
                padding: '0 16px',
                border: authorError ? '2px solid #8B1A1A' : '2px solid #000000',
                fontSize: '16px',
                lineHeight: '1.5',
                color: '#222222',
                outline: 'none',
              }}
              onFocus={(e) => { if (!authorError) e.target.style.border = '2px solid #D4AF37' }}
              onBlur={(e)  => { if (!authorError) e.target.style.border = '2px solid #000000' }}
            />
          </div>

          {/* ── Cover Color swatch picker ────────────────────── */}
          <div className="mb-md">
            <label
              className="font-georgia"
              style={{ display: 'block', fontSize: '14px', lineHeight: '1.4', color: '#222222', marginBottom: '8px' }}
            >
              Cover Color <span aria-hidden="true">*</span>
            </label>
            {colorError && (
              <p
                className="font-georgia"
                style={{ color: '#8B1A1A', fontSize: '13px', lineHeight: '1.4', marginBottom: '4px' }}
                role="alert"
              >
                {colorError}
              </p>
            )}
            {/* 4-column grid of 56×56px swatches, 8px gap — per UI-SPEC */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 56px)',
                gap: '8px',
              }}
              role="radiogroup"
              aria-label="Cover color"
            >
              {COVER_COLORS.map(({ label, hex }) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={label}
                  aria-pressed={coverColor === hex}
                  onClick={() => { setCoverColor(hex); setColorError('') }}
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: hex,
                    // Selected: 2px gold border (#D4AF37); unselected: 2px black border (#000000) — per UI-SPEC
                    border: coverColor === hex ? '2px solid #D4AF37' : '2px solid #000000',
                    cursor: 'pointer',
                    outline: coverColor === hex ? '2px solid #D4AF37' : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Notes textarea ───────────────────────────────── */}
          <div className="mb-lg">
            <label
              htmlFor="notes"
              className="font-georgia"
              style={{ display: 'block', fontSize: '14px', lineHeight: '1.4', color: '#222222', marginBottom: '8px' }}
            >
              Notes <span style={{ color: '#666666' }}>(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full font-georgia bg-parchment"
              style={{
                padding: '16px',
                border: '2px solid #000000',
                fontSize: '16px',
                lineHeight: '1.5',
                color: '#222222',
                resize: 'vertical',
                minHeight: '52px',
                outline: 'none',
              }}
              onFocus={(e) => { e.target.style.border = '2px solid #D4AF37' }}
              onBlur={(e)  => { e.target.style.border = '2px solid #000000' }}
            />
          </div>

          {/* ── Button group ─────────────────────────────────── */}
          {/* "Save Book" (primary, aged gold) + "Cancel" (secondary, parchment) side-by-side — per UI-SPEC */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="font-georgia"
              style={{
                flex: 1,
                height: '52px',
                backgroundColor: saving ? 'rgba(212, 175, 55, 0.5)' : '#D4AF37',
                border: '2px solid #000000',
                fontSize: '16px',
                lineHeight: '1.5',
                color: '#222222',
                cursor: saving ? 'not-allowed' : 'pointer',
                letterSpacing: '1px',
                opacity: saving ? 0.5 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Book'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="font-georgia"
              style={{
                flex: 1,
                height: '52px',
                backgroundColor: '#F5F0E8',
                border: '2px solid #000000',
                fontSize: '16px',
                lineHeight: '1.5',
                color: '#222222',
                cursor: saving ? 'not-allowed' : 'pointer',
                letterSpacing: '1px',
              }}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}
