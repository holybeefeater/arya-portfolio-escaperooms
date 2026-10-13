import { todo } from '../todo.js'

// Craft exploration around a single jacket. Placeholders until material is supplied.
export default {
  slug: 'rexine-jacket',
  title: 'Rexine Jacket',
  type: 'exploration',
  disciplines: ['garments', 'materials'],
  featured: true,
  order: 4,
  premise: todo('One sentence: what the jacket explores.'),
  overview: [todo('Two or three sentences: why rexine, what you made, what you found.')],
  facts: [['Year', todo('Year')], ['Role', todo('Your role')], ['Material', 'Rexine'], ['Scope', todo('e.g. one jacket, from pattern to finished piece')]],
  cover: { placeholder: 'Cover image: the finished jacket' },
  hero: { placeholder: 'Lead image: the finished jacket, worn or on a form' },
  related: ['swatches', 'auxin'],
  sections: [
    { id: 'question', title: 'Question', modules: [{ kind: 'text', body: [todo('The question or brief behind the jacket.')] }] },
    { id: 'material', title: 'Material', modules: [
      { kind: 'text', body: [todo('How the material behaved: cutting, stitching, finishing, what surprised you.')] },
      { kind: 'materials', items: [{ name: 'Rexine', use: todo('Where and how it is used') }, { name: todo('Lining or second material'), use: todo('Use') }] },
    ] },
    { id: 'construction', title: 'Construction', modules: [
      { kind: 'steps', items: [{ title: 'Pattern', body: todo('Pattern and fit decisions') }, { title: 'Sampling', body: todo('Tests and toiles') }, { title: 'Making', body: todo('Construction steps') }, { title: 'Finishing', body: todo('Edges, seams, hardware') }] },
      { kind: 'images', cols: 3, items: [{ placeholder: 'Process photo' }, { placeholder: 'Process photo' }, { placeholder: 'Detail' }] },
    ] },
    { id: 'result', title: 'Result', final: true, modules: [{ kind: 'images', cols: 2, items: [{ placeholder: 'Front' }, { placeholder: 'Back or detail' }] }] },
    { id: 'learning', title: 'Learning', modules: [{ kind: 'text', body: [todo('What you learned from working in rexine.')] }] },
  ],
}
