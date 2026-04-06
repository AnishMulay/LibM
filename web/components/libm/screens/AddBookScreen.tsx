'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addBook, updateBook } from '@/lib/books'
import { setShelfFeedback } from '@/lib/flash-feedback'
import { COVER_SWATCHES } from '@/lib/libm'
import type { Book } from '@/types/book'
import AppBar from '@/components/libm/AppBar'
import ColorPicker from '@/components/libm/ColorPicker'
import IconButton from '@/components/libm/IconButton'
import { BackIcon } from '@/components/libm/Icons'
import PrimaryButton from '@/components/libm/PrimaryButton'
import TextField from '@/components/libm/TextField'

export default function AddBookScreen({
  isWishlist,
  initialBook,
}: {
  isWishlist: boolean
  initialBook?: Book
}) {
  const router = useRouter()
  const shelfIsWishlist = initialBook?.isWishlist ?? isWishlist
  const isEditing = Boolean(initialBook)
  const [title, setTitle] = useState(initialBook?.title ?? '')
  const [author, setAuthor] = useState(initialBook?.author ?? '')
  const [notes, setNotes] = useState(initialBook?.notes ?? '')
  const [selectedColor, setSelectedColor] = useState<string>(
    initialBook?.coverColor ?? COVER_SWATCHES[1],
  )
  const [loading, setLoading] = useState(false)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [authorError, setAuthorError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  function goBack() {
    if (isEditing && initialBook) {
      router.push(`/book-detail?id=${initialBook.id}`)
      return
    }

    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(shelfIsWishlist ? '/wishlist' : '/home')
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
      if (initialBook) {
        const updatedBook = await updateBook({
          id: initialBook.id,
          title,
          author,
          coverColor: selectedColor,
          notes,
        })
        router.replace(`/book-detail?id=${updatedBook.id}`)
        return
      }

      const newBook = await addBook({
        title,
        author,
        coverColor: selectedColor,
        notes,
        isWishlist: shelfIsWishlist,
      })

      setShelfFeedback({
        shelf: shelfIsWishlist ? 'wishlist' : 'library',
        toast: shelfIsWishlist
          ? 'Book added to your Wishlist'
          : 'Book added to your Library',
        highlightBookId: newBook.id,
      })
      router.push(shelfIsWishlist ? '/wishlist' : '/home')
    } catch (error) {
      console.error('Failed to save book', error)
      setSaveError('Error saving book. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="libm-screen">
      <AppBar
        title={
          isEditing
            ? 'Edit Book'
            : shelfIsWishlist
              ? 'Add to Wishlist'
              : 'Add Book'
        }
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
          <PrimaryButton
            type="button"
            loading={loading}
            loadingText={isEditing ? 'Saving...' : 'Adding...'}
            onClick={() => void handleSave()}
          >
            {isEditing ? 'Save Changes' : 'Save Book'}
          </PrimaryButton>
        </div>
      </div>
    </main>
  )
}
