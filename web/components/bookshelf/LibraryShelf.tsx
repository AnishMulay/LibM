'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import BookSpine, { BookSpineProps } from './BookSpine'
import { Book } from '@/types/book'
import { createClient } from '@/lib/supabase/client'

// ── Sortable item wrapper ─────────────────────────────────────────
interface SortableBookSpineProps extends BookSpineProps {
  isDragging?: boolean
}

function SortableBookSpine({ isDragging: _isDragging, ...props }: SortableBookSpineProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: props.id! })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1,       // hide original while ghost floats
    cursor: 'grab',
    outline: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={`${props.title} — drag to reorder. Use arrow keys to reorder, Enter to confirm.`}
      role="listitem"
    >
      <BookSpine {...props} />
    </div>
  )
}

// ── LibraryShelf ──────────────────────────────────────────────────
interface LibraryShelfProps {
  initialBooks: Book[]
}

export default function LibraryShelf({ initialBooks }: LibraryShelfProps) {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },  // 8px drag threshold prevents accidental drags on tap
    }),
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  )

  const activeBook = activeId ? books.find((b) => b.id === activeId) : null

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (!over || active.id === over.id) return

      const oldIndex = books.findIndex((b) => b.id === active.id)
      const newIndex = books.findIndex((b) => b.id === over.id)

      // Optimistic update — reorder in local state immediately
      const reordered = arrayMove(books, oldIndex, newIndex)
      setBooks(reordered)

      // Persist to Supabase in background — update every book's position
      // position is 1-based: book at index 0 gets position 1
      const updates = reordered.map((book, index) => ({
        id: book.id,
        position: index + 1,
      }))

      // Batch updates: one update per book (Supabase does not have arrayUpdate)
      const results = await Promise.allSettled(
        updates.map(({ id, position }) =>
          supabase.from('books').update({ position }).eq('id', id),
        ),
      )

      const failed = results.filter(
        (r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.error),
      )
      if (failed.length > 0) {
        setSaveError('Failed to save order. Please try again.')
        // Revert to original order
        setBooks(books)
      } else {
        setSaveError(null)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [books, supabase],
  )

  const bookIds = books.map((b) => b.id)

  return (
    <>
      {saveError && (
        <p
          style={{ color: '#8B1A1A', fontSize: '13px', lineHeight: '1.4', marginBottom: '8px', fontFamily: 'var(--font-body), sans-serif' }}
        >
          {saveError}
        </p>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={bookIds} strategy={horizontalListSortingStrategy}>
          <section role="list" aria-label="Bookshelf — drag to reorder" className="w-full">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                gap: '0px',
                rowGap: '8px',
                background: 'linear-gradient(to bottom, #C8A06E 0%, #8B5E3C 100%)',
                borderBottom: '10px solid #4A2E1A',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.26)',
                padding: '8px 8px 0 8px',
                minHeight: '208px',
              }}
            >
              {books.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-xl">
                  <p className="font-editorial" style={{ color: '#666666', fontSize: '16px' }}>
                    Add your first book
                  </p>
                  <p className="font-ui mt-sm" style={{ color: '#666666', fontSize: '14px' }}>
                    No books yet. Tap the + button to add one.
                  </p>
                </div>
              ) : (
                books.map((book) => (
                  <SortableBookSpine
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    coverColor={book.coverColor}
                    onTap={() => router.push(`/books/${book.id}`)}
                  />
                ))
              )}
            </div>
          </section>
        </SortableContext>

        {/* DragOverlay renders the ghost spine floating under cursor */}
        <DragOverlay>
          {activeBook ? (
            <div style={{ opacity: 0.5 }}>
              <BookSpine
                id={activeBook.id}
                title={activeBook.title}
                author={activeBook.author}
                coverColor={activeBook.coverColor}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}
