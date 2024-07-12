/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,js,tsx,jsx}",
    "./components/**/*.{ts,js,tsx,jsx}",
    "./app/**/*.{ts,js,tsx,jsx}",
    "./src/**/*.{ts,js,tsx,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primaryBG: "#0B0C10",
        secondaryBG: "#1F2833",
        gray: "#C5C6C7",
        primaryT: "#66FCF1",
        secondaryT: "#45A29E",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(50deg, rgb(43, 10, 255), rgb(255, 91, 138) 49%, rgb(255, 91, 138) 53%, rgb(255, 91, 138) 55%, rgb(251, 166, 75) 77%, rgb(249, 155, 82))",
        "text-gradient": "linear-gradient(to right, #3b82f6, #a855f7)",
      },
      fontFamily: {
        apercu: ["Apercu", "sans-serif"],
        gt: ["GT", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        geist: ["geist"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
