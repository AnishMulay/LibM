import { COVER_SWATCHES } from '@/lib/libm'

export default function ColorPicker({
  selectedColor,
  onColorChanged,
}: {
  selectedColor: string
  onColorChanged: (color: string) => void
}) {
  return (
    <div className="libm-color-picker">
      <p className="libm-label">Cover Colour</p>
      <div className="libm-color-grid">
        {COVER_SWATCHES.map((color) => {
          const isSelected = color === selectedColor

          return (
            <button
              key={color}
              type="button"
              aria-label={`Select ${color}`}
              aria-pressed={isSelected}
              className={`libm-color-swatch ${isSelected ? 'is-selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChanged(color)}
            />
          )
        })}
      </div>
    </div>
  )
}
