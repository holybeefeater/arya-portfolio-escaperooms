import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header, Footer } from './components/chrome'
import { LightboxProvider } from './components/media'
import { ProjectOverlay, ProjectPage } from './components/ProjectView'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import NotFound from './pages/NotFound'

function Frame({ children }) {
  return (<><Header /><main id="main" tabIndex={-1}>{children}</main><Footer /></>)
}

// Routes:  /  ·  /work  ·  /work/:slug  ·  /about
// When a project is opened from inside the site, location.state.background keeps the
// page underneath, and the project renders over it. Visiting /work/:slug directly
// (a shared link, a reload) renders the full standalone project page instead.
export default function App() {
  const location = useLocation()
  const background = location.state?.background

  // new pages start at the top; the overlay keeps the page underneath where it was
  useEffect(() => { if (!background && !location.hash) window.scrollTo(0, 0) }, [location.pathname])

  return (
    <LightboxProvider>
      <Routes location={background || location}>
        <Route path="/" element={<Frame><Home /></Frame>} />
        <Route path="/work" element={<Frame><Work /></Frame>} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="/about" element={<Frame><About /></Frame>} />
        <Route path="*" element={<Frame><NotFound /></Frame>} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/work/:slug" element={<ProjectOverlay />} />
        </Routes>
      )}
    </LightboxProvider>
  )
}
