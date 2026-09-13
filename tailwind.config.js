/** @type {import('tailwindcss').Config} */

// ─────────────────────────────────────────────────────────────
// JANAKI TECHNICAL TRAINING CENTER — CENTRAL COLOR THEME
// Change the hex values below to re-brand the entire website.
//   navy   = primary brand color (deep blue / navy)
//   accent = energetic highlight color used for CTAs
// ─────────────────────────────────────────────────────────────

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F2F6FD',
          100: '#E3ECFA',
          200: '#C7D9F5',
          300: '#9DBDEC',
          400: '#6D9AE0',
          500: '#4A7BD0',
          600: '#3562B8',
          700: '#2B4F97',
          800: '#24407B',
          900: '#182F5C',
          950: '#0A1730',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 42, 83, 0.06), 0 8px 24px -12px rgba(16, 42, 83, 0.14)',
        'card-hover': '0 2px 4px rgba(16, 42, 83, 0.08), 0 16px 40px -12px rgba(16, 42, 83, 0.24)',
        soft: '0 4px 16px -4px rgba(16, 42, 83, 0.08)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '44px 44px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
