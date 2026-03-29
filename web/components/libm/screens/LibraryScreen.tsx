'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fetchLibraryBooks } from '@/lib/books'
import type { Book } from '@/types/book'
import AppBar from '@/components/libm/AppBar'
import EmptyShelf from '@/components/libm/EmptyShelf'
import IconButton from '@/components/libm/IconButton'
import { HeartIcon, LogoutIcon, PlusIcon } from '@/components/libm/Icons'
import ReorderableBookGrid from '@/components/libm/ReorderableBookGrid'
import Spinner from '@/components/libm/Spinner'

export default function LibraryScreen() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadBooks() {
      setLoading(true)
      setError(null)

      try {
        const nextBooks = await fetchLibraryBooks()
        if (isMounted) {
          setBooks(nextBooks)
          setLoading(false)
        }
      } catch {
        if (isMounted) {
          setError('Error loading books. Please try again.')
          setLoading(false)
        }
      }
    }

    void loadBooks()
    return () => {
      isMounted = false
    }
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
        <p className="libm-error-text">{error}</p>
      </div>
    )
  } else if (books.length === 0) {
    body = (
      <div className="libm-page-body">
        <EmptyShelf message="Add your first book" />
      </div>
    )
  } else {
    body = (
      <div className="libm-book-grid-scroll">
        <ReorderableBookGrid books={books} />
      </div>
    )
  }

  return (
    <main className="libm-screen">
      <AppBar
        title="Library"
        actions={
          <>
            <IconButton label="Wishlist" onClick={() => router.push('/wishlist')}>
              <HeartIcon />
            </IconButton>
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
    </main>
  )
}
