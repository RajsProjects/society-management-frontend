/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2b4a',
          light: '#2a3f6b',
          dark: '#0f1a2e',
        },
        charcoal: {
          DEFAULT: '#2d3436',
          light: '#4a5568',
        },
        cool: {
          blue: '#4a7fa5',
          'blue-light': '#6b9fc4',
          green: '#3d8b7a',
          'green-light': '#5aab98',
        },
        sea: {
          DEFAULT: '#3cb371',
          hover: '#2e8b57',
        },
        surface: {
          DEFAULT: '#f0f4f8',
          card: '#ffffff',
          muted: '#e8eef4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
