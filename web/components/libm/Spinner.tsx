import type { CSSProperties } from 'react'

export default function Spinner({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}: {
  size?: number
  color?: string
  strokeWidth?: number
}) {
  return (
    <span
      aria-hidden="true"
      className="libm-spinner"
      style={
        {
          width: size,
          height: size,
          borderWidth: strokeWidth,
          borderColor: `${color} ${color} ${color} transparent`,
        } as CSSProperties
      }
    />
  )
}
