import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

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
          {/* corner brackets */}
          {[
            { top: '12px', left: '12px', borderTop: '1px solid #00ff66', borderLeft: '1px solid #00ff66' },
            { top: '12px', right: '12px', borderTop: '1px solid #00ff66', borderRight: '1px solid #00ff66' },
            { bottom: '12px', left: '12px', borderBottom: '1px solid #00ff66', borderLeft: '1px solid #00ff66' },
            { bottom: '12px', right: '12px', borderBottom: '1px solid #00ff66', borderRight: '1px solid #00ff66' },
          ].map((b, i) => (
            <div key={i} style={{ position: 'absolute', width: '14px', height: '14px', ...b }} />
          ))}
        </div>

        {/* Body */}
        <div style={{
          padding: '24px 28px 20px',
          overflowY: 'auto',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div>
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

          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '13px',
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.6)',
            margin: 0,
            marginBottom: project.stack ? '20px' : '0',
          }}>
            {'> '}{project.description}
          </p>

          {project.stack && project.stack.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(0, 255, 102, 0.08)',
            }}>
              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '9px',
                color: 'rgba(0, 255, 102, 0.4)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginRight: '6px',
                alignSelf: 'center',
              }}>
                BUILT_WITH
              </span>
              {project.stack.map((tech) => (
                <span key={tech} style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '10px',
                  color: 'rgba(0, 255, 102, 0.8)',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  border: '1px solid rgba(0, 255, 102, 0.2)',
                  background: 'rgba(0, 255, 102, 0.04)',
                  letterSpacing: '0.05em',
                }}>
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '10px 28px',
          borderTop: '1px solid rgba(0, 255, 102, 0.08)',
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: 'rgba(0, 255, 102, 0.3)',
          letterSpacing: '0.1em',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>ESC or click outside to close</span>
          <span>{project.url ? '↗ ' + hostname : ''}</span>
        </div>
      </div>
    </div>,
    document.body
  )
}
