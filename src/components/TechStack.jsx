import { useState } from 'react'
import useIsMobile from '../hooks/useIsMobile'

const tileBase = {
  position: 'relative',
  width: '90px',
  height: '90px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '10px',
  borderRadius: '4px',
  background: 'rgba(0, 255, 102, 0.02)',
  border: '1px solid rgba(0, 255, 102, 0.12)',
  cursor: 'default',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
}

function StackTile({ name, usage, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...tileBase,
        transform: hovered ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
        background: hovered ? 'rgba(0, 255, 102, 0.06)' : 'rgba(0, 255, 102, 0.02)',
        borderColor: hovered ? 'rgba(0, 255, 102, 0.4)' : 'rgba(0, 255, 102, 0.12)',
        boxShadow: hovered
          ? '0 0 20px rgba(0, 255, 102, 0.25), inset 0 0 12px rgba(0, 255, 102, 0.05)'
          : 'none',
      }}
    >
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        {children}
      </svg>
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '8.5px',
        color: hovered ? '#00ff66' : 'rgba(255, 255, 255, 0.55)',
        textAlign: 'center',
        letterSpacing: '0.05em',
        transition: 'color 0.2s',
        lineHeight: 1.2,
      }}>
        {name}
      </span>
      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '6px 10px',
          borderRadius: '2px',
          background: '#030806',
          border: '1px solid rgba(0, 255, 102, 0.3)',
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: 'rgba(0, 255, 102, 0.9)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100,
          boxShadow: '0 0 12px rgba(0, 255, 102, 0.15)',
        }}>
          {'> '}{usage}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid rgba(0, 255, 102, 0.3)',
          }} />
        </div>
      )}
    </div>
  )
}

const languages = [
  {
    name: 'JavaScript',
    usage: 'web apps, scripts',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <text x="16" y="21" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Arial" fill="#00ff66">JS</text>
      </>
    ),
  },
  {
    name: 'TypeScript',
    usage: 'typed JS apps',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" stroke="#00ccff" strokeWidth="1.5" fill="none" />
        <text x="16" y="21" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Arial" fill="#00ccff">TS</text>
      </>
    ),
  },
  {
    name: 'Python',
    usage: 'AI, automation, APIs',
    svg: (
      <>
        <path d="M11 4 L11 9 L9 9 L9 11 L11 11 L11 14" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M21 28 L21 23 L23 23 L23 21 L21 21 L21 18" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="11" cy="7" r="1.5" fill="#00ff66" />
        <circle cx="21" cy="25" r="1.5" fill="#00ff66" />
      </>
    ),
  },
  {
    name: 'Go',
    usage: 'high-perf services',
    svg: (
      <>
        <circle cx="16" cy="16" r="11" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <path d="M11 16 L19 16 M16 11 L16 16 M16 16 L20 20" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Rust',
    usage: 'systems, native code',
    svg: (
      <>
        <polygon points="16,3 27,9 27,23 16,29 5,23 5,9" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="16" r="3" stroke="#00ff66" strokeWidth="1.2" fill="none" />
        <line x1="16" y1="9" x2="16" y2="13" stroke="#00ff66" strokeWidth="1.2" />
        <line x1="16" y1="19" x2="16" y2="23" stroke="#00ff66" strokeWidth="1.2" />
        <line x1="9" y1="16" x2="13" y2="16" stroke="#00ff66" strokeWidth="1.2" />
        <line x1="19" y1="16" x2="23" y2="16" stroke="#00ff66" strokeWidth="1.2" />
      </>
    ),
  },
  {
    name: 'SQL',
    usage: 'data, queries',
    svg: (
      <>
        <ellipse cx="16" cy="7" rx="9" ry="3" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <path d="M7 7 L7 25 Q7 28 16 28 Q25 28 25 25 L25 7" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <path d="M7 14 Q7 17 16 17 Q25 17 25 14" stroke="#00ff66" strokeWidth="1" fill="none" />
        <path d="M7 21 Q7 24 16 24 Q25 24 25 21" stroke="#00ff66" strokeWidth="1" fill="none" />
      </>
    ),
  },
]

const frameworks = [
  {
    name: 'React',
    usage: 'UI, SPAs',
    svg: (
      <>
        <circle cx="16" cy="16" r="2" fill="#00ff66" />
        <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#00ff66" strokeWidth="1.2" fill="none" />
        <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#00ff66" strokeWidth="1.2" fill="none" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#00ff66" strokeWidth="1.2" fill="none" transform="rotate(120 16 16)" />
      </>
    ),
  },
  {
    name: 'Next.js',
    usage: 'SSR, full-stack',
    svg: (
      <>
        <circle cx="16" cy="16" r="12" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <path d="M11 22 L21 10 M14 22 L21 14" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Node.js',
    usage: 'backend, APIs',
    svg: (
      <>
        <polygon points="16,3 27,9 27,23 16,29 5,23 5,9" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <text x="16" y="20" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="Arial" fill="#00ff66">N</text>
      </>
    ),
  },
  {
    name: 'Vue',
    usage: 'progressive UIs',
    svg: (
      <>
        <path d="M5 6 L16 25 L27 6 L22 6 L16 16 L10 6 Z" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'Tailwind',
    usage: 'utility-first CSS',
    svg: (
      <>
        <path d="M6 12 Q10 6 16 12 T26 12" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M6 18 Q10 12 16 18 T26 18" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M6 24 Q10 18 16 24 T26 24" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Flask',
    usage: 'lightweight APIs',
    svg: (
      <>
        <path d="M11 4 L11 11 L7 24 Q7 28 12 28 L20 28 Q25 28 23 24 L19 11 L19 4 Z" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <line x1="9" y1="4" x2="21" y2="4" stroke="#00ff66" strokeWidth="1.5" />
        <line x1="11" y1="15" x2="19" y2="15" stroke="#00ff66" strokeWidth="1" opacity="0.6" />
      </>
    ),
  },
]

const infrastructure = [
  {
    name: 'Docker',
    usage: 'containers, deploys',
    svg: (
      <>
        <rect x="5" y="13" width="3" height="3" stroke="#00ff66" strokeWidth="1" fill="none" />
        <rect x="9" y="13" width="3" height="3" stroke="#00ff66" strokeWidth="1" fill="none" />
        <rect x="13" y="13" width="3" height="3" stroke="#00ff66" strokeWidth="1" fill="none" />
        <rect x="9" y="9" width="3" height="3" stroke="#00ff66" strokeWidth="1" fill="none" />
        <rect x="13" y="9" width="3" height="3" stroke="#00ff66" strokeWidth="1" fill="none" />
        <rect x="13" y="5" width="3" height="3" stroke="#00ff66" strokeWidth="1" fill="none" />
        <path d="M3 18 L5 25 L27 25 L29 18" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'PostgreSQL',
    usage: 'relational DB',
    svg: (
      <>
        <path d="M8 12 Q8 9 12 9 L20 9 Q24 9 24 12 L24 18 Q24 24 16 26 Q8 24 8 18 Z" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <circle cx="13" cy="15" r="1" fill="#00ff66" />
        <circle cx="19" cy="15" r="1" fill="#00ff66" />
        <path d="M14 19 Q16 21 18 19" stroke="#00ff66" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M22 10 L26 8 M22 13 L27 13 M22 16 L26 18" stroke="#00ff66" strokeWidth="1" opacity="0.5" />
      </>
    ),
  },
  {
    name: 'AWS',
    usage: 'cloud infra',
    svg: (
      <>
        <path d="M5 20 Q3 22 5 24 L27 24 Q29 22 27 20 L21 14 L18 17 L15 14 Z" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <path d="M5 24 L4 27 L7 26" stroke="#00ff66" strokeWidth="1" fill="none" />
        <path d="M27 24 L28 27 L25 26" stroke="#00ff66" strokeWidth="1" fill="none" />
        <line x1="12" y1="20" x2="20" y2="20" stroke="#00ff66" strokeWidth="1" opacity="0.6" />
      </>
    ),
  },
  {
    name: 'Linux',
    usage: 'servers, CLI',
    svg: (
      <>
        <ellipse cx="16" cy="20" rx="8" ry="9" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <ellipse cx="16" cy="11" rx="5" ry="6" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <circle cx="13" cy="10" r="1" fill="#00ff66" />
        <circle cx="19" cy="10" r="1" fill="#00ff66" />
        <path d="M13 14 L15 16 L17 14 L19 16" stroke="#00ff66" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <ellipse cx="13" cy="22" rx="1.5" ry="2" fill="none" stroke="#00ff66" strokeWidth="1" />
        <ellipse cx="19" cy="22" rx="1.5" ry="2" fill="none" stroke="#00ff66" strokeWidth="1" />
      </>
    ),
  },
  {
    name: 'Git',
    usage: 'version control',
    svg: (
      <>
        <circle cx="7" cy="7" r="2.5" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <circle cx="7" cy="25" r="2.5" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <circle cx="22" cy="13" r="2.5" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <line x1="7" y1="9.5" x2="7" y2="22.5" stroke="#00ff66" strokeWidth="1.5" />
        <path d="M7 16 L20 14" stroke="#00ff66" strokeWidth="1.5" fill="none" />
        <path d="M7 16 Q9 14 11 14" stroke="#00ff66" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  {
    name: 'VS Code',
    usage: 'editor, IDE',
    svg: (
      <>
        <path d="M22 5 L13 14 L20 21 L22 19 L17 14 L22 9 Z" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <path d="M13 14 L6 19 L4 17 L10 13 L4 9 L6 7 Z" stroke="#00ff66" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <line x1="13" y1="14" x2="13" y2="14" stroke="#00ff66" strokeWidth="1" opacity="0" />
      </>
    ),
  },
]

function StackGrid({ title, items }) {
  return (
    <div>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '9px',
        color: 'rgba(0, 255, 102, 0.5)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '16px',
        paddingBottom: '6px',
        borderBottom: '1px solid rgba(0, 255, 102, 0.1)',
      }}>
        {'// '}{title}
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {items.map((item) => (
          <StackTile key={item.name} name={item.name} usage={item.usage}>
            {item.svg}
          </StackTile>
        ))}
      </div>
    </div>
  )
}

export default function TechStack() {
  const isMobile = useIsMobile()

  return (
    <div style={{ marginTop: '40px', position: 'relative' }}>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '11px',
        color: 'rgba(0, 204, 255, 0.6)',
        marginBottom: '24px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(0, 204, 255, 0.1)',
        animation: 'labelPulse 3s ease-in-out infinite',
      }}>
        {'// STACK'}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        backgroundImage: `
          linear-gradient(rgba(0,255,102,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,102,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
        padding: '20px',
        borderRadius: '4px',
        border: '1px solid rgba(0, 255, 102, 0.06)',
      }}>
        <StackGrid title="LANGUAGES" items={languages} />
        <StackGrid title="FRAMEWORKS" items={frameworks} />
        <StackGrid title="INFRASTRUCTURE" items={infrastructure} />
      </div>
    </div>
  )
}
