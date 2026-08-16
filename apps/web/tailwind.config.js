/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Tokens tomados literalmente del sistema de marca Oponow (Nocturne).
      colors: {
        ink: {
          DEFAULT: "#161826", // --color-bg
          surface: "#232532", // --color-surface
          text: "#e9e9ed", // --color-text
          divider: "rgba(233, 233, 237, 0.16)", // --color-divider
        },
        accent: {
          DEFAULT: "#9184d9",
          100: "#f5f4ff",
          200: "#e7e5fe",
          300: "#d2cefd",
          400: "#b5abfc",
          500: "#968ae0",
          600: "#796cbf",
          700: "#5d5294",
          800: "#423a6a",
          900: "#2b2741",
        },
        neutral: {
          100: "#f3f5fe",
          200: "#e4e7f5",
          300: "#cfd3e5",
          400: "#b2b6ca",
          500: "#9397ab",
          600: "#75798c",
          700: "#595d6c",
          800: "#3f424d",
          900: "#292b31",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        md: "8px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};
