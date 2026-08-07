import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:   "#0D1B2A",
        gold:   "#C89B3C",
        teal:   "#1A5C4A",
        orange: "#D4540A",
        cream:  "#F9F7F3",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:        "0 4px 16px rgba(0,0,0,0.06)",
        "card-hover":"0 8px 32px rgba(0,0,0,0.10)",
        xl:          "0 20px 60px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;



