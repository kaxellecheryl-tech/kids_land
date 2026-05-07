import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Charte officielle Kids Land
        brand: {
          "blue-light": "#99C5FF",
          "blue-dark": "#6D86DD",
          orange: "#FF751F",
          yellow: "#FFD21F",
          green: "#7ED957",
          pink: "#F6E5E5",
        },
        // Aliases sémantiques
        primary: "#6D86DD",
        accent: "#FF751F",
        success: "#7ED957",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        display: ["var(--font-tropika)", "var(--font-montserrat)", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        DEFAULT: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 8px 40px rgba(0,0,0,0.08)",
        cardHover: "0 16px 40px rgba(0,0,0,0.12)",
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        "fade-up": "fadeUp 0.5s ease-out forwards",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
