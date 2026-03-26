/**
 * Represents a row from the Supabase `books` table.
 * Column names use camelCase to match Supabase JS client's automatic conversion.
 * Note: Supabase JS v2 does NOT auto-convert snake_case to camelCase —
 * fields are returned as snake_case. Use the snake_case names in queries;
 * this type uses camelCase aligned to the component props convention.
 */
export interface Book {
  id: string
  userId: string
  title: string
  author: string
  coverColor: string  // maps to cover_color column
  notes: string | null
  position: number
  isWishlist: boolean  // maps to is_wishlist column
  createdAt: string   // maps to created_at column (ISO string)
}

/**
 * The shape returned directly from Supabase queries (snake_case columns).
 * Use this when reading raw Supabase responses, then map to Book.
 */
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

/**
 * Convert a raw Supabase BookRow to the camelCase Book type.
 */
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
