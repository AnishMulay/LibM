'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Bookshelf from './Bookshelf'
import { BookSpineProps } from './BookSpine'

interface WishlistShelfProps {
  books: BookSpineProps[]
  showAddButton: boolean
}

export default function WishlistShelf({ books, showAddButton }: WishlistShelfProps) {
  const router = useRouter()

  const booksWithTap: BookSpineProps[] = books.map((book) => ({
    ...book,
    onTap: () => router.push(`/books/${book.id}`),
  }))

  return (
    <div>
      {/* Header row: "Wishlist" heading + optional "+" button */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 className="font-georgia" style={{ fontSize: '48px', fontWeight: 700, lineHeight: '1.0', color: '#222222', letterSpacing: '2px' }}>
          Wishlist
        </h1>
        {showAddButton && (
          <Link
            href="/wishlist/add"
            aria-label="Add to wishlist"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '48px', height: '48px',
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
        )}
      </div>
      <Bookshelf books={booksWithTap} />
    </div>
  )
}
