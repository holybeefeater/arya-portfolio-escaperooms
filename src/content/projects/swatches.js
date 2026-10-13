import { todo } from '../todo.js'

// Material exploration: a swatch library. Placeholders until material is supplied.
export default {
  slug: 'swatches',
  title: 'Swatches',
  type: 'exploration',
  disciplines: ['materials'],
  featured: true,
  order: 5,
  premise: todo('One sentence: what the swatches test.'),
  overview: [todo('Two or three sentences: the techniques or materials explored and why.')],
  facts: [['Year', todo('Year')], ['Count', todo('Number of swatches')], ['Techniques', todo('e.g. embossing, weaving, burnishing, dyeing')]],
  cover: { placeholder: 'Cover image: a group of swatches, shot flat' },
  hero: { placeholder: 'Lead image: the full set laid out in a grid' },
  related: ['rexine-jacket', 'auxin', 'tannery'],
  sections: [
    { id: 'aim', title: 'Aim', modules: [{ kind: 'text', body: [todo('What you wanted to find out.')] }] },
    { id: 'library', title: 'Swatch library', final: true, intro: 'Each swatch with its technique and material.', modules: [
      { kind: 'materials', items: Array.from({ length: 8 }, (_, i) => ({ name: todo(`Swatch ${String(i + 1).padStart(2, '0')}: technique`), use: todo('Material and process') })) },
    ] },
    { id: 'process', title: 'Process', modules: [{ kind: 'images', cols: 3, items: [{ placeholder: 'Process' }, { placeholder: 'Process' }, { placeholder: 'Process' }] }] },
    { id: 'learning', title: 'Learning', modules: [{ kind: 'text', body: [todo('Which techniques worked, and where you would use them.')] }] },
  ],
}
