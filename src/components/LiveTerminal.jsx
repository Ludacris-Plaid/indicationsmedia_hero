import { useState, useEffect, useRef, useCallback } from 'react'

const LINES = [
  { delay: 0, text: 'SYSTEM_BOOT v3.2.7 // Indications Media', color: '#00ff66' },
  { delay: 300, text: '> initializing core modules...', color: 'rgba(0, 255, 102, 0.5)' },
  { delay: 500, text: '> security kernel loaded', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 700, text: '> distributed compute mesh online', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 900, text: '> threat detection active', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 1200, text: '', color: '' },
  { delay: 1400, text: 'ACTIVE_DEPLOYMENTS // last 90 days', color: '#00ff66' },
  { delay: 1700, text: '> deploy: nexus-coffee-co  // v2.4.1  [OK]  2.3s', color: 'rgba(0, 204, 255, 0.5)' },
  { delay: 2000, text: '> deploy: sentinel-cyber  // v1.9.0  [OK]  1.8s', color: 'rgba(0, 204, 255, 0.5)' },
  { delay: 2300, text: '> deploy: medvex-health  // v3.1.2  [OK]  4.1s', color: 'rgba(0, 204, 255, 0.5)' },
  { delay: 2600, text: '> deploy: cortex-legal  // v2.7.3  [OK]  1.4s', color: 'rgba(0, 204, 255, 0.5)' },
  { delay: 2900, text: '> deploy: prism-gallery  // v1.5.0  [OK]  2.9s', color: 'rgba(0, 204, 255, 0.5)' },
  { delay: 3200, text: '', color: '' },
  { delay: 3400, text: 'SECURITY_AUDIT // live scan', color: '#00ff66' },
  { delay: 3700, text: '> scanning attack surface...', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 3900, text: '> 0 critical  // 0 high  // 1 low  // CLEAR', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 4100, text: '> TLS 1.3  // HSTS enforced  // CSP strict', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 4300, text: '> penetration test: PASSED', color: '#00ff66' },
  { delay: 4600, text: '', color: '' },
  { delay: 4800, text: 'INFRA_METRICS // real-time', color: '#00ff66' },
  { delay: 5100, text: '> uptime: 99.97%  // latency p99: 42ms', color: 'rgba(0, 204, 255, 0.5)' },
  { delay: 5400, text: '> throughput: 1.2M req/min  // err rate: 0.001%', color: 'rgba(0, 204, 255, 0.5)' },
  { delay: 5700, text: '> 8 nodes healthy  // auto-scaling: NOMINAL', color: 'rgba(0, 204, 255, 0.5)' },
  { delay: 6000, text: '', color: '' },
  { delay: 6200, text: 'PHILOSOPHY_DAEMON // running', color: '#00ff66' },
  { delay: 6500, text: '> SECURE_BY_DEFAULT  // BUILT_TO_LAST', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 6800, text: '> ZERO_SHORTCUTS  // CLIENTS_NOT_CONTRACTS', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 7100, text: '> EVERY_COMMIT_COUNTS  // ARCHITECTED_FOR_SCALE', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 7300, text: '> PRECISION_AT_SPEED  // TRUST_BUILT_DAILY', color: 'rgba(0, 255, 102, 0.4)' },
  { delay: 7600, text: '', color: '' },
  { delay: 7800, text: '[indications]~$ _', color: '#00ccff' },
]

const STATS = [
  { label: 'DEPLOYS', value: '247', sub: 'this quarter' },
  { label: 'UPTIME', value: '99.9%', sub: 'rolling 90d' },
  { label: 'THREATS', value: '0', sub: 'blocked / day' },
  { label: 'NODES', value: '8', sub: 'global mesh' },
]

export default function LiveTerminal({ isVisible }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [typingLine, setTypingLine] = useState(null)
  const [charIndex, setCharIndex] = useState(0)
  const termRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isVisible) setMounted(true)
  }, [isVisible])

  // Type out lines sequentially
  useEffect(() => {
    if (!mounted) return

    const timeouts = []
    let active = true

    LINES.forEach((line, i) => {
      // Skip empty lines (just add them after delay)
      if (!line.text) {
        const t = setTimeout(() => {
          if (!active) return
          setVisibleLines((prev) => [...prev, line])
        }, line.delay)
        timeouts.push(t)
        return
      }

      // For the last line (prompt), type it out character by character
      if (i === LINES.length - 1) {
        const t = setTimeout(() => {
          if (!active) return
          setVisibleLines((prev) => [...prev, { text: '', color: line.color }])
          setTypingLine({ text: line.text.replace('_', ''), color: line.color, showCursor: true })
        }, line.delay)
        timeouts.push(t)

        // Type each character
        const chars = line.text.replace('_', '')
        chars.split('').forEach((_, ci) => {
          const ct = setTimeout(() => {
            if (!active) return
            setCharIndex(ci + 1)
          }, line.delay + ci * 50)
          timeouts.push(ct)
        })
        return
      }

      // Regular line: type it out
      const t = setTimeout(() => {
        if (!active) return
        setVisibleLines((prev) => [...prev, { text: '', color: line.color }])
        setTypingLine({ text: line.text, color: line.color, showCursor: false })
      }, line.delay)
      timeouts.push(t)

      const chars = line.text
      chars.split('').forEach((_, ci) => {
        const ct = setTimeout(() => {
          if (!active) return
          setCharIndex(ci + 1)
        }, line.delay + ci * 20)
        timeouts.push(ct)
      })
    })

    return () => {
      active = false
      timeouts.forEach(clearTimeout)
    }
  }, [mounted])

  // When typing finishes for the current line, commit it
  useEffect(() => {
    if (!typingLine) return

    const partial = typingLine.text.substring(0, charIndex)
    setVisibleLines((prev) => {
      const updated = [...prev]
      updated[updated.length - 1] = {
        text: partial,
        color: typingLine.color,
        showCursor: typingLine.showCursor && charIndex >= typingLine.text.length,
      }
      return updated
    })
  }, [charIndex, typingLine])

  // Auto-scroll
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [visibleLines])

  return (
    <div style={{
      borderRadius: '2px',
      border: '1px solid rgba(0, 255, 102, 0.1)',
      background: 'rgba(0, 0, 0, 0.3)',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(15px)',
      transition: 'all 0.8s ease 0.7s',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        background: 'rgba(0, 255, 102, 0.04)',
        borderBottom: '1px solid rgba(0, 255, 102, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: '#00ff66',
        }}>
          {'// SYS_CONSOLE'}
        </span>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: 'rgba(0, 255, 102, 0.3)',
        }}>
          {'LIVE'}
        </span>
      </div>

      {/* Terminal output */}
      <div ref={termRef} style={{
        height: '220px',
        overflowY: 'auto',
        padding: '12px 14px',
        fontFamily: "'Courier New', monospace",
        fontSize: '9.5px',
        lineHeight: 1.7,
        letterSpacing: '0.03em',
        position: 'relative',
      }}>
        {/* Scan line overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 102, 0.008) 2px, rgba(0, 255, 102, 0.008) 4px)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {visibleLines.map((line, i) => (
          <div key={i} style={{ color: line.color, position: 'relative', zIndex: 0 }}>
            {line.text}
            {line.showCursor && (
              <span className="blink" style={{
                display: 'inline-block',
                width: '7px',
                height: '12px',
                background: '#00ccff',
                marginLeft: '1px',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }} />
            )}
          </div>
        ))}

        {mounted && (
          <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
        )}
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        borderTop: '1px solid rgba(0, 255, 102, 0.06)',
      }}>
        {STATS.map((stat, i) => (
          <div key={stat.label} style={{
            padding: '10px 8px',
            textAlign: 'center',
            borderRight: i < 3 ? '1px solid rgba(0, 255, 102, 0.04)' : 'none',
            opacity: mounted ? 1 : 0,
            transition: `opacity 0.6s ease ${1.0 + i * 0.1}s`,
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '2px',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '7px',
              color: 'rgba(0, 255, 102, 0.35)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {stat.label}
            </div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '6.5px',
              color: 'rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.05em',
              marginTop: '1px',
            }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

