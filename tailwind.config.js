/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "bright-blue": "#0096FF" 
      }
    },
    fontFamily: {
      "mono": ["Montserrat", "sans-serif"]
    }
  },
  plugins: [],
}

