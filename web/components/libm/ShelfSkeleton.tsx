const SHELF_COLORS = [
  '#CFC3B3',
  '#C0BAA8',
  '#B7B09C',
  '#C8A06E',
  '#A88862',
  '#8B6F47',
]

export default function ShelfSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="libm-book-grid-scroll" aria-hidden="true">
      <div className="libm-bookshelf libm-bookshelf-skeleton">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="libm-sortable-book"
            style={{ cursor: 'default' }}
          >
            <div
              className="libm-book-spine libm-book-spine-skeleton"
              style={{ backgroundColor: SHELF_COLORS[index % SHELF_COLORS.length] }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
