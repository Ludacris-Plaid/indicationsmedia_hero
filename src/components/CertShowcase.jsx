import { useState, useEffect, useRef } from 'react'

const certs = [
  {
    id: 'a',
    name: 'CompTIA A+',
    short: 'A+',
    color: '#C8102E',
    accent: '#FF1744',
    description: 'Hardware, operating systems, networking, troubleshooting, and security fundamentals.',
    url: 'https://www.comptia.org/certifications/a',
  },
  {
    id: 'network',
    name: 'CompTIA Network+',
    short: 'NET+',
    color: '#C8102E',
    accent: '#FF1744',
    description: 'Networking concepts, infrastructure, network operations, and network security.',
    url: 'https://www.comptia.org/certifications/network',
  },
  {
    id: 'security',
    name: 'CompTIA Security+',
    short: 'SEC+',
    color: '#C8102E',
    accent: '#FF1744',
    description: 'Cybersecurity basics, threat analysis, risk management, and security operations.',
    url: 'https://www.comptia.org/certifications/security',
  },
  {
    id: 'linux',
    name: 'CompTIA Linux+',
    short: 'LNX+',
    color: '#C8102E',
    accent: '#FF1744',
    description: 'Linux system administration, scripting, containers, and security.',
    url: 'https://www.comptia.org/certifications/linux',
  },
  {
    id: 'pentest',
    name: 'CompTIA PenTest+',
    short: 'PEN+',
    color: '#C8102E',
    accent: '#FF1744',
    description: 'Penetration testing, vulnerability assessment, and reporting.',
    url: 'https://www.comptia.org/certifications/pentest',
  },
  {
    id: 'cysa',
    name: 'CompTIA CySA+',
    short: 'CSA+',
    color: '#C8102E',
    accent: '#FF1744',
    description: 'Cybersecurity analysis, threat detection, incident response, and compliance.',
    url: 'https://www.comptia.org/certifications/cybersecurity-analyst',
  },
  {
    id: 'oscp',
    name: 'OSCP',
    short: 'OSCP',
    color: '#9A0000',
    accent: '#CC3333',
    description: 'Penetration testing methodology, exploitation techniques, privilege escalation, and professional reporting.',
    url: 'https://www.offensive-security.com/pwk-oscp/',
  },
]

function DiamondLogo({ size = 60, text = '', color = '#C8102E' }) {
  const textSize = text.length > 3 ? 13 : 17
  const gradId = `grad-${color.replace('#', '')}-${text}`
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.65" />
        </linearGradient>
        <filter id={`glow-${gradId}`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="50,6 94,50 50,94 6,50"
        fill={`url(#${gradId})`}
        stroke="#FFF"
        strokeWidth="1.2"
        opacity="0.95"
        filter={`url(#glow-${gradId})`}
      />
      <polygon
        points="50,6 94,50 50,94 6,50"
        fill="none"
        stroke="#FFF"
        strokeWidth="0.3"
        opacity="0.4"
        transform="scale(0.85) translate(8.8, 8.8)"
      />
      <text x="50" y="38" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif" fill="#FFF" letterSpacing="0.5">CompTIA</text>
      <line x1="22" y1="48" x2="78" y2="48" stroke="#FFF" strokeWidth="0.6" opacity="0.35" />
      <text x="50" y="73" textAnchor="middle" fontSize={textSize} fontWeight="800" fontFamily="Arial, sans-serif" fill="#FFF" letterSpacing="0.3">{text}</text>
    </svg>
  )
}

export default function CertShowcase({ isVisible }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [scanAngle, setScanAngle] = useState(0)
  const [pulse, setPulse] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return
    let raf
    const tick = () => {
      setScanAngle((a) => (a + 1.2) % 360)
      setPulse((p) => (p + 1.5) % 360)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isVisible])

  const active = certs[activeIdx]
  const radius = 70
  const pulseScale = 1 + Math.sin((pulse * Math.PI) / 180) * 0.05

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        padding: '16px 16px 14px',
        borderRadius: '4px',
        border: '1px solid rgba(200, 16, 46, 0.25)',
        background: 'rgba(200, 16, 46, 0.02)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: '12px',
        minHeight: '340px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
        transition: 'all 0.8s ease 0.7s',
      }}
    >
      {/* Animated scan-line background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200, 16, 46, 0.04) 3px, rgba(200, 16, 46, 0.04) 4px)',
      }} />

      {/* Header */}
      <div style={{
        fontFamily: "'Courier New', monospace", fontSize: '10px',
        color: 'rgba(0, 255, 102, 0.5)', letterSpacing: '0.1em',
        textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px',
        position: 'relative', zIndex: 1,
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: active.color, boxShadow: `0 0 8px ${active.color}`,
          transition: 'all 0.3s',
        }} />
        <span>// COMPETENCY_MATRIX</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: 'rgba(200, 16, 46, 0.8)' }}>CERTIFIED: {certs.length}</span>
      </div>

      {/* Central showcase area */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '150px', marginTop: '4px',
      }}>
        {/* Outermost rotating dashed ring */}
        <div style={{
          position: 'absolute', width: '180px', height: '180px',
          border: '1px dashed rgba(200, 16, 46, 0.35)',
          borderRadius: '50%',
          animation: 'spin 16s linear infinite',
        }} />
        {/* Middle ring with tick marks */}
        <div style={{
          position: 'absolute', width: '150px', height: '150px',
          border: '1px solid rgba(200, 16, 46, 0.2)',
          borderRadius: '50%',
        }} />
        {/* Inner pulsing ring */}
        <div style={{
          position: 'absolute',
          width: `${radius * 2 * pulseScale}px`,
          height: `${radius * 2 * pulseScale}px`,
          border: '1px solid rgba(255, 23, 68, 0.4)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(200, 16, 46, 0.3)',
          transition: 'transform 0.1s',
        }} />
        {/* Scanning conic beam */}
        <div style={{
          position: 'absolute', width: '160px', height: '160px',
          transform: `rotate(${scanAngle}deg)`,
          background: `conic-gradient(from 0deg, transparent 0deg, ${active.color}50 8deg, transparent 25deg)`,
          borderRadius: '50%',
          opacity: 0.7,
          transition: 'background 0.5s',
        }} />
        {/* Corner crosshairs */}
        {[
          { top: '-4px', left: '50%', transform: 'translateX(-50%)' },
          { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' },
          { left: '-4px', top: '50%', transform: 'translateY(-50%)' },
          { right: '-4px', top: '50%', transform: 'translateY(-50%)' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', width: '8px', height: '8px',
            ...p,
            background: active.color,
            opacity: 0.6,
            transition: 'background 0.3s',
          }} />
        ))}

        {/* Center logo with glow */}
        <div style={{
          position: 'relative', zIndex: 2,
          transform: `scale(${pulseScale})`,
          transition: 'transform 0.1s',
          filter: `drop-shadow(0 0 12px ${active.color}80)`,
        }}>
          <DiamondLogo size={84} text={active.short} color={active.color} />
        </div>

        {/* Status text floating around */}
        <div style={{
          position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Courier New', monospace", fontSize: '8px',
          color: 'rgba(0, 255, 102, 0.5)', letterSpacing: '0.2em',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span style={{ width: '4px', height: '4px', background: '#00ff66', borderRadius: '50%' }} />
          CERTIFIED
        </div>
        <div style={{
          position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Courier New', monospace", fontSize: '8px',
          color: 'rgba(0, 255, 102, 0.4)', letterSpacing: '0.15em',
        }}>
          ACTIVE: {String(activeIdx + 1).padStart(2, '0')}/{String(certs.length).padStart(2, '0')}
        </div>
      </div>

      {/* Details panel */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: "'Courier New', monospace", fontSize: '10px',
          color: active.color, letterSpacing: '0.15em', textTransform: 'uppercase',
          fontWeight: 700, marginBottom: '4px',
          transition: 'color 0.3s',
        }}>
          {'> '}{active.name.toUpperCase()}
        </div>
        <p style={{
          fontFamily: "'Courier New', monospace", fontSize: '10px',
          lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.55)',
          margin: '0 auto 6px', maxWidth: '300px',
        }}>{active.description}</p>
        <a href={active.url} target="_blank" rel="noopener noreferrer"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = active.color
            e.currentTarget.style.borderColor = active.color
            e.currentTarget.style.boxShadow = `0 0 8px ${active.color}50`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(0, 255, 102, 0.7)'
            e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.3)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          style={{
            display: 'inline-block',
            fontFamily: "'Courier New', monospace", fontSize: '9px',
            color: 'rgba(0, 255, 102, 0.7)', textDecoration: 'none',
            border: '1px solid rgba(0, 255, 102, 0.3)', borderRadius: '2px',
            padding: '4px 10px', letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}>VIEW_CREDENTIAL ↗</a>
      </div>

      {/* Cert tile grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px',
        paddingTop: '10px', borderTop: '1px solid rgba(200, 16, 46, 0.1)',
        position: 'relative', zIndex: 1,
      }}>
        {certs.map((cert, i) => (
          <button key={cert.id} onClick={() => setActiveIdx(i)}
            onMouseEnter={(e) => {
              if (i !== activeIdx) {
                e.currentTarget.style.background = 'rgba(0, 255, 102, 0.12)'
                e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.5)'
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 255, 102, 0.2)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = i === activeIdx ? 'rgba(200, 16, 46, 0.2)' : 'rgba(0, 255, 102, 0.03)'
              e.currentTarget.style.borderColor = i === activeIdx ? cert.color : 'rgba(0, 255, 102, 0.15)'
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            style={{
              background: i === activeIdx ? 'rgba(200, 16, 46, 0.2)' : 'rgba(0, 255, 102, 0.03)',
              border: i === activeIdx ? `1px solid ${cert.color}` : '1px solid rgba(0, 255, 102, 0.15)',
              padding: '5px 2px 4px', borderRadius: '2px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              fontFamily: "'Courier New', monospace", fontSize: '7.5px',
              color: i === activeIdx ? cert.color : 'rgba(0, 255, 102, 0.6)',
              fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            <DiamondLogo size={26} text={cert.short} color={cert.color} />
            <span style={{ marginTop: '1px' }}>{cert.short}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
