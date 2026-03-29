import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Spinner from './Spinner'

export default function PrimaryButton({
  children,
  loading = false,
  tone = 'forest',
  className = '',
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  loading?: boolean
  tone?: 'forest' | 'burgundy'
}) {
  const toneClass = tone === 'burgundy' ? 'is-burgundy' : ''

  return (
    <button
      className={`libm-button ${toneClass} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}
