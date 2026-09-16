// import type { Config } from "tailwindcss";

// const config: Config = {
//   safelist: [
//     "text-orange-500", "text-purple-500", "text-green-600", "text-yellow-500",
//     "text-blue-500", "text-slate-500", "text-pink-500", "text-amber-600",
//     "text-gray-600", "text-teal-500", "text-orange-700", "text-indigo-500",
//     "text-sky-500", "text-lime-600", "text-fuchsia-500", "text-cyan-500",
//     "text-red-500", "text-rose-500", "text-emerald-600", "text-violet-500",
//     "text-orange-600", "text-pink-600", "text-sky-600", "text-blue-600",
//     "text-yellow-600", "text-teal-600", "text-indigo-600", "text-amber-700",
//     "text-rose-400", "text-slate-600", "text-fuchsia-600",
//     "bg-orange-50", "bg-purple-50", "bg-green-50", "bg-yellow-50",
//     "bg-blue-50", "bg-slate-50", "bg-pink-50", "bg-amber-50",
//     "bg-gray-50", "bg-teal-50", "bg-indigo-50", "bg-sky-50",
//     "bg-lime-50", "bg-fuchsia-50", "bg-cyan-50", "bg-red-50",
//     "bg-rose-50", "bg-emerald-50", "bg-violet-50",
//   ],
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         navy: "#0D1B2A",
//         gold: "#C89B3C",
//         // renamed to avoid overriding Tailwind's teal and orange scales
//         "brand-teal": "#1A5C4A",
//         "brand-orange": "#D4540A",
//         cream: "#F9F7F3",
//       },
//       fontFamily: {
//         playfair: ["var(--font-playfair)", "Georgia", "serif"],
//         inter: ["var(--font-inter)", "system-ui", "sans-serif"],
//       },
//       boxShadow: {
//         card: "0 4px 16px rgba(0,0,0,0.06)",
//         "card-hover": "0 8px 32px rgba(0,0,0,0.10)",
//         xl: "0 20px 60px rgba(0,0,0,0.12)",
//       },
//       borderRadius: {
//         "2xl": "1rem",
//         "3xl": "1.5rem",
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;



import type { Config } from "tailwindcss";

const config: Config = {
  safelist: [
    "text-orange-500", "text-purple-500", "text-green-600", "text-yellow-500",
    "text-blue-500", "text-slate-500", "text-pink-500", "text-amber-600",
    "text-gray-600", "text-teal-500", "text-orange-700", "text-indigo-500",
    "text-sky-500", "text-lime-600", "text-fuchsia-500", "text-cyan-500",
    "text-red-500", "text-rose-500", "text-emerald-600", "text-violet-500",
    "text-orange-600", "text-pink-600", "text-sky-600", "text-blue-600",
    "text-yellow-600", "text-teal-600", "text-indigo-600", "text-amber-700",
    "text-rose-400", "text-slate-600", "text-fuchsia-600",
    "bg-orange-50", "bg-purple-50", "bg-green-50", "bg-yellow-50",
    "bg-blue-50", "bg-slate-50", "bg-pink-50", "bg-amber-50",
    "bg-gray-50", "bg-teal-50", "bg-indigo-50", "bg-sky-50",
    "bg-lime-50", "bg-fuchsia-50", "bg-cyan-50", "bg-red-50",
    "bg-rose-50", "bg-emerald-50", "bg-violet-50",
  ],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0D1B2A",
        gold: "#C89B3C",
        "brand-teal": "#1A5C4A",   // renamed — was overriding teal-50/500/600 etc.
        "brand-orange": "#D4540A", // renamed — was overriding orange-50/500/700 etc.
        cream: "#F9F7F3",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.10)",
        xl: "0 20px 60px rgba(0,0,0,0.12)",
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