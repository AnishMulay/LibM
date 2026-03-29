'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { moveToLibrary } from '@/lib/books'
import { normalizeHexColor } from '@/lib/libm'
import type { Book } from '@/types/book'
import AppBar from '@/components/libm/AppBar'
import IconButton from '@/components/libm/IconButton'
import { BackIcon } from '@/components/libm/Icons'
import PrimaryButton from '@/components/libm/PrimaryButton'

export default function BookDetailScreen({ book }: { book: Book }) {
  const router = useRouter()
  const [moving, setMoving] = useState(false)
  const [moveError, setMoveError] = useState<string | null>(null)

  function goBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(book.isWishlist ? '/wishlist' : '/home')
  }

  async function handleMoveToLibrary() {
    setMoving(true)
    setMoveError(null)

    try {
      await moveToLibrary(book.id)
      goBack()
    } catch {
      setMoving(false)
      setMoveError('Error moving book to library. Please try again.')
    }
  }

  return (
    <main className="libm-screen">
      <AppBar
        title=""
        leading={
          <IconButton label="Back" onClick={goBack}>
            <BackIcon />
          </IconButton>
        }
      />
      <div className="libm-detail-scroll">
        <div style={{ height: 24 }} />
        <div
          className="libm-cover-block"
          style={{ backgroundColor: normalizeHexColor(book.coverColor, '#2D4A3E') }}
        />
        <div style={{ height: 16 }} />
        <h1 className="libm-heading">{book.title}</h1>
        <div style={{ height: 16 }} />
        <p className="libm-body-text">{book.author}</p>
        {book.notes ? (
          <div className="libm-detail-notes">
            <p className="libm-label">Notes</p>
            <div style={{ height: 8 }} />
            <p className="libm-body-text">{book.notes}</p>
          </div>
        ) : null}
        <div style={{ height: 24 }} />
        {book.isWishlist ? (
          <>
            {moveError ? <p className="libm-error-text">{moveError}</p> : null}
            <PrimaryButton
              type="button"
              tone="burgundy"
              loading={moving}
              onClick={() => void handleMoveToLibrary()}
            >
              Move to Library
            </PrimaryButton>
            <div style={{ height: 24 }} />
          </>
        ) : null}
      </div>
    </main>
  )
}
