'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface MoveToLibraryButtonProps {
  bookId: string
}

export default function MoveToLibraryButton({ bookId }: MoveToLibraryButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [moving, setMoving] = useState(false)
  const [moveError, setMoveError] = useState('')

  const handleMove = async () => {
    setMoving(true)
    setMoveError('')

    // Step 1: Fetch current max position from library books (is_wishlist=false)
    const { data: libraryBooks } = await supabase
      .from('books')
      .select('position')
      .eq('is_wishlist', false)
      .order('position', { ascending: false })
      .limit(1)

    const maxPosition =
      libraryBooks && libraryBooks.length > 0
        ? (libraryBooks[0].position as number)
        : 0
    const newPosition = maxPosition + 1

    // Step 2: Update book: is_wishlist=false, position=max+1 (D-12)
    const { error } = await supabase
      .from('books')
      .update({ is_wishlist: false, position: newPosition })
      .eq('id', bookId)

    if (error) {
      setMoveError('Failed to move. Please try again.')
      setMoving(false)
      return
    }

    // Step 3: Navigate to /wishlist (D-14) — user stays in wishlist-management mode
    router.push('/wishlist')
  }

  return (
    <div style={{ marginTop: '32px' }}>
      {moveError && (
        <p
          className="font-ui"
          style={{
            color: '#8B1A1A',
            fontSize: '13px',
            lineHeight: '1.4',
            marginBottom: '8px',
          }}
          role="alert"
        >
          {moveError}
        </p>
      )}
      <button
        type="button"
        onClick={handleMove}
        disabled={moving}
        className="font-ui"
        style={{
          display: 'block',
          width: '100%',
          height: '52px',
          backgroundColor: moving ? 'rgba(45, 74, 62, 0.5)' : '#2D4A3E',
          border: '2px solid #000000',
          fontSize: '16px',
          lineHeight: '1.5',
          color: '#F5F0E8',
          cursor: moving ? 'not-allowed' : 'pointer',
          opacity: moving ? 0.5 : 1,
          letterSpacing: '1px',
        }}
      >
        {moving ? 'Moving...' : 'Move to Library'}
      </button>
    </div>
  )
}
