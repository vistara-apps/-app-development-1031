/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(210, 30%, 95%)',
        text: 'hsl(220, 20%, 15%)',
        accent: 'hsl(40, 90%, 55%)',
        primary: 'hsl(230, 75%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0, 0%, 0%, 0.08)',
      },
      spacing: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
      fontSize: {
        body: ['0.875rem', '1rem'], // text-sm leading-4
        display: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }], // text-xl font-semibold
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          lg: '1024px',
        },
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        '4': '16px',
      },
    },
  },
  plugins: [],
};

