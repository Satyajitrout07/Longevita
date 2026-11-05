/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A1C2A',
          'navy-dark': '#06131D',
          'navy-light': '#142C3E',
          teal: '#0D9488',
          'teal-light': '#E0F7F6',
          emerald: '#10B981',
          'mint-bg': '#EDFAF5',
          'mint-border': '#A7F3D0',
          'mint-text': '#047857',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 20px 45px -10px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.04)',
        'glass': '0 16px 36px -8px rgba(12, 38, 64, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        'soft-glow': '0 0 50px -10px rgba(45, 212, 191, 0.25)',
      }
    },
  },
  plugins: [],
}
