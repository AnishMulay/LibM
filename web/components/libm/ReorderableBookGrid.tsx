'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { updatePositions } from '@/lib/books'
import type { Book } from '@/types/book'
import BookSpine from './BookSpine'

function SortableSpine({
  book,
  onTap,
}: {
  book: Book
  onTap: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: book.id })

  return (
    <div
      ref={setNodeRef}
      className="libm-sortable-book"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
      }}
      {...attributes}
      {...listeners}
    >
      <BookSpine book={book} onTap={onTap} />
    </div>
  )
}

export default function ReorderableBookGrid({ books }: { books: Book[] }) {
  const router = useRouter()
  const [items, setItems] = useState(books)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    setItems(books)
  }, [books])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  )

  const activeBook = activeId ? items.find((book) => book.id === activeId) : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    if (!event.over || event.active.id === event.over.id) {
      return
    }

    const oldIndex = items.findIndex((book) => book.id === event.active.id)
    const newIndex = items.findIndex((book) => book.id === event.over?.id)
    const reordered = arrayMove(items, oldIndex, newIndex)
    setItems(reordered)
    void updatePositions(reordered.map((book) => book.id)).catch(() => undefined)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((book) => book.id)} strategy={rectSortingStrategy}>
        <div className="libm-book-grid">
          {items.map((book) => (
            <SortableSpine
              key={book.id}
              book={book}
              onTap={() => router.push(`/book-detail?id=${book.id}`)}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeBook ? (
          <div className="libm-drag-overlay">
            <BookSpine book={activeBook} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
