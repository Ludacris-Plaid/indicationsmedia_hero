import { useState, useEffect, useRef } from 'react'
import useIsMobile from '../hooks/useIsMobile'

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
  const isMobile = useIsMobile()
  const [slideIdx, setSlideIdx] = useState(0)
  const [closing, setClosing] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [heroMode, setHeroMode] = useState(true)
  const carouselRef = useRef(null)
  const wheelLockRef = useRef(false)

  useEffect(() => {
    setSlideIdx(0)
    setSheetOpen(false)
    setHeroMode(true)
  }, [project?.id])

  // Mouse wheel navigates the carousel when scrolling over it
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const handleWheel = (e) => {
      e.preventDefault()
      if (wheelLockRef.current) return
      if (e.deltaY > 0) {
        setSlideIdx((i) => Math.min(gallery.length - 1, i + 1))
        wheelLockRef.current = true
        setTimeout(() => { wheelLockRef.current = false }, 450)
      } else if (e.deltaY < 0) {
        setSlideIdx((i) => Math.max(0, i - 1))
        wheelLockRef.current = true
        setTimeout(() => { wheelLockRef.current = false }, 450)
      }
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [project])

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
        padding: isMobile && heroMode ? '0' : '16px', transition: 'background 0.18s ease',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: isMobile && heroMode ? '100%' : '1100px',
          height: isMobile && heroMode ? '100dvh' : 'calc(100vh - 32px)',
          maxHeight: isMobile && heroMode ? 'none' : '900px',
          background: '#050806',
          border: isMobile && heroMode ? 'none' : '1px solid rgba(0, 255, 102, 0.3)',
          borderRadius: isMobile && heroMode ? '0' : '4px',
          boxShadow: isMobile && heroMode ? 'none' : '0 0 60px rgba(0, 255, 102, 0.15), 0 20px 60px rgba(0, 0, 0, 0.7)',
          display: 'flex', flexDirection: 'column',
          opacity: closing ? 0 : 1,
          transition: 'opacity 0.18s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        {!(isMobile && heroMode) && (
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.7)'
              e.currentTarget.style.color = '#00ff66'
              e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 102, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.25)'
              e.currentTarget.style.color = 'rgba(0, 255, 102, 0.7)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            style={{
              background: 'transparent', border: '1px solid rgba(0, 255, 102, 0.25)',
              color: 'rgba(0, 255, 102, 0.7)', width: '30px', height: '30px',
              borderRadius: '2px', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Courier New', monospace", fontSize: '14px', lineHeight: 1, padding: 0,
              transition: 'all 0.15s',
            }}>✕</button>
        </div>
        )}

        {/* Carousel — flex: 1, shrinks when sheet opens */}
        <div ref={carouselRef} style={{
          position: 'relative', width: '100%', background: '#0a0c0a',
          overflow: 'hidden', flex: 1, minHeight: 0,
          display: 'flex', alignItems: isMobile && heroMode ? 'center' : 'stretch',
        }}>
          <div style={{
            display: 'flex', height: isMobile && heroMode ? '70dvh' : '100%',
            width: '100%',
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 102, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.9)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 255, 102, 0.5)'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(3, 8, 6, 0.85)'
                e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.4)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
              style={{
                position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(3, 8, 6, 0.85)', border: '1px solid rgba(0, 255, 102, 0.4)',
                color: '#00ff66', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', lineHeight: 1, padding: 0, backdropFilter: 'blur(4px)',
                transition: 'all 0.15s',
              }}>‹</button>
          )}
          {slideIdx < gallery.length - 1 && (
            <button onClick={() => setSlideIdx(i => Math.min(gallery.length - 1, i + 1))} aria-label="Next"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 102, 0.2)'
                e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.9)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0, 255, 102, 0.5)'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(3, 8, 6, 0.85)'
                e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.4)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
              style={{
                position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(3, 8, 6, 0.85)', border: '1px solid rgba(0, 255, 102, 0.4)',
                color: '#00ff66', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', lineHeight: 1, padding: 0, backdropFilter: 'blur(4px)',
                transition: 'all 0.15s',
              }}>›</button>
          )}

          {/* Bottom-center: dot indicator + counter (when case study is closed, not hero mode) */}
          {!sheetOpen && !(isMobile && heroMode) && (
            <div style={{
              position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '7px 16px', background: 'rgba(3, 8, 6, 0.9)',
              border: '1px solid rgba(0, 255, 102, 0.3)', borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 102, 0.05)',
              zIndex: 6,
              transition: 'opacity 0.2s, transform 0.2s',
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
          )}

          {/* Right side: terminal-style "page log" (when case study is open) */}
          {sheetOpen && (
            <div style={{
              position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
              display: 'flex', flexDirection: 'column',
              background: 'rgba(3, 8, 6, 0.92)',
              border: '1px solid rgba(0, 255, 102, 0.3)', borderRadius: '4px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 255, 102, 0.08)',
              zIndex: 6,
              minWidth: '130px',
              overflow: 'hidden',
            }}>
              {/* Log header */}
              <div style={{
                padding: '5px 10px',
                background: 'rgba(0, 255, 102, 0.06)',
                borderBottom: '1px solid rgba(0, 255, 102, 0.15)',
                fontFamily: "'Courier New', monospace", fontSize: '8px',
                color: 'rgba(0, 255, 102, 0.5)', letterSpacing: '0.12em',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ width: '4px', height: '4px', background: '#00ff66', borderRadius: '50%', boxShadow: '0 0 4px #00ff66' }} />
                // PAGES
                <span style={{ flex: 1, textAlign: 'right', color: 'rgba(0, 255, 102, 0.4)' }}>{String(slideIdx + 1).padStart(2, '0')}/{String(gallery.length).padStart(2, '0')}</span>
              </div>

              {/* Slide entries */}
              {gallery.map((slide, i) => (
                <button key={i} onClick={() => setSlideIdx(i)}
                  onMouseEnter={(e) => {
                    if (i !== slideIdx) {
                      e.currentTarget.style.background = 'rgba(0, 255, 102, 0.08)'
                      e.currentTarget.style.paddingLeft = '14px'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = i === slideIdx ? 'rgba(0, 255, 102, 0.12)' : 'transparent'
                    e.currentTarget.style.paddingLeft = i === slideIdx ? '12px' : '10px'
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: i === slideIdx ? '6px 10px 6px 12px' : '6px 10px',
                    background: i === slideIdx ? 'rgba(0, 255, 102, 0.12)' : 'transparent',
                    border: 'none',
                    borderLeft: i === slideIdx ? '2px solid #00ff66' : '2px solid transparent',
                    cursor: 'pointer',
                    fontFamily: "'Courier New', monospace", fontSize: '9px',
                    color: i === slideIdx ? '#00ff66' : 'rgba(0, 255, 102, 0.5)',
                    letterSpacing: '0.05em',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {/* Status indicator */}
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: i === slideIdx ? '#00ff66' : 'rgba(0, 255, 102, 0.25)',
                    boxShadow: i === slideIdx ? '0 0 6px #00ff66' : 'none',
                  }} />
                  {/* Number */}
                  <span style={{ fontWeight: 700, minWidth: '14px', opacity: i === slideIdx ? 1 : 0.6 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Label */}
                  <span style={{ fontWeight: 600, fontSize: '8.5px', letterSpacing: '0.08em' }}>
                    {slide.label}
                  </span>
                </button>
              ))}

              {/* Log footer with progress bar */}
              <div style={{
                height: '2px', background: 'rgba(0, 255, 102, 0.08)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${((slideIdx + 1) / gallery.length) * 100}%`,
                  background: '#00ff66', boxShadow: '0 0 6px #00ff66',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          )}

          {/* Hero mode overlay — close + VIEW CASE STUDY on mobile */}
          {isMobile && heroMode && (
            <>
              {/* Close button — top right */}
              <button onClick={handleClose} aria-label="Close"
                style={{
                  position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                  background: 'rgba(3, 8, 6, 0.85)', border: '1px solid rgba(0, 255, 102, 0.4)',
                  color: 'rgba(0, 255, 102, 0.8)', width: '36px', height: '36px',
                  borderRadius: '50%', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Courier New', monospace", fontSize: '16px', lineHeight: 1, padding: 0,
                  backdropFilter: 'blur(8px)',
                }}>✕</button>

              {/* Bottom overlay: slide counter + VIEW CASE STUDY */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
                padding: '40px 20px 28px',
                background: 'linear-gradient(transparent, rgba(3, 8, 6, 0.95))',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
              }}>
                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {gallery.map((_, i) => (
                    <button key={i} onClick={() => setSlideIdx(i)}
                      style={{
                        width: i === slideIdx ? '20px' : '6px', height: '6px',
                        borderRadius: '3px', border: 'none', padding: 0, cursor: 'pointer',
                        background: i === slideIdx ? '#00ff66' : 'rgba(0, 255, 102, 0.3)',
                        boxShadow: i === slideIdx ? '0 0 8px rgba(0, 255, 102, 0.8)' : 'none',
                        transition: 'all 0.25s',
                      }} />
                  ))}
                  <span style={{
                    fontFamily: "'Courier New', monospace", fontSize: '10px',
                    color: 'rgba(0, 255, 102, 0.9)', letterSpacing: '0.1em',
                    fontWeight: 700, marginLeft: '6px',
                  }}>
                    {String(slideIdx + 1).padStart(2, '0')}/{String(gallery.length).padStart(2, '0')}
                  </span>
                </div>

                {/* VIEW CASE STUDY button */}
                <button onClick={() => { setHeroMode(false); setSheetOpen(true) }}
                  style={{
                    fontFamily: "'Courier New', monospace", fontSize: '12px', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#030806', background: '#00ff66',
                    padding: '14px 32px', borderRadius: '2px', border: 'none',
                    cursor: 'pointer', boxShadow: '0 0 24px rgba(0, 255, 102, 0.4)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    width: '100%', maxWidth: '320px', justifyContent: 'center',
                  }}>
                  VIEW CASE STUDY <span style={{ fontSize: '10px' }}>▴</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom sheet — hidden in hero mode */}
        {!(isMobile && heroMode) && (
        <div style={{
          background: '#050806',
          borderTop: '1px solid rgba(0, 255, 102, 0.3)',
          boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.5)',
          transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          height: sheetOpen ? '60%' : '64px',
          display: 'flex', flexDirection: 'column',
          flexShrink: 0,
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 255, 102, 0.18)'
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.7)'
                    e.currentTarget.style.color = '#00ff66'
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 102, 0.35)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 255, 102, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.3)'
                    e.currentTarget.style.color = '#00ff66'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  style={{
                    fontFamily: "'Courier New', monospace", fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#00ff66', background: 'rgba(0, 255, 102, 0.08)',
                    border: '1px solid rgba(0, 255, 102, 0.3)', padding: '8px 14px',
                    borderRadius: '2px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', gap: '6px', transition: 'all 0.15s',
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
        )}
      </div>
    </div>
  )
}
