import { todo } from '../todo.js'

// Research and documentation from tannery training. Facts from the résumé; the rest is placeholder.
export default {
  slug: 'tannery',
  title: 'Tannery',
  subtitle: 'Tannery training, Mirza International Ltd., Unnao',
  type: 'research',
  disciplines: ['materials'],
  featured: false,
  order: 8,
  premise: todo('One sentence: what you observed and documented at the tannery.'),
  overview: [todo('Two or three sentences: the training, the processes you documented, and what you took from them.')],
  facts: [['Role', 'Research, layout, creative direction'], ['Where', 'Mirza International Ltd., Unnao'], ['Year', todo('Year and duration')]],
  cover: { placeholder: 'Cover image: a tannery process or a page from the documentation' },
  hero: { placeholder: 'Lead image: the tannery floor or a process close-up' },
  related: ['crd', 'swatches'],
  sections: [
    { id: 'purpose', title: 'Purpose', modules: [{ kind: 'text', body: [todo('Why the training, and what you wanted to understand.')] }] },
    { id: 'process', title: 'From hide to leather', intro: 'The stages you observed, in order.', modules: [
      { kind: 'steps', items: Array.from({ length: 6 }, (_, i) => ({ title: todo(`Stage ${i + 1}`), body: todo('What happens here, and what you noted') })) },
      { kind: 'images', cols: 3, items: [{ placeholder: 'Process photograph' }, { placeholder: 'Process photograph' }, { placeholder: 'Process photograph' }] },
    ] },
    { id: 'documentation', title: 'Documentation', final: true, modules: [{ kind: 'images', cols: 2, items: [{ placeholder: 'Layout spread' }, { placeholder: 'Layout spread' }] }] },
    { id: 'implications', title: 'Implications for design', modules: [{ kind: 'text', body: [todo('How knowing the process changes how you choose and use leather.')] }] },
  ],
}
