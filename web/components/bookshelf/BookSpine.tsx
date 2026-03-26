export interface BookSpineProps {
  id?: string;
  title: string;
  author: string;
  coverColor: string; // hex string e.g. '#2D4A3E'
  onTap?: () => void;
}

/**
 * Compute WCAG-based contrast color for text on a given background.
 * Returns '#ffffff' for dark backgrounds and '#000000' for light backgrounds.
 */
export function getContrastColor(hex: string): '#ffffff' | '#000000' {
  if (!hex || typeof hex !== 'string') return '#000000'

  // Strip leading '#'
  const cleaned = hex.replace(/^#/, '')

  // Validate: must be 6 hex chars
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return '#000000'

  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)

  // WCAG perceived luminance (simplified)
  const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255

  return luminance < 0.5 ? '#ffffff' : '#000000'
}

export default function BookSpine({ id, title, author, coverColor, onTap }: BookSpineProps) {
  const textColor = getContrastColor(coverColor)

  return (
    <div
      id={id}
      role="listitem"
      aria-label={title}
      className="relative flex-shrink-0 border-2 border-black cursor-pointer"
      style={{ width: '56px', height: '150px', backgroundColor: coverColor }}
      onClick={onTap}
    >
      {/* Inner container: absolute fill, flex centering */}
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
        {/* Rotated text wrapper: writing-mode + rotate makes text read top-to-bottom */}
        <div
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            maxHeight: '140px',
            overflow: 'hidden',
          }}
        >
          {/* Title */}
          <span
            style={{
              color: textColor,
              fontSize: '16px',
              lineHeight: '1.5',
              fontFamily: 'Georgia, serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '140px',
            }}
          >
            {title}
          </span>

          {/* Author */}
          <span
            style={{
              color: textColor,
              fontSize: '13px',
              lineHeight: '1.4',
              fontFamily: 'Georgia, serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '120px',
              opacity: 0.85,
            }}
          >
            {author}
          </span>
        </div>
      </div>
    </div>
  )
}
