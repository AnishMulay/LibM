'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { consumeShelfFeedback } from '@/lib/flash-feedback'
import { createClient } from '@/lib/supabase/client'
import { fetchWishlistBooks, getSignedInUserId } from '@/lib/books'
import { HER_UID } from '@/lib/libm'
import type { Book } from '@/types/book'
import EmptyShelf from '@/components/libm/EmptyShelf'
import IconButton from '@/components/libm/IconButton'
import { LogoutIcon, PlusIcon } from '@/components/libm/Icons'
import PrimaryButton from '@/components/libm/PrimaryButton'
import ReorderableBookGrid from '@/components/libm/ReorderableBookGrid'
import ShelfSkeleton from '@/components/libm/ShelfSkeleton'
import ToastMessage from '@/components/libm/ToastMessage'
import TopNavBar from '@/components/libm/TopNavBar'

export default function WishlistScreen() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHer, setIsHer] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [highlightedBookId, setHighlightedBookId] = useState<string | null>(null)

  useEffect(() => {
    const feedback = consumeShelfFeedback()
    if (feedback?.shelf === 'wishlist') {
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

  async function loadWishlist() {
    setLoading(true)
    setError(null)

    try {
      const [nextBooks, currentUserId] = await Promise.all([
        fetchWishlistBooks(),
        getSignedInUserId(),
      ])
      setBooks(nextBooks)
      setIsHer(currentUserId === HER_UID)
      setLoading(false)
    } catch {
      setError('Error loading wishlist. Please try again.')
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadWishlist()
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
            <PrimaryButton type="button" tone="ghost" onClick={() => void loadWishlist()}>
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
          title={isHer ? 'Your Wishlist is waiting' : 'Nothing on the wishlist yet'}
          description={
            isHer
              ? 'Add the books you want so they are easy to spot the next time someone checks in.'
              : "She hasn't added any books yet. Check back later to see what she wants next."
          }
          action={
            isHer ? (
              <PrimaryButton
                type="button"
                onClick={() => router.push('/add-book?wishlist=1')}
              >
                Add your first wishlist book
              </PrimaryButton>
            ) : undefined
          }
        />
      </div>
    )
  } else {
    body = (
      <div className="libm-book-grid-scroll">
        <ReorderableBookGrid
          books={books}
          reorderable={false}
          highlightedBookId={highlightedBookId}
        />
      </div>
    )
  }

  return (
    <main className="libm-screen">
      <TopNavBar
        actions={
          <>
            {isHer ? (
              <IconButton
                label="Add to Wishlist"
                onClick={() => router.push('/add-book?wishlist=1')}
              >
                <PlusIcon />
              </IconButton>
            ) : null}
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
