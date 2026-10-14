/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['"Josefin Sans"', 'sans-serif'],
        nunito: ['"Nunito Sans"', 'sans-serif'],
      },
      colors: {
        jungle: '#1A3028',
        forest: '#2D5242',
        moss: '#4A7560',
        sage: '#5C8A72',
        orange: '#E8620A',
        gold: '#C8A832',
        cream: '#F5F0D8',
        dew: '#F0E498',
        alba: '#FAFAF8',
        linen: '#F4F1EA',
      },
    },
  },
  plugins: [],
}
