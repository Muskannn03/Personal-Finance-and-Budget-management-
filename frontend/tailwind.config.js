/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#E98FA3',
          'primary-dark': '#D96F88',
          'primary-light': '#F8DDE4',
          bg: '#FFF9F7',
          surface: '#FFFFFF',
          border: '#EEE5E7',
        },
        text: {
          main: '#29252A',
          sub: '#777177',
        },
        semantic: {
          income: '#8FB9A8',     // soft green
          expense: '#E76F51',    // muted coral/red
          savings: '#C3B1E1',    // lavender
          investment: '#D6A2E8', // soft purple
          budget: '#FDE2E4',     // peach/orange
          goals: '#E98FA3',      // pink
          reminder: '#F9D423',   // yellow/amber
          info: '#3498db',       // soft blue
        }
      }
    },
  },
  plugins: [],
}
