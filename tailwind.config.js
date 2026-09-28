/** @type {import('tailwindcss').Config} */
// Palette is taken from Aditi's own Pantone card for Escape Rooms
// (7763 C, 7428 C, 567 C, Fort Knox) plus the fluorescent light of her moodboard.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        garage:   '#13241E', // 567 C, darkened: the underpass at night
        slab:     '#1C302A', // lifted garage surface
        concrete: '#CBCFBF', // fluorescent-lit concrete
        tube:     '#E6EBD9', // light of a fluorescent tube
        wine:     '#6A1F2E', // 7428 C: cherry maroon nappa
        olive:    '#5B5A34', // 7763 C: olive suede
        umber:    '#6B5543', // 7532 C
        brass:    '#A68B45', // 20-0037 Fort Knox: hardware, thread, floor tape
        exit:     '#3DDC84', // emergency-exit green: used only as light
        ink:      '#1E2A24', // body text on lit rooms
      },
      fontFamily: {
        sans: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      screens: { xs: '420px' },
    },
  },
  plugins: [],
}
