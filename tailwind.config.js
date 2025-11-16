/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#1E293B",
        accent: "#F97316",
        muted: "#94A3B8",
        light: "#F1F5F9",
        dark: "#0F172A",
      },
    },
  },
  plugins: [],
}