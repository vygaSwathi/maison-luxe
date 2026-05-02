/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          display: ['"Playfair Display"', 'serif'],
          body: ['Inter', 'sans-serif'],
        },
        colors: {
          gold: '#C9A96E',
          'gold-dark': '#A67C52',
          'black-eclat': '#0b0b0f',
          charcoal: '#0f1115',
          ivory: '#FAF9F6',
          'muted-ivory': '#e9e7e2',
        }
      }
    },
    plugins: [],
  }