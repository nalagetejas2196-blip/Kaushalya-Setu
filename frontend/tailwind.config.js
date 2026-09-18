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
        gov: {
          navy: '#0B3C5D',
          'navy-dark': '#062338',
          'navy-light': '#1D5A85',
          saffron: '#FF9933',
          'saffron-dark': '#D97706',
          green: '#138808',
          'green-dark': '#0F6906',
          slate: '#F8FAFC',
          gold: '#C59B27'
        }
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
