/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBG: "#0B0C10",
        secondaryBG: "#1F2833",
        gray: "#C5C6C7",
        primaryT: "#66FCF1",
        secondaryT: "#45A29E",
      },
      fontFamily: {
        apercu: ["Apercu","sans-serif"],
      },
    },
  },
  plugins: [],
};
