/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#111827',
          card: '#1E293B',
          text: '#E2E8F0',
        },
        accent: '#3B82F6',
      },
    },
  },
  plugins: [],
}