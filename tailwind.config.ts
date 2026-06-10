import type { Config } from "tailwindcss";

/**
 * Frame's design tokens live here.
 * These names (bg-paper, text-ink, bg-coral, ...) are used everywhere
 * so the whole app stays visually consistent. Change a value once here
 * and it updates across every screen.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F1EFF8", // soft lilac-grey app background
        surface: "#FFFFFF", // cards and panels
        ink: "#1B1530", // primary text
        muted: "#8A85A0", // secondary text
        hairline: "#E7E3F2", // thin borders / dividers
        // Brand blue — Frame's signature colour, as a full tonal scale.
        // Use brand-50/100 for soft tinted backgrounds, brand-600 for buttons,
        // brand-700+ for deep accents. This is what makes the blue feel rich
        // and intentional instead of one flat shade.
        brand: {
          50: "#EEF0FE",
          100: "#E0E2FC",
          200: "#C5C7F8",
          300: "#A3A3F1",
          400: "#827CEA",
          500: "#5A4FE0",
          600: "#4A3ECF",
          700: "#3E33B0",
          800: "#332B8F",
          900: "#211C5E",
        },
        indigo: "#5A4FE0", // alias of brand-500 (kept so older classes still work)
        coral: "#FF5A5F", // warm spark — reserved for the logo's play button
        amber: "#FF9D2E", // streak / achievement accent
        success: "#10B981", // success states
      },
      fontFamily: {
        // Body text
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Headings only
        display: ["var(--font-bricolage)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        // soft, layered shadows give surfaces a hand-crafted sense of depth
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
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.4s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
