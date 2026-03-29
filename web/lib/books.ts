'use client'

import { createClient } from '@/lib/supabase/client'
import { bookRowToBook, type Book, type BookRow } from '@/types/book'

async function getCurrentUserId() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Not authenticated')
  }

  return user.id
}

export async function fetchLibraryBooks(): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_wishlist', false)
    .order('position', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => bookRowToBook(row as BookRow))
}

export async function fetchWishlistBooks(): Promise<Book[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('is_wishlist', true)
    .order('position', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) => bookRowToBook(row as BookRow))
}

export async function addBook(options: {
  title: string
  author: string
  coverColor: string
  notes?: string | null
  isWishlist: boolean
}) {
  const supabase = createClient()
  const userId = await getCurrentUserId()
  const existing = options.isWishlist
    ? await fetchWishlistBooks()
    : await fetchLibraryBooks()
  const nextPosition =
    existing.length === 0 ? 0 : existing[existing.length - 1].position + 1

  const payload = {
    user_id: userId,
    title: options.title.trim(),
    author: options.author.trim(),
    cover_color: options.coverColor,
    notes: options.notes?.trim() ? options.notes.trim() : null,
    position: nextPosition,
    is_wishlist: options.isWishlist,
  }

  const { data, error } = await supabase
    .from('books')
    .insert(payload)
    .select()
    .single()

  if (error) {
    throw error
  }

  return bookRowToBook(data as BookRow)
}

export async function updatePositions(orderedIds: string[]) {
  const supabase = createClient()
  const updates = orderedIds.map((id, index) => ({
    id,
    position: index,
  }))

  const { error } = await supabase.from('books').upsert(updates)

  if (error) {
    throw error
  }
}

export async function moveToLibrary(bookId: string) {
  const supabase = createClient()
  const shelfBooks = await fetchLibraryBooks()
  const nextPosition =
    shelfBooks.length === 0
      ? 0
      : shelfBooks[shelfBooks.length - 1].position + 1

  const { error } = await supabase
    .from('books')
    .update({ is_wishlist: false, position: nextPosition })
    .eq('id', bookId)

  if (error) {
    throw error
  }
}

export async function getSignedInUserId() {
  return getCurrentUserId()
}
