import { useState, useRef } from 'react'

export default function ProjectTile({ project, index, isVisible, onHover, isMobile }) {
  const [localHover, setLocalHover] = useState(false)
  const tileRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!tileRef.current) return
    const rect = tileRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    })
  }

  return (
    <div
      ref={tileRef}
      onClick={() => project.url && window.open(project.url, '_blank')}
      onMouseEnter={() => { setLocalHover(true); onHover(project) }}
      onMouseLeave={() => { setLocalHover(false); onHover(null) }}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        borderRadius: '2px',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? `translateY(0) perspective(1000px) rotateX(${localHover ? mousePos.y * 1.5 : 0}deg) rotateY(${localHover ? -mousePos.x * 1.5 : 0}deg)`
          : 'translateY(40px)',
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
        aspectRatio: isMobile ? '3/2' : '4/3',
        background: '#0a0c0a',
        border: `1px solid ${localHover ? 'rgba(0, 255, 102, 0.3)' : 'rgba(0, 255, 102, 0.06)'}`,
        boxShadow: localHover
          ? `0 0 30px rgba(0, 255, 102, 0.08), inset 0 0 30px rgba(0, 255, 102, 0.03)`
          : 'none',
      }}
    >
      {/* Screenshot */}
      {project.screenshot && (
        <img
          src={project.screenshot}
          alt={project.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
            transform: localHover ? 'scale(1.05)' : 'scale(1)',
            filter: localHover ? 'brightness(0.4)' : 'brightness(0.25)',
          }}
        />
      )}

      {/* Dark overlay for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: localHover
          ? 'linear-gradient(180deg, rgba(3,8,6,0.3) 0%, rgba(3,8,6,0.7) 100%)'
          : 'linear-gradient(180deg, rgba(3,8,6,0.5) 0%, rgba(3,8,6,0.8) 100%)',
        transition: 'background 0.4s ease',
      }} />

      {/* Circuit trace overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,102,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,102,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
        opacity: localHover ? 1 : 0.4,
        transition: 'opacity 0.4s ease',
      }} />

      {/* Corner brackets */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        width: '16px',
        height: '16px',
        borderTop: `1px solid ${localHover ? '#00ff66' : 'rgba(0,255,102,0.2)'}`,
        borderLeft: `1px solid ${localHover ? '#00ff66' : 'rgba(0,255,102,0.2)'}`,
        transition: 'border-color 0.3s',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        width: '16px',
        height: '16px',
        borderBottom: `1px solid ${localHover ? '#00ff66' : 'rgba(0,255,102,0.2)'}`,
        borderRight: `1px solid ${localHover ? '#00ff66' : 'rgba(0,255,102,0.2)'}`,
        transition: 'border-color 0.3s',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        padding: isMobile ? '12px' : '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 2,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? '7px' : '10px',
            fontWeight: localHover ? 700 : 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#00ff66',
            opacity: localHover ? 1 : 0.4,
            transition: 'all 0.3s',
            textShadow: localHover ? '0 0 8px rgba(0,255,102,0.3)' : 'none',
          }}>
            {project.category}
          </span>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? '7px' : '10px',
            color: 'rgba(0, 255, 102, 0.2)',
            fontWeight: 500,
          }}>
            {project.year}
          </span>
        </div>

        <div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: isMobile ? '13px' : '22px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: isMobile ? '4px' : '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            transform: localHover ? 'translateY(-6px)' : 'translateY(0)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {project.title}
          </h3>
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: isMobile ? '8px' : '12px',
            lineHeight: isMobile ? 1.4 : 1.7,
            color: localHover ? 'rgba(0, 255, 102, 0.9)' : 'rgba(0, 255, 102, 0.4)',
            fontWeight: localHover ? 600 : 400,
            transform: localHover ? 'translateY(-6px)' : isMobile ? 'translateY(0)' : 'translateY(8px)',
            opacity: isMobile ? 1 : localHover ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
          }}>
            {'> '}{project.description}
          </p>

          <div style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transform: localHover ? 'translateY(0)' : 'translateY(12px)',
            opacity: isMobile ? 0.5 : localHover ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: isMobile ? '8px' : '11px',
              fontWeight: localHover ? 700 : 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#00ff66',
              opacity: localHover ? 1 : 0.5,
              textShadow: localHover ? '0 0 8px rgba(0,255,102,0.3)' : 'none',
              transition: 'all 0.3s',
            }}>
              {'>>'} VIEW SITE
            </span>
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: localHover ? 1 : 0,
        transition: 'opacity 0.4s ease',
        background: `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(0,255,102,0.06), transparent 60%)`,
        pointerEvents: 'none',
      }} />
    </div>
  )
}
