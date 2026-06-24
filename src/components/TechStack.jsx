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

      {/* Tech Icons - Two Columns */}
      <div style={sectionLabel}>{'// STACK'}</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '24px' : '32px',
      }}>
        {/* Left Column - Languages & Code */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Languages & Code
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* JavaScript */}
            <TechIcon label="JavaScript" color="#F7DF1E">
              <rect x="2" y="2" width="20" height="20" rx="2" fill="#F7DF1E" />
              <path d="M13.3 17.5c.5 1 1.3 1.7 2.6 1.7 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-1.9-1.7l-.7-.3c-2-.8-3.3-1.8-3.3-4 0-2 1.5-3.5 3.9-3.5 1.7 0 2.9.6 3.8 2.1l-2 1.3c-.5-.9-1-1.2-1.8-1.2-.8 0-1.3.5-1.3 1.2 0 .8.5 1.1 1.7 1.6l.7.3c2.3.9 3.6 1.9 3.6 4.2 0 2.4-1.9 3.6-4.4 3.6-2.5 0-4.1-1.2-4.8-2.8l2.1-1.2zM8.3 16.3c.4.7.8 1.3 1.7 1.3.9 0 1.5-.3 1.5-1.5V9.2h2.7v6.9c0 2.4-1.4 3.5-3.4 3.5-1.8 0-2.9-.9-3.5-2l2-1.3z" fill="#000" />
            </TechIcon>

            {/* HTML5 */}
            <TechIcon label="HTML5" color="#E34F26">
              <path d="M3 2l1.5 17L12 22l7.5-3L21 2H3zm14.3 5.4H7.7l.2 2.1h9l-.5 5.6-4.4 1.5-4.4-1.5-.3-3.3h2.1l.1 1.4 2.5.7 2.5-.7.3-2.8H7.4L6.8 4h10.4l-.2 2.1z" fill="#E34F26" />
            </TechIcon>

            {/* CSS3 */}
            <TechIcon label="CSS3" color="#1572B6">
              <path d="M3 2l1.5 17L12 22l7.5-3L21 2H3zm13.6 6.2l.2 2H7.8l.2 2.2h8.7l-.5 5-4.2 1.5-4.2-1.5-.3-3h2l.1 1.6 2.4.7 2.4-.7.3-3.2H7.6l-.5-5.5h9.8l-.2 2.2z" fill="#1572B6" />
            </TechIcon>

            {/* C++ */}
            <TechIcon label="C++" color="#00599C">
              <path d="M22.4 6.8c-.2-.5-.6-.8-1.1-1l-3.4-.5V3.5c0-.3-.2-.5-.5-.5h-2.2V1.5h2.2c.3 0 .5-.2.5-.5V0h-4.4v1h-2.2c-.3 0-.5.2-.5.5V3h-2.2V1h-2.2v2.5H2.5c-.3 0-.5.2-.5.5v1.8l-1.1.5c-.5.2-.9.5-1.1 1l-.2.6.2.6c.2.5.6.8 1.1 1l3.4.5v1.8c0 .3.2.5.5.5h2.2v2h-2.2c-.3 0-.5.2-.5.5V22h4.4v-1h2.2c.3 0 .5-.2.5-.5v-2h2.2v2h2.2v-2.5h2c.3 0 .5-.2.5-.5v-1.8l1.1-.5c.5-.2.9-.5 1.1-1l.2-.6-.2-.6zM6.7 17.5H4.5v-2h2.2c.3 0 .5-.2.5-.5v-1.8l-2.7-.4V11l2.7-.4v-1.8c0-.3-.2-.5-.5-.5H4.5V4.8h2.2c.3 0 .5-.2.5-.5V3.5h2.2v.8c0 .3.2.5.5.5h3.6v2h-3.6c-.3 0-.5.2-.5.5v1.8l2.7.4V11l-2.7.4v1.8c0 .3.2.5.5.5h3.6v2h-3.6c-.3 0-.5.2-.5.5v1.8l2.7.4V20.5H13V22H8.6v-1.7l-1.9-.3zm8.8-7.5h-2.2v2h2.2v-2zm4.4 7.5h-2.2v-2h2.2v2z" fill="#00599C" />
            </TechIcon>

            {/* SQL */}
            <TechIcon label="SQL" color="#CC7832">
              <path d="M12 2C7.6 2 4 3.8 4 6v12c0 2.2 3.6 4 8 4s8-1.8 8-4V6c0-2.2-3.6-4-8-4zm0 2c3.9 0 6 1.5 6 2s-2.1 2-6 2-6-1.5-6-2 2.1-2 6-2zM6 8.3V10c0 .5 2.1 2 6 2s6-1.5 6-2V8.3c-2 1-4 1.5-6 1.5S8 9.3 6 8.3zM6 12.3V14c0 .5 2.1 2 6 2s6-1.5 6-2v-1.7c-2 1-4 1.5-6 1.5s-4-.5-6-1.5zM6 16.3V18c0 .5 2.1 2 6 2s6-1.5 6-2v-1.7c-2 1-4 1.5-6 1.5s-4-.5-6-1.5z" fill="#CC7832" />
            </TechIcon>

            {/* Vue */}
            <TechIcon label="Vue" color="#4FC08D">
              <path d="M2 3h3.5L12 14.5 18.5 3H22L12 21 2 3zm4.2 0L12 12.3 17.8 3h-3.3L12 6.8 9.5 3H6.2z" fill="#4FC08D" />
            </TechIcon>

            {/* Java */}
            <TechIcon label="Java" color="#ED8B00">
              <path d="M8.5 3C7 5.5 6.5 8.5 7 11c.3 1.5 1 3 2 4 .3.3.5.5.5.8 0 .3-.2.5-.5.5-.5 0-1.5-.5-2-1-.8-.8-1.3-2-1.5-3.2-.3 1.2-.8 2.4-1.5 3.2-.5.5-1.5 1-2 1-.3 0-.5-.2-.5-.5 0-.3.2-.5.5-.8 1-1 1.7-2.5 2-4 .5-2.5 0-5.5-1.5-8h3zm7 0c-1.5 2.5-2 5.5-1.5 8 .3 1.5 1 3 2 4 .3.3.5.5.5.8 0 .3-.2.5-.5.5-.5 0-1.5-.5-2-1-.8-.8-1.3-2-1.5-3.2-.3 1.2-.8 2.4-1.5 3.2-.5.5-1.5 1-2 1-.3 0-.5-.2-.5-.5 0-.3.2-.5.5-.8 1-1 1.7-2.5 2-4 .5-2.5 0-5.5-1.5-8h3z" fill="#ED8B00" />
            </TechIcon>

            {/* Go */}
            <TechIcon label="Go" color="#00ADD8">
              <path d="M1.5 10c0-3.3 2.7-6 6-6h7.5v2H7.5c-2.2 0-4 1.8-4 4s1.8 4 4 4h1.5v2H7.5c-3.3 0-6-2.7-6-6zm12-4.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5zM7.5 12h7.5c2.2 0 4-1.8 4-4s-1.8-4-4-4H7.5c-2.2 0-4 1.8-4 4s1.8 4 4 4zm0-6h7.5c1.1 0 2 .9 2 2s-.9 2-2 2H7.5c-1.1 0-2-.9-2-2s.9-2 2-2z" fill="#00ADD8" />
            </TechIcon>

            {/* Rust */}
            <TechIcon label="Rust" color="#DEA584">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.3l6.5 3.6v7.2L12 18.6l-6.5-3.6V7.8L12 4.3zm0 3.2l-3.5 2v4l3.5 2 3.5-2v-4l-3.5-2z" fill="#DEA584" />
            </TechIcon>

            {/* Bash */}
            <TechIcon label="Bash" color="#4EAA25">
              <path d="M2 4h20v16H2V4zm2 2v12h16V6H4zm2 2h3l2 2-2 2H6V8zm5 0h3l2 2-2 2h-3V8zm5 0h3v4h-3V8zm-5 5h3l2 2-2 2h-3v-4zm5 0h3v4h-3v-4z" fill="#4EAA25" />
            </TechIcon>

            {/* Ruby */}
            <TechIcon label="Ruby" color="#CC342D">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5l6 3.3v6.4L12 17.5 6 14.2V7.8l6-3.3z" fill="#CC342D" />
              <path d="M12 6l-3 1.7v3.4L12 12.8l3-1.7V7.7L12 6z" fill="#CC342D" opacity="0.5" />
            </TechIcon>

            {/* PHP */}
            <TechIcon label="PHP" color="#777BB4">
              <path d="M4 3h16c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm3 4c-.6 0-1 .4-1 1v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1H7zm3 0c-.6 0-1 .4-1 1v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1h-1zm3 0c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h1c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1h-1zm4 0c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h1c.6 0 1-.4 1-1V8c0-.6-.4-1-1-1h-1zm-8 6c-.6 0-1 .4-1 1v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1c0-.6-.4-1-1-1h-1zm4 0c-.6 0-1 .4-1 1v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1c0-.6-.4-1-1-1h-1zm4 0c-.6 0-1 .4-1 1v3c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-1z" fill="#777BB4" />
            </TechIcon>

            {/* Solidity */}
            <TechIcon label="Solidity" color="#363636">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5l6 3.3v6.4L12 17.5 6 14.2V7.8l6-3.3z" fill="#363636" />
              <path d="M9 9h6v2H9V9zm0 3h6v2H9v-2z" fill="#363636" opacity="0.5" />
            </TechIcon>

            {/* Swift */}
            <TechIcon label="Swift" color="#FA7343">
              <path d="M17.5 14.5c-.3 1.5-1.5 3.5-4 5.5-2.5-2-3.7-4-4-5.5-.3-1.5.3-3 2-4.5 1.7 1.5 2.3 3 2 4.5zm-5.5-8c3.5 0 6.5 2.5 8 6-1.5-3.5-4.5-6-8-6-3.5 0-6.5 2.5-8 6 1.5-3.5 4.5-6 8-6z" fill="#FA7343" />
            </TechIcon>

            {/* Kotlin */}
            <TechIcon label="Kotlin" color="#7F52FF">
              <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2l10 5-10 5V7z" fill="#7F52FF" />
            </TechIcon>
          </div>
        </div>

        {/* Right Column - Frameworks & Tools */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Frameworks & Tools
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* React */}
            <TechIcon label="React" color="#61DAFB">
              <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
            </TechIcon>

            {/* Node.js */}
            <TechIcon label="Node.js" color="#339933">
              <path d="M12 1.5l9 5.2v10.4l-9 5.2-9-5.2V6.7l9-5.2zm0 2.3L5.5 7.6v8.6L12 19.5l6.5-3.3V7.6L12 3.8z" fill="#339933" />
              <path d="M12 3.8v4.5l5 2.7v-4.5l-5-2.7zM7 11.1l5 2.7v4.5l-5-2.7v-4.5zm10 0l-5 2.7v4.5l5-2.7v-4.5z" fill="#339933" opacity="0.6" />
            </TechIcon>

            {/* VS Code */}
            <TechIcon label="VS Code" color="#007ACC">
              <path d="M17.5 3.5L7 12l-4-3v7l4 3 10.5-8.5 3-2.5-3-2.5zM7 18.5l3.5-3L7 11.5v7zm9.5-7L12 15l-4.5-3.5h-.5v-2h.5L12 6l4.5 3.5h.5v2h-.5z" fill="#007ACC" />
            </TechIcon>

            {/* Docker */}
            <TechIcon label="Docker" color="#2496ED">
              <path d="M13.5 8.5c-.2-.7-.6-1.1-1.2-1.2-.2-1.6-1.5-2.8-3.2-3-.2-.4-.6-.6-1.1-.6H5.5c-.5 0-.9.3-1 .8-.1.3-.1.6-.1.9 0 .2 0 .2.1.4-.5.2-.8.7-.9 1.3v5.2c0 .2.1.4.4.4h7.4c.6 0 1.2-.2 1.7-.7.4-.4.6-1 .7-1.6.1-.3.1-.6.1-.9v-.3h.4c.2 0 .4-.1.4-.4v-.9h-.5zM4.5 10.3c0-.2.1-.4.2-.5.1-.1.2-.2.3-.2h6c.3 0 .6.2.6.6v1.2c0 .3-.2.6-.6.6H5.4c-.2 0-.4-.1-.5-.2-.1-.1-.2-.3-.2-.5v-.5z" fill="#2496ED" />
              <rect x="5.5" y="7" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
              <rect x="7.5" y="7" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
              <rect x="9.5" y="7" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
              <rect x="7.5" y="5.2" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
              <rect x="9.5" y="5.2" width="1.2" height="1.2" rx="0.2" fill="#2496ED" opacity="0.5" />
            </TechIcon>

            {/* Git */}
            <TechIcon label="Git" color="#F05032">
              <path d="M21.5 11.1l-9.3-9.3c-.4-.4-1-.4-1.4 0l-1.5 1.5 2 2c.4-.1.9-.1 1.3.1.4.2.7.6.8 1 .2.5.1 1-.2 1.4l2 2c.4-.3.9-.4 1.4-.2.6.2 1 .7 1.2 1.2.3.7.2 1.4-.2 2l1.9 1.9c.8-.8.8-2.1 0-2.9zM7.3 13.4c-.5 0-1-.2-1.3-.6-.4-.4-.5-1-.4-1.5.1-.5.4-.9.8-1.2l2.4-2.4c.1-.1.3-.1.4-.1.2 0 .3.1.4.2.1.1.1.3.1.4 0 .2-.1.3-.2.4L6.5 12c-.1.1-.1.2-.1.3 0 .3.2.5.5.5.1 0 .2 0 .3-.1l1.6-1.6c.1-.1.3-.1.4-.1.2 0 .3.1.4.2.1.1.1.3.1.4 0 .2-.1.3-.2.4l-2 2c-.2.3-.5.4-.8.4z" fill="#F05032" />
            </TechIcon>

            {/* Linux */}
            <TechIcon label="Linux" color="#FCC624">
              <path d="M12 2C9.2 2 7 4.3 7 7.1c0 2 1.2 3.8 3 4.6-.5.8-1.5 1.9-1.5 2.8 0 .8.5 1.4 1.2 1.4.5 0 .9-.3 1.3-.7.3.6.9 1 1.5 1s1.2-.4 1.5-1c.4.4.8.7 1.3.7.7 0 1.2-.6 1.2-1.4 0-.9-1-2-1.5-2.8 1.8-.8 3-2.6 3-4.6C17 4.3 14.8 2 12 2zm-1.3 5.5a.9.9 0 110-1.8.9.9 0 010 1.8zm2.6 0a.9.9 0 110-1.8.9.9 0 010 1.8z" fill="#FCC624" />
            </TechIcon>

            {/* Python */}
            <TechIcon label="Python" color="#3776AB">
              <path d="M11.9 2C6.8 2 6.5 4.1 6.5 4.1v2.1h5.5v.7H5.2S2 6.3 2 11.8s2.9 5.4 2.9 5.4h1.7v-2.6s-.1-2.9 2.9-2.9h5s2.8 0 2.8-2.8V4.5S18.4 2 11.9 2zm-2.8 1.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" fill="#3776AB" />
              <path d="M12.1 22c5.1 0 5.4-2.1 5.4-2.1v-2.1h-5.5v-.7h6.8S22 17.7 22 12.2s-2.9-5.4-2.9-5.4h-1.7v2.6s.1 2.9-2.9 2.9h-5s-2.8 0-2.8 2.8v4.5S5.6 22 12.1 22zm2.8-1.5a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" fill="#FFD43B" />
            </TechIcon>

            {/* Flask */}
            <TechIcon label="Flask" color="#FFFFFF">
              <path d="M9 2v6.5L5.5 18c-.3.8.3 2 1.2 2h10.6c.9 0 1.5-1.2 1.2-2L15 8.5V2H9zm2 2h2v4h-2V4zm-1 6h4l1 6H7l1-6z" fill="#FFFFFF" />
            </TechIcon>

            {/* PostgreSQL */}
            <TechIcon label="PostgreSQL" color="#336791">
              <path d="M12 2C6.5 2 2 5.5 2 10c0 2.5 1.5 4.8 3.8 6.3-.2.8-.8 2-1.8 3.2 0 0 2.5-.2 4.5-1.5.6.1 1.3.2 2 .2 5.5 0 10-3.5 10-8S17.5 2 12 2zm0 1.5c1.8 0 3.5.7 4.8 1.8-.2.1-.5.3-.8.5-.7.5-1.5.8-2.2.9-.5.1-1 .1-1.5.1h-1c-.7 0-1.4-.1-2-.3-.6-.2-1.1-.6-1.5-1-.3-.3-.5-.6-.7-1 .5-.8 1.2-1.5 2-2.1.7-.5 1.4-.8 2.2-.9.5-.1 1-.1 1.5 0h.7zm-5.5 7c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm3 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm3 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z" fill="#336791" />
            </TechIcon>

            {/* MariaDB */}
            <TechIcon label="MariaDB" color="#003545">
              <path d="M12 2C6.5 2 2 5.8 2 10.5c0 3 2 5.6 5 7v4.5l3.5-2c.5.1 1 .1 1.5.1 5.5 0 10-3.8 10-8.5S17.5 2 12 2zm0 1.5c4.7 0 8.5 3.3 8.5 7.3s-3.8 7.3-8.5 7.3c-.5 0-.9 0-1.4-.1L8 18.8v-3.3c2.5-1 4.3-3.3 4.3-6 0-1-.3-2-.7-2.8l.4-.4c.8-.7 1.3-1.6 1.5-2.6.1-.4 0-.7-.2-1-.3-.3-.6-.4-1-.4-.6 0-1.2.3-1.7.7-.4.3-.7.7-.9 1.1-.2.5-.6.8-1 .8s-.8-.3-1-.8c-.5-1.2-1.5-2-2.7-2.2-.4-.1-.7 0-1 .3-.3.3-.3.7-.2 1 .5 1.5 1.7 2.7 3 3.4-.3.5-.4 1-.4 1.6 0 2.4 1.8 4.5 4.2 5.2v1.5c-3.5-.8-6-3.5-6-6.7 0-1.2.4-2.3 1-3.3C7.5 5 9.6 3.5 12 3.5z" fill="#003545" />
            </TechIcon>

            {/* n8n */}
            <TechIcon label="n8n" color="#FF6D5A">
              <path d="M4 4h5v5H4V4zm0 11h5v5H4v-5zm11-11h5v5h-5V4zm-3 3h5v5h-5V7zm3 8h5v5h-5v-5zm-8 0h5v5H7v-5zm3-3h5v5h-5v-5z" fill="#FF6D5A" />
            </TechIcon>

            {/* Parrot OS */}
            <TechIcon label="Parrot OS" color="#FF6B6B">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4L10 14.2l7.6-7.6L19 8l-9 9z" fill="#FF6B6B" />
            </TechIcon>

            {/* Ubuntu */}
            <TechIcon label="Ubuntu" color="#E95420">
              <circle cx="12" cy="12" r="9" fill="none" stroke="#E95420" strokeWidth="1.5" />
              <circle cx="12" cy="6" r="2" fill="#E95420" />
              <circle cx="17.2" cy="15" r="2" fill="#E95420" />
              <circle cx="6.8" cy="15" r="2" fill="#E95420" />
              <circle cx="12" cy="12" r="2.5" fill="#E95420" />
            </TechIcon>

            {/* Next.js */}
            <TechIcon label="Next.js" color="#FFFFFF">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z" fill="#FFFFFF" />
            </TechIcon>

            {/* Django */}
            <TechIcon label="Django" color="#092E20">
              <path d="M7 3c-1.5 0-2.5.5-2.5 2v3c0 1.5 1 2 2.5 2h1v2H4.5C2.5 12 1 10.5 1 8.5V5c0-2.5 2-4 4.5-4H7v2zm5 0c2.5 0 4.5 1.5 4.5 4v3.5c0 2-1.5 3.5-3.5 3.5h-1v-2h1c1 0 1.5-.5 1.5-1.5V5c0-1.5-1-2-2.5-2h-1V3h1z" fill="#092E20" />
              <circle cx="4" cy="16" r="2" fill="#092E20" />
            </TechIcon>
          </div>
        </div>
      </div>

      {/* Row 3 - AI, Crypto, Comms */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gap: isMobile ? '24px' : '32px',
        marginTop: '32px',
      }}>
        {/* AI Tools */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            AI Tools
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* Claude */}
            <TechIcon label="Claude" color="#D97757">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#D97757" />
            </TechIcon>

            {/* Codex */}
            <TechIcon label="Codex" color="#10A37F">
              <path d="M22.3 6.3c-.3-.5-.7-.8-1.2-1l-3.4-.5V3.5c0-.3-.2-.5-.5-.5h-2.2V1.5h2.2c.3 0 .5-.2.5-.5V0h-4.4v1h-2.2c-.3 0-.5.2-.5.5V3h-2.2V1h-2.2v2.5H2.5c-.3 0-.5.2-.5.5v1.8l-1.1.5c-.5.2-.9.5-1.2 1l-.2.6.2.6c.3.5.7.8 1.2 1l3.4.5v1.8c0 .3.2.5.5.5h2.2v2h-2.2c-.3 0-.5.2-.5.5V22h4.4v-1h2.2c.3 0 .5-.2.5-.5v-2h2.2v2h2.2v-2.5h2c.3 0 .5-.2.5-.5v-1.8l1.1-.5c.5-.2.9-.5 1.2-1l.2-.6-.2-.6z" fill="#10A37F" />
            </TechIcon>

            {/* Hugging Face */}
            <TechIcon label="HuggingFace" color="#FFD21E">
              <path d="M12 4c-1.5 0-2.7.5-3.5 1.2-.5.4-.8.9-1 1.5-.2.5-.3 1.1-.3 1.7 0 .5.1 1 .3 1.5.2.5.5.9 1 1.3.5.4 1.1.7 1.8.8v5h4v-5c.7-.1 1.3-.4 1.8-.8.5-.4.8-.8 1-1.3.2-.5.3-1 .3-1.5 0-.6-.1-1.2-.3-1.7-.2-.6-.5-1.1-1-1.5C14.7 4.5 13.5 4 12 4zm-2.5 5.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2z" fill="#FFD21E" />
            </TechIcon>
          </div>
        </div>

        {/* Crypto */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Crypto
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* Bitcoin */}
            <TechIcon label="BTC" color="#F7931A">
              <path d="M15.5 8.5c.3-2-1.2-3-3.2-3.8l.7-2.7-1.6-.4-.6 2.6c-.4-.1-.9-.2-1.3-.3l.6-2.6L8.5 1l-.7 2.7c-.3-.1-.7-.2-1-.2l-2.2-.6-.4 1.7s1.2.3 1.2.3c.6.2.8.6.8 1l-.8 3.2c0 .1.1.1.1.1h-.1l-1.2 4.7c-.1.3-.3.7-.8.9 0 0-1.2.3-1.2.3l.8 2.1 1.7-.4c.3.1.7.2 1 .2l-.7 2.7 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.7 2.7 1.6.4.7-2.7c2.8.5 4.9.3 5.8-2.2.7-2-.1-3.2-1.5-3.9 1.1-.3 1.9-1 2.1-2.5zm-3.7 5.2c-.5 2-3.9.9-5 .7l.9-3.6c1.1.3 4.7.8 4.1 2.9zm.5-5.3c-.5 1.8-3.3.9-4.2.7l.8-3.2c.9.2 3.9.7 3.4 2.5z" fill="#F7931A" />
            </TechIcon>

            {/* Litecoin */}
            <TechIcon label="LTC" color="#BFBBBB">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h-1l4-8h2v2h1l-4 8z" fill="#BFBBBB" />
            </TechIcon>

            {/* Monero */}
            <TechIcon label="XMR" color="#FF6600">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2s-2-.9-2-2V7c0-1.1.9-2 2-2zm-4 6h8v2H8v-2z" fill="#FF6600" />
            </TechIcon>
          </div>
        </div>

        {/* Comms & Privacy */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Comms & Privacy
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* Tor */}
            <TechIcon label="Tor" color="#7D4698">
              <circle cx="12" cy="8" r="3" fill="none" stroke="#7D4698" strokeWidth="2" />
              <path d="M6 12v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6" fill="none" stroke="#7D4698" strokeWidth="2" />
              <circle cx="12" cy="8" r="1" fill="#7D4698" />
            </TechIcon>

            {/* Telegram */}
            <TechIcon label="Telegram" color="#26A5E4">
              <path d="M20.7 3.3L2.4 10.4c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.8.6.8.4 0 .6-.2.8-.4l2-1.9 4.2 3.1c.8.4 1.3.2 1.5-.7l2.7-12.6c.3-1.1-.4-1.6-1.4-1.2zM9.3 13.1l7.7-4.8c.4-.2.7-.1.4.2l-6.3 5.6-.5 1.8-1.3-2.8z" fill="#26A5E4" />
            </TechIcon>

            {/* Slack */}
            <TechIcon label="Slack" color="#4A154B">
              <path d="M6.5 14.5a2 2 0 110-4 2 2 0 010 4zm0-6.5a2 2 0 110-4 2 2 0 010 4zm6.5 6.5a2 2 0 110-4 2 2 0 010 4zm0-6.5a2 2 0 110-4 2 2 0 010 4zm6.5 6.5a2 2 0 110-4 2 2 0 010 4zm0-6.5a2 2 0 110-4 2 2 0 010 4z" fill="#E01E5A" />
              <path d="M14.5 6.5a2 2 0 114 0v6a2 2 0 11-4 0v-6zm-6.5 0a2 2 0 114 0v6a2 2 0 11-4 0v-6z" fill="#36C5F0" />
              <path d="M14.5 14.5a2 2 0 110 4h-6a2 2 0 110-4h6zm0-6.5a2 2 0 110 4h-6a2 2 0 110-4h6z" fill="#2EB67D" />
              <path d="M6.5 14.5a2 2 0 11-4 0v-6a2 2 0 114 0v6zm6.5 0a2 2 0 11-4 0v-6a2 2 0 114 0v6z" fill="#ECB22E" />
            </TechIcon>

          </div>
        </div>
      </div>
    </div>
  )
}
