import { useState, useRef, useEffect } from 'react'
import useIsMobile from '../hooks/useIsMobile'

const CYCLE_WORDS = [
  'execute',
  'build',
  'create',
  'launch',
  'deploy',
  'innovate',
  'transform',
  'disrupt',
]

function RotatingWord({ words = CYCLE_WORDS, typeSpeed = 60, deleteSpeed = 40, pauseMs = 2200 }) {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    const current = words[index]

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
          setIndex((prev) => (prev + 1) % words.length)
          setPhase('typing')
        }, 10)
        return () => clearTimeout(timer)
      }
    }
  }, [displayed, phase, index, words, typeSpeed, deleteSpeed, pauseMs])

  return (
    <span style={{ color: '#00ccff', textShadow: '0 0 25px rgba(0, 204, 255, 0.4)' }}>
      {displayed}
    </span>
  )
}

export default function Contact() {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let root = null
    let parent = el.parentElement
    while (parent) {
      if (parent.style && parent.style.overflowY === 'auto') {
        root = parent
        break
      }
      parent = parent.parentElement
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { root, threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '70vh',
        padding: isMobile ? '80px 16px 40px' : '120px 40px 60px',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease',
        }}>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '11px',
            color: '#00ccff',
            marginBottom: '16px',
            letterSpacing: '0.1em',
            animation: 'connectionPulse 2.5s ease-in-out infinite',
          }}>
            {'// ESTABLISH CONNECTION'}
          </div>

          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 24px 0',
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            Ready to{' '}
            <RotatingWord />
            <span className="blink" style={{ color: '#00ccff', textShadow: '0 0 25px rgba(0, 204, 255, 0.4)' }}>?</span>
          </h2>

          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '13px',
            lineHeight: 1.8,
            color: 'rgba(0, 255, 102, 0.7)',
            textShadow: '0 0 8px rgba(0, 255, 102, 0.15)',
            maxWidth: '450px',
            margin: '0 auto 40px',
          }}>
            {'> Have a project that needs'}
            <br />
            {'> to be built right? Let\'s talk.'}
          </p>

          {/* Email */}
          <div style={{
            marginBottom: '12px',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '9px',
              color: 'rgba(0, 255, 102, 0.35)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              {'// EMAIL'}
            </div>

          <a
            href="mailto:indicationsmedia@protonmail.com"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: isMobile ? '12px 16px' : '14px 28px',
              borderRadius: '2px',
              border: '1px solid rgba(0, 255, 102, 0.15)',
              background: 'rgba(0, 255, 102, 0.03)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(0, 255, 102, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.08)'
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 255, 102, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.35)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.03)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 102, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Envelope SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(0, 255, 102, 0.4))',
                animation: 'emailFloat 3s ease-in-out infinite',
                flexShrink: 0,
              }}
            >
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="#00ff66" strokeWidth="1.5" fill="rgba(0, 255, 102, 0.05)" />
              <path d="M2 7l8.5 6.5c.9.7 2.1.7 3 0L22 7" stroke="#00ff66" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            </svg>

            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '13px',
              color: '#00ff66',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(0, 255, 102, 0.3)',
              wordBreak: 'break-all',
            }}>
              indicationsmedia@protonmail.com
            </span>

            <span style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '9px',
              color: 'rgba(0, 255, 102, 0.3)',
              letterSpacing: '0.1em',
            }}>
              [pgp]
            </span>
          </a>
          </div>

          {/* Telegram */}
          <div style={{
            marginTop: '44px',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 0.3s',
          }}>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '9px',
              color: 'rgba(0, 204, 255, 0.35)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              {'// DIRECT_LINE'}
            </div>

            <a
              href="https://t.me/therealdysthemix"
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-line"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 24px',
                borderRadius: '2px',
                border: '1px solid rgba(0, 204, 255, 0.15)',
                background: 'rgba(0, 204, 255, 0.03)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(0, 204, 255, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 204, 255, 0.08)'
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 204, 255, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.35)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 204, 255, 0.03)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 204, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.15)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Telegram SVG */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(0, 204, 255, 0.4))',
                  animation: 'telegramFloat 3s ease-in-out infinite',
                  flexShrink: 0,
                }}
              >
                <circle cx="12" cy="12" r="12" fill="rgba(0, 204, 255, 0.08)" />
                <path
                  d="M5.4 11.2l4.3 1.6 1.6 5.1c.1.3.5.4.7.1l2.2-2.6c.2-.2.5-.2.7 0l2.8 2.1c.3.2.7 0 .7-.3l2-11c.1-.4-.3-.7-.7-.6L5.3 10.3c-.4.1-.4.7.1.9zm6-1.5l5.5-3.4c.1-.1.2.1.1.2l-4.7 5.3c-.2.2-.3.5-.3.8l-.2 1.5c0 .1-.2.1-.2 0l-.8-2.5c-.1-.3.1-.6.4-.8l.2-.1z"
                  fill="#00ccff"
                  opacity="0.9"
                  style={{ transition: 'all 0.3s ease' }}
                />
              </svg>

              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '13px',
                color: '#00ccff',
                letterSpacing: '0.06em',
                textShadow: '0 0 10px rgba(0, 204, 255, 0.3)',
                transition: 'all 0.3s ease',
              }}>
                @therealdysthemix
              </span>

              <span style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '9px',
                color: 'rgba(0, 204, 255, 0.3)',
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease',
              }}>
                [online]
              </span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(0, 255, 102, 0.06)',
          paddingTop: isMobile ? '24px' : '32px',
          marginTop: isMobile ? '48px' : '80px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? '20px' : '16px',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              border: '1px solid rgba(0, 255, 102, 0.2)',
              borderRadius: '2px',
              fontSize: '8px',
              fontWeight: 700,
              color: '#00ff66',
            }}>
              iM
            </span>
            indications.media
          </div>

          <div style={{
            display: 'flex',
            gap: '20px',
          }}>
            {[
              { name: 'Twitter', color: '#1DA1F2' },
              { name: 'GitHub', color: '#F05032' },
              { name: 'LinkedIn', color: '#0A66C2' },
            ].map((link) => (
              <a
                key={link.name}
                href="#"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '10px',
                  color: link.color,
                  opacity: 0.7,
                  textDecoration: 'none',
                  transition: 'opacity 0.3s',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => { e.target.style.opacity = '1' }}
                onMouseLeave={(e) => { e.target.style.opacity = '0.7' }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '10px',
            color: '#00ccff',
            letterSpacing: '0.05em',
            animation: 'copyrightPulse 3s ease-in-out infinite',
          }}>
            c.2024 INDICATIONS_MEDIA
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes copyrightPulse {
          0%, 100% { opacity: 0.6; text-shadow: 0 0 4px rgba(0, 204, 255, 0.2); }
          50% { opacity: 1; text-shadow: 0 0 12px rgba(0, 204, 255, 0.4); }
        }
        @keyframes connectionPulse {
          0%, 100% { opacity: 0.4; text-shadow: 0 0 4px rgba(0, 204, 255, 0.15); }
          50% { opacity: 1; text-shadow: 0 0 16px rgba(0, 204, 255, 0.45), 0 0 32px rgba(0, 204, 255, 0.15); }
        }
        @keyframes telegramFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes emailFloat {
          0%, 100% { transform: translateY(0); }
          33% { transform: translateY(-2px); }
          66% { transform: translateY(1px); }
        }
      `}</style>
    </section>
  )
}
