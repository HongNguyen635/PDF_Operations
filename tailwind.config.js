/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/templates/*.html",
    "./src/static/javascript/*.js",
    "./src/pdf_manip/*.py",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },

      keyframes: {
        "open-menu": {
          "0%": { transform: "scaleY(0)" },
          "80%": { transform: "scaleY(1.2)" },
          "100%": { transform: "scaleY(1)" },
        },
        "close-menu": {
          "0%": { transform: "scaleY(1)" },
          "80%": { transform: "scaleY(1.2)" },
          "100%": { transform: "scaleY(0)" },
        },
      },
      animation: {
        "open-menu": "open-menu 0.5s ease-in-out forwards",
        "close-menu": "close-menu 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
