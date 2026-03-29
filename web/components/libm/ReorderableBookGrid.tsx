'use client'

import type { KeyboardEventHandler } from 'react'
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
  onKeyDown,
  highlighted = false,
  reorderMode = false,
  dragDisabled = false,
  buttonDisabled = false,
}: {
  book: Book
  onTap: () => void
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>
  highlighted?: boolean
  reorderMode?: boolean
  dragDisabled?: boolean
  buttonDisabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: book.id, disabled: dragDisabled })

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
      <BookSpine
        book={book}
        onTap={onTap}
        onKeyDown={onKeyDown}
        highlighted={highlighted}
        reorderMode={reorderMode}
        disabled={buttonDisabled}
      />
    </div>
  )
}

export default function ReorderableBookGrid({
  books,
  reorderable = true,
  highlightedBookId,
}: {
  books: Book[]
  reorderable?: boolean
  highlightedBookId?: string | null
}) {
  const router = useRouter()
  const [items, setItems] = useState(books)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving'>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [keyboardReorderId, setKeyboardReorderId] = useState<string | null>(null)
  const [keyboardOrigin, setKeyboardOrigin] = useState<Book[] | null>(null)

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
  const isSaving = saveState === 'saving'

  async function persistOrder(nextItems: Book[], previousItems: Book[]) {
    setSaveError(null)
    setSaveState('saving')

    try {
      await updatePositions(nextItems.map((book) => book.id))
      setSaveState('idle')
    } catch {
      setItems(previousItems)
      setSaveState('idle')
      setSaveError("Couldn't save order. Please try again.")
    }
  }

  function moveBookInList(direction: 'left' | 'right', bookId: string) {
    const currentIndex = items.findIndex((book) => book.id === bookId)
    const nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) {
      return
    }

    setItems((currentItems) => {
      const activeIndex = currentItems.findIndex((book) => book.id === bookId)
      const targetIndex = direction === 'left' ? activeIndex - 1 : activeIndex + 1

      if (activeIndex < 0 || targetIndex < 0 || targetIndex >= currentItems.length) {
        return currentItems
      }

      return arrayMove(currentItems, activeIndex, targetIndex)
    })
  }

  async function confirmKeyboardReorder(bookId: string) {
    const previousItems = keyboardOrigin ?? items
    const nextItems = items
    setKeyboardReorderId(null)
    setKeyboardOrigin(null)

    if (previousItems.map((book) => book.id).join(',') === nextItems.map((book) => book.id).join(',')) {
      return
    }

    await persistOrder(nextItems, previousItems)
  }

  function cancelKeyboardReorder() {
    if (keyboardOrigin) {
      setItems(keyboardOrigin)
    }
    setKeyboardReorderId(null)
    setKeyboardOrigin(null)
  }

  if (!reorderable) {
    return (
      <div className="libm-bookshelf">
        {items.map((book) => (
          <BookSpine
            key={book.id}
            book={book}
            highlighted={highlightedBookId === book.id}
            onTap={() => router.push(`/book-detail?id=${book.id}`)}
          />
        ))}
      </div>
    )
  }

  function handleDragStart(event: DragStartEvent) {
    if (isSaving || keyboardReorderId) {
      return
    }
    setActiveId(String(event.active.id))
    setSaveError(null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    if (!event.over || event.active.id === event.over.id) {
      return
    }

    const oldIndex = items.findIndex((book) => book.id === event.active.id)
    const newIndex = items.findIndex((book) => book.id === event.over?.id)
    const previousItems = items
    const reordered = arrayMove(items, oldIndex, newIndex)
    setItems(reordered)
    void persistOrder(reordered, previousItems)
  }

  function handleSpineKeyDown(book: Book): KeyboardEventHandler<HTMLButtonElement> {
    return (event) => {
      if (isSaving) {
        return
      }

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()

        if (keyboardReorderId === book.id) {
          void confirmKeyboardReorder(book.id)
          return
        }

        setSaveError(null)
        setKeyboardOrigin(items)
        setKeyboardReorderId(book.id)
        return
      }

      if (keyboardReorderId !== book.id) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        moveBookInList('left', book.id)
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        moveBookInList('right', book.id)
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        cancelKeyboardReorder()
      }
    }
  }

  return (
    <>
      <div className="libm-shelf-feedback" aria-live="polite" aria-atomic="true">
        {isSaving ? <p className="libm-muted-label">Saving order...</p> : null}
        {saveError ? <p className="libm-error-text">{saveError}</p> : null}
        {keyboardReorderId ? (
          <p id={`libm-reorder-${keyboardReorderId}`} className="libm-muted-label">
            Reorder mode: use left and right arrows to move this book. Press Enter,
            Space, or Escape when you&apos;re done.
          </p>
        ) : null}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((book) => book.id)} strategy={rectSortingStrategy}>
          <div className="libm-bookshelf">
            {items.map((book) => (
              <SortableSpine
                key={book.id}
                book={book}
                onTap={() => router.push(`/book-detail?id=${book.id}`)}
                onKeyDown={handleSpineKeyDown(book)}
                highlighted={highlightedBookId === book.id}
                reorderMode={keyboardReorderId === book.id}
                dragDisabled={isSaving || keyboardReorderId !== null}
                buttonDisabled={
                  isSaving ||
                  (keyboardReorderId !== null && keyboardReorderId !== book.id)
                }
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
    </>
  )
}
