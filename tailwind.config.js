/** @type {import('tailwindcss').Config} */
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        xs: ['1rem', '1.5'],    // 16px
        sm: ['1.25rem', '1.5'], // 20px
        md: ['1.5rem', '1.5'],  // 24px
        lg: ['2rem', '1.3'],    // 32px
        xl: ['3rem', '1.2'],    // 48px
      },
      colors: {
        purple: '#7F3DFF',
        violet: '#9B59FF',
        blue: '#3498FF',
        skyBlue: '#5BC0FF',
        dark: '#1F1F2E',
        light: '#F5F5F5',
      },
      spacing: {
        '4.5': '1.125rem',  // 18px
        '7.5': '1.875rem',  // 30px
        '9.5': '2.375rem',  // 38px
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
})
