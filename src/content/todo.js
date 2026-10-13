// Placeholders for content that has not been supplied yet.
// Write todo('what goes here') in any text field; the site shows it as a marked gap.
export const todo = text => ({ todo: text })
export const isTodo = v => !!v && typeof v === 'object' && 'todo' in v
