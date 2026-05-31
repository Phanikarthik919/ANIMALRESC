/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5', // Professional Indigo
          primaryDark: '#4338CA', 
          primaryLight: '#E0E7FF',
          darkGrey: '#1E293B', // Sleek slate
          textGrey: '#F8FAFC',
        }
      }
    },
  },
  plugins: [],
}
