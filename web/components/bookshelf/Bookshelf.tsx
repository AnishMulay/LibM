import BookSpine, { BookSpineProps } from './BookSpine'

export interface BookshelfProps {
  books: BookSpineProps[]
}

export function Bookshelf({ books }: BookshelfProps) {
  return (
    <section role="region" aria-label="Bookshelf" className="w-full">
      <div
        className="flex flex-row flex-wrap items-end gap-0"
        style={{
          background: 'linear-gradient(to bottom, #8B6F47 0%, #6B5438 50%, #4A3728 100%)',
          borderBottom: '14px solid #4A3728',
          padding: '8px 8px 0 8px',
          rowGap: '8px',
          minHeight: '166px',
        }}
      >
        {books.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-xl">
            <p className="text-body font-georgia text-text-secondary">Add your first book</p>
            <p className="text-subtitle font-georgia text-text-secondary mt-sm">
              No books yet. Tap the + button to add one.
            </p>
          </div>
        ) : (
          books.map((book, index) => (
            <BookSpine key={book.id ?? String(index)} {...book} />
          ))
        )}
      </div>
    </section>
  )
}

export default Bookshelf
