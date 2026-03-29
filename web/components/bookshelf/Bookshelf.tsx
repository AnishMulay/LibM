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
          background: 'linear-gradient(to bottom, #C8A06E 0%, #8B5E3C 100%)',
          borderBottom: '10px solid #4A2E1A',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.26)',
          padding: '8px 8px 0 8px',
          rowGap: '8px',
          minHeight: '208px',
        }}
      >
        {books.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-xl">
            <p className="text-body font-editorial text-text-secondary">Add your first book</p>
            <p className="text-subtitle font-ui text-text-secondary mt-sm">
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
