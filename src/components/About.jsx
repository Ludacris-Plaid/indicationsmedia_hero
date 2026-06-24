import { useState, useRef, useEffect, useCallback } from 'react'
import TechStack from './TechStack'
import useIsMobile from '../hooks/useIsMobile'

const useCounterAnimation = (endValue, duration = 2000) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    let animationFrameId = null

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(2 - 2 * progress, 2)
      
      setCount(Math.floor(ease * endValue))
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [endValue, duration])

  return count
}

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

const testimonials = [
  { name: 'Sarah K.', role: 'CEO, NovaTech Solutions', quote: 'They built our entire platform in 6 weeks. Zero downtime since launch. Our security posture went from nonexistent to SOC 2 compliant.' },
  { name: 'Marcus R.', role: 'CTO, Flux Dynamics', quote: 'Indications Media doesn\'t just write code — they architect systems. Our API handles 10x the traffic now with half the latency.' },
  { name: 'Diana L.', role: 'Founder, Prism Analytics', quote: 'The AI integration they built processes 50k documents daily. It\'s like having a team of analysts working 24/7.' },
  { name: 'James T.', role: 'VP Eng, Harbor Systems', quote: 'They found vulnerabilities our previous team missed entirely. Post-pen-test, we haven\'t had a single incident in 14 months.' },
  { name: 'Priya M.', role: 'Director, Vertex Commerce', quote: 'From concept to production in 4 months. Our e-commerce platform now does $2M monthly with 99.99% uptime.' },
  { name: 'Alex Chen', role: 'Founder, CipherVault', quote: 'They hardened our infrastructure in under a week. What took our last team months, Indications Media shipped in days.' },
  { name: 'Rachel W.', role: 'Head of Product, Orbit Labs', quote: 'The real-time dashboards they built give us visibility we never had. We catch issues before our customers do.' },
  { name: 'Devon B.', role: 'CTO, NeonBridge', quote: 'Clean code, tight architecture, zero hand-holding. They delivered exactly what was spec\'d and then some.' },
  { name: 'Kenji O.', role: 'CEO, Wavepoint Digital', quote: 'Our conversion rate jumped 40% after the redesign. The attention to performance and UX detail was unreal.' },
  { name: 'Laura F.', role: 'VP Tech, Stratum Health', quote: 'HIPAA-compliant from day one. They understood the compliance landscape better than most security firms we\'ve worked with.' },
]

function TestimonialBox({ isVisible }) {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(c => !c), 530)
    return () => clearInterval(blink)
  }, [])

  useEffect(() => {
    const t = testimonials[index]
    const fullText = `"${t.quote}" — ${t.name}, ${t.role}`

    if (phase === 'typing') {
      if (displayed.length < fullText.length) {
        const timer = setTimeout(() => {
          setDisplayed(fullText.slice(0, displayed.length + 1))
        }, 18)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => setPhase('pausing'), 4000)
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
        }, 8)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setIndex((prev) => (prev + 1) % testimonials.length)
          setPhase('typing')
        }, 300)
        return () => clearTimeout(timer)
      }
    }
  }, [displayed, phase, index])

  const t = testimonials[index]

  return (
    <div style={{
      padding: '20px',
      borderRadius: '2px',
      border: '1px solid rgba(0, 255, 102, 0.1)',
      background: 'rgba(0, 255, 102, 0.02)',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
      transition: 'all 0.8s ease 0.6s',
    }}>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '10px',
        color: 'rgba(0, 255, 102, 0.5)',
        letterSpacing: '0.1em',
        marginBottom: '14px',
        textTransform: 'uppercase',
      }}>
        {'// CLIENT_LOG'}
        <span style={{
          float: 'right',
          color: 'rgba(0, 255, 102, 0.3)',
          fontSize: '9px',
        }}>
          [{String(index + 1).padStart(2, '0')}/{String(testimonials.length).padStart(2, '0')}]
        </span>
      </div>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '11px',
        lineHeight: 1.7,
        color: 'rgba(255, 255, 255, 0.55)',
        minHeight: '60px',
      }}>
        <span style={{ color: '#00ff66' }}>{'>'} </span>
        {displayed}
        <span style={{ opacity: showCursor ? 1 : 0, color: '#00ff66' }}>_</span>
      </div>
    </div>
  )
}

export default function About() {
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

  const stats = [
    { number: 50, label: 'Projects Deployed' },
    { number: 8, label: 'Years Runtime' },
    { number: 30, label: 'Active Clients' },
    { number: 15, label: 'Awards Compiled' },
  ]

  const skills = [
    'Full-Stack Development', 'System Architecture', 'AI Integration',
    'Cybersecurity', 'API Development', 'Cloud & DevOps',
    'Linux Systems', 'Database Design', 'Network Engineering',
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: isMobile ? '80px 16px' : '120px 40px',
        pointerEvents: 'auto',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '55% 45%',
        gap: isMobile ? '32px' : '60px',
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
            color: 'rgba(0, 204, 255, 0.6)',
            marginBottom: '12px',
            letterSpacing: '0.1em',
            animation: 'labelPulse 3s ease-in-out infinite',
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
            whiteSpace: isMobile ? 'normal' : 'nowrap',
          }}>
            A studio built on{' '}
            <TypewriterWord words={ROTATING_WORDS} color="#00ccff" />
          </h2>
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '13px',
            lineHeight: 1.9,
            color: 'rgba(255, 255, 255, 0.5)',
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
                border: '1px solid rgba(0, 255, 102, 0.15)',
                color: '#00ff66',
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
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
          transition: 'all 0.8s ease 0.2s',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}>
            {stats.map((stat, index) => {
              const isCyan = index % 2 === 1
              const isWhite = index === 0 || index === 2
              const accent = isCyan ? '#00ccff' : isWhite ? '#ffffff' : '#00ff66'
              return (
                <div key={stat.label} style={{
                  padding: '28px',
                  borderRadius: '2px',
                  border: `1px solid ${isCyan ? 'rgba(0, 204, 255, 0.08)' : isWhite ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 255, 102, 0.06)'}`,
                  background: 'rgba(255, 255, 255, 0.02)',
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
                    color: accent,
                    textShadow: `0 0 15px ${isCyan ? 'rgba(0, 204, 255, 0.3)' : isWhite ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 255, 102, 0.3)'}`,
                  }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '32px',
                      fontWeight: 700,
                      color: accent,
                    }}>
                      {useCounterAnimation(stat.number, 2000)}
                    </span>
                    <span style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: accent,
                    }}>
                      +
                    </span>
                  </div>
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>

           {/* Digital Manifesto */}
           <div style={{
             padding: '20px',
             borderRadius: '2px',
             border: '1px solid rgba(0, 255, 102, 0.3)',
             background: 'rgba(0, 255, 102, 0.03)',
             opacity: isVisible ? 1 : 0,
             transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
             transition: 'all 0.8s ease 0.5s',
             position: 'relative',
             overflow: 'hidden',
           }}>
             <div style={{
               fontFamily: "'Courier New', monospace",
               fontSize: '10px',
               color: '#00ff66',
               letterSpacing: '0.1em',
               marginBottom: '14px',
               textTransform: 'uppercase',
               display: 'flex',
               justifyContent: 'space-between',
             }}>
               {'// SYSTEM_MANIFESTO'}
               <span style={{ color: 'rgba(0, 255, 102, 0.4)' }}>v1.0.4_stable</span>
             </div>
             <div style={{
               fontFamily: "'Space Grotesk', sans-serif",
               fontSize: '13px',
               lineHeight: 1.6,
               color: 'rgba(255, 255, 255, 0.7)',
               fontStyle: 'italic',
             }}>
               "We operate at the intersection of security and curiosity. Born from the <span style={{ color: '#00ff66', fontWeight: 'bold' }}>grey-hat</span> ethos, we believe that true stability is only found by understanding the breaks. Our philosophy is simple: <span style={{ color: '#00ff66' }}>open source</span> is the only path forward, and information wants to be free. We don't just build walls; we know exactly how to climb them—which is why our walls are the only ones that actually hold."
             </div>
             <div style={{
               marginTop: '16px',
               display: 'flex',
               flexWrap: 'wrap',
               gap: '8px',
               opacity: 0.6,
               fontFamily: 'monospace',
               fontSize: '8px',
               color: '#00ff66',
               overflow: 'hidden',
               whiteSpace: 'nowrap'
             }}>
               <marquee scrollamount="3" style={{ width: '100%' }}>
                 [INFO_WANTS_TO_BE_FREE] &nbsp;&nbsp; [CYBER_AUTONOMY] &nbsp;&nbsp; [DIGITAL_SOVEREIGNTY] &nbsp;&nbsp; [VOID_THE_WARRANTY] &nbsp;&nbsp; [PRIVACY_IS_A_RIGHT] &nbsp;&nbsp; [DECENTRALIZE_EVERYTHING] &nbsp;&nbsp; [OPEN_SOURCE_OR_DIE] &nbsp;&nbsp; [RESIST_THE_ALGORITHM] &nbsp;&nbsp; [KNOWLEDGE_FOR_ALL] &nbsp;&nbsp; [ENCRYPT_YOUR_LIFE] &nbsp;&nbsp; [NO_MASTERS_NO_ROOTS]
               </marquee>
             </div>
           </div>

          {/* Testimonial */}
          <TestimonialBox isVisible={isVisible} />
        </div>
      </div>
    </section>
  )
}
