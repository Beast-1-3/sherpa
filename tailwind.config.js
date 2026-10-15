/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sherpa: {
          purple: '#5B5BD6',
          purpleLight: '#7C7CE0',
          purpleDark: '#4848B8',
          lavender: '#F0F0FF',
          lavenderMid: '#E8E8F8',
          lavenderDark: '#D0D0EE',
          bg: '#F0EFF8',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
