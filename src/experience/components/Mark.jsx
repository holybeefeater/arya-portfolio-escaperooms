// Aditi's maker's mark: two A's whose inner legs stand as the jambs of a doorway,
// under one shared lintel. Drawn as a stamp that can be debossed into leather.
export const MARK_LETTERS = 'M16 96 L37 24 H52 V96 M26 70 H52 M68 96 V24 H83 L104 96 M68 70 H94'

export default function Mark({ stamp = true, className = '', title }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 120 120" role={title ? 'img' : undefined} aria-hidden={title ? undefined : 'true'} aria-label={title}>
      {stamp && <rect x="3" y="3" width="114" height="114" rx="14" fill="none" stroke="currentColor" strokeWidth="3.5" />}
      {stamp && <rect x="11" y="11" width="98" height="98" rx="8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="4.5 3.5" opacity="0.85" />}
      <path d={MARK_LETTERS} fill="none" stroke="currentColor" strokeWidth="8.5" strokeLinejoin="miter" strokeLinecap="butt" />
    </svg>
  )
}
