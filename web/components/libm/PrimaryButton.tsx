import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Spinner from './Spinner'

export default function PrimaryButton({
  children,
  loading = false,
  tone = 'forest',
  loadingText,
  className = '',
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  loading?: boolean
  tone?: 'forest' | 'burgundy' | 'ghost'
  loadingText?: string
}) {
  const toneClass =
    tone === 'burgundy'
      ? 'is-burgundy'
      : tone === 'ghost'
        ? 'is-ghost'
        : ''

  return (
    <button
      className={`libm-button ${toneClass} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className="libm-button-content">
          <Spinner size={16} />
          <span>{loadingText ?? children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
