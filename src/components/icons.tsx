export const PaletteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2.75a9.25 9.25 0 1 0 0 18.5c1.13 0 1.9-.9 1.9-1.87 0-.5-.2-.94-.5-1.28-.3-.33-.48-.76-.48-1.24a1.87 1.87 0 0 1 1.87-1.86h2.21a4.25 4.25 0 0 0 4.25-4.25c0-4.5-4.1-8-9.25-8Z" />
    <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="16.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

type ThemeSwatchIconProps = {
  palette: Record<string, string> | null
}

/**
 * A miniature preview of a theme rendered from its `palette.json`: the
 * page background as the tile, with the primary and text colors as dots.
 * Falls back to the generic palette icon when the theme ships no palette.
 */
export const ThemeSwatchIcon = ({ palette }: ThemeSwatchIconProps) => {
  if (!palette) return <PaletteIcon />

  return (
    <span
      className="telescope-themes-swatch"
      style={{ backgroundColor: palette['--page-background'] }}
    >
      <span
        className="telescope-themes-swatch-dot"
        style={{ backgroundColor: palette['--primary-color'] }}
      />
      <span
        className="telescope-themes-swatch-dot"
        style={{ backgroundColor: palette['--text-color'] }}
      />
    </span>
  )
}
