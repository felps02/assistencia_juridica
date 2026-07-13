import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#edf3f8",
          100: "#d8e5ef",
          600: "#234761",
          700: "#19364d",
          800: "#10263a",
          900: "#081827"
        },
        gold: {
          400: "#d3aa55",
          500: "#b98a2e"
        }
      },
      boxShadow: {
        soft: "0 20px 45px rgba(8, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

