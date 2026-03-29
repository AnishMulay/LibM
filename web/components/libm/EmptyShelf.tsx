export default function EmptyShelf({ message }: { message: string }) {
  return (
    <div className="libm-empty-shelf-wrap">
      <div className="libm-empty-shelf">
        <p className="libm-muted-label">{message}</p>
      </div>
      <div className="libm-empty-shelf-lip" />
    </div>
  )
}
