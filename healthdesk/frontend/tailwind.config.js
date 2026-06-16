/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0057A8',
          light: '#EBF3FF',
          dark:  '#003D7A',
        }
      }
    }
  },
  plugins: [],
}
