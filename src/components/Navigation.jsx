import { useState, useRef, useEffect } from 'react'
import Logo from './Logo'

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

export default function Navigation({ activeSection, setActiveSection, scrollToTop }) {
  const navItems = ['Home', 'Work', 'About', 'Contact']

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '20px 32px',
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
              onClick={() => {
                if (item === 'Home') {
                  setActiveSection('hero')
                  scrollToTop()
                } else {
                  setActiveSection(item.toLowerCase())
                  document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
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
    </nav>
  )
}
