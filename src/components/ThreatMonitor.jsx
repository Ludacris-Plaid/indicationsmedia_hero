import { useEffect, useState, useRef } from 'react'

const EVENT_POOL = [
  { type: 'OK', color: '#00ff66', text: 'TLS_HANDSHAKE 200', detail: 'indicationsmedia.com' },
  { type: 'BLOCK', color: '#ff3366', text: 'SQL_INJECTION', detail: '185.220.101.42' },
  { type: 'SCAN', color: '#ffcc00', text: 'PORT_SCAN', detail: '45.33.32.156' },
  { type: 'OK', color: '#00ff66', text: 'DEPLOY_PROD', detail: 'a3f8b1c' },
  { type: 'AUTH', color: '#00ccff', text: '2FA_VERIFIED', detail: 'user@protonmail.com' },
  { type: 'BLOCK', color: '#ff3366', text: 'XSS_ATTEMPT', detail: '91.219.236.222' },
  { type: 'OK', color: '#00ff66', text: 'CERT_RENEWED', detail: "Let's Encrypt" },
  { type: 'RATE', color: '#ff8800', text: 'RATE_LIMIT_HIT', detail: '/api/auth' },
  { type: 'OK', color: '#00ff66', text: 'BACKUP_OK', detail: 'pg_dump 1.2GB' },
  { type: 'GEO', color: '#ff3366', text: 'GEO_BLOCK', detail: 'CN → refused' },
  { type: 'SCAN', color: '#ffcc00', text: 'DIR_TRAVERSAL', detail: '162.247.74.74' },
  { type: 'OK', color: '#00ff66', text: 'HEALTH_CHECK', detail: 'all_systems_nominal' },
  { type: 'AUTH', color: '#00ccff', text: 'PGP_SIGNED', detail: 'commit 7e3a91d' },
  { type: 'BLOCK', color: '#ff3366', text: 'BRUTE_FORCE', detail: '51.158.0.0/15' },
  { type: 'OK', color: '#00ff66', text: 'CDN_PURGE', detail: '14 edges' },
  { type: 'WARN', color: '#ffcc00', text: 'CERT_EXPIRY_30D', detail: 'api.*' },
  { type: 'OK', color: '#00ff66', text: 'BUILD_PASSED', detail: '8.42s' },
  { type: 'BLOCK', color: '#ff3366', text: 'BOT_DETECTED', detail: 'ua_headless' },
  { type: 'OK', color: '#00ff66', text: 'DNS_PROPAGATED', detail: '4/4 NS' },
  { type: 'SCAN', color: '#ffcc00', text: 'CVE_PROBE', detail: 'CVE-2024-3094' },
  { type: 'AUTH', color: '#00ccff', text: 'SSH_KEY_OK', detail: 'ed25519' },
  { type: 'OK', color: '#00ff66', text: 'UPTIME_99.99%', detail: 'rolling 30d' },
  { type: 'BLOCK', color: '#ff3366', text: 'WAF_TRIGGERED', detail: '/api/contact' },
  { type: 'OK', color: '#00ff66', text: 'CACHE_WARMED', detail: '1041 keys' },
]

const ICONS = {
  OK: '✓',
  BLOCK: '✕',
  SCAN: '!',
  AUTH: '◆',
  RATE: '⚠',
  GEO: '⊘',
  WARN: '!',
}

function formatTime(d) {
  return d.toTimeString().slice(0, 8)
}

function makeEvent() {
  const e = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)]
  return {
    ...e,
    id: Date.now() + Math.random(),
    time: formatTime(new Date()),
  }
}

export default function ThreatMonitor({ isVisible }) {
  const [events, setEvents] = useState(() => {
    const initial = []
    for (let i = 0; i < 8; i++) {
      const e = EVENT_POOL[i % EVENT_POOL.length]
      const t = new Date(Date.now() - (8 - i) * 27000)
      initial.push({ ...e, id: `init-${i}`, time: formatTime(t) })
    }
    return initial
  })
  const [paused, setPaused] = useState(false)
  const [counts, setCounts] = useState({ ok: 247, block: 18, scan: 7 })
  const containerRef = useRef(null)

  useEffect(() => {
    if (paused || !isVisible) return
    const interval = setInterval(() => {
      setEvents((prev) => {
        const next = [...prev, makeEvent()]
        return next.slice(-10)
      })
      setCounts((prev) => {
        const r = Math.random()
        if (r < 0.55) return { ...prev, ok: prev.ok + 1 }
        if (r < 0.8) return { ...prev, block: prev.block + 1 }
        return { ...prev, scan: prev.scan + 1 }
      })
    }, 2200)
    return () => clearInterval(interval)
  }, [paused, isVisible])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [events])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        padding: '16px',
        borderRadius: '2px',
        border: '1px solid rgba(0, 255, 102, 0.2)',
        background: 'rgba(0, 255, 102, 0.02)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
        transition: 'all 0.8s ease 0.7s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
      }}>
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '10px',
          color: '#00ff66',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {'// THREAT_MONITOR'}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: paused ? 'rgba(255, 204, 0, 0.8)' : 'rgba(0, 255, 102, 0.8)',
          letterSpacing: '0.08em',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: paused ? '#ffcc00' : '#00ff66',
            boxShadow: paused
              ? '0 0 6px #ffcc00'
              : '0 0 6px #00ff66',
            animation: paused ? 'none' : 'pulse-dot 1.5s ease-in-out infinite',
          }} />
          {paused ? 'PAUSED' : 'LIVE'}
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        marginBottom: '12px',
        fontFamily: "'Courier New', monospace",
        fontSize: '9px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(0, 255, 102, 0.5)', fontSize: '8px', letterSpacing: '0.1em' }}>PASS</div>
          <div style={{ color: '#00ff66', fontWeight: 700, fontSize: '12px' }}>{counts.ok}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255, 51, 102, 0.5)', fontSize: '8px', letterSpacing: '0.1em' }}>BLOCK</div>
          <div style={{ color: '#ff3366', fontWeight: 700, fontSize: '12px' }}>{counts.block}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(255, 204, 0, 0.5)', fontSize: '8px', letterSpacing: '0.1em' }}>SCAN</div>
          <div style={{ color: '#ffcc00', fontWeight: 700, fontSize: '12px' }}>{counts.scan}</div>
        </div>
      </div>

      {/* Log */}
      <div
        ref={containerRef}
        style={{
          height: '130px',
          overflow: 'hidden',
          position: 'relative',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      >
        {events.map((evt) => (
          <div
            key={evt.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Courier New', monospace",
              fontSize: '9px',
              lineHeight: 1.5,
              padding: '2px 0',
              animation: 'log-fade-in 0.4s ease-out',
            }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.25)', flexShrink: 0, fontSize: '8.5px' }}>{evt.time}</span>
            <span style={{ color: evt.color, fontWeight: 700, width: '12px', textAlign: 'center', flexShrink: 0 }}>{ICONS[evt.type]}</span>
            <span style={{ color: evt.color, fontWeight: 600, flexShrink: 0 }}>{evt.type.padEnd(5)}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.text}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)', marginLeft: 'auto', flexShrink: 0, fontSize: '8.5px' }}>{evt.detail}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '10px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(0, 255, 102, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: "'Courier New', monospace",
        fontSize: '8px',
        color: 'rgba(0, 255, 102, 0.4)',
        letterSpacing: '0.08em',
      }}>
        <span>UPTIME: 99.99%</span>
        <span>HOVER_TO_PAUSE</span>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes log-fade-in {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
