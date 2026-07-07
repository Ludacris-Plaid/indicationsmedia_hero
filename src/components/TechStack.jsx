import { useState } from 'react'
import useIsMobile from '../hooks/useIsMobile'

function StackTile({ name, usage, color, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
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
        background: hovered ? `${color}10` : 'rgba(255, 255, 255, 0.015)',
        border: 'none',
        cursor: 'default',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        transform: hovered ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 0 20px ${color}40, inset 0 0 18px ${color}08`
          : 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(${color}25, ${color}10)`,
        clipPath: 'inherit',
        zIndex: -1,
      }} />
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        {children}
      </svg>
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '8.5px',
        color: hovered ? color : 'rgba(255, 255, 255, 0.55)',
        textAlign: 'center',
        letterSpacing: '0.05em',
        transition: 'color 0.2s',
        lineHeight: 1.2,
        fontWeight: hovered ? 700 : 400,
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
          border: `1px solid ${color}60`,
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: color,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100,
          boxShadow: `0 0 12px ${color}30`,
          fontWeight: 700,
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
            borderTop: `4px solid ${color}60`,
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
    color: '#F7DF1E',
    svg: (
      <>
        <rect x="2" y="2" width="28" height="28" rx="3" fill="#F7DF1E" />
        <path d="M15.5 22 Q13 23 11 22 Q9 21 9 19 L11 19 Q11 20 12 20.5 Q13 21 14 20.5 L14 16 L11.5 16 L11.5 14.5 L15.5 14.5 L15.5 20.5 Q16 21 17 20.5 Q18 20 18 19 L20 19 Q20 21 18 22 Q16 23 15.5 22 Z M21.5 19 Q21.5 21.5 23 22 Q24 22.3 25 21.5 L25 19.7 Q24 20.3 23.5 20.2 Q23 20 23 19.3 L23 16 L21.5 16 Z" fill="#000" />
      </>
    ),
  },
  {
    name: 'TypeScript',
    usage: 'typed JS apps',
    color: '#3178C6',
    svg: (
      <>
        <rect x="2" y="2" width="28" height="28" rx="3" fill="#3178C6" />
        <path d="M14 17 L20 17 L20 18.7 L17.9 18.7 L17.9 26 L16.1 26 L16.1 18.7 L14 18.7 Z M22 24.3 L23.3 23.5 Q23.7 24.3 24.7 24.3 Q25.7 24.3 25.7 23.5 Q25.7 22.7 24.7 22.3 Q23 21.7 23 20.3 Q23 18.7 24.7 18.7 Q26 18.7 26.6 19.7 L25.4 20.5 Q25.1 19.9 24.5 19.9 Q24 19.9 24 20.4 Q24 20.9 25 21.3 Q26.7 22 26.7 23.5 Q26.7 25.3 24.8 25.3 Q23 25.3 22 24.3 Z" fill="#FFF" />
      </>
    ),
  },
  {
    name: 'Python',
    usage: 'AI, automation',
    color: '#3776AB',
    svg: (
      <>
        <path d="M16 4 C 10 4, 9 7, 9 10 L 9 13 L 16 13 L 16 14.5 L 7 14.5 C 5 14.5, 4 16, 4 18.5 L 4 21 C 4 23.5, 5.5 25, 8 25 L 11 25 L 11 22 C 11 19.5, 12.5 18, 15 18 L 22 18 C 24 18, 25 17, 25 14.5 L 25 9 C 25 6, 23.5 4.5, 20.5 4.5 Z" fill="#3776AB" />
        <path d="M16 28 C 22 28, 23 25, 23 22 L 23 19 L 16 19 L 16 17.5 L 25 17.5 C 27 17.5, 28 16, 28 13.5 L 28 11 C 28 8.5, 26.5 7, 24 7 L 21 7 L 21 10 C 21 12.5, 19.5 14, 17 14 L 10 14 C 8 14, 7 15, 7 17.5 L 7 23 C 7 26, 8.5 27.5, 11.5 27.5 Z" fill="#FFD43B" />
        <circle cx="13" cy="9" r="1.2" fill="#FFF" />
        <circle cx="19" cy="23" r="1.2" fill="#000" />
      </>
    ),
  },
  {
    name: 'Go',
    usage: 'high-perf services',
    color: '#00ADD8',
    svg: (
      <>
        <rect x="2" y="2" width="28" height="28" rx="5" fill="#00ADD8" />
        <path d="M9 11 L13 16 L9 21 M13 16 L19 16 M19 16 L22 13 M19 16 L22 19" stroke="#FFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'Rust',
    usage: 'systems code',
    color: '#DEA584',
    svg: (
      <>
        <circle cx="16" cy="16" r="12" fill="#DEA584" />
        <circle cx="16" cy="16" r="7" fill="#030806" />
        <text x="16" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial" fill="#DEA584">R</text>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <rect key={i} x="15" y="2" width="2" height="4" fill="#DEA584" transform={`rotate(${angle} 16 16)`} />
        ))}
      </>
    ),
  },
  {
    name: 'SQL',
    usage: 'data, queries',
    color: '#E48E00',
    svg: (
      <>
        <ellipse cx="16" cy="7" rx="10" ry="3.5" fill="#E48E00" />
        <path d="M6 7 L6 25 Q6 28.5 16 28.5 Q26 28.5 26 25 L26 7" fill="#E48E00" />
        <ellipse cx="16" cy="7" rx="10" ry="3.5" fill="#FFA500" />
        <ellipse cx="16" cy="14" rx="10" ry="3.5" fill="none" stroke="#030806" strokeWidth="0.5" opacity="0.4" />
        <ellipse cx="16" cy="21" rx="10" ry="3.5" fill="none" stroke="#030806" strokeWidth="0.5" opacity="0.4" />
      </>
    ),
  },
]

const frameworks = [
  {
    name: 'React',
    usage: 'UI, SPAs',
    color: '#61DAFB',
    svg: (
      <>
        <circle cx="16" cy="16" r="2.5" fill="#61DAFB" />
        <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.3" fill="none" />
        <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.3" fill="none" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61DAFB" strokeWidth="1.3" fill="none" transform="rotate(120 16 16)" />
      </>
    ),
  },
  {
    name: 'Next.js',
    usage: 'SSR, full-stack',
    color: '#FFFFFF',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#FFFFFF" />
        <path d="M11 23 L21 10 M14 23 L21 14" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'Node.js',
    usage: 'backend, APIs',
    color: '#339933',
    svg: (
      <>
        <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="#339933" />
        <path d="M11 13 L11 19 L17 13 L21 13 L21 19 M11 19 L17 13" stroke="#FFF" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'Vue',
    usage: 'progressive UIs',
    color: '#4FC08D',
    svg: (
      <>
        <path d="M3 6 L8 6 L16 19 L24 6 L29 6 L16 27 Z" fill="#4FC08D" />
        <path d="M8 6 L16 19 L24 6 L19 6 L16 11 L13 6 Z" fill="#35495E" />
      </>
    ),
  },
  {
    name: 'Tailwind',
    usage: 'utility-first CSS',
    color: '#06B6D4',
    svg: (
      <>
        <path d="M16 6 Q11 6 9 11 Q11 8 14 9 Q11 9 10 13 Q13 9 18 11 Q14 11 13 15 Q17 11 22 14 Q19 11 22 17 Q24 14 22 22 Q25 17 23 25 Q26 20 25 26" stroke="#06B6D4" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M16 6 Q21 6 23 11 Q21 8 18 9 Q21 9 22 13 Q19 9 14 11 Q18 11 19 15 Q15 11 10 14 Q13 11 10 17 Q8 14 10 22 Q7 17 9 25 Q6 20 7 26" stroke="#06B6D4" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      </>
    ),
  },
  {
    name: 'Flask',
    usage: 'lightweight APIs',
    color: '#FFFFFF',
    svg: (
      <>
        <path d="M11 4 L11 11 L6 24 Q5 28 10 28 L22 28 Q27 28 26 24 L21 11 L21 4 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="9" y1="4" x2="23" y2="4" stroke="#FFFFFF" strokeWidth="1.8" />
        <path d="M9 18 L23 18" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
        <path d="M11 11 L21 11" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
        <path d="M13 22 L19 22 L18 25 L14 25 Z" fill="#FFFFFF" opacity="0.3" />
      </>
    ),
  },
]

const infrastructure = [
  {
    name: 'Docker',
    usage: 'containers',
    color: '#2496ED',
    svg: (
      <>
        <g fill="#2496ED">
          <rect x="4" y="14" width="4" height="4" rx="0.5" />
          <rect x="9" y="14" width="4" height="4" rx="0.5" />
          <rect x="14" y="14" width="4" height="4" rx="0.5" />
          <rect x="19" y="14" width="4" height="4" rx="0.5" />
          <rect x="9" y="9" width="4" height="4" rx="0.5" />
          <rect x="14" y="9" width="4" height="4" rx="0.5" />
          <rect x="19" y="9" width="4" height="4" rx="0.5" />
          <rect x="14" y="4" width="4" height="4" rx="0.5" />
        </g>
        <path d="M2 19 L4 26 L28 26 L30 19" stroke="#2496ED" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'PostgreSQL',
    usage: 'relational DB',
    color: '#336791',
    svg: (
      <>
        <path d="M9 11 Q9 8 12 8 L20 8 Q23 8 23 11 L23 17 Q23 22 16 25 Q9 22 9 17 Z" fill="#336791" />
        <circle cx="13" cy="14" r="1" fill="#FFF" />
        <circle cx="19" cy="14" r="1" fill="#FFF" />
        <path d="M13 18 Q16 20 19 18" stroke="#FFF" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M22 10 L26 8 M22 13 L27 13 M22 16 L26 18" stroke="#336791" strokeWidth="1.2" opacity="0.5" />
      </>
    ),
  },
  {
    name: 'AWS',
    usage: 'cloud infra',
    color: '#FF9900',
    svg: (
      <>
        <path d="M4 22 Q2 25 4 27 L28 27 Q30 25 28 22 L21 14 L19 17 L16 13 L13 17 L11 14 Z" fill="#FF9900" />
        <text x="16" y="23" textAnchor="middle" fontSize="5.5" fontWeight="700" fontFamily="Arial" fill="#FFF">aws</text>
      </>
    ),
  },
  {
    name: 'Linux',
    usage: 'servers, CLI',
    color: '#FCC624',
    svg: (
      <>
        <ellipse cx="16" cy="19" rx="7" ry="8" fill="#FCC624" />
        <ellipse cx="16" cy="10" rx="5" ry="6" fill="#FCC624" />
        <ellipse cx="16" cy="22" rx="4" ry="5" fill="#FFF" />
        <ellipse cx="13.5" cy="9" r="1.3" fill="#000" />
        <ellipse cx="18.5" cy="9" r="1.3" fill="#000" />
        <ellipse cx="13.8" cy="9.2" r="0.4" fill="#FFF" />
        <ellipse cx="18.8" cy="9.2" r="0.4" fill="#FFF" />
        <path d="M14 13 L15 14 L17 14 L18 13" stroke="#FF8800" strokeWidth="1" fill="#FF8800" strokeLinejoin="round" />
        <path d="M11 25 L9 28 M21 25 L23 28" stroke="#FCC624" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Git',
    usage: 'version control',
    color: '#F05032',
    svg: (
      <>
        <line x1="7" y1="9" x2="7" y2="23" stroke="#F05032" strokeWidth="2.2" />
        <path d="M7 16 Q7 14 9 14 L20 14" stroke="#F05032" strokeWidth="2.2" fill="none" />
        <circle cx="7" cy="7" r="3" fill="#F05032" />
        <circle cx="7" cy="25" r="3" fill="#F05032" />
        <circle cx="22" cy="13" r="3" fill="#F05032" />
        <circle cx="7" cy="7" r="1.2" fill="#FFF" />
        <circle cx="7" cy="25" r="1.2" fill="#FFF" />
        <circle cx="22" cy="13" r="1.2" fill="#FFF" />
      </>
    ),
  },
  {
    name: 'VS Code',
    usage: 'editor, IDE',
    color: '#007ACC',
    svg: (
      <>
        <path d="M23 4 L13 14 L21 22 L24 19 L18 14 L24 9 Z" fill="#007ACC" />
        <path d="M13 14 L5 19 L3 17 L9 13 L3 9 L5 7 Z" fill="#007ACC" />
        <path d="M17 14 L20 14" stroke="#007ACC" strokeWidth="0.5" opacity="0" />
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
          <StackTile key={item.name} name={item.name} usage={item.usage} color={item.color}>
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
