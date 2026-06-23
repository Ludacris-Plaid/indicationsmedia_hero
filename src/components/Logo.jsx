import { useState, useEffect, useRef, useCallback } from 'react'

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:<>?/01'

function useGlitchText(text, { interval = 4000, duration = 150, enabled = true } = {}) {
  const [displayed, setDisplayed] = useState(text)
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!enabled) { setDisplayed(text); return }

    const trigger = () => {
      const chars = text.split('')
      const count = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < count; i++) {
        const pos = Math.floor(Math.random() * chars.length)
        chars[pos] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      }
      setDisplayed(chars.join(''))
      timeoutRef.current = setTimeout(() => setDisplayed(text), duration)
    }

    const schedule = () => {
      const delay = interval + Math.random() * 3000
      intervalRef.current = setTimeout(() => { trigger(); schedule() }, delay)
    }
    schedule()

    return () => {
      clearTimeout(timeoutRef.current)
      clearTimeout(intervalRef.current)
    }
  }, [text, interval, duration, enabled])

  return displayed
}

export default function Logo({ onClick }) {
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [textRevealed, setTextRevealed] = useState(0)
  const monogram = useGlitchText('iM', { interval: 3500, duration: 120, enabled: hovered })
  const fullText = useGlitchText('indications.media', { interval: 5000, duration: 100 })

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const full = 'indications.media'
    if (textRevealed >= full.length) return
    const delay = textRevealed === 0 ? 600 : 60 + Math.random() * 40
    const t = setTimeout(() => setTextRevealed(prev => prev + 1), delay)
    return () => clearTimeout(t)
  }, [mounted, textRevealed])

  const displayName = fullText.slice(0, textRevealed)
  const showCursor = mounted && textRevealed < 'indications.media'.length

  return (
    <>
      <style>{`
        @keyframes logoScan {
          0% { top: -2px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: calc(100% + 2px); opacity: 0; }
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes logoBorderGlow {
          0%, 100% {
            box-shadow:
              0 0 4px rgba(0, 255, 102, 0.2),
              inset 0 0 4px rgba(0, 255, 102, 0.05);
          }
          50% {
            box-shadow:
              0 0 12px rgba(0, 255, 102, 0.4),
              0 0 24px rgba(0, 255, 102, 0.1),
              inset 0 0 8px rgba(0, 255, 102, 0.1);
          }
        }
        @keyframes logoGlitchClip {
          0% { clip-path: inset(0 0 95% 0); }
          10% { clip-path: inset(40% 0 20% 0); }
          20% { clip-path: inset(80% 0 0% 0); }
          30% { clip-path: inset(10% 0 70% 0); }
          40% { clip-path: inset(50% 0 30% 0); }
          50% { clip-path: inset(0 0 60% 0); }
          60% { clip-path: inset(70% 0 10% 0); }
          70% { clip-path: inset(20% 0 50% 0); }
          80% { clip-path: inset(90% 0 0% 0); }
          90% { clip-path: inset(30% 0 40% 0); }
          100% { clip-path: inset(0 0 95% 0); }
        }
        @keyframes logoCornerBlink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.3; }
        }
        .logo-container:hover .logo-scan {
          animation-duration: 0.8s;
        }
        .logo-container:hover .logo-monogram {
          color: #00ccff;
          text-shadow: 0 0 15px rgba(0, 204, 255, 0.6);
          border-color: #00ccff;
        }
        .logo-container:hover .logo-corner {
          border-color: #00ccff;
        }
        .logo-container:hover .logo-text {
          color: #00ccff;
          text-shadow: 0 0 8px rgba(0, 204, 255, 0.4);
        }
      `}</style>

      <div
        className="logo-container"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          userSelect: 'none',
          position: 'relative',
        }}
      >
        {/* Monogram */}
        <div style={{ position: 'relative', width: '36px', height: '36px' }}>
          {/* Corner brackets */}
          <div className="logo-corner" style={{
            position: 'absolute', top: '-3px', left: '-3px',
            width: '10px', height: '10px',
            borderTop: '1.5px solid #00ff66',
            borderLeft: '1.5px solid #00ff66',
            transition: 'border-color 0.3s',
            animation: 'logoCornerBlink 4s infinite',
          }} />
          <div className="logo-corner" style={{
            position: 'absolute', top: '-3px', right: '-3px',
            width: '10px', height: '10px',
            borderTop: '1.5px solid #00ff66',
            borderRight: '1.5px solid #00ff66',
            transition: 'border-color 0.3s',
            animation: 'logoCornerBlink 4s infinite 1s',
          }} />
          <div className="logo-corner" style={{
            position: 'absolute', bottom: '-3px', left: '-3px',
            width: '10px', height: '10px',
            borderBottom: '1.5px solid #00ff66',
            borderLeft: '1.5px solid #00ff66',
            transition: 'border-color 0.3s',
            animation: 'logoCornerBlink 4s infinite 2s',
          }} />
          <div className="logo-corner" style={{
            position: 'absolute', bottom: '-3px', right: '-3px',
            width: '10px', height: '10px',
            borderBottom: '1.5px solid #00ff66',
            borderRight: '1.5px solid #00ff66',
            transition: 'border-color 0.3s',
            animation: 'logoCornerBlink 4s infinite 3s',
          }} />

          {/* Main monogram box */}
          <div
            className="logo-monogram"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Courier New', monospace",
              fontSize: '13px',
              fontWeight: 900,
              letterSpacing: '0.05em',
              color: '#00ff66',
              border: '1px solid #00ff66',
              borderRadius: '2px',
              background: 'rgba(0, 255, 102, 0.04)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              animation: 'logoBorderGlow 3s ease-in-out infinite',
            }}
          >
            {/* Scan line */}
            <div
              className="logo-scan"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0, 255, 102, 0.8), transparent)',
                animation: 'logoScan 2.5s linear infinite',
                pointerEvents: 'none',
              }}
            />
            {/* Glitch clone layer */}
            {hovered && (
              <span style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff0040',
                opacity: 0.7,
                animation: 'logoGlitchClip 0.3s infinite',
                fontSize: '13px',
                fontWeight: 900,
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.05em',
                pointerEvents: 'none',
              }}>
                {monogram}
              </span>
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{monogram}</span>
          </div>
        </div>

        {/* Text */}
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: '#00ff66',
          transition: 'color 0.3s, text-shadow 0.3s',
          textShadow: '0 0 10px rgba(0, 255, 102, 0.3)',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span className="logo-text">{displayName}</span>
          {showCursor && (
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '15px',
              background: '#00ff66',
              marginLeft: '1px',
              animation: 'logoPulse 0.7s step-end infinite',
              verticalAlign: 'middle',
            }} />
          )}
        </div>
      </div>
    </>
  )
}
