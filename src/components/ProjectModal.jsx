import { useState, useEffect } from 'react'

function CarouselSlide({ src, label, idx }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0a0c0a' }}>
      {src ? (
        <img src={src} alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top center', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0, 255, 102, 0.3)', fontFamily: "'Courier New', monospace", fontSize: '12px' }}>[NO_IMAGE]</div>
      )}
      <div style={{
        position: 'absolute', top: '8px', left: '10px',
        fontFamily: "'Courier New', monospace", fontSize: '9px',
        color: 'rgba(0, 255, 102, 0.7)', letterSpacing: '0.15em',
        textTransform: 'uppercase', padding: '3px 8px',
        background: 'rgba(3, 8, 6, 0.75)', border: '1px solid rgba(0, 255, 102, 0.2)',
        borderRadius: '2px', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        <span style={{ width: '4px', height: '4px', background: '#00ff66', borderRadius: '50%' }} />
        {label}
      </div>
    </div>
  )
}

function CaseStudy({ project }) {
  return (
    <div style={{ padding: '0 2px' }}>
      {project.problem && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: '9px',
            color: '#ff6666', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <span style={{ width: '4px', height: '4px', background: '#ff6666', borderRadius: '50%' }} />
            {'> THE_PROBLEM'}
          </div>
          <div style={{
            paddingLeft: '10px', borderLeft: '2px solid rgba(255, 102, 102, 0.3)',
            fontFamily: "'Courier New', monospace", fontSize: '11px',
            lineHeight: 1.45, color: 'rgba(255, 255, 255, 0.65)',
          }}>
            {project.problem}
          </div>
        </div>
      )}

      {project.solution && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: '9px',
            color: '#00ff66', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <span style={{ width: '4px', height: '4px', background: '#00ff66', borderRadius: '50%' }} />
            {'> THE_SOLUTION'}
          </div>
          <div style={{
            paddingLeft: '10px', borderLeft: '2px solid rgba(0, 255, 102, 0.3)',
            fontFamily: "'Courier New', monospace", fontSize: '11px',
            lineHeight: 1.45, color: 'rgba(255, 255, 255, 0.65)',
          }}>
            {project.solution}
          </div>
        </div>
      )}

      {project.stack?.length > 0 && (
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: '9px',
            color: '#00ccff', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <span style={{ width: '4px', height: '4px', background: '#00ccff', borderRadius: '50%' }} />
            {'> BUILT_WITH'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {project.stack.map((tech) => (
              <span key={tech} style={{
                fontFamily: "'Courier New', monospace", fontSize: '9px',
                color: 'rgba(0, 204, 255, 0.85)', padding: '3px 7px',
                borderRadius: '2px', border: '1px solid rgba(0, 204, 255, 0.25)',
                background: 'rgba(0, 204, 255, 0.05)', letterSpacing: '0.05em',
              }}>{tech}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectModal({ project, onClose }) {
  const [slideIdx, setSlideIdx] = useState(0)
  const [closing, setClosing] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    setSlideIdx(0)
    setSheetOpen(false)
  }, [project?.id])

  useEffect(() => {
    if (!project) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (sheetOpen) setSheetOpen(false)
        else handleClose()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [project, sheetOpen])

  if (!project) return null

  const buildGallery = () => {
    if (!project.screenshot) return []
    const base = project.screenshot.replace(/\.png$/, '')
    return [
      { src: `${base}.png`, label: 'HOME' },
      { src: `${base}-2.png`, label: 'SECTION_02' },
      { src: `${base}-3.png`, label: 'SECTION_03' },
      { src: `${base}-4.png`, label: 'FOOTER' },
    ]
  }
  const gallery = buildGallery()

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 180)
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) handleClose()
  }

  const visitButtonStyle = {
    fontFamily: "'Courier New', monospace", fontSize: '12px', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#030806',
    background: '#00ff66', padding: '12px 20px', borderRadius: '2px',
    textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px',
    boxShadow: '0 0 20px rgba(0, 255, 102, 0.35)', transition: 'all 0.2s',
    border: 'none', cursor: 'pointer', fontFamily: "'Courier New', monospace",
  }

  return (
    <div
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: closing ? 'rgba(3, 8, 6, 0)' : 'rgba(3, 8, 6, 0.88)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', transition: 'background 0.18s ease',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: '1100px',
          height: 'calc(100vh - 32px)', maxHeight: '900px',
          background: '#050806',
          border: '1px solid rgba(0, 255, 102, 0.3)',
          borderRadius: '4px',
          boxShadow: '0 0 60px rgba(0, 255, 102, 0.15), 0 20px 60px rgba(0, 0, 0, 0.7)',
          display: 'flex', flexDirection: 'column',
          opacity: closing ? 0 : 1,
          transition: 'opacity 0.18s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 18px', borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
          background: 'rgba(0, 255, 102, 0.02)', flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: "'Courier New', monospace", fontSize: '10px',
            color: 'rgba(0, 255, 102, 0.5)', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff66', boxShadow: '0 0 6px #00ff66' }} />
            <span>// PROJECT_CASE</span>
            <span style={{ color: 'rgba(0, 255, 102, 0.3)' }}>·</span>
            <span style={{ color: 'rgba(0, 255, 102, 0.7)' }}>{String(slideIdx + 1).padStart(2, '0')}/{String(gallery.length).padStart(2, '0')}</span>
            <span style={{ color: 'rgba(0, 255, 102, 0.3)' }}>·</span>
            <span id="modal-title" style={{ color: project.color || '#00ff66' }}>{project.title.toUpperCase()}</span>
          </div>
          <button onClick={handleClose} aria-label="Close"
            style={{
              background: 'transparent', border: '1px solid rgba(0, 255, 102, 0.25)',
              color: 'rgba(0, 255, 102, 0.7)', width: '30px', height: '30px',
              borderRadius: '2px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Courier New', monospace", fontSize: '14px', lineHeight: 1, padding: 0,
            }}>✕</button>
        </div>

        {/* Carousel — flex: 1, shrinks when sheet opens */}
        <div style={{
          position: 'relative', width: '100%', background: '#0a0c0a',
          overflow: 'hidden', flex: 1, minHeight: 0,
        }}>
          <div style={{
            display: 'flex', height: '100%',
            transform: `translateX(-${slideIdx * 100}%)`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {gallery.map((slide, i) => (
              <div key={i} style={{ width: '100%', height: '100%', flexShrink: 0 }}>
                <CarouselSlide src={slide.src} label={slide.label} idx={i} />
              </div>
            ))}
          </div>

          {slideIdx > 0 && (
            <button onClick={() => setSlideIdx(i => Math.max(0, i - 1))} aria-label="Previous"
              style={{
                position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(3, 8, 6, 0.85)', border: '1px solid rgba(0, 255, 102, 0.4)',
                color: '#00ff66', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', lineHeight: 1, padding: 0, backdropFilter: 'blur(4px)',
              }}>‹</button>
          )}
          {slideIdx < gallery.length - 1 && (
            <button onClick={() => setSlideIdx(i => Math.min(gallery.length - 1, i + 1))} aria-label="Next"
              style={{
                position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(3, 8, 6, 0.85)', border: '1px solid rgba(0, 255, 102, 0.4)',
                color: '#00ff66', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', lineHeight: 1, padding: 0, backdropFilter: 'blur(4px)',
              }}>›</button>
          )}

          {/* Top-center: clean dot indicator + counter (above the bottom sheet) */}
          <div style={{
            position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 16px', background: 'rgba(3, 8, 6, 0.85)',
            border: '1px solid rgba(0, 255, 102, 0.3)', borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 102, 0.05)',
            zIndex: 6,
          }}>
            {Array.from({ length: gallery.length }).map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)} aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === slideIdx ? '22px' : '7px', height: '7px',
                  borderRadius: '4px',
                  background: i === slideIdx ? '#00ff66' : 'rgba(0, 255, 102, 0.3)',
                  border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.25s',
                  boxShadow: i === slideIdx ? '0 0 8px rgba(0, 255, 102, 0.8)' : 'none',
                }} />
            ))}
            <span style={{
              fontFamily: "'Courier New', monospace", fontSize: '10px',
              color: 'rgba(0, 255, 102, 0.9)', letterSpacing: '0.15em',
              fontWeight: 700, minWidth: '36px', textAlign: 'center',
              borderLeft: '1px solid rgba(0, 255, 102, 0.2)',
              paddingLeft: '10px', marginLeft: '2px',
            }}>
              {String(slideIdx + 1).padStart(2, '0')}<span style={{ color: 'rgba(0, 255, 102, 0.4)' }}>/</span>{String(gallery.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Bottom sheet — slides up from bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#050806',
          borderTop: '1px solid rgba(0, 255, 102, 0.3)',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
          transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          height: sheetOpen ? '60%' : '64px',
          display: 'flex', flexDirection: 'column',
          zIndex: 5,
        }}>
          {/* Sheet header — always visible */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', borderBottom: sheetOpen ? '1px solid rgba(0, 255, 102, 0.1)' : 'none',
            flexShrink: 0, minHeight: '44px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontFamily: "'Courier New', monospace", fontSize: '10px',
              color: 'rgba(0, 255, 102, 0.5)', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {sheetOpen ? (
                <>
                  <span style={{ width: '4px', height: '4px', background: '#00ff66', borderRadius: '50%' }} />
                  {'> CASE_STUDY'}
                </>
              ) : (
                <span style={{ color: 'rgba(0, 255, 102, 0.4)' }}>{'// ACTIONS'}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!sheetOpen && (
                <button onClick={() => setSheetOpen(true)}
                  style={{
                    fontFamily: "'Courier New', monospace", fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#00ff66', background: 'rgba(0, 255, 102, 0.08)',
                    border: '1px solid rgba(0, 255, 102, 0.3)', padding: '8px 14px',
                    borderRadius: '2px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: '6px',
                  }}>VIEW CASE STUDY <span style={{ fontSize: '10px' }}>▴</span></button>
              )}
              <a href={project.url} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontFamily: "'Courier New', monospace", fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#030806',
                  background: '#00ff66', padding: '8px 14px', borderRadius: '2px',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                  gap: '6px', boxShadow: '0 0 12px rgba(0, 255, 102, 0.3)',
                }}>VISIT PAGE <span style={{ fontSize: '11px' }}>↗</span></a>
              {sheetOpen && (
                <button onClick={() => setSheetOpen(false)} aria-label="Minimize"
                  style={{
                    background: 'rgba(0, 255, 102, 0.08)', border: '1px solid rgba(0, 255, 102, 0.3)',
                    color: '#00ff66', width: '32px', height: '32px',
                    borderRadius: '2px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', lineHeight: 1, padding: 0,
                  }}>▾</button>
              )}
            </div>
          </div>

          {/* Sheet body — only when open */}
          {sheetOpen && (
            <div className="modal-body-scroll" style={{
              flex: 1, overflowY: 'scroll', overflowX: 'hidden',
              padding: '10px 16px 12px', minHeight: 0,
              WebkitOverflowScrolling: 'touch',
            }}>
              {/* Category + year strip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px',
                fontFamily: "'Courier New', monospace", fontSize: '10px',
                color: project.color || '#00ff66', letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                <span style={{ width: '4px', height: '4px', background: project.color || '#00ff66', borderRadius: '50%' }} />
                {project.category} · {project.year}
              </div>

              <p style={{
                fontFamily: "'Courier New', monospace", fontSize: '12px',
                lineHeight: 1.45, color: 'rgba(255, 255, 255, 0.5)', margin: '0 0 10px 0', fontSize: '11px',
              }}>{project.description}</p>

              <CaseStudy project={project} />

              {/* Big Visit Page button at the bottom of the expanded sheet */}
              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    ...visitButtonStyle,
                    padding: '10px 28px', fontSize: '12px', width: '100%', maxWidth: '400px',
                  }}>VISIT PAGE <span style={{ fontSize: '15px' }}>↗</span></a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
