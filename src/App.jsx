import { useState, useCallback, useRef, useEffect } from 'react'
import Scene from './components/Scene'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import ProjectGrid from './components/ProjectGrid'
import About from './components/About'
import Contact from './components/Contact'
import CustomCursor from './components/CustomCursor'
import DataStream from './components/DataStream'
import GlitchOverlay from './components/GlitchOverlay'

export default function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [hoveredProject, setHoveredProject] = useState(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const scrollRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const scrollToTop = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Track which section is in view
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const sections = ['hero', 'work', 'about', 'contact']
    const observers = []

    sections.forEach((id) => {
      const el = container.querySelector(`#${id}`)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        {
          root: container,
          threshold: 0.3,
        }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ width: '100vw', height: '100dvh', overflow: 'hidden', background: '#030806' }}
    >
      <Scene />

      <DataStream />
      <GlitchOverlay />
      <CustomCursor cursorPosition={cursorPosition} hoveredProject={hoveredProject} />

      <div
        ref={scrollRef}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          pointerEvents: 'none',
        }}
      >
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} scrollToTop={scrollToTop} />
        <Hero />
        <ProjectGrid onProjectHover={setHoveredProject} hoveredProject={hoveredProject} setActiveSection={setActiveSection} />
        <About />
        <Contact />
      </div>
    </div>
  )
}
