import AddBookScreen from '@/components/libm/screens/AddBookScreen'
import { createClient } from '@/lib/supabase/server'
import { bookRowToBook, type BookRow } from '@/types/book'
import { notFound } from 'next/navigation'

export default async function AddBookPage({
  searchParams,
}: {
  searchParams?: { wishlist?: string; id?: string }
}) {
  const id = searchParams?.id

  if (id) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      notFound()
    }

    return (
      <AddBookScreen
        isWishlist={searchParams?.wishlist === '1'}
        initialBook={bookRowToBook(data as BookRow)}
      />
    )
  }

  return <AddBookScreen isWishlist={searchParams?.wishlist === '1'} />
}
