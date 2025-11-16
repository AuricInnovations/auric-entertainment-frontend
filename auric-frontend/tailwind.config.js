/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        auric: {
          bg: "#0f0f12",
          panel: "#18181e",
          gold: "#FFD700",
          goldSoft: "#ffdb4d",
          text: "#ffffff",
          textDim: "#cfcfcf",
        }
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,.35)"
      },
      backdropBlur: {
        xs: "2px"
      }
    },
  },
  plugins: [],
}
