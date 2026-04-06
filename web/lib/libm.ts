export const LIBM_COLORS = {
  parchment: '#F5F0E8',
  forestGreen: '#2D4A3E',
  darkRed: '#8B1A1A',
  burgundy: '#8B3A3A',
  navy: '#1A3A4A',
  agedGold: '#D4AF6A',
  charcoal: '#3A3A3A',
  rust: '#9B4A4A',
  cream: '#FFFAF0',
  borderDefault: 'rgba(0, 0, 0, 0.87)',
  textMuted: 'rgba(0, 0, 0, 0.54)',
  shelfWoodLight: '#C8A06E',
  shelfWoodDark: '#8B5E3C',
  shelfLip: '#4A2E1A',
} as const

export const COVER_SWATCHES = [
  LIBM_COLORS.parchment,
  LIBM_COLORS.forestGreen,
  LIBM_COLORS.burgundy,
  LIBM_COLORS.navy,
  LIBM_COLORS.agedGold,
  LIBM_COLORS.charcoal,
  LIBM_COLORS.rust,
  LIBM_COLORS.cream,
] as const

export function normalizeHexColor(
  hex: string,
  fallback: string = LIBM_COLORS.parchment,
): string {
  return /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex.toUpperCase() : fallback
}
