import { useState, useRef, useEffect } from 'react'

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
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
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
        padding: '120px 40px 60px',
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
            color: 'rgba(0, 255, 102, 0.6)',
            marginBottom: '16px',
            letterSpacing: '0.1em',
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

          <a
            href="mailto:hello@indicationsmedia.com"
            className="btn-redraw"
            style={{
              display: 'inline-block',
              padding: '16px 36px',
              minWidth: '200px',
              borderRadius: '2px',
              border: '1px solid #00ff66',
              background: 'rgba(0, 255, 102, 0.05)',
              color: '#00ff66',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: "'Courier New', monospace",
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 15px rgba(0, 255, 102, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.12)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 102, 0.2)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 102, 0.05)'
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 102, 0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            hello@indicationsmedia.com
          </a>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(0, 255, 102, 0.06)',
          paddingTop: '32px',
          marginTop: '80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '11px',
            color: 'rgba(0, 255, 102, 0.5)',
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
            {['Twitter', 'GitHub', 'LinkedIn'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '10px',
                  color: 'rgba(0, 255, 102, 0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={(e) => { e.target.style.color = '#00ff66' }}
                onMouseLeave={(e) => { e.target.style.color = 'rgba(0, 255, 102, 0.6)' }}
              >
                {link}
              </a>
            ))}
          </div>

          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '10px',
            color: 'rgba(0, 255, 102, 0.5)',
          }}>
            © 2025 INDICATIONS_MEDIA
          </div>
        </div>
      </div>
    </section>
  )
}
