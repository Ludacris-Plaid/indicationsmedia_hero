import { useState, useEffect } from 'react'

function CarouselSlide({ project, idx, color }) {
  const base = {
    width: '100%', height: '100%', aspectRatio: '16/9',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px', position: 'relative', overflow: 'hidden',
  }
  if (idx === 0) {
    return project.screenshot ? (
      <img src={project.screenshot} alt={project.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
    ) : (
      <div style={{ ...base, color: 'rgba(0, 255, 102, 0.3)', fontFamily: "'Courier New', monospace", fontSize: '12px' }}>[NO_SCREENSHOT]</div>
    )
  }
  if (idx === 1) {
    return (
      <div style={{ ...base, background: `linear-gradient(135deg, ${color}22 0%, #0a0c0a 100%)`, flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${color}10 1px, transparent 1px), linear-gradient(90deg, ${color}10 1px, transparent 1px)`, backgroundSize: '32px 32px', opacity: 0.5 }} />
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '11px', color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px', position: 'relative', zIndex: 1 }}>{'> '}{project.category}</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: 'rgba(255,255,255,0.95)', textAlign: 'center', letterSpacing: '-0.03em', lineHeight: 1.05, textShadow: `0 0 40px ${color}40`, position: 'relative', zIndex: 1 }}>{project.title}</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '16px', position: 'relative', zIndex: 1 }}>{project.year} · {project.stack?.length || 0} technologies</div>
      </div>
    )
  }
  if (idx === 2) {
    return (
      <div style={{ ...base, background: 'linear-gradient(135deg, rgba(255,102,102,0.1) 0%, #0a0c0a 100%)', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 60px' }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '11px', color: '#ff6666', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>{'> THE_PROBLEM'}</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px, 2.4vw, 28px)', fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, maxWidth: '600px' }}>"{project.problem || 'No problem statement.'}"</div>
      </div>
    )
  }
  if (idx === 3) {
    return (
      <div style={{ ...base, background: 'linear-gradient(135deg, rgba(0,255,102,0.12) 0%, #0a0c0a 100%)', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 60px' }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '11px', color: '#00ff66', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>{'> THE_SOLUTION'}</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(18px, 2.4vw, 28px)', fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, maxWidth: '600px' }}>"{project.solution || 'No solution provided.'}"</div>
      </div>
    )
  }
  if (idx === 4) {
    return (
      <div style={{ ...base, background: 'linear-gradient(135deg, rgba(0,204,255,0.1) 0%, #0a0c0a 100%)', flexDirection: 'column' }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: '11px', color: '#00ccff', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>{'> BUILT_WITH'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '600px' }}>
          {(project.stack || []).map((tech) => (
            <div key={tech} style={{ fontFamily: "'Courier New', monospace", fontSize: '13px', color: 'rgba(0, 204, 255, 0.95)', fontWeight: 600, padding: '8px 16px', borderRadius: '2px', border: '1px solid rgba(0, 204, 255, 0.4)', background: 'rgba(0, 204, 255, 0.08)', letterSpacing: '0.05em' }}>{tech}</div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

function CaseStudy({ project, color }) {
  return (
    <div>
      {/* PROBLEM */}
      {project.problem && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: '10px',
            color: '#ff6666', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ width: '4px', height: '4px', background: '#ff6666', borderRadius: '50%' }} />
            {'> THE_PROBLEM'}
          </div>
          <div style={{
            paddingLeft: '14px', borderLeft: '2px solid rgba(255, 102, 102, 0.3)',
            fontFamily: "'Courier New', monospace", fontSize: '13px',
            lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.65)',
          }}>
            {project.problem}
          </div>
        </div>
      )}

      {/* SOLUTION */}
      {project.solution && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: '10px',
            color: '#00ff66', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ width: '4px', height: '4px', background: '#00ff66', borderRadius: '50%' }} />
            {'> THE_SOLUTION'}
          </div>
          <div style={{
            paddingLeft: '14px', borderLeft: '2px solid rgba(0, 255, 102, 0.3)',
            fontFamily: "'Courier New', monospace", fontSize: '13px',
            lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.65)',
          }}>
            {project.solution}
          </div>
        </div>
      )}

      {/* STACK */}
      {project.stack?.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: '10px',
            color: '#00ccff', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ width: '4px', height: '4px', background: '#00ccff', borderRadius: '50%' }} />
            {'> BUILT_WITH'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.stack.map((tech) => (
              <span key={tech} style={{
                fontFamily: "'Courier New', monospace", fontSize: '10px',
                color: 'rgba(0, 204, 255, 0.85)', padding: '5px 10px',
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

  useEffect(() => {
    setSlideIdx(0)
  }, [project?.id])

  useEffect(() => {
    if (!project) return
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [project])

  if (!project) return null

  const color = project.color || '#00ff66'
  const totalSlides = 5
  const displayHostname = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '.com'

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 180)
  }

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) handleClose()
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
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: '960px',
          maxHeight: 'calc(100vh - 32px)',
          background: '#050806',
          border: '1px solid rgba(0, 255, 102, 0.3)',
          borderRadius: '4px',
          boxShadow: '0 0 60px rgba(0, 255, 102, 0.15), 0 20px 60px rgba(0, 0, 0, 0.7)',
          display: 'flex', flexDirection: 'column',
          opacity: closing ? 0 : 1,
          transform: closing ? 'translateY(20px)' : 'translateY(0)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
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
            <span style={{ color: 'rgba(0, 255, 102, 0.7)' }}>{displayHostname}</span>
            <span style={{ color: 'rgba(0, 255, 102, 0.3)' }}>·</span>
            <span style={{ color: 'rgba(0, 255, 102, 0.5)' }}>{String(slideIdx + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}</span>
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

        {/* Carousel — fixed height, not part of scroll */}
        <div style={{
          position: 'relative', width: '100%', background: '#0a0c0a',
          borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
          overflow: 'hidden', aspectRatio: '16/9', flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', height: '100%',
            transform: `translateX(-${slideIdx * 100}%)`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div key={i} style={{ width: '100%', height: '100%', flexShrink: 0, position: 'relative' }}>
                <CarouselSlide project={project} idx={i} color={color} />
                <div style={{ position: 'absolute', top: '8px', left: '12px', fontFamily: "'Courier New', monospace", fontSize: '9px', color: 'rgba(0, 255, 102, 0.5)', letterSpacing: '0.1em', padding: '3px 8px', background: 'rgba(3, 8, 6, 0.7)', borderRadius: '2px', backdropFilter: 'blur(4px)' }}>
                  {['HOME', 'OVERVIEW', 'PROBLEM', 'SOLUTION', 'STACK'][i]}
                </div>
              </div>
            ))}
          </div>

          {slideIdx > 0 && (
            <button onClick={() => setSlideIdx(i => Math.max(0, i - 1))} aria-label="Previous"
              style={{
                position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(3, 8, 6, 0.85)', border: '1px solid rgba(0, 255, 102, 0.4)',
                color: '#00ff66', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', lineHeight: 1, padding: 0, backdropFilter: 'blur(4px)',
              }}>‹</button>
          )}
          {slideIdx < totalSlides - 1 && (
            <button onClick={() => setSlideIdx(i => Math.min(totalSlides - 1, i + 1))} aria-label="Next"
              style={{
                position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(3, 8, 6, 0.85)', border: '1px solid rgba(0, 255, 102, 0.4)',
                color: '#00ff66', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', lineHeight: 1, padding: 0, backdropFilter: 'blur(4px)',
              }}>›</button>
          )}

          <div style={{
            position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '6px', padding: '4px 8px',
            background: 'rgba(3, 8, 6, 0.7)', borderRadius: '12px', backdropFilter: 'blur(4px)',
          }}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)} aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === slideIdx ? '22px' : '6px', height: '6px',
                  borderRadius: '3px', background: i === slideIdx ? '#00ff66' : 'rgba(0, 255, 102, 0.3)',
                  border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: i === slideIdx ? '0 0 8px rgba(0, 255, 102, 0.6)' : 'none',
                }} />
            ))}
          </div>
        </div>

        {/* Body — SCROLLABLE with all case study content */}
        <div
          className="modal-body-scroll"
          style={{
            padding: '20px 24px', overflowY: 'scroll', overflowX: 'hidden',
            flex: '1 1 0%', minHeight: 0, WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Title + CTA */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: '8px', gap: '12px', flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{
                fontFamily: "'Courier New', monospace", fontSize: '10px',
                color, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px',
              }}>{'> '}{project.category} · {project.year}</div>
              <h2 id="modal-title" style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700,
                letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
                color: 'rgba(255, 255, 255, 0.95)',
              }}>{project.title}</h2>
            </div>
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "'Courier New', monospace", fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#030806',
                background: '#00ff66', padding: '12px 20px', borderRadius: '2px',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 0 20px rgba(0, 255, 102, 0.3)', transition: 'all 0.2s',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>OPEN HOMEPAGE <span style={{ fontSize: '14px' }}>↗</span></a>
          </div>

          <p style={{
            fontFamily: "'Courier New', monospace", fontSize: '13px',
            lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.55)', margin: '10px 0 0 0',
          }}>{'> '}{project.description}</p>

          <div style={{
            marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
            fontFamily: "'Courier New', monospace", fontSize: '11px',
          }}>
            <span style={{ color: 'rgba(0, 255, 102, 0.4)', letterSpacing: '0.1em' }}>URL:</span>
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(0, 255, 102, 0.85)', textDecoration: 'none', borderBottom: '1px dashed rgba(0, 255, 102, 0.3)', paddingBottom: '1px' }}>
              {displayHostname} ↗
            </a>
          </div>

          {/* Case study content — forces scroll */}
          <div style={{
            marginTop: '24px', paddingTop: '20px',
            borderTop: '1px solid rgba(0, 255, 102, 0.08)',
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace", fontSize: '9px',
              color: 'rgba(0, 255, 102, 0.4)', letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: '14px',
            }}>
              {'// CASE_STUDY · SCROLL_TO_READ'}
            </div>
            <CaseStudy project={project} color={color} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 24px', borderTop: '1px solid rgba(0, 255, 102, 0.08)',
          fontFamily: "'Courier New', monospace", fontSize: '9px',
          color: 'rgba(0, 255, 102, 0.3)', letterSpacing: '0.1em',
          display: 'flex', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <span>ESC to close · click outside to close · scroll inside the box</span>
          <span>{displayHostname}</span>
        </div>
      </div>
    </div>
  )
}
