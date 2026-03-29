'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addBook } from '@/lib/books'
import { COVER_SWATCHES } from '@/lib/libm'
import AppBar from '@/components/libm/AppBar'
import ColorPicker from '@/components/libm/ColorPicker'
import IconButton from '@/components/libm/IconButton'
import { BackIcon } from '@/components/libm/Icons'
import PrimaryButton from '@/components/libm/PrimaryButton'
import TextField from '@/components/libm/TextField'

export default function AddBookScreen({ isWishlist }: { isWishlist: boolean }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>(COVER_SWATCHES[1])
  const [loading, setLoading] = useState(false)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [authorError, setAuthorError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  function goBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(isWishlist ? '/wishlist' : '/home')
  }

  async function handleSave() {
    setTitleError(null)
    setAuthorError(null)
    setSaveError(null)

    let hasError = false
    if (title.trim().length === 0) {
      setTitleError('Title is required')
      hasError = true
    }
    if (author.trim().length === 0) {
      setAuthorError('Author is required')
      hasError = true
    }
    if (hasError) {
      return
    }

    setLoading(true)

    try {
      await addBook({
        title,
        author,
        coverColor: selectedColor,
        notes,
        isWishlist,
      })
      goBack()
    } catch {
      setSaveError('Error saving book. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="libm-screen">
      <AppBar
        title={isWishlist ? 'Add to Wishlist' : 'Add Book'}
        leading={
          <IconButton label="Back" onClick={goBack}>
            <BackIcon />
          </IconButton>
        }
      />
      <div className="libm-page-body">
        <div style={{ height: 16 }} />
        <TextField label="Title" value={title} onChange={setTitle} error={titleError} />
        <TextField
          label="Author"
          value={author}
          onChange={setAuthor}
          error={authorError}
        />
        <ColorPicker selectedColor={selectedColor} onColorChanged={setSelectedColor} />
        <TextField
          label="Notes (optional)"
          value={notes}
          onChange={setNotes}
          multiline
          rows={4}
        />
        {saveError ? (
          <p className="libm-error-text" style={{ marginTop: 8 }}>
            {saveError}
          </p>
        ) : null}
        <div style={{ marginTop: 24 }}>
          <PrimaryButton type="button" loading={loading} onClick={() => void handleSave()}>
            Save Book
          </PrimaryButton>
        </div>
      </div>
    </main>
  )
}
