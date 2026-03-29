'use client'

import { useId, useState } from 'react'

type SharedProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | null
  disabled?: boolean
  autoComplete?: string
  spellCheck?: boolean
  type?: string
  multiline?: boolean
  rows?: number
}

export default function TextField({
  label,
  value,
  onChange,
  error,
  disabled = false,
  autoComplete,
  spellCheck,
  type = 'text',
  multiline = false,
  rows = 4,
}: SharedProps) {
  const [focused, setFocused] = useState(false)
  const id = useId()
  const isFloating = focused || value.length > 0
  const className = [
    'libm-field',
    focused ? 'is-focused' : '',
    error ? 'is-error' : '',
    multiline ? 'is-multiline' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="libm-field-wrap">
      <div className={className}>
        {multiline ? (
          <textarea
            id={id}
            className="libm-field-control"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            rows={rows}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        ) : (
          <input
            id={id}
            className="libm-field-control"
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            autoComplete={autoComplete}
            spellCheck={spellCheck}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        )}
        <label
          htmlFor={id}
          className={`libm-field-label ${isFloating ? 'is-floating' : ''}`}
        >
          {label}
        </label>
      </div>
      {error ? <p className="libm-error-text">{error}</p> : null}
    </div>
  )
}
