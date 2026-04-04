/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Source Sans 3', 'DM Sans', 'system-ui', 'sans-serif'],
        'display': ['DM Sans', 'sans-serif'],
      },
      colors: {
        'primary': {
          50: '#DCFCE7',
          100: '#BBF7D0',
          200: '#86EFAC',
          300: '#4ADE80',
          400: '#22C55E',
          500: '#16A34A',
          600: '#15803D',
          700: '#166534',
          800: '#14532D',
          900: '#102E23',
        },
        'secondary': '#A16207',
        'accent': '#A16207',
        'dark': '#1F2937',
        'light': '#FFFBEB',
        'bg': '#FFFBEB',
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
      },
    },
  },
  plugins: [],
}