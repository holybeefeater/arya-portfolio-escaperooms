/** @type {import('tailwindcss').Config} */
// Auxin's palette comes from the deck: the sage of its pages, the cobalt of the
// leather, and the four Pantone references on the colour board.
export default {
  content: ['./auxin/index.html', './src/auxin/**/*.{js,jsx}', './src/shared/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sage:    '#D6DECE', // page ground (the deck's pages)
        moss:    '#C5CCB4', // deck board colour, a shade deeper
        pale:    '#E3E8DA', // lit ground
        cobalt:  '#22397A', // ink: the jacket's blue
        surf:    '#203C7F', // Pantone 19-3952 TCX, Surf the Web
        teal:    '#34657F', // Pantone 7699 C
        fern:    '#7D956D', // Pantone 16-0224 TCX, Green Eyes
        juniper: '#3D7245', // Pantone 18-6330 TCX
        soil:    '#1E2B23', // the roots chapter
        thread:  '#E8E2CC', // stitching
        brass:   '#A68B45', // rivets and eyelets
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Archivo Variable"', 'Archivo', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      screens: { xs: '420px' },
    },
  },
  plugins: [],
}
