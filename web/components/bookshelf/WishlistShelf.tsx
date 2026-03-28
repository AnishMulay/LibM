'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Bookshelf from './Bookshelf'
import { BookSpineProps } from './BookSpine'
import SignOutButton from './SignOutButton'

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
      {/* Header row: "Wishlist" heading + optional "+" button + sign-out */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 className="font-georgia" style={{ fontSize: '48px', fontWeight: 700, lineHeight: '1.0', color: '#222222', letterSpacing: '2px' }}>
          Wishlist
        </h1>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
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
          <SignOutButton />
        </div>
      </div>
      {booksWithTap.length === 0 ? (
        <div
          style={{
            background: 'linear-gradient(to bottom, #8B6F47 0%, #6B5438 50%, #4A3728 100%)',
            borderBottom: '14px solid #4A3728',
            padding: '8px',
            minHeight: '166px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p className="font-georgia" style={{ color: '#F5F0E8', fontSize: '16px' }}>
            Her wishlist is empty
          </p>
        </div>
      ) : (
        <Bookshelf books={booksWithTap} />
      )}
    </div>
  )
}
