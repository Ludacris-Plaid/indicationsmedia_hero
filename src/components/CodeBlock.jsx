import { useState } from 'react'

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = code
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const langLabel = language || 'code'

  return (
    <div style={{
      position: 'relative',
      margin: '20px 0',
      borderRadius: '6px',
      border: '1px solid rgba(0, 255, 102, 0.15)',
      background: '#060a08',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
        background: 'rgba(0, 255, 102, 0.03)',
      }}>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(0, 255, 102, 0.5)',
        }}>
          {langLabel}
        </span>
        <button
          onClick={handleCopy}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: copied ? '#00ff66' : 'rgba(0, 255, 102, 0.4)',
            background: copied ? 'rgba(0, 255, 102, 0.1)' : 'transparent',
            border: `1px solid ${copied ? 'rgba(0, 255, 102, 0.4)' : 'rgba(0, 255, 102, 0.15)'}`,
            borderRadius: '3px',
            padding: '3px 8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.color = '#00ff66'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.color = 'rgba(0, 255, 102, 0.4)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.15)'
            }
          }}
        >
          {copied ? '✓ Copied' : '[ Copy ]'}
        </button>
      </div>

      {/* Code content */}
      <pre style={{
        margin: 0,
        padding: '16px',
        overflowX: 'auto',
        fontFamily: "'Courier New', monospace",
        fontSize: '13px',
        lineHeight: 1.7,
        color: 'rgba(0, 255, 102, 0.8)',
        background: 'transparent',
        tabSize: 2,
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
