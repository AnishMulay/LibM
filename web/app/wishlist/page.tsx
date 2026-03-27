import { createClient } from '@/lib/supabase/server'
import { bookRowToBook, BookRow } from '@/types/book'
import { BookSpineProps } from '@/components/bookshelf/BookSpine'
import WishlistShelf from '@/components/bookshelf/WishlistShelf'

export default async function WishlistPage() {
  const supabase = await createClient()

  // Fetch wishlist books ordered by created_at ascending (D-01: chronological order)
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_wishlist', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[WishlistPage] Supabase fetch error:', error.message)
  }

  const books = (data ?? []).map((row) => bookRowToBook(row as BookRow))

  // Convert Book[] to BookSpineProps[] for WishlistShelf
  const bookSpineProps: BookSpineProps[] = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    coverColor: book.coverColor,
  }))

  // UID gate: her UID stored in NEXT_PUBLIC_HER_UID (D-05, D-06)
  // getUser() matches Phase 4 middleware pattern — authoritative JWT validation
  const { data: { user } } = await supabase.auth.getUser()
  const showAddButton = user?.id === process.env.NEXT_PUBLIC_HER_UID

  return (
    <main className="min-h-screen bg-parchment">
      <div className="px-md py-lg">
        <WishlistShelf books={bookSpineProps} showAddButton={showAddButton} />
      </div>
    </main>
  )
}
