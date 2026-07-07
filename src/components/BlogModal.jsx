import { useEffect, useRef } from 'react'

const CATEGORY_COLORS = {
  SECURITY: '#ff3366',
  CRYPTO: '#FF6600',
  AI: '#00ccff',
}

export default function BlogModal({ post, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!post) return
    document.body.style.overflow = 'hidden'
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [post, onClose])

  if (!post) return null

  const catColor = CATEGORY_COLORS[post.category] || '#00ff66'
  const paragraphs = post.content.split('\n\n').filter(Boolean)

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(3, 8, 6, 0.92)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        .blog-modal-body::-webkit-scrollbar { width: 4px }
        .blog-modal-body::-webkit-scrollbar-track { background: transparent }
        .blog-modal-body::-webkit-scrollbar-thumb { background: rgba(0, 255, 102, 0.2); border-radius: 2px }
      `}</style>

      <div style={{
        position: 'relative',
        width: '96vw',
        maxWidth: 'none',
        maxHeight: '92vh',
        background: '#0a0e0c',
        border: `1px solid ${catColor}30`,
        borderRadius: '10px',
        overflow: 'hidden',
        animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header bar */}
        <div style={{
          padding: '24px 40px 20px',
          borderBottom: '1px solid rgba(0, 255, 102, 0.08)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: catColor,
              padding: '3px 10px',
              border: `1px solid ${catColor}40`,
              borderRadius: '3px',
              background: `${catColor}10`,
            }}>
              {post.category}
            </span>
            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.35)',
              letterSpacing: '0.05em',
            }}>
              {post.date}
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 700,
            lineHeight: 1.2,
            margin: 0,
            color: 'rgba(255, 255, 255, 0.95)',
          }}>
            {post.title}
          </h2>
        </div>

        {/* Body */}
        <div className="blog-modal-body" style={{
          padding: '28px 40px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.65)',
              margin: '0 0 20px 0',
            }}>
              {p}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 40px',
          borderTop: '1px solid rgba(0, 255, 102, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(0, 255, 102, 0.4)',
            letterSpacing: '0.15em',
          }}>
            {'> END_OF_TRANSMISSION'}
          </span>

          <button
            onClick={onClose}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#00ff66',
              background: 'rgba(0, 255, 102, 0.05)',
              border: '1px solid rgba(0, 255, 102, 0.25)',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.15)'
              e.currentTarget.style.borderColor = '#00ff66'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.25)'
            }}
          >
            {'[ CLOSE ]'}
          </button>
        </div>
      </div>
    </div>
  )
}
