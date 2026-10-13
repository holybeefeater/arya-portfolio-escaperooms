import { todo } from '../todo.js'

// Research and documentation. Facts come from the résumé; everything else is a placeholder.
export default {
  slug: 'crd',
  title: 'CRD',
  subtitle: 'Listed on the résumé as “Craft Research Documentation (CRD): Aipan Art”',
  type: 'research',
  disciplines: [],
  featured: true,
  order: 7,
  premise: todo('One sentence: what the research documented and why.'),
  overview: [todo('Two or three sentences: the craft, where and how you researched it, what came out of it.')],
  facts: [['Role', 'Research, creative direction'], ['Subject', 'Aipan art'], ['Year', todo('Year')], ['Method', todo('e.g. field visits, interviews with artisans, documentation')], ['Output', todo('e.g. a documentation book')]],
  cover: { placeholder: 'Cover image: a spread from the documentation, or the craft itself' },
  hero: { placeholder: 'Lead image: field photograph or a spread from the document' },
  related: ['tannery', 'swatches'],
  sections: [
    { id: 'purpose', title: 'Purpose', modules: [{ kind: 'text', body: [todo('Why this craft, and what the documentation set out to record.')] }] },
    { id: 'method', title: 'Context and method', modules: [
      { kind: 'facts', items: [['Where', todo('Location')], ['When', todo('Dates')], ['With', todo('Artisans or institutions, only as you want them credited')], ['Methods', todo('Observation, interviews, photography …')]] },
      { kind: 'text', body: [todo('How the research was carried out.')] },
    ] },
    { id: 'observations', title: 'Observations', modules: [
      { kind: 'images', cols: 3, items: [{ placeholder: 'Field photograph', caption: todo('Caption: what it shows') }, { placeholder: 'Field photograph', caption: todo('Caption') }, { placeholder: 'Field photograph', caption: todo('Caption') }] },
      { kind: 'text', body: [todo('Documented observations: materials, tools, motifs, process.')] },
    ] },
    { id: 'synthesis', title: 'Synthesis', final: true, modules: [
      { kind: 'text', body: [todo('What the research added up to.')] },
      { kind: 'images', cols: 2, items: [{ placeholder: 'Document spread' }, { placeholder: 'Document spread' }] },
    ] },
    { id: 'implications', title: 'Implications for design', modules: [{ kind: 'text', body: [todo('How this research informs your design work.')] }] },
  ],
}
