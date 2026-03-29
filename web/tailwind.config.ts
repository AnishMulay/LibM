import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette — neo-brutalist old-money
        parchment: '#F5F0E8',
        'forest-green': '#2D4A3E',
        'dark-red': '#8B1A1A',
        // Text
        'text-primary': '#222222',
        'text-secondary': '#666666',
        // Borders
        border: '#000000',
        // Wood tones — bookshelf gradient (Phase 5)
        // Flutter AppColors: shelfWoodLight, shelfWoodDark, shelfLip (2-stop gradient, no mid)
        'wood-light': '#C8A06E',   // Flutter AppColors.shelfWoodLight
        'wood-dark':  '#8B5E3C',   // Flutter AppColors.shelfWoodDark
        'wood-lip':   '#4A2E1A',   // Flutter AppColors.shelfLip
        // Cover swatches
        'aged-gold':  '#D4AF6A',   // Flutter coverSwatches[4]
      },
      fontFamily: {
        editorial: ['var(--font-heading)', 'serif'],
        ui: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        // Override ALL border radius to 0 — no rounded corners anywhere
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      spacing: {
        // Design token spacing scale (UI-SPEC)
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      height: {
        'input': '52px',  // Exact input/button height from UI-SPEC
      },
      letterSpacing: {
        'display': '2px',   // App name heading
        'button': '1px',    // Button text
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.0', fontWeight: '700' }],
        'subtitle': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'heading': ['32px', { lineHeight: '1.0', fontWeight: '700' }],
        'error': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

export default config
