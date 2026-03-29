'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { consumeShelfFeedback } from '@/lib/flash-feedback'
import { createClient } from '@/lib/supabase/client'
import { fetchLibraryBooks } from '@/lib/books'
import type { Book } from '@/types/book'
import EmptyShelf from '@/components/libm/EmptyShelf'
import IconButton from '@/components/libm/IconButton'
import { LogoutIcon, PlusIcon } from '@/components/libm/Icons'
import PrimaryButton from '@/components/libm/PrimaryButton'
import ReorderableBookGrid from '@/components/libm/ReorderableBookGrid'
import ShelfSkeleton from '@/components/libm/ShelfSkeleton'
import ToastMessage from '@/components/libm/ToastMessage'
import TopNavBar from '@/components/libm/TopNavBar'

export default function LibraryScreen() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [highlightedBookId, setHighlightedBookId] = useState<string | null>(null)

  useEffect(() => {
    const feedback = consumeShelfFeedback()
    if (feedback?.shelf === 'library') {
      setToastMessage(feedback.toast)
      setHighlightedBookId(feedback.highlightBookId ?? null)
    }
  }, [])

  useEffect(() => {
    if (!highlightedBookId) {
      return
    }

    const timeout = window.setTimeout(() => setHighlightedBookId(null), 2600)
    return () => window.clearTimeout(timeout)
  }, [highlightedBookId])

  async function loadBooks() {
    setLoading(true)
    setError(null)

    try {
      const nextBooks = await fetchLibraryBooks()
      setBooks(nextBooks)
      setLoading(false)
    } catch {
      setError('Error loading books. Please try again.')
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadBooks()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  let body: React.ReactNode
  if (loading) {
    body = <ShelfSkeleton />
  } else if (error) {
    body = (
      <div className="libm-center-state">
        <div className="libm-error-state">
          <p className="libm-error-text">{error}</p>
          <div className="libm-inline-action">
            <PrimaryButton type="button" tone="ghost" onClick={() => void loadBooks()}>
              Retry
            </PrimaryButton>
          </div>
        </div>
      </div>
    )
  } else if (books.length === 0) {
    body = (
      <div className="libm-page-body">
        <EmptyShelf
          title="Your Library is ready"
          description="Start your shared shelf with the books you already own together."
          action={
            <PrimaryButton type="button" onClick={() => router.push('/add-book')}>
              Add your first book
            </PrimaryButton>
          }
        />
      </div>
    )
  } else {
    body = (
      <div className="libm-book-grid-scroll">
        <ReorderableBookGrid books={books} highlightedBookId={highlightedBookId} />
      </div>
    )
  }

  return (
    <main className="libm-screen">
      <TopNavBar
        actions={
          <>
            <IconButton label="Add Book" onClick={() => router.push('/add-book')}>
              <PlusIcon />
            </IconButton>
            <IconButton label="Sign out" onClick={() => void handleSignOut()}>
              <LogoutIcon />
            </IconButton>
          </>
        }
      />
      {body}
      {toastMessage ? (
        <ToastMessage message={toastMessage} onDone={() => setToastMessage(null)} />
      ) : null}
    </main>
  )
}
