import { useEffect } from 'react'
import { site } from '../content/site'

// Sets the page title and sharing metadata while the page is open.
// (Crawlers read the same tags from the prerendered HTML: scripts/prerender.mjs.)
const setMeta = (attr, key, value) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', value)
}

export function useHead({ title, description, image, path }) {
  useEffect(() => {
    const full = title ? `${title} · ${site.name}` : `${site.name} · ${site.descriptor}`
    document.title = full
    const desc = description || site.intro
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', desc)
    setMeta('name', 'twitter:title', full)
    if (image) { setMeta('property', 'og:image', site.url + image); setMeta('name', 'twitter:image', site.url + image) }
    if (path != null) {
      setMeta('property', 'og:url', site.url + path)
      let link = document.head.querySelector('link[rel="canonical"]')
      if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
      link.href = site.url + path
    }
  }, [title, description, image, path])
}
