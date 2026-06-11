import type { Config } from "tailwindcss";

/**
 * Frame's design tokens.
 *
 * The structural neutrals (paper, surface, ink, muted, hairline) and the two
 * lightest brand tints are driven by CSS variables (see globals.css), so they
 * flip automatically in dark mode. The accent colours (brand 200-900, coral,
 * amber, success, indigo) are fixed — they read well on both themes.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        hairline: "rgb(var(--c-hairline) / <alpha-value>)",
        brand: {
          50: "rgb(var(--c-brand-50) / <alpha-value>)",
          100: "rgb(var(--c-brand-100) / <alpha-value>)",
          200: "#C5C7F8",
          300: "#A3A3F1",
          400: "#827CEA",
          500: "#5A4FE0",
          600: "#4A3ECF",
          700: "#3E33B0",
          800: "#332B8F",
          900: "#211C5E",
        },
        indigo: "#5A4FE0",
        coral: "#FF5A5F",
        amber: "#FF9D2E",
        success: "#10B981",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-bricolage)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(27,21,48,0.06), 0 10px 30px rgba(27,21,48,0.08)",
        card: "0 1px 2px rgba(27,21,48,0.04), 0 8px 24px rgba(27,21,48,0.06)",
        lift: "0 6px 16px rgba(27,21,48,0.08), 0 20px 44px rgba(27,21,48,0.12)",
        glow: "0 10px 28px rgba(90,79,224,0.38)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-12vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
        // Marketing/landing motion
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "flow-down": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { transform: "translateY(var(--flow, 240px))", opacity: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.4s ease both",
        "confetti-fall": "confetti-fall 1.8s linear forwards",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        "flow-down": "flow-down 2.8s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
