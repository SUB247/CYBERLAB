/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#090b0e",
          surface: "#0f1319",
          card: "#151b23",
          cardHover: "#1b222d",
          border: "#212836",
          borderSubtle: "#18202c",
          muted: "#8b949e",
          text: "#e6edf3",
          emerald: "#10b981",
          emeraldHover: "#059669",
          emeraldDim: "#064e3b",
          emeraldGlow: "rgba(16, 185, 129, 0.15)",
          amber: "#f59e0b",
          red: "#ef4444",
          cyan: "#06b6d4",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Cascadia Code",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
