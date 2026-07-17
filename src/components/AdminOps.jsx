import { useState, useEffect } from 'react'

const C = {
  bg: '#030806',
  green: '#00ff66',
  greenDim: 'rgba(0,255,102,0.12)',
  cyan: '#00ccff',
  cyanDim: 'rgba(0,204,255,0.12)',
  red: '#ff3366',
  redDim: 'rgba(255,51,102,0.12)',
  orange: '#FF6600',
  orangeDim: 'rgba(255,102,0,0.12)',
  purple: '#7C3AED',
  purpleDim: 'rgba(124,58,237,0.12)',
  white: 'rgba(255,255,255,0.85)',
  muted: 'rgba(255,255,255,0.4)',
  mono: "'Courier New', monospace",
  sans: "'Space Grotesk', sans-serif",
}

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

/* ── UPTIME PANEL ── */
function UptimePanel({ data, loading }) {
  if (loading) return <LoadingBox label="PINGING_ENDPOINTS" color={C.green} />
  if (!data?.targets) return <ErrorBox label="Uptime data unavailable" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {data.targets.map((t) => (
        <div key={t.id} style={{
          padding: '12px 14px',
          background: t.up ? `${C.green}06` : `${C.red}06`,
          border: `1px solid ${t.up ? `${C.green}25` : `${C.red}25`}`,
          borderRadius: '3px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.up ? C.green : C.red, boxShadow: `0 0 6px ${t.up ? C.green : C.red}` }} />
              <span style={{ fontFamily: C.mono, fontSize: '10px', fontWeight: 700, color: t.color, letterSpacing: '0.05em' }}>{t.name}</span>
            </div>
            <span style={{ fontFamily: C.mono, fontSize: '9px', color: C.muted }}>{t.latency}ms</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: '24H', value: t.uptime24h },
              { label: '7D', value: t.uptime7d },
              { label: '30D', value: t.uptime30d },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.1em', marginBottom: '2px' }}>{label}</div>
                <div style={{
                  fontFamily: C.mono, fontSize: '12px', fontWeight: 700,
                  color: value === null ? C.muted : value >= 99 ? C.green : value >= 95 ? C.orange : C.red,
                }}>
                  {value === null ? '—' : `${value}%`}
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginLeft: 'auto' }}>
              <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.1em', marginBottom: '2px' }}>CHECKS</div>
              <div style={{ fontFamily: C.mono, fontSize: '12px', fontWeight: 700, color: C.muted }}>{t.totalChecks}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── SSL PANEL ── */
function SSLPanel({ data, loading }) {
  if (loading) return <LoadingBox label="CHECKING_CERTIFICATES" color={C.cyan} />
  if (!data?.certificates) return <ErrorBox label="SSL data unavailable" />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {data.certificates.map((c) => {
        const statusColor = c.valid ? (c.isExpiringSoon ? C.orange : C.green) : C.red
        const statusText = c.valid ? (c.isExpiringSoon ? `EXPIRES_${c.daysLeft}D` : 'VALID') : (c.isExpired ? 'EXPIRED' : 'INVALID')
        return (
          <div key={c.id} style={{
            padding: '12px 14px',
            background: `${statusColor}06`,
            border: `1px solid ${statusColor}25`,
            borderRadius: '3px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: C.mono, fontSize: '10px', fontWeight: 700, color: c.color }}>{c.name}</span>
              <span style={{
                fontFamily: C.mono, fontSize: '8px', fontWeight: 700,
                color: statusColor, padding: '2px 8px',
                background: `${statusColor}15`, border: `1px solid ${statusColor}30`,
                borderRadius: '2px', letterSpacing: '0.08em',
              }}>
                {statusText}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
              <InfoRow label="ISSUER" value={c.issuer} />
              <InfoRow label="DAYS_LEFT" value={c.valid ? String(c.daysLeft) : '—'} color={statusColor} />
              <InfoRow label="VALID_FROM" value={c.validFrom?.slice(0, 10) || '—'} />
              <InfoRow label="VALID_TO" value={c.validTo?.slice(0, 10) || '—'} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── DEPLOYS PANEL ── */
function DeploysPanel({ data, loading }) {
  if (loading) return <LoadingBox label="FETCHING_DEPLOY_HISTORY" color={C.purple} />
  if (!data?.deploys?.length) return (
    <div style={{ fontFamily: C.mono, fontSize: '11px', color: C.muted, textAlign: 'center', padding: '20px' }}>
      {data?.note || 'No deploys found'}
    </div>
  )

  const stateColor = (s) => {
    if (s === 'READY') return C.green
    if (s === 'ERROR' || s === 'CANCELED') return C.red
    if (s === 'BUILDING' || s === 'QUEUED') return C.orange
    return C.muted
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {data.deploys.slice(0, 10).map((d) => (
        <div key={d.id} style={{
          padding: '10px 12px',
          background: `${stateColor(d.readyState)}06`,
          border: `1px solid ${stateColor(d.readyState)}18`,
          borderRadius: '2px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: stateColor(d.readyState),
            boxShadow: `0 0 4px ${stateColor(d.readyState)}`,
            flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: C.mono, fontSize: '10px', color: C.white,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {d.message || 'No message'}
            </div>
            <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, marginTop: '2px' }}>
              {d.branch} · {d.author || 'unknown'} · {new Date(d.createdAt).toLocaleString()}
            </div>
          </div>
          <span style={{
            fontFamily: C.mono, fontSize: '8px', fontWeight: 700,
            color: stateColor(d.readyState), letterSpacing: '0.05em',
            flexShrink: 0,
          }}>
            {d.readyState}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── AI USAGE PANEL ── */
function AIUsagePanel({ data, loading }) {
  if (loading) return <LoadingBox label="LOADING_AI_USAGE" color={C.orange} />
  if (!data?.totals) return <ErrorBox label="AI usage data unavailable" />

  const t = data.totals
  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', marginBottom: '14px' }}>
        <MiniStat label="TODAY_CALLS" value={t.todayCalls || 0} color={C.green} />
        <MiniStat label="TODAY_INPUT" value={formatTokens(t.todayInputTokens)} color={C.cyan} />
        <MiniStat label="TODAY_OUTPUT" value={formatTokens(t.todayOutputTokens)} color={C.purple} />
        <MiniStat label="TODAY_COST" value={`$${(t.todayCost || 0).toFixed(4)}`} color={C.orange} />
        <MiniStat label="TOTAL_CALLS" value={t.totalCalls || 0} color={C.muted} />
        <MiniStat label="SUCCESS_RATE" value={`${t.successRate || 100}%`} color={t.successRate >= 99 ? C.green : C.red} />
      </div>

      {/* Daily chart */}
      {data.daily && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.1em', marginBottom: '8px' }}>LAST_7_DAYS</div>
          <div style={{ display: 'flex', alignItems: 'end', gap: '4px', height: '40px' }}>
            {Object.entries(data.daily).map(([date, d]) => {
              const maxCalls = Math.max(1, ...Object.values(data.daily).map(x => x.calls))
              const h = Math.max(2, (d.calls / maxCalls) * 40)
              return (
                <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontFamily: C.mono, fontSize: '7px', color: C.muted }}>{d.calls}</span>
                  <div style={{
                    width: '100%', height: `${h}px`, background: C.green,
                    borderRadius: '1px', opacity: 0.5, animation: 'barGrow 0.5s ease',
                  }} />
                  <span style={{ fontFamily: C.mono, fontSize: '7px', color: C.muted }}>{date.slice(5)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* By model */}
      {data.byModel && Object.keys(data.byModel).length > 0 && (
        <div>
          <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.1em', marginBottom: '8px' }}>BY_MODEL</div>
          {Object.entries(data.byModel).map(([model, m]) => (
            <div key={model} style={{
              padding: '6px 10px', background: `${C.purple}06`,
              border: `1px solid ${C.purple}15`, borderRadius: '2px',
              marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: C.mono, fontSize: '9px', color: C.purple }}>{model}</span>
              <span style={{ fontFamily: C.mono, fontSize: '9px', color: C.muted }}>{m.calls} calls · {formatTokens(m.inputTokens + m.outputTokens)} tokens</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── ERRORS PANEL ── */
function ErrorsPanel({ data, loading }) {
  if (loading) return <LoadingBox label="LOADING_ERROR_LOGS" color={C.red} />
  if (!data?.summary) return <ErrorBox label="Error data unavailable" />

  const s = data.summary
  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        <MiniStat label="LAST_24H" value={s.last24h} color={s.last24h > 0 ? C.red : C.green} />
        <MiniStat label="LAST_7D" value={s.last7d} color={s.last7d > 0 ? C.orange : C.green} />
      </div>

      {/* By status */}
      {Object.keys(s.byStatus).length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.1em', marginBottom: '8px' }}>BY_STATUS</div>
          {Object.entries(s.byStatus).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
            <div key={status} style={{
              padding: '6px 10px', background: `${C.red}06`,
              border: `1px solid ${C.red}15`, borderRadius: '2px',
              marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: C.mono, fontSize: '9px', color: status.startsWith('5') ? C.red : C.orange }}>{status}</span>
              <span style={{ fontFamily: C.mono, fontSize: '9px', color: C.muted }}>{count} hits</span>
            </div>
          ))}
        </div>
      )}

      {/* By path */}
      {s.byPath.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.1em', marginBottom: '8px' }}>TOP_PATHS</div>
          {s.byPath.map(([path, count]) => (
            <div key={path} style={{
              padding: '6px 10px', background: `${C.orange}06`,
              border: `1px solid ${C.orange}15`, borderRadius: '2px',
              marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: C.mono, fontSize: '9px', color: C.orange, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{path}</span>
              <span style={{ fontFamily: C.mono, fontSize: '9px', color: C.muted, marginLeft: '8px' }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Daily chart */}
      {data.daily && (
        <div>
          <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.1em', marginBottom: '8px' }}>DAILY_ERRORS</div>
          <div style={{ display: 'flex', alignItems: 'end', gap: '4px', height: '30px' }}>
            {Object.entries(data.daily).map(([date, d]) => {
              const maxErrors = Math.max(1, ...Object.values(data.daily).map(x => x.total))
              const h = Math.max(1, (d.total / maxErrors) * 30)
              return (
                <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <span style={{ fontFamily: C.mono, fontSize: '7px', color: C.muted }}>{d.total}</span>
                  <div style={{
                    width: '100%', height: `${h}px`,
                    background: d.total > 0 ? C.red : `${C.green}40`,
                    borderRadius: '1px', animation: 'barGrow 0.5s ease',
                  }} />
                  <span style={{ fontFamily: C.mono, fontSize: '7px', color: C.muted }}>{date.slice(5)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── SHARED UI ── */
function LoadingBox({ label, color }) {
  return (
    <div style={{ fontFamily: C.mono, fontSize: '11px', color, textAlign: 'center', padding: '20px' }}>
      <div style={{ marginBottom: '6px' }}>{'>'} {label}</div>
      <div style={{ color: C.muted, fontSize: '9px' }}>Fetching data...</div>
    </div>
  )
}

function ErrorBox({ label }) {
  return (
    <div style={{ fontFamily: C.mono, fontSize: '11px', color: C.red, textAlign: 'center', padding: '20px' }}>
      ERR: {label}
    </div>
  )
}

function InfoRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
      <span style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.08em', flexShrink: 0 }}>{label}:</span>
      <span style={{ fontFamily: C.mono, fontSize: '9px', color: color || C.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{
      padding: '8px 10px', background: `${color}08`,
      border: `1px solid ${color}20`, borderRadius: '2px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: C.mono, fontSize: '8px', color: C.muted, letterSpacing: '0.1em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: C.mono, fontSize: '14px', fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function formatTokens(n) {
  if (!n) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

/* ─══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function AdminOps({ password }) {
  const [activePanel, setActivePanel] = useState('uptime')
  const [uptime, setUptime] = useState(null)
  const [ssl, setSsl] = useState(null)
  const [deploys, setDeploys] = useState(null)
  const [aiUsage, setAiUsage] = useState(null)
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState({})

  const panels = [
    { key: 'uptime', label: 'UPTIME', icon: '◉', color: C.green },
    { key: 'ssl', label: 'SSL', icon: '🔐', color: C.cyan },
    { key: 'deploys', label: 'DEPLOYS', icon: '▲', color: C.purple },
    { key: 'ai-usage', label: 'AI_USAGE', icon: '⚡', color: C.orange },
    { key: 'errors', label: 'ERRORS', icon: '✕', color: C.red },
  ]

  const fetchData = async (key, setter, url) => {
    setLoading(prev => ({ ...prev, [key]: true }))
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${password}` } })
      if (res.ok) {
        const data = await res.json()
        setter(data)
      }
    } catch {}
    setLoading(prev => ({ ...prev, [key]: false }))
  }

  useEffect(() => {
    fetchData('uptime', setUptime, '/api/uptime')
    fetchData('ssl', setSsl, '/api/ssl')
    fetchData('deploys', setDeploys, '/api/deploys')
    fetchData('ai-usage', setAiUsage, '/api/ai-usage')
    fetchData('errors', setErrors, '/api/errors')
  }, [password])

  const refreshAll = () => {
    fetchData('uptime', setUptime, '/api/uptime')
    fetchData('ssl', setSsl, '/api/ssl')
    fetchData('deploys', setDeploys, '/api/deploys')
    fetchData('ai-usage', setAiUsage, '/api/ai-usage')
    fetchData('errors', setErrors, '/api/errors')
  }

  const panelContent = {
    uptime: <UptimePanel data={uptime} loading={loading.uptime} />,
    ssl: <SSLPanel data={ssl} loading={loading.ssl} />,
    deploys: <DeploysPanel data={deploys} loading={loading.deploys} />,
    'ai-usage': <AIUsagePanel data={aiUsage} loading={loading['ai-usage']} />,
    errors: <ErrorsPanel data={errors} loading={loading.errors} />,
  }

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease' }}>
      <style>{`
        @keyframes barGrow { from{width:0} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Panel tabs */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '20px',
        borderBottom: '1px solid rgba(0,255,102,0.1)', paddingBottom: '0',
        flexWrap: 'wrap',
      }}>
        {panels.map((p) => (
          <button
            key={p.key}
            onClick={() => setActivePanel(p.key)}
            style={{
              fontFamily: C.mono, fontSize: '9px', fontWeight: 700,
              letterSpacing: '0.1em', padding: '7px 12px',
              background: activePanel === p.key ? `${p.color}12` : 'transparent',
              border: '1px solid transparent',
              borderBottom: activePanel === p.key ? `1px solid ${C.bg}` : '1px solid transparent',
              borderTop: activePanel === p.key ? `1px solid ${p.color}40` : '1px solid transparent',
              borderLeft: activePanel === p.key ? `1px solid ${p.color}40` : '1px solid transparent',
              borderRight: activePanel === p.key ? `1px solid ${p.color}40` : '1px solid transparent',
              borderRadius: '4px 4px 0 0',
              color: activePanel === p.key ? p.color : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-1px',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
          >
            <span style={{ fontSize: '7px' }}>{p.icon}</span>
            {p.label}
          </button>
        ))}
        <button
          onClick={refreshAll}
          style={{
            fontFamily: C.mono, fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.1em', padding: '7px 12px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px 4px 0 0',
            color: 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            marginLeft: 'auto',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.green; e.currentTarget.style.borderColor = `${C.green}40` }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
        >
          ↻ REFRESH
        </button>
      </div>

      {/* Panel content */}
      <div style={{
        padding: '20px',
        background: `${panels.find(p => p.key === activePanel)?.color || C.green}03`,
        border: `1px solid ${panels.find(p => p.key === activePanel)?.color || C.green}18`,
        borderRadius: '4px',
        minHeight: '200px',
      }}>
        <SectionHeader
          label={panels.find(p => p.key === activePanel)?.label}
          color={panels.find(p => p.key === activePanel)?.color}
        />
        {panelContent[activePanel]}
      </div>
    </div>
  )
}
