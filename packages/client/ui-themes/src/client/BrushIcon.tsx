/**
 * Paintbrush glyph for the sidebar theme launcher. Drawn inline (no shared
 * catalog id) and painted with `currentColor` so every pack recolors it.
 */

/**
 * Render the paintbrush glyph.
 * @param props.size - square edge in pixels.
 * @returns the inline SVG element.
 */
export function BrushIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <g transform="rotate(45 8 8)" fill="currentColor">
        <rect x="6.4" y="1.2" width="3.2" height="7" rx="1.2" />
        <rect x="5.9" y="7.6" width="4.2" height="1.8" rx="0.5" />
        <path d="M5.9 9.4h4.2c0 2.1-.7 3.7-2.1 4.8-1.4-1.1-2.1-2.7-2.1-4.8Z" />
      </g>
    </svg>
  )
}
