import { useState, useRef, useEffect } from 'react'
import ProjectTile from './ProjectTile'
import projects from '../data/projects'
import useIsMobile from '../hooks/useIsMobile'

export default function ProjectGrid({ onProjectHover, hoveredProject, setActiveSection }) {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    // Find the custom scroll container (the div with overflowY: auto)
    let root = null
    let parent = el.parentElement
    while (parent) {
      if (parent.style && parent.style.overflowY === 'auto') {
        root = parent
        break
      }
      parent = parent.parentElement
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setActiveSection('work')
        }
      },
      { root, threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [setActiveSection])

  return (
    <section
      id="work"
      ref={gridRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: isMobile ? '80px 16px 40px' : '120px 40px 80px',
        pointerEvents: 'auto',
      }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          marginBottom: '64px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c084fc',
            marginBottom: '16px',
            display: 'block',
          }}>
            Selected Work
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
          }}>
            Featured Projects
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: isMobile ? '12px' : '24px',
        }}>
          {projects.map((project, index) => (
            <ProjectTile
              key={project.id}
              project={project}
              index={index}
              isVisible={isVisible}
              onHover={onProjectHover}
              isHovered={hoveredProject?.id === project.id}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
