import { notFound } from 'next/navigation'
import BookDetailScreen from '@/components/libm/screens/BookDetailScreen'
import { createClient } from '@/lib/supabase/server'
import { bookRowToBook, type BookRow } from '@/types/book'

export default async function BookDetailPage({
  searchParams,
}: {
  searchParams?: { id?: string }
}) {
  const id = searchParams?.id
  if (!id) {
    notFound()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  return <BookDetailScreen book={bookRowToBook(data as BookRow)} />
}
