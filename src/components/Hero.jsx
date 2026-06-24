import { useEffect, useState } from 'react'
import useIsMobile from '../hooks/useIsMobile'

const CYCLE_PHRASES = [
  'push boundaries',
  'break limits',
  'scale seamlessly',
  'create clients',
  'deliver results',
  'stay ahead',
  'resist trends',
  'move faster',
  'cut the noise',
  'own the future',
  'stay sharp',
  'dominate rivals',
  'evolve smart',
]

function RotatingTypewriter({ phrases = CYCLE_PHRASES, typeSpeed = 50, deleteSpeed = 30, pauseMs = 2000 }) {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [phase, setPhase] = useState('typing') // typing | pausing | deleting

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(c => !c), 530)
    return () => clearInterval(blink)
  }, [])

  useEffect(() => {
    const current = phrases[index]

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const timer = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1))
        }, typeSpeed)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setPhase('pausing'), pauseMs)
        return () => clearTimeout(timer)
      }
    }

    if (phase === 'pausing') {
      const timer = setTimeout(() => setPhase('deleting'), 10)
      return () => clearTimeout(timer)
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const timer = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1))
        }, deleteSpeed)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setIndex((prev) => (prev + 1) % phrases.length)
          setPhase('typing')
        }, 10)
        return () => clearTimeout(timer)
      }
    }
  }, [displayed, phase, index, phrases, typeSpeed, deleteSpeed, pauseMs])

  return (
    <span>
      {displayed}
      <span style={{ opacity: showCursor ? 1 : 0, color: '#00ccff' }}>_</span>
    </span>
  )
}

function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)

  const bootLines = [
    '> INITIALIZING SYSTEM...',
    '> LOADING KERNEL MODULES... OK',
    '> MOUNTING FILESYSTEMS... OK',
    '> ESTABLISHING NETWORK LINK... OK',
    '> RENDERING WEBGL CONTEXT... OK',
    '> LOADING INDICATIONS_MEDIA v3.7.1...',
    '> DECRYPTING ASSETS...',
    '> [████████████████████] 100%',
    '> SYSTEM READY.',
  ]

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        setLines(prev => [...prev, bootLines[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          onComplete()
        }, 400)
      }
    }, 180)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (done) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10001,
      background: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'auto',
    }}>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '12px',
        color: '#00ff66',
        maxWidth: '500px',
        width: '100%',
        padding: '0 20px',
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            opacity: i === lines.length - 1 ? 1 : 0.5,
            marginBottom: '4px',
            animation: 'lineAppear 0.1s ease',
          }}>
            {line}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes lineAppear {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default function Hero() {
  const isMobile = useIsMobile()
  const [phase, setPhase] = useState(0)
  const [bootDone, setBootDone] = useState(false)

  useEffect(() => {
    if (!bootDone) return
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setPhase(4), 1500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [bootDone])

  return (
    <>
      <BootSequence onComplete={() => setBootDone(true)} />

      <section
        id="hero"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '0 16px' : '0 40px',
          pointerEvents: 'auto',
          overflow: 'hidden',
          opacity: bootDone ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'left',
          maxWidth: '900px',
          width: '100%',
        }}>
          {/* Terminal prompt */}
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '13px',
            color: 'rgba(0, 255, 102, 0.4)',
            marginBottom: '20px',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}>
            <span style={{ color: '#00ff66' }}>root@indications</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>:</span>
            <span style={{ color: '#00ccff' }}>~/work</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>$</span>
            <span style={{ color: 'rgba(255,255,255,0.15)', marginLeft: '8px' }}>whoami</span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(38px, 7vw, 88px)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            margin: '0 0 24px 0',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>We build </span>
            <br />
            <span style={{
              color: '#00ff66',
              textShadow: '0 0 20px rgba(0, 255, 102, 0.4), 0 0 40px rgba(0, 255, 102, 0.2)',
            }}>
              digital systems
            </span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>that </span>
            <span style={{
              color: '#00ccff',
              textShadow: '0 0 20px rgba(0, 204, 255, 0.4), 0 0 40px rgba(0, 204, 255, 0.2)',
            }}>
              {phase >= 2 && <RotatingTypewriter />}
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '14px',
            lineHeight: 1.8,
            color: 'rgba(0, 255, 102, 0.7)',
            textShadow: '0 0 8px rgba(0, 255, 102, 0.15)',
            maxWidth: '520px',
            margin: '0 0 48px 0',
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {'// Immersive web experiences crafted with'}
            <br />
            {'// cutting-edge technology and creative code.'}
            <br />
            {'// Your vision. Our architecture. Pure execution.'}
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '12px' : '16px',
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <button
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-redraw"
              style={{
                padding: isMobile ? '12px 20px' : '16px 32px',
                minWidth: isMobile ? '140px' : '200px',
                borderRadius: '2px',
                border: '1px solid #00ff66',
                background: 'rgba(0, 255, 102, 0.05)',
                color: '#00ff66',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(0, 255, 102, 0.1), inset 0 0 15px rgba(0, 255, 102, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 102, 0.15)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 102, 0.2), inset 0 0 30px rgba(0, 255, 102, 0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 102, 0.05)'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 102, 0.1), inset 0 0 15px rgba(0, 255, 102, 0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              [ EXPLORE WORK ]
            </button>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-redraw btn-redraw-cyan"
              style={{
                padding: isMobile ? '12px 20px' : '16px 32px',
                minWidth: isMobile ? '140px' : '200px',
                borderRadius: '2px',
                border: '1px solid #00ccff',
                background: 'rgba(0, 204, 255, 0.05)',
                color: '#00ccff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(0, 204, 255, 0.1), inset 0 0 15px rgba(0, 204, 255, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 204, 255, 0.15)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 204, 255, 0.2), inset 0 0 30px rgba(0, 204, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 204, 255, 0.05)'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 204, 255, 0.1), inset 0 0 15px rgba(0, 204, 255, 0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              [ CONNECT ]
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: phase >= 4 ? 0.3 : 0,
          transition: 'opacity 1s ease 1s',
        }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'rgba(0, 255, 102, 0.3)',
          }}>
            SCROLL DOWN
          </span>
          <div style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(0,255,102,0.3), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }} />
        </div>

        <style>{`
          @keyframes scrollPulse {
            0%, 100% { opacity: 0.3; transform: scaleY(1); }
            50% { opacity: 0.8; transform: scaleY(1.2); }
          }
        `}</style>
      </section>
    </>
  )
}
