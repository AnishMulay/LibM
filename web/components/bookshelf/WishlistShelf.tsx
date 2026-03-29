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
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 700, lineHeight: '1.0', color: '#222222', letterSpacing: '2px' }}>
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
                backgroundColor: '#D4AF6A',
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
            background: 'linear-gradient(to bottom, #C8A06E 0%, #8B5E3C 100%)',
            borderBottom: '10px solid #4A2E1A',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.26)',
            padding: '8px',
            minHeight: '208px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p className="font-editorial" style={{ color: '#F5F0E8', fontSize: '16px' }}>
            Her wishlist is empty
          </p>
        </div>
      ) : (
        <Bookshelf books={booksWithTap} />
      )}
    </div>
  )
}
