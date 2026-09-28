// Turns 'assets/…' paths from content.js into URLs that work locally and on any host.
export const url = path => (import.meta.env.BASE_URL || '/') + String(path).replace(/^\/+/, '')
