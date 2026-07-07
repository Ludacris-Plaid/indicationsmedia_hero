import { useState, useRef, useEffect } from 'react'
import Logo from './Logo'
import useIsMobile from '../hooks/useIsMobile'

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789'

function GlitchText({ text, glitchInterval = 4000, glitchDuration = 150 }) {
  const [displayed, setDisplayed] = useState(text)
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const triggerGlitch = () => {
      const chars = text.split('')
      const numGlitches = Math.floor(Math.random() * 3) + 1

      for (let i = 0; i < numGlitches; i++) {
        const pos = Math.floor(Math.random() * chars.length)
        chars[pos] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      }
      setDisplayed(chars.join(''))

      timeoutRef.current = setTimeout(() => setDisplayed(text), glitchDuration)
    }

    const scheduleNext = () => {
      const nextDelay = glitchInterval + Math.random() * 3000
      intervalRef.current = setTimeout(() => {
        triggerGlitch()
        scheduleNext()
      }, nextDelay)
    }

    scheduleNext()

    return () => {
      clearTimeout(timeoutRef.current)
      clearTimeout(intervalRef.current)
    }
  }, [text, glitchInterval, glitchDuration])

  return <>{displayed}</>
}

function HamburgerIcon({ isOpen }) {
  return (
    <div style={{
      width: '24px',
      height: '18px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <span style={{
        display: 'block',
        width: '100%',
        height: '2px',
        background: '#00ff66',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
      }} />
      <span style={{
        display: 'block',
        width: '100%',
        height: '2px',
        background: '#00ff66',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        opacity: isOpen ? 0 : 1,
      }} />
      <span style={{
        display: 'block',
        width: '100%',
        height: '2px',
        background: '#00ff66',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
      }} />
    </div>
  )
}

function MobileMenu({ isOpen, onClose, activeSection, setActiveSection, scrollToTop }) {
  const navItems = ['Home', 'Work', 'About', 'Contact']
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true))
      })
    } else {
      setAnimating(false)
      const timer = setTimeout(() => setVisible(false), 400)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleNav = (item) => {
    setAnimating(false)
    setTimeout(() => {
      onClose()
      if (item === 'Home') {
        setActiveSection('hero')
        scrollToTop()
      } else {
        setActiveSection(item.toLowerCase())
        document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 200)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 105,
      overflow: 'hidden',
    }}>
      {/* Animated dark background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: '#030806',
        opacity: animating ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }} />

      {/* Animated scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,102,0.015) 2px, rgba(0,255,102,0.015) 4px)',
        opacity: animating ? 1 : 0,
        transition: 'opacity 0.6s ease 0.1s',
        animation: animating ? 'scanlineScroll 8s linear infinite' : 'none',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,102,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,102,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: animating ? 1 : 0,
        transition: 'opacity 0.8s ease 0.2s',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        opacity: animating ? 1 : 0,
        transition: 'opacity 0.6s ease 0.1s',
      }} />

      {/* Horizontal glitch line */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1px',
        background: 'rgba(0,255,102,0.4)',
        top: '50%',
        boxShadow: '0 0 20px rgba(0,255,102,0.3)',
        opacity: animating ? 1 : 0,
        transform: animating ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'all 0.6s ease 0.3s',
      }} />

      {/* Menu items */}
      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}>
        {/* System status header */}
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '10px',
          color: 'rgba(0,255,102,0.3)',
          letterSpacing: '0.2em',
          marginBottom: '24px',
          opacity: animating ? 1 : 0,
          transform: animating ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.5s ease 0.2s',
        }}>
          [ SYSTEM://NAV_MENU.ACTIVE ]
        </div>

        {navItems.map((item, i) => {
          const isActive = item === 'Home'
            ? activeSection === 'hero'
            : activeSection === item.toLowerCase()
          return (
            <button
              key={item}
              onClick={() => handleNav(item)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#00ff66' : 'rgba(0,255,102,0.6)',
                fontSize: '28px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '16px 48px',
                fontFamily: "'Courier New', monospace",
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                textShadow: isActive ? '0 0 20px rgba(0,255,102,0.6)' : 'none',
                opacity: animating ? 1 : 0,
                transform: animating ? 'translateX(0)' : 'translateX(40px)',
                transitionDelay: `${0.15 + i * 0.08}s`,
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#00ff66'
                  e.currentTarget.style.textShadow = '0 0 15px rgba(0,255,102,0.5)'
                  e.currentTarget.style.transform = 'translateX(8px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'rgba(0,255,102,0.6)'
                  e.currentTarget.style.textShadow = 'none'
                  e.currentTarget.style.transform = 'translateX(0)'
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  left: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#00ff66',
                  boxShadow: '0 0 10px #00ff66',
                }} />
              )}
              <GlitchText text={item} glitchInterval={5000} />
            </button>
          )
        })}

        {/* Bottom status */}
        <div style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: 'rgba(0,255,102,0.2)',
          letterSpacing: '0.15em',
          marginTop: '32px',
          opacity: animating ? 1 : 0,
          transition: 'opacity 0.5s ease 0.6s',
        }}>
          INDICATIONS_MEDIA // {new Date().getFullYear()}
        </div>
      </div>

      <style>{`
        @keyframes scanlineScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
      `}</style>
    </div>
  )
}

export default function Navigation({ activeSection, setActiveSection, scrollToTop }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = ['Home', 'Work', 'About', 'Contact']

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav aria-label="Main navigation" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: isMobile ? '14px 16px' : '20px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      pointerEvents: 'auto',
      borderBottom: '1px solid rgba(0, 255, 102, 0.06)',
      background: menuOpen ? 'transparent' : 'rgba(5, 5, 8, 0.8)',
      backdropFilter: menuOpen ? 'none' : 'blur(20px)',
      transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
    }}>
      <div style={{ zIndex: menuOpen ? 110 : 1 }}>
        <Logo onClick={() => {
          setActiveSection('hero')
          scrollToTop()
          setMenuOpen(false)
        }} />
      </div>

      {/* Desktop nav */}
      {!isMobile && (
        <div style={{
          display: 'flex',
          gap: '28px',
          alignItems: 'center',
        }}>
          {navItems.map((item) => {
            const isActive = item === 'Home'
              ? activeSection === 'hero'
              : activeSection === item.toLowerCase()
            return (
              <button
                key={item}
                onClick={() => handleNav(item)}
                style={{
                  background: isActive ? 'rgba(0, 255, 102, 0.08)' : 'none',
                  border: 'none',
                  borderBottom: isActive ? '1px solid #00ff66' : '1px solid transparent',
                  color: isActive ? '#00ff66' : 'rgba(0, 255, 102, 0.8)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 10px',
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s',
                  textShadow: isActive ? '0 0 12px rgba(0, 255, 102, 0.5)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#00ff66'
                    e.currentTarget.style.textShadow = '0 0 10px rgba(0, 255, 102, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(0, 255, 102, 0.8)'
                    e.currentTarget.style.textShadow = 'none'
                  }
                }}
              >
                <GlitchText text={item} glitchInterval={3000} />
              </button>
            )
          })}
        </div>
      )}

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            zIndex: 110,
          }}
        >
          <HamburgerIcon isOpen={menuOpen} />
        </button>
      )}

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        scrollToTop={scrollToTop}
      />
    </nav>
  )

  function handleNav(item) {
    if (item === 'Home') {
      setActiveSection('hero')
      scrollToTop()
    } else {
      setActiveSection(item.toLowerCase())
      document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
