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
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ad',
          300: '#f6bc79',
          400: '#f19643',
          500: '#ed7a1f',
          600: '#de6015',
          700: '#b84913',
          800: '#933b17',
          900: '#773316',
        },
        secondary: {
          50: '#f4f7fb',
          100: '#e8eff6',
          200: '#ccddeb',
          300: '#a0c1da',
          400: '#6da0c4',
          500: '#4a84ae',
          600: '#386a92',
          700: '#2e5577',
          800: '#294963',
          900: '#273e53',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
