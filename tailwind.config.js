/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cr-green": "#33FF7A",
        "cr-light-green": "#1DB954",
        "cr-genre": "rgba(255,255,255,0.2)",
        "cr-muted": "#3B3B40",
        "cr-modal": "#262927",
        "cr-loader-bg": "#2b2a2a",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
