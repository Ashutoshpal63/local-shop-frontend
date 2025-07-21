// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // This is the crucial part for manual dark mode
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
}