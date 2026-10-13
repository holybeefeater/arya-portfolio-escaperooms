// Everything personal on the site: name, introduction, links, résumé, about page.
// Facts here come from Aditi's résumé. Anything written todo('…') is not supplied yet
// and shows on the site as a marked gap until you replace it.
import { todo } from './todo.js'

export const site = {
  url: 'https://aditiaryaescaperoomsportfolio.vercel.app',
  name: 'Aditi Arya',
  // Shown under the name in the header and in search results.
  descriptor: 'Leather, footwear and garment design',
  // Home introduction. Short on purpose: who, what, where.
  intro: 'I design leather goods, footwear and garments, and the identities and stories that carry them. B.Des. Leather Design at NIFT Raebareli, with a minor in Fashion Communication.',
  // A second line for the introduction, in her own words (from her résumé).
  approach: 'My work begins with research and develops into visual identities and narratives that feel both intentional and expressive.',
  location: todo('City you are based in'),
  availability: todo('What you are looking for now, e.g. "Open to internships and graduation projects from …"'),
  email: 'aryaaditi2607@gmail.com',
  instagram: { handle: '@diffworld__', url: 'https://www.instagram.com/diffworld__/' },
  linkedin: 'https://www.linkedin.com/in/aditi-arya-787336364',
  resume: { href: '/downloads/Aditi-Arya-Resume.pdf', label: 'Résumé', size: 'PDF, 0.8 MB' },
  portfolioPdf: { href: '/downloads/Aditi-Arya-Full-Portfolio.pdf', label: 'Escape Rooms portfolio', size: 'PDF, 10 MB' },
  portrait: { image: 'about/portrait', alt: 'Aditi Arya holding a hand-painted bag, wearing her NIFT lanyard' },
}

export const about = {
  // Longer introduction for the About page. Her résumé text, lightly edited.
  bio: [
    'I am a design student drawn to design as a way to explore and to express. I am most interested in how ideas change through research, experiment and making by hand, and I like working just past the conventional approach, where there is still room to question and test.',
    'My work usually starts with research and grows into visual identities and narratives that feel intentional and expressive. I see design as a way to make sense of the world and to move through it with curiosity and purpose.',
  ],
  quote: { text: 'Craftsmanship is coordination made visible.', source: 'From my internship reflection, Hats Off Accessories' },
  education: [
    ['Bachelor of Design, Leather Design', 'NIFT Raebareli, 2023–2027'],
    ['Interdisciplinary minor, Fashion Communication', 'NIFT Raebareli'],
    ['Higher secondary', 'Mount Carmel School, Digwadih, 2021–2023'],
  ],
  experience: [
    ['Industry internship, Hats Off Accessories', '1 June – 24 July 2026. Print development, technical packs, product-line research, sourcing, content and set design.'],
    ['Tannery training, Mirza International Ltd., Unnao', 'Research, layout, creative direction.'],
    ['Design associate, materials and social media', 'Startup.'],
  ],
  recognition: [
    'Leather collection displayed at IFCOMA Shoetech, Kanpur, 2025',
    'First position, surrealism painting, Antaragini 2023',
    'Top 10 proposed designs, Toycathon 2023',
    'First position, poster design events, NIFT Raebareli',
    'Artwork published in Fashion Review, issue 1, Manchester',
    'Artwork published in Lost Stories, 4th edition, NLUJAA Assam',
  ],
  skills: [
    'Design research and trend forecasting', 'Leather goods design and material development',
    'Brand identity and visual communication', 'Creative art direction',
    'Product styling and concept development', 'Packaging, editorial and digital design',
  ],
  tools: ['Adobe Creative Suite', 'Procreate', 'Figma', 'Rhino 3D', 'CLO 3D', 'Shoemaster', 'ERP software'],
}

// Fonts used on the site, with sources and licences (shown in the footer colophon).
export const colophon = [
  { name: 'Schibsted Grotesk', by: 'Schibsted / Bakken & Bæck', licence: 'SIL Open Font License 1.1', source: 'https://github.com/schibsted/schibsted-grotesk' },
  { name: 'JetBrains Mono', by: 'JetBrains', licence: 'SIL Open Font License 1.1', source: 'https://github.com/JetBrains/JetBrainsMono' },
  { name: 'Bodoni Moda', by: 'Owen Earl (indestructible type*)', licence: 'SIL Open Font License 1.1', source: 'https://github.com/indestructible-type/Bodoni', note: 'KOSHA identity only' },
]
