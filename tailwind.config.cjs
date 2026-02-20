/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        glowPurple: "#2A1A4A",
        glowRed: "#3A0F1C",
      },
      fontFamily: {
        serifDisplay: ["Playfair Display", "serif"],
        sansUi: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        tile: "0 10px 30px rgba(0,0,0,0.35)",
        tileGlow: "0 0 28px rgba(130,92,220,0.28)",
      },
    },
  },
  plugins: [],
};

