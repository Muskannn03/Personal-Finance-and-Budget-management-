/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        ivory: '#FFF9F5',
        blush: '#FCEAE6',
        coral: {
          DEFAULT: '#FF8A78',
          pink: '#F16F83',
          dark: '#28232A',
          muted: '#88838C',
          border: '#E7DFDF',
        },
        brand: {
          primary: '#FF8A78',
          'primary-dark': '#F16F83',
          'primary-light': '#FCEAE6',
          bg: '#FFF9F5',
          surface: '#FFFFFF',
          border: '#E7DFDF',
        },
        text: {
          main: '#28232A',
          sub: '#88838C',
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
