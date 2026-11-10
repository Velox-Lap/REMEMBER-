import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "#244B3C",
        sage: "#A8B9A0",
        ocean: "#A9D4E5",
        "deep-ocean": "#315D73",
        sand: "#E9DCC8",
        cream: "#F8F6EF",
        ink: "#26352E",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        editorial: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        handwritten: ["var(--font-caveat)", "cursive"],
      },
      maxWidth: {
        site: "1440px",
        reading: "720px",
      },
      transitionTimingFunction: {
        "cinematic": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
