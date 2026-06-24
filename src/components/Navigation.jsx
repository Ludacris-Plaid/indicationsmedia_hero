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

export default function Navigation({ activeSection, setActiveSection, scrollToTop }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = ['Home', 'Work', 'About', 'Contact']

  const handleNav = (item) => {
    setMenuOpen(false)
    if (item === 'Home') {
      setActiveSection('hero')
      scrollToTop()
    } else {
      setActiveSection(item.toLowerCase())
      document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav style={{
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
      background: 'rgba(5, 5, 8, 0.8)',
      backdropFilter: 'blur(20px)',
    }}>
      <Logo onClick={() => {
        setActiveSection('hero')
        scrollToTop()
      }} />

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
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 8, 6, 0.95)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          paddingTop: '80px',
          zIndex: 105,
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
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '1px solid #00ff66' : '1px solid transparent',
                  color: isActive ? '#00ff66' : 'rgba(0, 255, 102, 0.8)',
                  fontSize: '18px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '12px 24px',
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s',
                  textShadow: isActive ? '0 0 12px rgba(0, 255, 102, 0.5)' : 'none',
                }}
              >
                {item}
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}
