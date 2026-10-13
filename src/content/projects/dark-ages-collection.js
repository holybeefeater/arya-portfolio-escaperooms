import { todo } from '../todo.js'

// Thematic exploration. Nothing about this project has been supplied yet:
// every field below is a marked placeholder. Replace todo('…') with your text,
// and add images to media/dark-ages-collection/ (then run `npm run images`).
export default {
  slug: 'dark-ages-collection',
  title: 'Dark Ages Collection',
  type: 'exploration',
  disciplines: [],   // add when known: 'bags', 'footwear', 'garments', 'materials'
  featured: false,
  order: 3,
  premise: todo('One sentence: the theme or question this collection explores.'),
  overview: [todo('Two or three sentences: what you set out to explore, what you made, and what came of it.')],
  facts: [['Year', todo('Year')], ['Role', todo('Your role')], ['Scope', todo('What was made: pieces, samples, sketches')]],
  cover: { placeholder: 'Cover image: the strongest finished piece or study' },
  hero: { placeholder: 'Lead image: the strongest outcome', note: 'Wide image, at least 2400 px across.' },
  related: ['rexine-jacket', 'swatches'],
  sections: [
    { id: 'theme', title: 'Theme', modules: [
      { kind: 'text', body: [todo('The theme or question, and why it interested you.')] },
      { kind: 'images', cols: 2, items: [{ placeholder: 'Reference or mood image' }, { placeholder: 'Reference or mood image' }] },
    ] },
    { id: 'experiments', title: 'Experiments', modules: [
      { kind: 'text', body: [todo('What you tried, in order. A short caption per experiment works well.')] },
      { kind: 'images', cols: 3, items: [{ placeholder: 'Experiment 01' }, { placeholder: 'Experiment 02' }, { placeholder: 'Experiment 03' }] },
    ] },
    { id: 'construction', title: 'Construction and material decisions', modules: [
      { kind: 'text', body: [todo('The decisions that shaped the result: materials, techniques, why.')] },
    ] },
    { id: 'results', title: 'Results', final: true, modules: [
      { kind: 'image', placeholder: 'Final piece or set of pieces', ratio: 3 / 2, size: 'wide' },
    ] },
    { id: 'learning', title: 'Learning', modules: [{ kind: 'text', body: [todo('What this taught you, and where it led.')] }] },
  ],
}
