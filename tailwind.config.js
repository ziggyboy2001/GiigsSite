/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Giigs brand purple (anchored on #8338ec — same accent as the app + dashboards)
        brand: {
          50: "#f4ecfe",
          100: "#e7d7fd",
          200: "#cdb0fb",
          300: "#b288f6",
          400: "#9a64f1",
          500: "#8338ec",
          600: "#7127d6",
          700: "#5d1fb0",
          800: "#481a86",
          900: "#34155f",
          950: "#1f0c3a",
        },
        // "Live now" energy accent (mirrors the orange live pins in-app)
        live: {
          400: "#ff9243",
          500: "#ff6b1a",
          600: "#e85600",
        },
        ink: {
          950: "#08080c",
          900: "#0b0b10",
          850: "#101017",
          800: "#15151f",
          700: "#1d1d2a",
          600: "#262635",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "brand-glow":
          "radial-gradient(60% 60% at 50% 0%, rgba(131,56,236,0.25) 0%, rgba(131,56,236,0) 70%)",
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(131,56,236,0.55)",
        "glow-live": "0 0 50px -8px rgba(255,107,26,0.5)",
        card: "0 20px 60px -20px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        marquee: "marquee 32s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
