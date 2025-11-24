/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./menu/**/*.html",
    "./components/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563eb',
        'brand-purple': '#9333ea',
      },
    },
  },
  plugins: [],
}
