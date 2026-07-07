import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

function SectionLabel({ children, color = '#00ccff' }) {
  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      fontSize: '10px',
      color,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      marginBottom: '8px',
      marginTop: '20px',
    }}>
      {children}
    </div>
  )
}

function BodyText({ children }) {
  return (
    <p style={{
      fontFamily: "'Courier New', monospace",
      fontSize: '13px',
      lineHeight: 1.8,
      color: 'rgba(255, 255, 255, 0.6)',
      margin: 0,
    }}>
      {children}
    </p>
  )
}

export default function ProjectModal({ project, onClose }) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!project) return
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [project])

  if (!mounted || !project) return null

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 200)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  const hostname = (() => {
    try { return new URL(project.url).hostname.replace(/^www\./, '') }
    catch { return project.url }
  })()

  return createPortal(
    <div
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483646,
        background: closing ? 'rgba(3, 8, 6, 0)' : 'rgba(3, 8, 6, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        transition: 'background 0.2s ease',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '960px',
          maxHeight: 'calc(100vh - 48px)',
          background: '#050806',
          border: '1px solid rgba(0, 255, 102, 0.25)',
          borderRadius: '4px',
          boxShadow: '0 0 60px rgba(0, 255, 102, 0.12), 0 20px 60px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          opacity: closing ? 0 : 1,
          transform: closing ? 'translateY(20px) scale(0.98)' : 'translateY(0) scale(1)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
          background: 'rgba(0, 255, 102, 0.02)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "'Courier New', monospace",
            fontSize: '10px',
            color: 'rgba(0, 255, 102, 0.5)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00ff66',
              boxShadow: '0 0 6px #00ff66',
            }} />
            <span>// PROJECT_CASE</span>
            <span style={{ color: 'rgba(0, 255, 102, 0.3)' }}>·</span>
            <span style={{ color: 'rgba(0, 255, 102, 0.7)' }}>{hostname}</span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close project details"
            style={{
              background: 'transparent',
              border: '1px solid rgba(0, 255, 102, 0.2)',
              color: 'rgba(0, 255, 102, 0.7)',
              width: '28px',
              height: '28px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Courier New', monospace",
              fontSize: '14px',
              lineHeight: 1,
              padding: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.5)'
              e.currentTarget.style.color = '#00ff66'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.2)'
              e.currentTarget.style.color = 'rgba(0, 255, 102, 0.7)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Screenshot */}
        <div style={{
          position: 'relative',
          width: '100%',
          background: '#0a0c0a',
          borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
          overflow: 'hidden',
          aspectRatio: '16/9',
          flexShrink: 0,
        }}>
          {project.screenshot ? (
            <img
              src={project.screenshot}
              alt={project.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(0, 255, 102, 0.3)',
              fontFamily: "'Courier New', monospace",
              fontSize: '12px',
            }}>
              [NO_SCREENSHOT]
            </div>
          )}
          {[
            { top: '12px', left: '12px', borderTop: '1px solid #00ff66', borderLeft: '1px solid #00ff66' },
            { top: '12px', right: '12px', borderTop: '1px solid #00ff66', borderRight: '1px solid #00ff66' },
            { bottom: '12px', left: '12px', borderBottom: '1px solid #00ff66', borderLeft: '1px solid #00ff66' },
            { bottom: '12px', right: '12px', borderBottom: '1px solid #00ff66', borderRight: '1px solid #00ff66' },
          ].map((b, i) => (
            <div key={i} style={{ position: 'absolute', width: '14px', height: '14px', ...b }} />
          ))}
        </div>

        {/* Body — scrollable */}
        <div style={{
          padding: '24px 28px 20px',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
        }}>
          {/* Title + CTA */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: project.color || '#00ff66',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                {'> '}{project.category} · {project.year}
              </div>
              <h2 id="modal-title" style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: 0,
                color: 'rgba(255, 255, 255, 0.95)',
              }}>
                {project.title}
              </h2>
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#030806',
                background: '#00ff66',
                padding: '12px 20px',
                borderRadius: '2px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(0, 255, 102, 0.25)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00ffaa'
                e.currentTarget.style.boxShadow = '0 0 28px rgba(0, 255, 102, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00ff66'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 102, 0.25)'
              }}
            >
              VISIT LIVE SITE
              <span style={{ fontSize: '14px' }}>↗</span>
            </a>
          </div>

          {/* Overview */}
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '13px',
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.55)',
            margin: 0,
            marginTop: '12px',
          }}>
            {'> '}{project.description}
          </p>

          {/* Problem */}
          {project.problem && (
            <>
              <SectionLabel color="#ff6666">{'> PROBLEM'}</SectionLabel>
              <div style={{
                paddingLeft: '14px',
                borderLeft: '2px solid rgba(255, 102, 102, 0.3)',
              }}>
                <BodyText>{project.problem}</BodyText>
              </div>
            </>
          )}

          {/* Solution */}
          {project.solution && (
            <>
              <SectionLabel color="#00ff66">{'> SOLUTION'}</SectionLabel>
              <div style={{
                paddingLeft: '14px',
                borderLeft: '2px solid rgba(0, 255, 102, 0.3)',
              }}>
                <BodyText>{project.solution}</BodyText>
              </div>
            </>
          )}

          {/* Stack */}
          {project.stack && project.stack.length > 0 && (
            <>
              <SectionLabel color="#00ccff">{'> BUILT_WITH'}</SectionLabel>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginTop: '4px',
              }}>
                {project.stack.map((tech) => (
                  <span key={tech} style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '10px',
                    color: 'rgba(0, 204, 255, 0.85)',
                    padding: '5px 10px',
                    borderRadius: '2px',
                    border: '1px solid rgba(0, 204, 255, 0.25)',
                    background: 'rgba(0, 204, 255, 0.05)',
                    letterSpacing: '0.05em',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Gallery placeholder (if project has gallery field) */}
          {project.gallery && project.gallery.length > 0 && (
            <>
              <SectionLabel color="#c084fc">{'> GALLERY'}</SectionLabel>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '8px',
                marginTop: '4px',
              }}>
                {project.gallery.map((src, i) => (
                  <div key={i} style={{
                    aspectRatio: '4/3',
                    background: '#0a0c0a',
                    border: '1px solid rgba(192, 132, 252, 0.2)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 28px',
          borderTop: '1px solid rgba(0, 255, 102, 0.08)',
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: 'rgba(0, 255, 102, 0.3)',
          letterSpacing: '0.1em',
          display: 'flex',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span>ESC or click outside to close</span>
          <span>{project.url ? '↗ ' + hostname : ''}</span>
        </div>
      </div>
    </div>,
    document.body
  )
}
