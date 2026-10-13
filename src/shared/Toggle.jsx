import { useState } from 'react'
import { projects, hrefOf } from './projects'
import { swapTo, prefetch } from './swap'

// The collection switch in the header. Each option is a real link to that
// collection's page, so it also works opened in a new tab or without scripts.
export default function Toggle({ current, className = '' }) {
  const here = projects.findIndex(p => p.id === current)
  const [at, setAt] = useState(here)
  return (
    <nav className={`aa-toggle ${className}`} aria-label="Collections" style={{ '--n': projects.length, '--i': at }}>
      <span className="aa-toggle-knob" aria-hidden="true" />
      {projects.map((p, i) => (
        <a
          key={p.id}
          href={hrefOf(p)}
          className={i === at ? 'is-on' : ''}
          aria-current={p.id === current ? 'page' : undefined}
          onPointerEnter={() => prefetch(p.id)}
          onFocus={() => prefetch(p.id)}
          onClick={e => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return
            e.preventDefault()
            if (p.id === current) return
            setAt(i)
            swapTo(p.id)
          }}
        >
          {p.short}
        </a>
      ))}
    </nav>
  )
}
