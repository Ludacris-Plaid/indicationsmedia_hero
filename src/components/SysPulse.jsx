import { useState, useEffect } from 'react'

function parseUserAgent(ua) {
  let os = 'Unknown OS'
  let browser = 'Unknown Browser'

  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

  if (ua.includes('Firefox/')) browser = 'Firefox'
  else if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera'
  else if (ua.includes('Chrome/')) browser = 'Chrome'
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari'

  return { os, browser }
}

function getSystemInfo() {
  const ua = navigator.userAgent
  const { os, browser } = parseUserAgent(ua)

  const cores = navigator.hardwareConcurrency || '—'
  const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '—'

  let connection = '—'
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (conn) {
    connection = conn.effectiveType || conn.type || '—'
  }

  const screenRes = `${window.screen.width}x${window.screen.height}`
  const colorDepth = `${window.screen.colorDepth}-bit`
  const lang = navigator.language || '—'
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '—'

  return [
    { label: 'OS', value: os },
    { label: 'BROWSER', value: browser },
    { label: 'CPU_CORES', value: cores },
    { label: 'RAM', value: ram },
    { label: 'CONNECTION', value: connection.toUpperCase() },
    { label: 'RESOLUTION', value: screenRes },
    { label: 'COLOR_DEPTH', value: colorDepth },
    { label: 'LANG', value: lang },
    { label: 'TZ', value: tz.split('/').pop() },
  ]
}

export default function SysPulse({ isVisible }) {
  const [scanning, setScanning] = useState(true)
  const [info, setInfo] = useState([])
  const [battery, setBattery] = useState(null)
  const [linesShown, setLinesShown] = useState(0)

  useEffect(() => {
    setInfo(getSystemInfo())

    const tryBattery = async () => {
      try {
        const bat = await navigator.getBattery()
        setBattery({ level: Math.round(bat.level * 100), charging: bat.charging })
        bat.addEventListener('levelchange', () => {
          setBattery({ level: Math.round(bat.level * 100), charging: bat.charging })
        })
      } catch {}
    }
    tryBattery()

    const timer = setTimeout(() => setScanning(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible || info.length === 0) return
    if (linesShown >= info.length) return
    const delay = linesShown === 0 ? 400 : 120
    const timer = setTimeout(() => setLinesShown(prev => prev + 1), delay)
    return () => clearTimeout(timer)
  }, [isVisible, linesShown, info.length])

  return (
    <div style={{
      padding: '16px',
      borderRadius: '2px',
      border: '1px solid rgba(0, 255, 102, 0.2)',
      background: 'rgba(0, 255, 102, 0.02)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
      transition: 'all 0.8s ease 0.8s',
      fontFamily: "'Courier New', monospace",
    }}>
      {/* Header */}
      <div style={{
        fontSize: '10px',
        color: '#00ff66',
        letterSpacing: '0.1em',
        marginBottom: '12px',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {'// SYS_PULSE'}
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '9px',
          color: scanning ? 'rgba(255, 204, 0, 0.8)' : 'rgba(0, 255, 102, 0.8)',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: scanning ? '#ffcc00' : '#00ff66',
            boxShadow: `0 0 6px ${scanning ? '#ffcc00' : '#00ff66'}`,
            animation: scanning ? 'sys-pulse-pulse 1s ease-in-out infinite' : 'none',
          }} />
          {scanning ? 'SCANNING' : 'READY'}
        </span>
      </div>

      {/* Terminal output */}
      <div style={{
        padding: '10px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
        border: '1px solid rgba(0, 255, 102, 0.08)',
        minHeight: '180px',
      }}>
        <div style={{ fontSize: '9px', color: 'rgba(0, 255, 102, 0.5)', marginBottom: '8px' }}>
          {'>'} sys_diagnostic --verbose
        </div>

        {info.slice(0, linesShown).map((item, i) => (
          <div key={item.label} style={{
            fontSize: '9px',
            lineHeight: '1.8',
            animation: 'sys-fade-in 0.25s ease-out',
          }}>
            <span style={{ color: 'rgba(0, 255, 102, 0.4)' }}>{item.label.padEnd(13)}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{item.value}</span>
          </div>
        ))}

        {battery && linesShown >= info.length && (
          <div style={{
            fontSize: '9px',
            lineHeight: '1.8',
            animation: 'sys-fade-in 0.25s ease-out',
          }}>
            <span style={{ color: 'rgba(0, 255, 102, 0.4)' }}>{'BATTERY'.padEnd(13)}</span>
            <span style={{ color: battery.level < 20 ? '#ff3366' : 'rgba(255, 255, 255, 0.8)' }}>
              {battery.level}%{battery.charging ? ' ⚡' : ''}
            </span>
          </div>
        )}

        {!scanning && linesShown >= info.length && (
          <div style={{
            fontSize: '9px',
            color: 'rgba(0, 255, 102, 0.5)',
            marginTop: '8px',
            animation: 'sys-fade-in 0.25s ease-out',
          }}>
            {'>'} <span style={{
              display: 'inline-block',
              width: '7px',
              height: '12px',
              background: 'rgba(0, 255, 102, 0.6)',
              animation: 'sys-blink 1s step-end infinite',
            }} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes sys-pulse-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes sys-fade-in {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes sys-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
