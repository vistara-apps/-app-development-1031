/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors from specifications
        bg: 'hsl(210, 30%, 98%)',
        error: 'hsl(0, 80%, 50%)',
        accent: 'hsl(130, 70%, 45%)',
        primary: 'hsl(210, 80%, 40%)',
        surface: 'hsl(210, 30%, 95%)',
        notification: 'hsl(30, 90%, 50%)',
      },
      borderRadius: {
        // Design system radius tokens
        'xs': '4px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '24px',
      },
      spacing: {
        // Design system spacing tokens
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        // Design system shadows
        'card': '0 4px 12px hsla(210, 30%, 20%, 0.1)',
        'elevated': '0 12px 24px hsla(210, 30%, 20%, 0.1)',
      },
      animation: {
        // Design system motion
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-in-fast': 'fadeIn 100ms ease-out',
        'fade-in-slow': 'fadeIn 300ms ease-out',
        'pulse-emergency': 'pulseEmergency 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseEmergency: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      maxWidth: {
        'container': '768px', // max-w-3xl equivalent
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
