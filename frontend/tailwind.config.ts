import type { Config } from 'tailwindcss';
import rtl from 'tailwindcss-rtl';

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d8e8ff',
          500: '#0f4c81',
          700: '#0b3559',
          900: '#081f35',
        },
        sand: '#f5efe4',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [rtl],
} satisfies Config;
