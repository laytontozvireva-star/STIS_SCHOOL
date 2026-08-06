/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B3F7A",     // Primary Navy Blue
        primaryDark: "#0D1F45", // Deep Navy
        secondary: "#F5A623",   // Golden Amber
        accent: "#A85A2A",      // Rust Brown
        background: "#F8FAFC",
        surface: "#FFFFFF",
        textPrimary: "#0D1F45", // Changed to Deep Navy for better integration
        textSecondary: "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};