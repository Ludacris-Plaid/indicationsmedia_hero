import useIsMobile from '../hooks/useIsMobile'

const sectionLabel = {
  fontFamily: "'Courier New', monospace",
  fontSize: '10px',
  color: 'rgba(0, 204, 255, 0.5)',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid rgba(0, 204, 255, 0.1)',
  animation: 'labelPulse 3s ease-in-out infinite',
}

const services = [
  { title: 'Custom Web Applications', desc: 'Full-stack solutions tailored to business needs' },
  { title: 'System Architecture', desc: 'Scalable infrastructure and microservices design' },
  { title: 'AI Integration', desc: 'LLM pipelines, automation, and intelligent agents' },
  { title: 'Cybersecurity', desc: 'Vulnerability assessment, hardening, and monitoring' },
  { title: 'API Development', desc: 'REST, GraphQL, and real-time WebSocket endpoints' },
  { title: 'Cloud & DevOps', desc: 'CI/CD, containerization, and cloud deployment' },
]

const iconBox = {
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  transition: 'all 0.3s ease',
  cursor: 'default',
}

const labelStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: '9px',
  color: 'rgba(255, 255, 255, 0.4)',
  textAlign: 'center',
  marginTop: '6px',
  letterSpacing: '0.03em',
}

function TechIcon({ label, color, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={iconBox}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${color}10`
          e.currentTarget.style.borderColor = `${color}30`
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = `0 0 16px ${color}15`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
          {children}
        </svg>
      </div>
      <span style={labelStyle}>{label}</span>
    </div>
  )
}

export default function TechStack() {
  const isMobile = useIsMobile()
  const certs = [
    { abbr: 'A+', name: 'CompTIA A+' },
    { abbr: 'Network+', name: 'CompTIA Network+' },
    { abbr: 'Security+', name: 'CompTIA Security+' },
    { abbr: 'Linux+', name: 'CompTIA Linux+' },
    { abbr: 'C#', name: 'C# Diploma' },
    { abbr: 'DevOps', name: 'DevOps Diploma' },
    { abbr: 'PenTest+', name: 'CompTIA PenTest+' },
  ]

  return (
    <div style={{ marginTop: '40px' }}>
      {/* Services + Certifications side by side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '24px' : '32px',
        marginBottom: '36px',
      }}>
        {/* Services */}
        <div>
          <div style={sectionLabel}>{'// SERVICES'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {services.map((s) => (
              <div key={s.title} style={{
                padding: '14px 16px',
                borderRadius: '2px',
                border: '1px solid rgba(0, 204, 255, 0.06)',
                background: 'rgba(0, 204, 255, 0.02)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.15)'
                  e.currentTarget.style.background = 'rgba(0, 204, 255, 0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 204, 255, 0.06)'
                  e.currentTarget.style.background = 'rgba(0, 204, 255, 0.02)'
                }}
              >
                <div style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#00ff66',
                  marginBottom: '4px',
                  letterSpacing: '0.02em',
                }}>
                  {'> '}{s.title}
                </div>
                <div style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  lineHeight: 1.5,
                }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div style={sectionLabel}>{'// CERTIFICATIONS'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {certs.map((cert) => (
              <div key={cert.abbr} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: '2px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '4px',
                  border: '1.5px solid #00ff66',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 255, 102, 0.06)',
                  boxShadow: '0 0 10px rgba(0, 255, 102, 0.12)',
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" fill="#00ff66" />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.05em',
                  }}>
                    {cert.abbr}
                  </div>
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '9px',
                    color: 'rgba(255, 255, 255, 0.35)',
                    letterSpacing: '0.03em',
                  }}>
                    {cert.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack — Three Balanced Columns */}
      <div style={sectionLabel}>{'// STACK'}</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gap: isMobile ? '24px' : '20px',
      }}>
        {/* Languages */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(0, 255, 102, 0.35)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Languages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <TechIcon label="JavaScript" color="#F7DF1E">
              <rect x="2" y="2" width="20" height="20" rx="2" fill="#F7DF1E" />
              <path d="M13.3 17.5c.5 1 1.3 1.7 2.6 1.7 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-1.9-1.7l-.7-.3c-2-.8-3.3-1.8-3.3-4 0-2 1.5-3.5 3.9-3.5 1.7 0 2.9.6 3.8 2.1l-2 1.3c-.5-.9-1-1.2-1.8-1.2-.8 0-1.3.5-1.3 1.2 0 .8.5 1.1 1.7 1.6l.7.3c2.3.9 3.6 1.9 3.6 4.2 0 2.4-1.9 3.6-4.4 3.6-2.5 0-4.1-1.2-4.8-2.8l2.1-1.2zM8.3 16.3c.4.7.8 1.3 1.7 1.3.9 0 1.5-.3 1.5-1.5V9.2h2.7v6.9c0 2.4-1.4 3.5-3.4 3.5-1.8 0-2.9-.9-3.5-2l2-1.3z" fill="#000" />
            </TechIcon>
            <TechIcon label="Java" color="#ED8B00">
              <path d="M8.5 3C7 5.5 6.5 8.5 7 11c.3 1.5 1 3 2 4 .3.3.5.5.5.8 0 .3-.2.5-.5.5-.5 0-1.5-.5-2-1-.8-.8-1.3-2-1.5-3.2-.3 1.2-.8 2.4-1.5 3.2-.5.5-1.5 1-2 1-.3 0-.5-.2-.5-.5 0-.3.2-.5.5-.8 1-1 1.7-2.5 2-4 .5-2.5 0-5.5-1.5-8h3zm7 0c-1.5 2.5-2 5.5-1.5 8 .3 1.5 1 3 2 4 .3.3.5.5.5.8 0 .3-.2.5-.5.5-.5 0-1.5-.5-2-1-.8-.8-1.3-2-1.5-3.2-.3 1.2-.8 2.4-1.5 3.2-.5.5-1.5 1-2 1-.3 0-.5-.2-.5-.5 0-.3.2-.5.5-.8 1-1 1.7-2.5 2-4 .5-2.5 0-5.5-1.5-8h3z" fill="#ED8B00" />
            </TechIcon>
            <TechIcon label="Python" color="#3776AB">
              <path d="M11.9 2C6.8 2 6.5 4.1 6.5 4.1v2.1h5.5v.7H5.2S2 6.3 2 11.8s2.9 5.4 2.9 5.4h1.7v-2.6s-.1-2.9 2.9-2.9h5s2.8 0 2.8-2.8V4.5S18.4 2 11.9 2zm-2.8 1.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" fill="#3776AB" />
              <path d="M12.1 22c5.1 0 5.4-2.1 5.4-2.1v-2.1h-5.5v-.7h6.8S22 17.7 22 12.2s-2.9-5.4-2.9-5.4h-1.7v2.6s.1 2.9-2.9 2.9h-5s-2.8 0-2.8 2.8v4.5S5.6 22 12.1 22zm2.8-1.5a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" fill="#FFD43B" />
            </TechIcon>
            <TechIcon label="Go" color="#00ADD8">
              <path d="M1.5 10c0-3.3 2.7-6 6-6h7.5v2H7.5c-2.2 0-4 1.8-4 4s1.8 4 4 4h1.5v2H7.5c-3.3 0-6-2.7-6-6zm12-4.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5zM7.5 12h7.5c2.2 0 4-1.8 4-4s-1.8-4-4-4H7.5c-2.2 0-4 1.8-4 4s1.8 4 4 4zm0-6h7.5c1.1 0 2 .9 2 2s-.9 2-2 2H7.5c-1.1 0-2-.9-2-2s.9-2 2-2z" fill="#00ADD8" />
            </TechIcon>
            <TechIcon label="Rust" color="#DEA584">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.3l6.5 3.6v7.2L12 18.6l-6.5-3.6V7.8L12 4.3zm0 3.2l-3.5 2v4l3.5 2 3.5-2v-4l-3.5-2z" fill="#DEA584" />
            </TechIcon>
            <TechIcon label="SQL" color="#CC7832">
              <path d="M12 2C7.6 2 4 3.8 4 6v12c0 2.2 3.6 4 8 4s8-1.8 8-4V6c0-2.2-3.6-4-8-4zm0 2c3.9 0 6 1.5 6 2s-2.1 2-6 2-6-1.5-6-2 2.1-2 6-2zM6 8.3V10c0 .5 2.1 2 6 2s6-1.5 6-2V8.3c-2 1-4 1.5-6 1.5S8 9.3 6 8.3zM6 12.3V14c0 .5 2.1 2 6 2s6-1.5 6-2v-1.7c-2 1-4 1.5-6 1.5s-4-.5-6-1.5zM6 16.3V18c0 .5 2.1 2 6 2s6-1.5 6-2v-1.7c-2 1-4 1.5-6 1.5s-4-.5-6-1.5z" fill="#CC7832" />
            </TechIcon>
          </div>
        </div>

        {/* Frameworks */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(0, 255, 102, 0.35)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Frameworks
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <TechIcon label="React" color="#61DAFB">
              <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
            </TechIcon>
            <TechIcon label="Next.js" color="#FFFFFF">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z" fill="#FFFFFF" />
            </TechIcon>
            <TechIcon label="Node.js" color="#339933">
              <path d="M12 1.5l9 5.2v10.4l-9 5.2-9-5.2V6.7l9-5.2zm0 2.3L5.5 7.6v8.6L12 19.5l6.5-3.3V7.6L12 3.8z" fill="#339933" />
              <path d="M12 3.8v4.5l5 2.7v-4.5l-5-2.7zM7 11.1l5 2.7v4.5l-5-2.7v-4.5zm10 0l-5 2.7v4.5l5-2.7v-4.5z" fill="#339933" opacity="0.6" />
            </TechIcon>
            <TechIcon label="Vue" color="#4FC08D">
              <path d="M2 3h3.5L12 14.5 18.5 3H22L12 21 2 3zm4.2 0L12 12.3 17.8 3h-3.3L12 6.8 9.5 3H6.2z" fill="#4FC08D" />
            </TechIcon>
            <TechIcon label="Tailwind CSS" color="#06B6D4">
              <path d="M12 2C7.5 2 5.5 4.5 5.5 4.5S6.5 6 8.5 6c1.3 0 2.3-.8 3.5-2 1.5-1.5 3.2-2.5 5.5-2 2.5.5 3.5 3 3.5 3S19.5 4 17.5 4c-1.3 0-2.3.8-3.5 2-1.5 1.5-3.2 2.5-5.5 2-2.5-.5-3.5-3-3.5-3S6.5 6 8.5 6c1.3 0 2.3-.8 3.5-2z" fill="#06B6D4" />
              <path d="M12 10c-2.5 0-4.5 2.5-4.5 2.5S8.5 14 10.5 14c1.3 0 2.3-.8 3.5-2 1.5-1.5 3.2-2.5 5.5-2 2.5.5 3.5 3 3.5 3s-1.5-1-3.5-1c-1.3 0-2.3.8-3.5 2-1.5 1.5-3.2 2.5-5.5 2-2.5-.5-3.5-3-3.5-3s1.5 1 3.5 1c1.3 0 2.3-.8 3.5-2z" fill="#06B6D4" opacity="0.6" />
            </TechIcon>
            <TechIcon label="Flask" color="#FFFFFF">
              <path d="M9 2v6.5L5.5 18c-.3.8.3 2 1.2 2h10.6c.9 0 1.5-1.2 1.2-2L15 8.5V2H9zm2 2h2v4h-2V4zm-1 6h4l1 6H7l1-6z" fill="#FFFFFF" />
            </TechIcon>
          </div>
        </div>

        {/* Infrastructure */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(0, 255, 102, 0.35)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Infrastructure
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <TechIcon label="Docker" color="#2496ED">
              <path d="M13.5 8.5c-.2-.7-.6-1.1-1.2-1.2-.2-1.6-1.5-2.8-3.2-3-.2-.4-.6-.6-1.1-.6H5.5c-.5 0-.9.3-1 .8-.1.3-.1.6-.1.9 0 .2 0 .2.1.4-.5.2-.8.7-.9 1.3v5.2c0 .2.1.4.4.4h7.4c.6 0 1.2-.2 1.7-.7.4-.4.6-1 .7-1.6.1-.3.1-.6.1-.9v-.3h.4c.2 0 .4-.1.4-.4v-.9h-.5zM4.5 10.3c0-.2.1-.4.2-.5.1-.1.2-.2.3-.2h6c.3 0 .6.2.6.6v1.2c0 .3-.2.6-.6.6H5.4c-.2 0-.4-.1-.5-.2-.1-.1-.2-.3-.2-.5v-.5z" fill="#2496ED" />
              <rect x="5.5" y="7" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
              <rect x="7.5" y="7" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
              <rect x="9.5" y="7" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
              <rect x="7.5" y="5.2" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
              <rect x="9.5" y="5.2" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
            </TechIcon>
            <TechIcon label="PostgreSQL" color="#336791">
              <path d="M12 2C6.5 2 2 5.5 2 10c0 2.5 1.5 4.8 3.8 6.3-.2.8-.8 2-1.8 3.2 0 0 2.5-.2 4.5-1.5.6.1 1.3.2 2 .2 5.5 0 10-3.5 10-8S17.5 2 12 2zm0 1.5c1.8 0 3.5.7 4.8 1.8-.2.1-.5.3-.8.5-.7.5-1.5.8-2.2.9-.5.1-1 .1-1.5.1h-1c-.7 0-1.4-.1-2-.3-.6-.2-1.1-.6-1.5-1-.3-.3-.5-.6-.7-1 .5-.8 1.2-1.5 2-2.1.7-.5 1.4-.8 2.2-.9.5-.1 1-.1 1.5 0h.7zm-5.5 7c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm3 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm3 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="#336791" />
            </TechIcon>
            <TechIcon label="AWS" color="#FF9900">
              <path d="M6 6h12v12H6V6zm2 2h8v8H8V8z" fill="#FF9900" opacity="0.3" />
              <path d="M8 8h3v3H8zm5 0h3v3h-3zm-5 5h3v3H8zm5 0h3v3h-3z" fill="#FF9900" />
            </TechIcon>
            <TechIcon label="Linux" color="#FCC624">
              <path d="M12 2C9 2 6.5 4.2 6.5 7c0 2.1 1.2 4 3 5.2-.5.7-1 1.7-1.2 2.6 0 .3.2.4.4.4.2 0 .3-.1.4-.3.2-.5.6-1 1-1.3.2.2.5.3.9.3h.5c.4 0 .7-.1.9-.3.4.3.8.8 1 1.3.1.2.2.3.4.3.2 0 .4-.1.4-.4-.2-.9-.7-1.9-1.2-2.6 1.8-1.2 3-3.1 3-5.2C17.5 4.2 15 2 12 2zM9.2 8a.9.9 0 110 1.8.9.9 0 010-1.8zm5.6 0a.9.9 0 110 1.8.9.9 0 010-1.8zm-4.6 3c.5 0 .8.2 1 .4l.2.2h.6c.1 0 .2 0 .3-.1l.2-.2c.2-.2.5-.4 1-.4.2 0 .4.2.4.4s-.2.4-.4.4c-.2 0-.5.1-.6.3l-.2.2c-.1.1-.3.2-.5.2h-.4c-.2 0-.4 0-.5-.2l-.2-.2c-.1-.2-.4-.3-.6-.3-.2 0-.4-.2-.4-.4s.2-.4.4-.4z" fill="#FCC624" />
              <ellipse cx="9.8" cy="8.5" rx="0.3" ry="0.35" fill="#1A1A1A" opacity="0.7" />
              <ellipse cx="14.2" cy="8.5" rx="0.3" ry="0.35" fill="#1A1A1A" opacity="0.7" />
              <path d="M11.5 9l.5.3.5-.3" stroke="#1A1A1A" strokeWidth="0.2" fill="none" opacity="0.5" />
            </TechIcon>
            <TechIcon label="Git" color="#F05032">
              <path d="M21.5 11.1l-9.3-9.3c-.4-.4-1-.4-1.4 0l-1.5 1.5 2 2c.4-.1.9-.1 1.3.1.4.2.7.6.8 1 .2.5.1 1-.2 1.4l2 2c.4-.3.9-.4 1.4-.2.6.2 1 .7 1.2 1.2.3.7.2 1.4-.2 2l1.9 1.9c.8-.8.8-2.1 0-2.9zM7.3 13.4c-.5 0-1-.2-1.3-.6-.4-.4-.5-1-.4-1.5.1-.5.4-.9.8-1.2l2.4-2.4c.1-.1.3-.1.4-.1.2 0 .3.1.4.2.1.1.1.3.1.4 0 .2-.1.3-.2.4L6.5 12c-.1.1-.1.2-.1.3 0 .3.2.5.5.5.1 0 .2 0 .3-.1l1.6-1.6c.1-.1.3-.1.4-.1.2 0 .3.1.4.2.1.1.1.3.1.4 0 .2-.1.3-.2.4l-2 2c-.2.3-.5.4-.8.4z" fill="#F05032" />
            </TechIcon>
            <TechIcon label="VS Code" color="#007ACC">
              <path d="M20.3 3L13 8.8l-4.7-3.5L3.5 8v8l4.8 2.7L13 15.2l7.3 5.8V3zm-15 5.5l3.5-2v11l-3.5-2V8.5zm9 6.5l-2 1.5v-9l2 1.5v6z" fill="#007ACC" />
            </TechIcon>
          </div>
        </div>
      </div>
    </div>
  )
}
