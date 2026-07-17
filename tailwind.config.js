/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette: warm neutral + the browns used across the client's
        // own copy ("مرحبًا بكم في متجر كيان 🤎", "© 2026 By Kayaan").
        kayaan: {
          bg: "#faf7f2",
          ink: "#1c1917",
          brown: "#6b4a35",
          brownDark: "#4a3224",
          accent: "#c9a876",
          pink: "#f7e6e6", // running-bar background, per jana-store reference (§6.5)
        },
      },
      fontFamily: {
        arabic: ["Tahoma", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
