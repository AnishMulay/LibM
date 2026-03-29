'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteBook, moveToLibrary, moveToWishlist } from '@/lib/books'
import { setShelfFeedback } from '@/lib/flash-feedback'
import { normalizeHexColor } from '@/lib/libm'
import type { Book } from '@/types/book'
import AppBar from '@/components/libm/AppBar'
import ConfirmDialog from '@/components/libm/ConfirmDialog'
import IconButton from '@/components/libm/IconButton'
import { BackIcon } from '@/components/libm/Icons'
import PrimaryButton from '@/components/libm/PrimaryButton'

export default function BookDetailScreen({ book }: { book: Book }) {
  const router = useRouter()
  const [movingTarget, setMovingTarget] = useState<'library' | 'wishlist' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const shelfPath = book.isWishlist ? '/wishlist' : '/home'

  function goBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(shelfPath)
  }

  async function handleMove(target: 'library' | 'wishlist') {
    setMovingTarget(target)
    setActionError(null)

    try {
      if (target === 'library') {
        await moveToLibrary(book.id)
        setShelfFeedback({
          shelf: 'library',
          toast: 'Moved to Library',
          highlightBookId: book.id,
        })
        router.push('/home')
        return
      }

      await moveToWishlist(book.id)
      setShelfFeedback({
        shelf: 'wishlist',
        toast: 'Moved to Wishlist',
        highlightBookId: book.id,
      })
      router.push('/wishlist')
    } catch {
      setMovingTarget(null)
      setActionError(
        target === 'library'
          ? 'Error moving book to library. Please try again.'
          : 'Error moving book to wishlist. Please try again.',
      )
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)

    try {
      await deleteBook(book.id)
      setShelfFeedback({
        shelf: book.isWishlist ? 'wishlist' : 'library',
        toast: 'Book removed',
      })
      router.push(shelfPath)
    } catch {
      setDeleting(false)
      setDeleteError('Could not remove this book. Please try again.')
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
        {actionError ? <p className="libm-error-text">{actionError}</p> : null}
        <div className="libm-detail-actions">
          <PrimaryButton
            type="button"
            onClick={() => router.push(`/add-book?id=${book.id}`)}
            disabled={Boolean(movingTarget) || deleting}
          >
            Edit Book
          </PrimaryButton>
          {book.isWishlist ? (
            <PrimaryButton
              type="button"
              tone="burgundy"
              loading={movingTarget === 'library'}
              loadingText="Moving..."
              disabled={Boolean(movingTarget && movingTarget !== 'library') || deleting}
              onClick={() => void handleMove('library')}
            >
              Move to Library
            </PrimaryButton>
          ) : (
            <PrimaryButton
              type="button"
              tone="burgundy"
              loading={movingTarget === 'wishlist'}
              loadingText="Moving..."
              disabled={Boolean(movingTarget && movingTarget !== 'wishlist') || deleting}
              onClick={() => void handleMove('wishlist')}
            >
              Move to Wishlist
            </PrimaryButton>
          )}
          <PrimaryButton
            type="button"
            tone="ghost"
            className="libm-danger-button"
            disabled={Boolean(movingTarget) || deleting}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Book
          </PrimaryButton>
        </div>
        <div style={{ height: 24 }} />
      </div>
      {showDeleteDialog ? (
        <ConfirmDialog
          title="Remove this book?"
          message="Are you sure you want to remove this book? This cannot be undone."
          confirmLabel="Delete Book"
          error={deleteError}
          loading={deleting}
          onCancel={() => {
            if (deleting) {
              return
            }
            setDeleteError(null)
            setShowDeleteDialog(false)
          }}
          onConfirm={() => void handleDelete()}
        />
      ) : null}
    </main>
  )
}
