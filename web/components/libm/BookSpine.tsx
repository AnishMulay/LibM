import type { KeyboardEventHandler } from 'react'
import type { Book } from '@/types/book'
import { LIBM_COLORS, normalizeHexColor } from '@/lib/libm'

type Props = {
  book: Pick<Book, 'id' | 'title' | 'author' | 'coverColor'>
  onTap?: () => void
  highlighted?: boolean
  reorderMode?: boolean
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
  disabled?: boolean
}

function getSpineTextColor(hex: string) {
  const cleaned = hex.replace('#', '')
  if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) {
    return LIBM_COLORS.cream
  }

  const red = parseInt(cleaned.slice(0, 2), 16) / 255
  const green = parseInt(cleaned.slice(2, 4), 16) / 255
  const blue = parseInt(cleaned.slice(4, 6), 16) / 255

  const [r, g, b] = [red, green, blue].map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  )

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.42 ? 'rgba(0, 0, 0, 0.86)' : '#F8F2E8'
}

function Content({ book }: { book: Pick<Book, 'title' | 'author' | 'coverColor'> }) {
  const spineColor = normalizeHexColor(book.coverColor, LIBM_COLORS.forestGreen)
  const textColor = getSpineTextColor(spineColor)

  return (
    <div
      className="libm-book-spine"
      style={{ backgroundColor: spineColor, color: textColor }}
    >
      <div className="libm-book-spine-rotated">
        <p className="libm-book-spine-title" title={book.title}>
          {book.title}
        </p>
        <p className="libm-book-spine-author" title={book.author}>
          {book.author}
        </p>
      </div>
    </div>
  )
}

export default function BookSpine({
  book,
  onTap,
  highlighted = false,
  reorderMode = false,
  onKeyDown,
  disabled = false,
}: Props) {
  if (!onTap) {
    return <Content book={book} />
  }

  return (
    <button
      type="button"
      className={`libm-book-spine-button ${highlighted ? 'is-highlighted' : ''} ${reorderMode ? 'is-reordering' : ''}`.trim()}
      onClick={onTap}
      onKeyDown={onKeyDown}
      disabled={disabled}
      aria-pressed={reorderMode || undefined}
      aria-describedby={reorderMode ? `libm-reorder-${book.id}` : undefined}
    >
      <Content book={book} />
    </button>
  )
}
