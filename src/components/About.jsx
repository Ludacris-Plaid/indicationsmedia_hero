import { useState, useRef, useEffect } from 'react'
import TechStack from './TechStack'

const ROTATING_WORDS = ['code', 'craft', 'design', 'precision', 'vision', 'execution', 'strategy', 'innovation', 'systems', 'architecture']

function TypewriterWord({ words, typeSpeed = 60, deleteSpeed = 35, pauseMs = 2500, color = '#00ff66' }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(c => !c), 530)
    return () => clearInterval(blink)
  }, [])

  useEffect(() => {
    const current = words[wordIndex]

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
          setWordIndex((prev) => (prev + 1) % words.length)
          setPhase('typing')
        }, 10)
        return () => clearTimeout(timer)
      }
    }
  }, [displayed, phase, wordIndex, words, typeSpeed, deleteSpeed, pauseMs])

  return (
    <span style={{ color }}>
      {displayed}
      <span style={{ opacity: showCursor ? 1 : 0 }}>_</span>
    </span>
  )
}

export default function About() {
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

  const stats = [
    { number: '50+', label: 'Projects Deployed' },
    { number: '8+', label: 'Years Runtime' },
    { number: '30+', label: 'Active Clients' },
    { number: '15+', label: 'Awards Compiled' },
  ]

  const skills = [
    'Full-Stack Development', 'System Architecture', 'AI Integration',
    'Cybersecurity', 'API Development', 'Cloud & DevOps',
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: '120px 40px',
        pointerEvents: 'auto',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '55% 45%',
        gap: '60px',
        alignItems: 'start',
      }}>
        {/* Left */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 0.8s ease',
        }}>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '11px',
            color: 'rgba(0, 255, 102, 0.6)',
            marginBottom: '12px',
            letterSpacing: '0.1em',
          }}>
            {'// ABOUT US'}
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(24px, 3.5vw, 38px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: '0 0 20px 0',
            color: 'rgba(255, 255, 255, 0.9)',
            whiteSpace: 'nowrap',
          }}>
            A studio built on{' '}
            <TypewriterWord words={ROTATING_WORDS} color="#00ccff" />
          </h2>
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '13px',
            lineHeight: 1.9,
            color: 'rgba(0, 255, 102, 0.7)',
            textShadow: '0 0 8px rgba(0, 255, 102, 0.15)',
            marginBottom: '20px',
          }}>
            {'> Indications Media is a digital development studio'}
            <br />
            {'> building custom solutions and secure systems.'}
            <br />
            {'> We architect technology that performs.'}
          </p>

          {/* Skills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '32px',
          }}>
            {skills.map((skill, i) => (
              <span key={skill} style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                padding: '6px 12px',
                borderRadius: '2px',
                border: '1px solid rgba(0, 255, 102, 0.1)',
                color: 'rgba(0, 255, 102, 0.7)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: `all 0.5s ease ${0.3 + i * 0.05}s`,
                letterSpacing: '0.05em',
              }}>
                {skill}
              </span>
            ))}
          </div>

          {/* Tech Stack */}
          <div style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 0.4s',
          }}>
            <TechStack />
          </div>
        </div>

        {/* Right - Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
          transition: 'all 0.8s ease 0.2s',
        }}>
          {stats.map((stat, index) => (
            <div key={stat.label} style={{
              padding: '28px',
              borderRadius: '2px',
              border: '1px solid rgba(0, 255, 102, 0.06)',
              background: 'rgba(0, 255, 102, 0.02)',
              textAlign: 'center',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
              transition: `all 0.6s ease ${0.3 + index * 0.08}s`,
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '32px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '6px',
                color: '#00ff66',
                textShadow: '0 0 15px rgba(0, 255, 102, 0.3)',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '10px',
                color: 'rgba(0, 255, 102, 0.6)',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
