/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        canvas: '#FAF8F5',
        ink: '#000000',
        accent: {
          blue:   '#0000FF',
          lime:   '#A3E635',
          yellow: '#FEF08A',
          orange: '#FF5500',
        },
      },
      boxShadow: {
        nb:    '4px 4px 0px 0px #000000',
        'nb-sm': '2px 2px 0px 0px #000000',
        'nb-lg': '6px 6px 0px 0px #000000',
        none: 'none',
      },
      borderWidth: {
        DEFAULT: '2px',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '0',
      },
      transitionTimingFunction: {
        mechanical: 'cubic-bezier(0, 0, 1, 1)',
      },
      transitionDuration: {
        fast: '100ms',
        DEFAULT: '150ms',
        slow: '200ms',
      },
    },
  },
  plugins: [],
}
