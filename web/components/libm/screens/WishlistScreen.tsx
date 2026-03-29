'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fetchWishlistBooks, getSignedInUserId } from '@/lib/books'
import { HER_UID } from '@/lib/libm'
import type { Book } from '@/types/book'
import AppBar from '@/components/libm/AppBar'
import BookSpine from '@/components/libm/BookSpine'
import EmptyShelf from '@/components/libm/EmptyShelf'
import IconButton from '@/components/libm/IconButton'
import { LogoutIcon, PlusIcon, RefreshIcon } from '@/components/libm/Icons'
import Spinner from '@/components/libm/Spinner'

export default function WishlistScreen() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHer, setIsHer] = useState(false)

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
    body = (
      <div className="libm-center-state">
        <Spinner size={32} color="#2D4A3E" />
      </div>
    )
  } else if (error) {
    body = (
      <div className="libm-center-state">
        <div className="libm-error-state">
          <p className="libm-error-text">{error}</p>
          <IconButton label="Retry" onClick={() => void loadWishlist()}>
            <RefreshIcon />
          </IconButton>
        </div>
      </div>
    )
  } else if (books.length === 0) {
    body = (
      <div className="libm-page-body">
        <EmptyShelf message="Her wishlist is empty" />
      </div>
    )
  } else {
    body = (
      <div className="libm-book-grid-scroll">
        <div className="libm-book-grid">
          {books.map((book) => (
            <BookSpine
              key={book.id}
              book={book}
              onTap={() => router.push(`/book-detail?id=${book.id}`)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <main className="libm-screen">
      <AppBar
        title="Wishlist"
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
    </main>
  )
}
