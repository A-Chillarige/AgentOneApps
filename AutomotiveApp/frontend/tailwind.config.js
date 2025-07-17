/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#0f4c81',
        'off-white': '#f5f5f5',
        'gold': '#fdbc3d',
        'forest-green': '#2e8b57',
        'danger': '#dc3545',
        'warning': '#ffc107',
        'success': '#28a745',
        'info': '#17a2b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
