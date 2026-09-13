/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          teal: '#10B981',
          'teal-dark': '#059669',
          'teal-light': '#F0FDFA',
          purple: '#7C3AED',
          'purple-light': '#E0E7FF',
          cyan: '#06B6D4',
          'cyan-dark': '#0891B2',
          dark: '#1A1A2E',
          light: '#F8FAFB',
          border: '#E5E7EB',
          success: '#059669',
          warning: '#F59E0B',
          error: '#DC2626',
        }
      }
    },
  },
  plugins: [],
}
