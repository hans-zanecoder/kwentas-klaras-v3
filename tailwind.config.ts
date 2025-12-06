import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './components/**/*.{vue,ts,js}',
    './pages/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': {
          DEFAULT: '#22C98D',
        },
        'brand-blue': {
          DEFAULT: '#2563EB',
        },
        'brand-bg': {
          DEFAULT: '#FCF8F2',
        },
      },
    },
  },
  plugins: [],
} satisfies Config

