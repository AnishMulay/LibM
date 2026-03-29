import type { Book } from '@/types/book'
import { normalizeHexColor } from '@/lib/libm'

type Props = {
  book: Pick<Book, 'title' | 'author' | 'coverColor'>
  onTap?: () => void
}

function Content({ book }: { book: Pick<Book, 'title' | 'author' | 'coverColor'> }) {
  return (
    <div
      className="libm-book-spine"
      style={{ backgroundColor: normalizeHexColor(book.coverColor) }}
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

export default function BookSpine({ book, onTap }: Props) {
  if (!onTap) {
    return <Content book={book} />
  }

  return (
    <button type="button" className="libm-book-spine-button" onClick={onTap}>
      <Content book={book} />
    </button>
  )
}
