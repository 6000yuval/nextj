import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["\"Heebo\"", "\"Assistant\"", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "#0f172a",
          700: "#334155",
          500: "#64748b",
        },
        sand: {
          50: "#f8fafc",
          100: "#f1f5f9",
        },
        accent: {
          500: "#2563eb",
        },
      },
      maxWidth: {
        reading: "66ch",
      },
    },
  },
  plugins: [],
};

export default config;