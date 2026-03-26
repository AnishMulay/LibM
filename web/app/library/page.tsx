import { createClient } from '@/lib/supabase/server'
import { bookRowToBook, BookRow } from '@/types/book'
import LibraryShelf from '@/components/bookshelf/LibraryShelf'
import Link from 'next/link'

export default async function LibraryPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_wishlist', false)
    .order('position', { ascending: true })

  if (error) {
    // Log server-side, show graceful fallback
    console.error('[LibraryPage] Supabase fetch error:', error.message)
  }

  const books = (data ?? []).map((row) => bookRowToBook(row as BookRow))

  return (
    <main className="min-h-screen bg-parchment">
      <div className="px-md py-lg">
        {/* Header: title + "+" button */}
        <div className="flex flex-row items-center justify-between mb-xl">
          <h1
            className="font-georgia"
            style={{
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: '1.0',
              color: '#222222',
              letterSpacing: '2px',
            }}
          >
            Library
          </h1>

          {/* "+" button — per D-05, D-06, UI-SPEC: 48×48px, aged gold #D4AF37, 2px black border, navigates to /library/add */}
          <Link
            href="/library/add"
            aria-label="Add a new book"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              backgroundColor: '#D4AF37',
              border: '2px solid #000000',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#2C2C2C',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            +
          </Link>
        </div>

        {/* Shelf — client component handles drag + tap */}
        <LibraryShelf initialBooks={books} />
      </div>
    </main>
  )
}
