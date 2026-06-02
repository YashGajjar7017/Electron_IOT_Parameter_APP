/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./client/src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(69, 125, 255, 0.14)'
      },
      colors: {
        glass: 'rgba(255,255,255,0.08)',
        glassBorder: 'rgba(255,255,255,0.18)'
      }
    }
  },
  plugins: []
};
