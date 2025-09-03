/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(234, 82%, 57%)",
        accent: "hsl(158, 75%, 50%)",
        bg: "hsl(0, 0%, 98%)",
        surface: "hsl(0, 0%, 100%)"
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '32px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0, 0%, 0%, 0.08)',
        modal: '0 16px 48px hsla(0, 0%, 0%, 0.16)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
          },
        },
      },
    },
  },
  plugins: [],
};

