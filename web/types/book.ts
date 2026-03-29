export interface Book {
  id: string
  userId: string
  title: string
  author: string
  coverColor: string
  notes: string | null
  position: number
  isWishlist: boolean
  createdAt: string
}

export interface BookRow {
  id: string
  user_id: string
  title: string
  author: string
  cover_color: string
  notes: string | null
  position: number
  is_wishlist: boolean
  created_at: string
}

export function bookRowToBook(row: BookRow): Book {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    author: row.author,
    coverColor: row.cover_color,
    notes: row.notes,
    position: row.position,
    isWishlist: row.is_wishlist,
    createdAt: row.created_at,
  }
}
