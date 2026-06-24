const iconBox = {
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  background: 'rgba(0, 255, 102, 0.04)',
  border: '1px solid rgba(0, 255, 102, 0.08)',
  transition: 'all 0.3s ease',
  cursor: 'default',
}

const labelStyle = {
  fontFamily: "'Courier New', monospace",
  fontSize: '10px',
  color: 'rgba(0, 255, 102, 0.5)',
  textAlign: 'center',
  marginTop: '8px',
  letterSpacing: '0.03em',
}

const Icon = ({ children, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div
      style={iconBox}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0, 255, 102, 0.1)'
        e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.25)'
        e.currentTarget.style.transform = 'scale(1.08)'
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 102, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(0, 255, 102, 0.04)'
        e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.08)'
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {children}
      </svg>
    </div>
    <span style={labelStyle}>{label}</span>
  </div>
)

import useIsMobile from '../hooks/useIsMobile'

const sectionLabel = {
  fontFamily: "'Courier New', monospace",
  fontSize: '10px',
  color: 'rgba(0, 255, 102, 0.4)',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid rgba(0, 255, 102, 0.06)',
}

const services = [
  { title: 'Custom Web Applications', desc: 'Full-stack solutions tailored to business needs' },
  { title: 'System Architecture', desc: 'Scalable infrastructure and microservices design' },
  { title: 'AI Integration', desc: 'LLM pipelines, automation, and intelligent agents' },
  { title: 'Cybersecurity', desc: 'Vulnerability assessment, hardening, and monitoring' },
  { title: 'API Development', desc: 'REST, GraphQL, and real-time WebSocket endpoints' },
  { title: 'Cloud & DevOps', desc: 'CI/CD, containerization, and cloud deployment' },
]

export default function TechStack() {
  const isMobile = useIsMobile()
  const certs = [
    { abbr: 'A+', name: 'CompTIA A+' },
    { abbr: 'Network+', name: 'CompTIA Network+' },
    { abbr: 'Security+', name: 'CompTIA Security+' },
    { abbr: 'Linux+', name: 'CompTIA Linux+' },
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
                border: '1px solid rgba(0, 255, 102, 0.06)',
                background: 'rgba(0, 255, 102, 0.02)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.15)'
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.06)'
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.02)'
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
                  color: 'rgba(0, 255, 102, 0.4)',
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
                border: '1px solid rgba(0, 255, 102, 0.06)',
                background: 'rgba(0, 255, 102, 0.02)',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.15)'
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 102, 0.06)'
                  e.currentTarget.style.background = 'rgba(0, 255, 102, 0.02)'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1.5px solid #00ff66',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 255, 102, 0.06)',
                  boxShadow: '0 0 10px rgba(0, 255, 102, 0.12)',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#00ff66" />
                  </svg>
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#00ff66',
                    letterSpacing: '0.05em',
                  }}>
                    {cert.abbr}
                  </div>
                  <div style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '9px',
                    color: 'rgba(0, 255, 102, 0.4)',
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
        {/* Left Column - Languages */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(0, 255, 102, 0.3)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Languages
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* JavaScript */}
            <Icon label="JavaScript">
              <path d="M2 2h20v20H2V2zm11.3 16.4c.5 1 1.3 1.7 2.6 1.7 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-1.9-1.7l-.7-.3c-2-.8-3.3-1.8-3.3-4 0-2 1.5-3.5 3.9-3.5 1.7 0 2.9.6 3.8 2.1l-2 1.3c-.5-.9-1-1.2-1.8-1.2-.8 0-1.3.5-1.3 1.2 0 .8.5 1.1 1.7 1.6l.7.3c2.3.9 3.6 1.9 3.6 4.2 0 2.4-1.9 3.6-4.4 3.6-2.5 0-4.1-1.2-4.8-2.8l2.1-1.2zM7.7 16.3c.4.7.8 1.3 1.7 1.3.9 0 1.5-.3 1.5-1.5V9.2h2.7v6.9c0 2.4-1.4 3.5-3.4 3.5-1.8 0-2.9-.9-3.5-2l2-1.3z" fill="#00ff66" />
            </Icon>

            {/* TypeScript */}
            <Icon label="TypeScript">
              <path d="M2 2h20v20H2V2zm11.1 14.5h-2V9.2h-2.2v7.3H7.9V7.8h8.4v8.7h-3.2zm5-2.3l-.1-1.6h-2l.1 1.6H16zm-2.6-3.1l-.1 1.6h-4.4l.1-1.6h4.4z" fill="#00ff66" />
              <path d="M13.7 12.4c.3.6.7 1.1 1.5 1.1.8 0 1.2-.4 1.2-1 0-.7-.5-1-1.4-1.4l-.5-.2c-1.4-.6-2.1-1.2-2.1-2.6 0-1.4 1.1-2.5 3-2.5 1.3 0 2.2.4 2.9 1.6l-1.4.9c-.3-.6-.6-.9-1.2-.9-.5 0-.9.3-.9.9 0 .6.4.8 1.3 1.2l.5.2c1.6.7 2.3 1.3 2.3 2.8 0 1.6-1.3 2.7-3.4 2.7-1.9 0-3.1-.9-3.7-2.3l1.5-.8z" fill="#00ff66" opacity="0.5" />
            </Icon>

            {/* Python */}
            <Icon label="Python">
              <path d="M11.9 2C6.8 2 6.5 4.1 6.5 4.1v2.1h5.5v.7H5.2S2 6.3 2 11.8s2.9 5.4 2.9 5.4h1.7v-2.6s-.1-2.9 2.9-2.9h5s2.8 0 2.8-2.8V4.5S18.4 2 11.9 2zm-2.8 1.5a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" fill="#00ff66" />
              <path d="M12.1 22c5.1 0 5.4-2.1 5.4-2.1v-2.1h-5.5v-.7h6.8S22 17.7 22 12.2s-2.9-5.4-2.9-5.4h-1.7v2.6s.1 2.9-2.9 2.9h-5s-2.8 0-2.8 2.8v4.5S5.6 22 12.1 22zm2.8-1.5a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4z" fill="#00ff66" opacity="0.5" />
            </Icon>

            {/* HTML5 */}
            <Icon label="HTML5">
              <path d="M3 2l1.5 17L12 22l7.5-3L21 2H3zm14.3 5.4H7.7l.2 2.1h9l-.5 5.6-4.4 1.5-4.4-1.5-.3-3.3h2.1l.1 1.4 2.5.7 2.5-.7.3-2.8H7.4L6.8 4h10.4l-.2 2.1-.7-.7z" fill="#00ff66" />
            </Icon>

            {/* CSS3 */}
            <Icon label="CSS3">
              <path d="M3 2l1.5 17L12 22l7.5-3L21 2H3zm13.6 6.2l.2 2H7.8l.2 2.2h8.7l-.5 5-4.2 1.5-4.2-1.5-.3-3h2l.1 1.6 2.4.7 2.4-.7.3-3.2H7.6l-.5-5.5h9.8l-.2 2.2-.3-.3-.3-.4-.5-.5-.3-.4-.3-.4z" fill="#00ff66" />
            </Icon>

            {/* SQL */}
            <Icon label="SQL">
              <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2zm0 4h16v2H4v-2zm0 4h10v2H4v-2z" fill="#00ff66" opacity="0.6" />
              <rect x="4" y="4" width="16" height="18" rx="1" stroke="#00ff66" strokeWidth="1.2" fill="none" />
            </Icon>
          </div>
        </div>

        {/* Right Column - Tools & Platforms */}
        <div>
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: 'rgba(0, 255, 102, 0.3)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
            textTransform: 'uppercase',
          }}>
            Tools & Platforms
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* React */}
            <Icon label="React">
              <circle cx="12" cy="12" r="2.2" fill="#00ff66" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00ff66" strokeWidth="1.2" fill="none" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00ff66" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#00ff66" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)" />
            </Icon>

            {/* Node.js */}
            <Icon label="Node.js">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.5 3.6v7.2L12 18.6l-6.5-3.6V7.8L12 4.2z" fill="#00ff66" />
              <path d="M12 4.2v5.4l-3.5 2v-5.4l3.5-2zm7 3.6L12 4.2v5.4l7 3.8V7.8zM12 13.2v5.4l-3.5-2v-5.4l3.5 2zm7-2.2l-7 3.8v-5.4l7-3.8v5.4z" fill="#00ff66" opacity="0.4" />
            </Icon>

            {/* VS Code */}
            <Icon label="VS Code">
              <path d="M16.5 3L7 11.5 3 8.5v7l4 3 9.5-8.5L21 9.5l-4.5-6.5zM7 18.5l4.5-3.5L7 11.5v7zm9.5-7L12 15l-4.5-3.5h-.5v-2h.5L12 6l4.5 3.5h.5v2h-.5z" fill="#00ff66" />
            </Icon>

            {/* Docker */}
            <Icon label="Docker">
              <path d="M21 10.5c-.2-.8-.7-1.3-1.4-1.5-.3-2-2-3.5-4.1-3.8-.3-.5-.9-.7-1.4-.7H6.5c-.6 0-1.1.4-1.2 1-.1.4-.1.8-.1 1.2 0 .2 0 .3.1.5-.6.3-1 .9-1.1 1.6v6.5c0 .3.2.5.5.5h9.3c.8 0 1.6-.3 2.2-.9.5-.5.8-1.2.9-2 .1-.4.2-.8.2-1.2v-.4h.5c.3 0 .5-.2.5-.5v-1.1h-.7zM5 12.5c0-.3.1-.5.3-.7.1-.1.2-.2.4-.2h7.5c.4 0 .8.3.8.7v1.5c0 .4-.3.7-.8.7H6.2c-.3 0-.5-.1-.7-.3-.1-.2-.2-.4-.2-.7v-1z" fill="#00ff66" />
              <rect x="6" y="8" width="1.5" height="1.5" rx="0.3" fill="#00ff66" opacity="0.5" />
              <rect x="8.5" y="8" width="1.5" height="1.5" rx="0.3" fill="#00ff66" opacity="0.5" />
              <rect x="11" y="8" width="1.5" height="1.5" rx="0.3" fill="#00ff66" opacity="0.5" />
              <rect x="8.5" y="5.8" width="1.5" height="1.5" rx="0.3" fill="#00ff66" opacity="0.5" />
              <rect x="11" y="5.8" width="1.5" height="1.5" rx="0.3" fill="#00ff66" opacity="0.5" />
            </Icon>

            {/* Linux */}
            <Icon label="Linux">
              <path d="M12 2C9.2 2 7 4.3 7 7.1c0 2 1.2 3.8 3 4.6-.5.8-1.5 1.9-1.5 2.8 0 .8.5 1.4 1.2 1.4.5 0 .9-.3 1.3-.7.3.6.9 1 1.5 1s1.2-.4 1.5-1c.4.4.8.7 1.3.7.7 0 1.2-.6 1.2-1.4 0-.9-1-2-1.5-2.8 1.8-.8 3-2.6 3-4.6C17 4.3 14.8 2 12 2zm-1.3 5.5a.9.9 0 110-1.8.9.9 0 010 1.8zm2.6 0a.9.9 0 110-1.8.9.9 0 010 1.8z" fill="#00ff66" />
            </Icon>

            {/* Git */}
            <Icon label="Git">
              <path d="M21.5 11.1l-9.3-9.3c-.4-.4-1-.4-1.4 0l-1.5 1.5 2 2c.4-.1.9-.1 1.3.1.4.2.7.6.8 1 .2.5.1 1-.2 1.4l2 2c.4-.3.9-.4 1.4-.2.6.2 1 .7 1.2 1.2.3.7.2 1.4-.2 2l1.9 1.9c.8-.8.8-2.1 0-2.9zM7.3 13.4c-.5 0-1-.2-1.3-.6-.4-.4-.5-1-.4-1.5.1-.5.4-.9.8-1.2l2.4-2.4c.1-.1.3-.1.4-.1.2 0 .3.1.4.2.1.1.1.3.1.4 0 .2-.1.3-.2.4L6.5 12c-.1.1-.1.2-.1.3 0 .3.2.5.5.5.1 0 .2 0 .3-.1l1.6-1.6c.1-.1.3-.1.4-.1.2 0 .3.1.4.2.1.1.1.3.1.4 0 .2-.1.3-.2.4l-2 2c-.2.3-.5.4-.8.4z" fill="#00ff66" />
            </Icon>
          </div>
        </div>
      </div>
    </div>
  )
}
