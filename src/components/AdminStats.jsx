import { useState, useEffect, useRef } from 'react'

/* ───────── animated counter hook ───────── */
function useAnimatedCounter(target, duration = 1600) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)
  const start = useRef(null)
  const from = useRef(0)

  useEffect(() => {
    from.current = value
    start.current = null
    const step = (ts) => {
      if (!start.current) start.current = ts
      const p = Math.min((ts - start.current) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from.current + (target - from.current) * ease))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

/* ───────── color palette ───────── */
const C = {
  bg: '#030806',
  green: '#00ff66',
  greenDim: 'rgba(0,255,102,0.12)',
  greenMid: 'rgba(0,255,102,0.25)',
  cyan: '#00ccff',
  cyanDim: 'rgba(0,204,255,0.12)',
  cyanMid: 'rgba(0,204,255,0.25)',
  red: '#ff3366',
  redDim: 'rgba(255,51,102,0.12)',
  purple: '#7C3AED',
  purpleDim: 'rgba(124,58,237,0.12)',
  white: 'rgba(255,255,255,0.85)',
  muted: 'rgba(255,255,255,0.4)',
  mono: "'Courier New', monospace",
  sans: "'Space Grotesk', sans-serif",
}

/* ───────── keyframes (injected once) ───────── */
const KEYFRAMES = `
@keyframes scanline  { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
@keyframes pulse     { 0%,100%{box-shadow:0 0 8px rgba(0,255,102,0.3)} 50%{box-shadow:0 0 20px rgba(0,255,102,0.6)} }
@keyframes pulseCyan { 0%,100%{box-shadow:0 0 8px rgba(0,204,255,0.3)} 50%{box-shadow:0 0 20px rgba(0,204,255,0.6)} }
@keyframes pulseRed  { 0%,100%{box-shadow:0 0 8px rgba(255,51,102,0.3)} 50%{box-shadow:0 0 20px rgba(255,51,102,0.6)} }
@keyframes fadeInUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes glowBorder{ 0%,100%{border-color:rgba(0,255,102,0.15)} 50%{border-color:rgba(0,255,102,0.4)} }
@keyframes dataFlow  { 0%{stroke-dashoffset:20} 100%{stroke-dashoffset:0} }
@keyframes barGrow   { from{width:0} }
@keyframes dotPulse  { 0%,100%{r:3;opacity:1} 50%{r:6;opacity:0.6} }
@keyframes dotPulseCyan { 0%,100%{r:3;opacity:1} 50%{r:6;opacity:0.6} }
@keyframes scanDot   { 0%{cx:0} 100%{cx:100%} }
@keyframes feedSlide { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
@keyframes glitchShift{ 0%{clip-path:inset(40% 0 61% 0)} 20%{clip-path:inset(92% 0 1% 0)} 40%{clip-path:inset(43% 0 1% 0)} 60%{clip-path:inset(25% 0 58% 0)} 80%{clip-path:inset(54% 0 7% 0)} 100%{clip-path:inset(58% 0 43% 0)} }
@keyframes countUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
@keyframes hexScroll { from{transform:translateY(0)} to{transform:translateY(-50%)} }
@keyframes borderTrace{ 0%{clip-path:polygon(0 0,0 0,0 0,0 0)} 25%{clip-path:polygon(0 0,100% 0,100% 0,0 0)} 50%{clip-path:polygon(0 0,100% 0,100% 100%,100% 100%)} 75%{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)} 100%{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)} }
`

/* ───────── section header ───────── */
function SectionHeader({ label, color = C.green }) {
  return (
    <div style={{
      fontFamily: C.mono, fontSize: '10px', color,
      letterSpacing: '0.15em', marginBottom: '16px',
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      <span style={{ width: 6, height: 6, background: color, borderRadius: '50%', boxShadow: `0 0 8px ${color}` }} />
      {'> '}{label}
    </div>
  )
}

/* ───────── stat card ───────── */
function StatCard({ label, value, suffix = '', color = C.green, delay = 0 }) {
  const v = useAnimatedCounter(value)
  const [vis, setVis] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t) }, [delay])

  return (
    <div style={{
      padding: '20px',
      background: `${color}06`,
      border: `1px solid ${color}30`,
      borderRadius: '4px',
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* scanline accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        animation: 'glowBorder 3s ease-in-out infinite',
      }} />

      <div style={{
        fontFamily: C.mono, fontSize: '9px', color: C.muted,
        letterSpacing: '0.12em', marginBottom: '10px', textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: C.sans, fontSize: 'clamp(28px,4vw,36px)', fontWeight: 700,
        color, textShadow: `0 0 30px ${color}40`,
        display: 'flex', alignItems: 'baseline', gap: '4px',
      }}>
        <span style={{ animation: 'countUp 0.4s ease' }}>{v.toLocaleString()}</span>
        {suffix && <span style={{ fontSize: '14px', opacity: 0.6 }}>{suffix}</span>}
      </div>

      {/* sparkline decoration */}
      <svg width="100%" height="24" style={{ marginTop: '10px', opacity: 0.4 }}>
        <polyline
          points={Array.from({ length: 12 }, (_, i) => `${(i / 11) * 100},${12 + Math.sin(i * 0.8) * 8 + Math.random() * 3}`).join(' ')}
          fill="none" stroke={color} strokeWidth="1"
          strokeDasharray="4 2" style={{ animation: 'dataFlow 2s linear infinite' }}
        />
      </svg>
    </div>
  )
}

/* ───────── hourly traffic chart (SVG area) ───────── */
function HourlyChart({ data }) {
  const max = Math.max(...data.map(d => d.visits), 1)
  const W = 680, H = 160, PAD = 40, CHART_W = W - PAD * 2, CHART_H = H - 40

  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * CHART_W
    const y = 20 + CHART_H - (d.visits / max) * CHART_H
    return `${x},${y}`
  })
  const line = pts.join(' ')
  const area = `${PAD},${20 + CHART_H} ${line} ${PAD + CHART_W},${20 + CHART_H}`

  return (
    <div style={{ position: 'relative' }}>
      {/* scanline */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`,
        animation: 'glowBorder 3s ease-in-out infinite', zIndex: 1,
      }} />

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.green} stopOpacity="0.25" />
            <stop offset="100%" stopColor={C.green} stopOpacity="0.01" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line key={i}
            x1={PAD} y1={20 + CHART_H * (1 - pct)} x2={PAD + CHART_W} y2={20 + CHART_H * (1 - pct)}
            stroke="rgba(0,255,102,0.06)" strokeWidth="1"
          />
        ))}

        {/* area fill */}
        <polygon points={area} fill="url(#areaGrad)" />

        {/* line */}
        <polyline points={line} fill="none" stroke={C.green} strokeWidth="2"
          filter="url(#glow)" strokeLinejoin="round"
          strokeDasharray="20" style={{ animation: 'dataFlow 3s linear infinite' }}
        />

        {/* dots */}
        {data.map((d, i) => {
          const x = PAD + (i / (data.length - 1)) * CHART_W
          const y = 20 + CHART_H - (d.visits / max) * CHART_H
          return d.visits > 0 ? (
            <circle key={i} cx={x} cy={y} r="2.5" fill={C.green} filter="url(#glow)">
              <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
            </circle>
          ) : null
        })}

        {/* x-axis labels */}
        {data.filter((_, i) => i % 4 === 0).map((d, i) => (
          <text key={i}
            x={PAD + (i * 4 / (data.length - 1)) * CHART_W} y={H - 2}
            fill={C.muted} fontSize="8" fontFamily={C.mono} textAnchor="middle"
          >
            {d.hour}
          </text>
        ))}

        {/* scan beam */}
        <rect x={PAD} y={20} width="2" height={CHART_H} fill={C.green} opacity="0.15">
          <animate attributeName="x" values={`${PAD};${PAD + CHART_W};${PAD}`} dur="8s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  )
}

/* ───────── geo map (simplified world with dots) ───────── */
const COUNTRY_COORDS = {
  US: [20, 35], CA: [22, 22], GB: [47, 24], DE: [50, 26], FR: [48, 28],
  JP: [82, 30], AU: [82, 62], BR: [30, 58], IN: [68, 38], NL: [49, 24],
  SE: [52, 18], SG: [74, 48], KR: [80, 30], CH: [49, 27], NO: [51, 16],
  FI: [54, 16], DK: [50, 21], IE: [45, 23], ES: [46, 30], IT: [50, 29],
  PL: [52, 24], RU: [65, 20], CN: [76, 32], MX: [16, 38], AR: [28, 66],
  ZA: [52, 62], TR: [56, 30], EG: [54, 36], AE: [60, 36], SA: [57, 36],
}

function GeoMap({ data }) {
  const max = Math.max(...data.map(d => d.visits), 1)

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '50%', overflow: 'hidden' }}>
      <svg viewBox="0 0 100 70" width="100%" height="100%"
        style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="mapGlow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* grid */}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 7} x2="100" y2={i * 7}
            stroke="rgba(0,255,102,0.04)" strokeWidth="0.3" />
        ))}
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`v${i}`} x1={i * 7} y1="0" x2={i * 7} y2="70"
            stroke="rgba(0,255,102,0.04)" strokeWidth="0.3" />
        ))}

        {/* outline continents (very simplified) */}
        <path d="M15,25 Q20,20 25,22 Q30,18 35,20 Q38,22 36,28 Q32,32 28,30 Q22,34 18,30 Z"
          fill="none" stroke="rgba(0,255,102,0.08)" strokeWidth="0.4" />
        <path d="M44,20 Q48,18 52,20 Q55,22 54,28 Q50,32 46,28 Q43,24 44,20 Z"
          fill="none" stroke="rgba(0,255,102,0.08)" strokeWidth="0.4" />
        <path d="M60,25 Q70,20 80,24 Q85,28 82,35 Q78,40 72,38 Q65,35 60,30 Z"
          fill="none" stroke="rgba(0,255,102,0.08)" strokeWidth="0.4" />
        <path d="M26,48 Q32,44 34,50 Q32,58 28,60 Q24,56 26,48 Z"
          fill="none" stroke="rgba(0,255,102,0.08)" strokeWidth="0.4" />
        <path d="M76,52 Q84,48 86,55 Q84,64 78,62 Q74,58 76,52 Z"
          fill="none" stroke="rgba(0,255,102,0.08)" strokeWidth="0.4" />

        {/* connection lines between top countries */}
        {data.slice(0, 5).map((d, i) => {
          const next = data[i + 1]
          if (!next) return null
          const c1 = COUNTRY_COORDS[d.code]
          const c2 = COUNTRY_COORDS[next.code]
          if (!c1 || !c2) return null
          return (
            <line key={i} x1={c1[0]} y1={c1[1]} x2={c2[0]} y2={c2[1]}
              stroke={C.green} strokeWidth="0.3" opacity="0.2"
              strokeDasharray="2 2" style={{ animation: 'dataFlow 3s linear infinite' }}
            />
          )
        })}

        {/* country dots */}
        {data.map((d) => {
          const coords = COUNTRY_COORDS[d.code]
          if (!coords) return null
          const size = 2 + (d.visits / max) * 4
          return (
            <g key={d.code} filter="url(#mapGlow)">
              {/* pulse ring */}
              <circle cx={coords[0]} cy={coords[1]} r={size + 3}
                fill="none" stroke={C.green} strokeWidth="0.3" opacity="0.3">
                <animate attributeName="r" values={`${size};${size + 5};${size}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* dot */}
              <circle cx={coords[0]} cy={coords[1]} r={size}
                fill={C.green} opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* label */}
              <text x={coords[0]} y={coords[1] - size - 2}
                fill={C.green} fontSize="3" fontFamily={C.mono}
                textAnchor="middle" opacity="0.6">
                {d.code}
              </text>
            </g>
          )
        })}

        {/* scanning line */}
        <line x1="0" y1="0" x2="100" y2="0" stroke={C.green} strokeWidth="0.5" opacity="0.15">
          <animate attributeName="y1" values="0;70;0" dur="10s" repeatCount="indefinite" />
          <animate attributeName="y2" values="0;70;0" dur="10s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  )
}

/* ───────── geo list ───────── */
function GeoList({ data }) {
  const max = data.length > 0 ? data[0].visits : 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {data.slice(0, 8).map((d, i) => (
        <div key={d.code} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          animation: `feedSlide 0.3s ease ${i * 60}ms both`,
        }}>
          <span style={{
            fontFamily: C.mono, fontSize: '9px', color: C.cyan,
            width: '22px', textAlign: 'center', letterSpacing: '0.05em',
          }}>
            {d.code}
          </span>
          <div style={{ flex: 1, height: '4px', background: 'rgba(0,255,102,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              width: `${(d.visits / max) * 100}%`,
              background: `linear-gradient(90deg, ${C.green}60, ${C.cyan}60)`,
              boxShadow: `0 0 8px ${C.green}30`,
              animation: `barGrow 0.8s ease ${i * 80}ms both`,
            }} />
          </div>
          <span style={{
            fontFamily: C.mono, fontSize: '10px', color: C.green,
            minWidth: '32px', textAlign: 'right',
          }}>
            {d.visits}
          </span>
          <span style={{
            fontFamily: C.mono, fontSize: '8px', color: C.muted, minWidth: '28px', textAlign: 'right',
          }}>
            {d.pct}%
          </span>
        </div>
      ))}
    </div>
  )
}

/* ───────── page breakdown bars ───────── */
function PageBreakdown({ data }) {
  const max = data.length > 0 ? data[0].views : 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {data.map((d, i) => (
        <div key={d.page} style={{ animation: `feedSlide 0.3s ease ${i * 50}ms both` }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '4px',
          }}>
            <span style={{
              fontFamily: C.mono, fontSize: '10px', color: C.white,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%',
            }}>
              {d.page}
            </span>
            <span style={{
              fontFamily: C.mono, fontSize: '10px', color: C.green,
            }}>
              {d.views.toLocaleString()}
            </span>
          </div>
          <div style={{
            height: '6px', background: 'rgba(0,255,102,0.06)',
            borderRadius: '3px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: '3px',
              width: `${(d.views / max) * 100}%`,
              background: `linear-gradient(90deg, ${C.green}80, ${C.cyan}80)`,
              boxShadow: `0 0 12px ${C.green}20`,
              animation: `barGrow 0.8s ease ${i * 80}ms both`,
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ───────── interaction breakdown ───────── */
function InteractionBreakdown({ data }) {
  const max = data.length > 0 ? data[0].count : 1
  const colors = [C.green, C.cyan, C.red, C.purple]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
      {data.slice(0, 8).map((d, i) => {
        const col = colors[i % colors.length]
        return (
          <div key={d.name} style={{
            padding: '12px',
            background: `${col}08`,
            border: `1px solid ${col}25`,
            borderRadius: '3px',
            animation: `feedSlide 0.3s ease ${i * 60}ms both`,
          }}>
            <div style={{
              fontFamily: C.mono, fontSize: '9px', color: C.muted,
              letterSpacing: '0.08em', marginBottom: '6px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {d.name}
            </div>
            <div style={{
              fontFamily: C.sans, fontSize: '20px', fontWeight: 700,
              color: col, textShadow: `0 0 20px ${col}30`,
            }}>
              {d.count.toLocaleString()}
            </div>
            <div style={{
              height: '3px', background: 'rgba(255,255,255,0.04)',
              borderRadius: '2px', marginTop: '8px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: '2px',
                width: `${(d.count / max) * 100}%`,
                background: col, opacity: 0.6,
                animation: `barGrow 0.6s ease ${i * 100}ms both`,
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ───────── live event feed ───────── */
function EventFeed({ events }) {
  const typeColor = (t) => t === 'pageview' ? C.green : C.cyan
  const typeBg = (t) => t === 'pageview' ? C.greenDim : C.cyanDim

  return (
    <div style={{
      maxHeight: '220px', overflowY: 'auto',
      scrollbarWidth: 'thin', scrollbarColor: `${C.greenMid} transparent`,
    }}>
      {events.map((e, i) => {
        const col = typeColor(e.type)
        const t = new Date(e.ts)
        const time = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}:${String(t.getSeconds()).padStart(2, '0')}`
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 10px', borderBottom: '1px solid rgba(255,255,255,0.03)',
            animation: `feedSlide 0.25s ease ${i * 30}ms both`,
          }}>
            <span style={{
              fontFamily: C.mono, fontSize: '8px', color: C.muted, minWidth: '58px',
            }}>
              {time}
            </span>
            <span style={{
              fontFamily: C.mono, fontSize: '8px', fontWeight: 700,
              color: col, padding: '2px 5px', background: typeBg(e.type),
              borderRadius: '2px', minWidth: '60px', textAlign: 'center',
            }}>
              {e.type.toUpperCase()}
            </span>
            <span style={{
              fontFamily: C.mono, fontSize: '9px', color: C.cyan,
              minWidth: '28px', textAlign: 'center',
            }}>
              {e.country}
            </span>
            <span style={{
              fontFamily: C.mono, fontSize: '9px', color: C.white,
              flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {e.name || e.page}
            </span>
          </div>
        )
      })}
      {events.length === 0 && (
        <div style={{
          fontFamily: C.mono, fontSize: '11px', color: C.muted,
          textAlign: 'center', padding: '24px',
        }}>
          AWAITING_INCOMING_DATA...
        </div>
      )}
    </div>
  )
}

/* ─══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function AdminStats({ password }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [health, setHealth] = useState(null)
  const [healthLoading, setHealthLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setStats(data)
      setLastUpdate(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) throw new Error('Health check failed')
      const data = await res.json()
      setHealth(data)
      setHealthLoading(false)
    } catch {
      setHealthLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchHealth()
    const interval = setInterval(fetchStats, 30000)
    const healthInterval = setInterval(fetchHealth, 60000)
    return () => { clearInterval(interval); clearInterval(healthInterval) }
  }, [password])

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease' }}>
      <style>{KEYFRAMES}</style>

      {/* scanline */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
        background: 'rgba(0, 255, 102, 0.12)',
        animation: 'scanline 4s linear infinite',
        pointerEvents: 'none', zIndex: 100,
      }} />

      {/* ── SECTION HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px', paddingBottom: '12px',
        borderBottom: `1px solid ${C.green}20`,
      }}>
        <SectionHeader label="ANALYTICS_MONITOR" color={C.green} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastUpdate && (
            <span style={{
              fontFamily: C.mono, fontSize: '9px', color: C.muted, letterSpacing: '0.08em',
            }}>
              LAST_SYNC: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: error ? C.red : C.green,
            boxShadow: `0 0 8px ${error ? C.red : C.green}`,
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        </div>
      </div>

      {loading && (
        <div style={{
          fontFamily: C.mono, fontSize: '12px', color: C.green,
          textAlign: 'center', padding: '60px 0',
        }}>
          <div style={{ marginBottom: '8px' }}>{'>'} INITIALIZING ANALYTICS_ENGINE</div>
          <div style={{ color: C.muted }}>Loading sensor data...</div>
        </div>
      )}

      {error && (
        <div style={{
          fontFamily: C.mono, fontSize: '11px', color: C.red,
          padding: '16px', background: C.redDim,
          border: `1px solid ${C.red}30`, borderRadius: '4px',
          textAlign: 'center',
        }}>
          ERR: {error}
        </div>
      )}

      {stats && !loading && (
        <>
          {/* ── STAT CARDS ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px', marginBottom: '28px',
          }}>
            <StatCard label="TOTAL_VISITS" value={stats.totalVisits} color={C.green} delay={0} />
            <StatCard label="UNIQUE_VISITORS" value={stats.uniqueVisitors} color={C.cyan} delay={80} />
            <StatCard label="BOUNCE_RATE" value={stats.bounceRate} suffix="%" color={C.red} delay={160} />
            <StatCard label="AVG_SESSION" value={stats.avgDuration} suffix="sec" color={C.purple} delay={240} />
          </div>

          {/* ── HOURLY TRAFFIC ── */}
          <div style={{
            padding: '20px', marginBottom: '28px',
            background: `${C.green}04`, border: `1px solid ${C.green}18`,
            borderRadius: '4px', overflow: 'hidden',
          }}>
            <SectionHeader label="HOURLY_TRAFFIC_24H" color={C.green} />
            <HourlyChart data={stats.hourlyTraffic} />
          </div>

          {/* ── API HEALTH STATUS ── */}
          <div style={{
            padding: '20px', marginBottom: '28px',
            background: `${C.cyan}04`, border: `1px solid ${C.cyan}18`,
            borderRadius: '4px', overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <SectionHeader label="API_HEALTH_STATUS" color={C.cyan} />
              <span style={{
                fontFamily: C.mono, fontSize: '8px', color: C.muted,
                letterSpacing: '0.1em',
              }}>
                AUTO_REFRESH: 60s
              </span>
            </div>

            {healthLoading ? (
              <div style={{
                fontFamily: C.mono, fontSize: '11px', color: C.cyan,
                textAlign: 'center', padding: '20px',
              }}>
                {'>'} PINGING_ENDPOINTS...
              </div>
            ) : health ? (
              <>
                {/* Overall status bar */}
                <div style={{
                  padding: '10px 14px', marginBottom: '14px',
                  background: health.overall === 'operational'
                    ? 'rgba(0,255,102,0.05)' : 'rgba(255,51,102,0.05)',
                  border: `1px solid ${health.overall === 'operational' ? 'rgba(0,255,102,0.2)' : 'rgba(255,51,102,0.2)'}`,
                  borderRadius: '2px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: health.overall === 'operational' ? C.green : C.red,
                    boxShadow: `0 0 8px ${health.overall === 'operational' ? C.green : C.red}`,
                    animation: 'pulse 2s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontFamily: C.mono, fontSize: '11px', fontWeight: 700,
                    color: health.overall === 'operational' ? C.green : C.red,
                    letterSpacing: '0.1em',
                  }}>
                    {health.overall === 'operational' ? 'ALL_SYSTEMS_OPERATIONAL' : 'SYSTEM_DEGRADED'}
                  </span>
                </div>

                {/* Provider cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px',
                }}>
                  {health.providers.map((p) => {
                    const statusColor = p.status === 'up' ? C.green
                      : p.status === 'degraded' ? '#FF6600'
                      : C.red
                    const statusLabel = p.status === 'up' ? 'ONLINE'
                      : p.status === 'degraded' ? 'DEGRADED'
                      : p.status === 'timeout' ? 'TIMEOUT'
                      : 'OFFLINE'
                    return (
                      <div key={p.id} style={{
                        padding: '12px 14px',
                        background: `${statusColor}06`,
                        border: `1px solid ${statusColor}25`,
                        borderRadius: '3px',
                        transition: 'all 0.3s',
                      }}>
                        {/* Provider header */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}>
                          <span style={{
                            fontFamily: C.mono, fontSize: '9px', fontWeight: 700,
                            color: p.color, letterSpacing: '0.08em',
                          }}>
                            {p.name}
                          </span>
                          <span style={{
                            fontFamily: C.mono, fontSize: '8px',
                            color: 'rgba(255,255,255,0.3)',
                            padding: '1px 6px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '2px',
                          }}>
                            {p.role}
                          </span>
                        </div>

                        {/* Status + latency */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          marginBottom: '6px',
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: statusColor, boxShadow: `0 0 6px ${statusColor}`,
                          }} />
                          <span style={{
                            fontFamily: C.mono, fontSize: '10px', fontWeight: 700,
                            color: statusColor, letterSpacing: '0.08em',
                          }}>
                            {statusLabel}
                          </span>
                          <span style={{
                            fontFamily: C.mono, fontSize: '9px', color: C.muted,
                          }}>
                            {p.latency}ms
                          </span>
                        </div>

                        {/* Model */}
                        <div style={{
                          fontFamily: C.mono, fontSize: '9px',
                          color: 'rgba(255,255,255,0.25)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {p.model}
                        </div>

                        {/* Latency sparkline */}
                        {health.history?.[p.id] && (
                          <div style={{ marginTop: '8px' }}>
                            <div style={{
                              display: 'flex', alignItems: 'end', gap: '2px',
                              height: '16px',
                            }}>
                              {health.history[p.id].slice(-12).map((h, i) => {
                                const maxLatency = 5000
                                const barHeight = Math.max(2, Math.min(16, (h.latency / maxLatency) * 16))
                                const barColor = h.status === 'up' ? C.green
                                  : h.status === 'degraded' ? '#FF6600'
                                  : C.red
                                return (
                                  <div key={i} style={{
                                    width: '4px',
                                    height: `${barHeight}px`,
                                    background: barColor,
                                    borderRadius: '1px',
                                    opacity: 0.5 + (i / 12) * 0.5,
                                    animation: `barGrow 0.5s ease ${i * 50}ms`,
                                  }} />
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div style={{
                fontFamily: C.mono, fontSize: '11px', color: C.red,
                textAlign: 'center', padding: '20px',
              }}>
                ERR: Health check data unavailable
              </div>
            )}
          </div>

          {/* ── GEO + PAGES (side by side) ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px', marginBottom: '28px',
          }}>
            {/* Geo Map */}
            <div style={{
              padding: '20px',
              background: `${C.cyan}04`, border: `1px solid ${C.cyan}18`,
              borderRadius: '4px', overflow: 'hidden',
            }}>
              <SectionHeader label="GEOGRAPHIC_DISTRIBUTION" color={C.cyan} />
              <GeoMap data={stats.geo} />
              <div style={{ marginTop: '16px' }}>
                <GeoList data={stats.geo} />
              </div>
            </div>

            {/* Page Breakdown */}
            <div style={{
              padding: '20px',
              background: `${C.green}04`, border: `1px solid ${C.green}18`,
              borderRadius: '4px',
            }}>
              <SectionHeader label="PAGE_ANALYTICS" color={C.green} />
              <PageBreakdown data={stats.pageAnalytics} />
            </div>
          </div>

          {/* ── INTERACTIONS + FEED ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px', marginBottom: '28px',
          }}>
            {/* Interaction Breakdown */}
            <div style={{
              padding: '20px',
              background: `${C.red}04`, border: `1px solid ${C.red}18`,
              borderRadius: '4px',
            }}>
              <SectionHeader label="INTERACTION_EVENTS" color={C.red} />
              <InteractionBreakdown data={stats.interactionBreakdown} />
            </div>

            {/* Live Event Feed */}
            <div style={{
              padding: '20px',
              background: `${C.purple}04`, border: `1px solid ${C.purple}18`,
              borderRadius: '4px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <SectionHeader label="LIVE_EVENT_STREAM" color={C.purple} />
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: C.green, boxShadow: `0 0 6px ${C.green}`,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontFamily: C.mono, fontSize: '8px', color: C.green,
                    letterSpacing: '0.1em',
                  }}>
                    LIVE
                  </span>
                </div>
              </div>
              <EventFeed events={stats.recent} />
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(0,255,102,0.02)',
            border: `1px solid ${C.green}10`,
            borderRadius: '3px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '8px',
          }}>
            <span style={{
              fontFamily: C.mono, fontSize: '9px', color: C.muted, letterSpacing: '0.08em',
            }}>
              TOTAL_EVENTS: {stats.totalEvents?.toLocaleString() || 0} · AUTO_REFRESH: 30s
            </span>
            <span style={{
              fontFamily: C.mono, fontSize: '9px', color: C.muted, letterSpacing: '0.08em',
            }}>
              {'// '}ANALYTICS_ENGINE v1.0.0 — INDICATIONS_MEDIA
            </span>
          </div>
        </>
      )}
    </div>
  )
}
