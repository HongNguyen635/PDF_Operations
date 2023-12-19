/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/templates/*.html", "./src/static/js/*.js"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
