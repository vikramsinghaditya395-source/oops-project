/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        volt: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A', // Primary green
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          navy: '#0F172A',
        },
        surface: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#0B0F17',
          darkCard: '#131B2E',
          darkBorder: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 25px -5px rgba(22, 163, 74, 0.25)',
      }
    },
  },
  plugins: [],
}
