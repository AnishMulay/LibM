import { createClient } from '@/lib/supabase/server'
import { bookRowToBook, BookRow } from '@/types/book'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MoveToLibraryButton from '@/components/bookshelf/MoveToLibraryButton'

interface BookDetailPageProps {
  params: { id: string }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    // Supabase returns error.code 'PGRST116' for no rows with .single()
    notFound()
  }

  const book = bookRowToBook(data as BookRow)

  return (
    <main className="min-h-screen bg-parchment">
      <div className="px-md py-lg">

        {/* Back link — conditional: "← Wishlist" for wishlist books, "← Library" for library books (DETAIL-01) */}
        <Link
          href={book.isWishlist ? '/wishlist' : '/library'}
          className="font-georgia"
          style={{
            display: 'inline-block',
            fontSize: '14px',
            lineHeight: '1.4',
            color: '#2C2C2C',
            textDecoration: 'none',
            marginBottom: '32px',
          }}
        >
          {book.isWishlist ? '← Wishlist' : '← Library'}
        </Link>

        {/* Book info container: parchment bg, 2px black border — per UI-SPEC */}
        <div
          style={{
            maxWidth: '600px',
            backgroundColor: '#F5F0E8',
            border: '2px solid #000000',
            padding: '32px',
          }}
        >

          {/* Title — 48px display weight — per UI-SPEC */}
          <h1
            className="font-georgia"
            style={{
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: '1.0',
              color: '#222222',
              marginBottom: '8px',
            }}
          >
            {book.title}
          </h1>

          {/* Author — 14px label weight, text-secondary #666666 — per UI-SPEC */}
          <p
            className="font-georgia"
            style={{
              fontSize: '14px',
              lineHeight: '1.4',
              color: '#666666',
              marginBottom: '32px',
            }}
          >
            {book.author}
          </p>

          {/* Cover color swatch: 120×160px block in book's cover_color, 2px black border — per UI-SPEC */}
          <div
            aria-label={`Cover color: ${book.coverColor}`}
            style={{
              width: '120px',
              height: '160px',
              backgroundColor: book.coverColor,
              border: '2px solid #000000',
              marginBottom: '32px',
              flexShrink: 0,
            }}
          />

          {/* Notes — read-only, 14px body weight — per UI-SPEC, D-09 */}
          <div>
            <p
              className="font-georgia"
              style={{ fontSize: '14px', lineHeight: '1.4', color: '#666666', marginBottom: '8px' }}
            >
              Notes
            </p>
            <p
              className="font-georgia"
              style={{ fontSize: '14px', lineHeight: '1.5', color: '#222222' }}
            >
              {book.notes ?? 'No notes'}
            </p>
          </div>

          {/* Move to Library — visible only for wishlist books (D-11, DETAIL-02) */}
          {book.isWishlist && <MoveToLibraryButton bookId={book.id} />}

        </div>
      </div>
    </main>
  )
}
