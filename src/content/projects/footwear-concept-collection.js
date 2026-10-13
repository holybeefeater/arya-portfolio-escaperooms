import { todo } from '../todo.js'

// Footwear concepts. Placeholders until material is supplied.
export default {
  slug: 'footwear-concept-collection',
  title: 'Footwear Concept Collection',
  type: 'exploration',
  disciplines: ['footwear'],
  featured: false,
  order: 6,
  premise: todo('One sentence: the idea behind the footwear concepts.'),
  overview: [todo('Two or three sentences: how many concepts, what they explore, how far they were developed.')],
  facts: [['Year', todo('Year')], ['Role', todo('Your role')], ['Scope', todo('e.g. six concepts, two developed to specification')]],
  cover: { placeholder: 'Cover image: the strongest concept render or sample' },
  hero: { placeholder: 'Lead image: the concepts as a line-up' },
  related: ['auxin', 'escape-rooms'],
  sections: [
    { id: 'idea', title: 'Idea', modules: [{ kind: 'text', body: [todo('The theme and references.')] }] },
    { id: 'concepts', title: 'Concepts', final: true, modules: [
      { kind: 'range', prefix: 'Concept', items: Array.from({ length: 4 }, (_, i) => ({ name: todo(`Concept ${i + 1} name`), desc: todo('What it is, construction, materials') })) },
    ] },
    { id: 'development', title: 'Development', modules: [
      { kind: 'images', cols: 2, items: [{ placeholder: 'Sketches' }, { placeholder: 'Technical drawing or last' }] },
      { kind: 'text', body: [todo('Construction, sole and material decisions.')] },
    ] },
    { id: 'learning', title: 'Learning', modules: [{ kind: 'text', body: [todo('What you learned.')] }] },
  ],
}
