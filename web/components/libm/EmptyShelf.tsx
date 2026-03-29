import type { ReactNode } from 'react'

export default function EmptyShelf({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="libm-empty-shelf-wrap">
      <div className="libm-empty-shelf">
        <div className="libm-empty-shelf-content">
          <p className="libm-empty-shelf-message">{title}</p>
          {description ? <p className="libm-empty-shelf-description">{description}</p> : null}
          {action ? <div className="libm-empty-shelf-action">{action}</div> : null}
        </div>
      </div>
      <div className="libm-empty-shelf-lip" />
    </div>
  )
}
