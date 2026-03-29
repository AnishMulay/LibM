import type { ReactNode } from 'react'

export default function AppBar({
  title,
  leading,
  actions,
}: {
  title: string
  leading?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="libm-app-bar">
      <div
        className="libm-app-bar-leading"
        style={{ minWidth: leading ? 48 : 0 }}
      >
        {leading}
      </div>
      <h1 className="libm-heading">{title}</h1>
      <div className="libm-app-bar-actions">{actions}</div>
    </header>
  )
}
