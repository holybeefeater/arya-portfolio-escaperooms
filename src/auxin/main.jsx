import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// Fonts are bundled with the page (SIL Open Font License), so it also works offline.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '../shared/shared.css'
import './styles.css'

document.documentElement.dataset.ink = 'dark'
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
