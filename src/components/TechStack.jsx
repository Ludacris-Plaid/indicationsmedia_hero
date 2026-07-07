import { useState } from 'react'
import useIsMobile from '../hooks/useIsMobile'

function StackTile({ name, usage, color, url, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
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
        cursor: 'pointer',
        textDecoration: 'none',
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
      {hovered && (
        <div style={{
          position: 'absolute',
          top: '6px',
          right: '12px',
          width: '10px',
          height: '10px',
          zIndex: 5,
        }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9 L9 3 M5 3 L9 3 L9 7" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
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
    </a>
  )
}

const languages = [
  {
    name: 'JavaScript',
    usage: 'web apps, scripts',
    color: '#F7DF1E',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
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
    url: 'https://www.typescriptlang.org/',
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
    url: 'https://www.python.org/',
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
    url: 'https://go.dev/',
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
    url: 'https://www.rust-lang.org/',
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
    url: 'https://en.wikipedia.org/wiki/SQL',
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
  {
    name: 'C',
    usage: 'systems, low-level',
    color: '#A8B9CC',
    url: 'https://en.wikipedia.org/wiki/C_(programming_language)',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#283593" />
        <path d="M21 11 Q19 8 14 8 Q9 8 9 16 Q9 24 14 24 Q19 24 21 21" stroke="#FFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'C++',
    usage: 'systems, game dev',
    color: '#00599C',
    url: 'https://isocpp.org/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#00599C" />
        <path d="M14 10 Q11 8 9 11 Q8 14 11 16 Q8 18 9 21 Q11 24 14 22" stroke="#FFF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <line x1="20" y1="9" x2="20" y2="23" stroke="#FFF" strokeWidth="1.5" />
        <line x1="16" y1="13" x2="24" y2="13" stroke="#FFF" strokeWidth="1.5" />
        <line x1="16" y1="19" x2="24" y2="19" stroke="#FFF" strokeWidth="1.5" />
      </>
    ),
  },
  {
    name: 'C#',
    usage: '.NET, enterprise',
    color: '#9B4F96',
    url: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#68217A" />
        <text x="13" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Arial" fill="#FFF">C</text>
        <line x1="18" y1="11" x2="26" y2="11" stroke="#FFF" strokeWidth="1.5" />
        <line x1="18" y1="15" x2="26" y2="15" stroke="#FFF" strokeWidth="1.5" />
        <line x1="20" y1="8" x2="24" y2="18" stroke="#FFF" strokeWidth="1.5" />
      </>
    ),
  },
  {
    name: 'Ruby',
    usage: 'web, scripting',
    color: '#CC342D',
    url: 'https://www.ruby-lang.org/',
    svg: (
      <>
        <polygon points="16,3 28,11 24,28 8,28 4,11" fill="#CC342D" />
        <path d="M4 11 L28 11" stroke="#9B1B17" strokeWidth="0.5" opacity="0.5" />
        <path d="M16 3 L11 28 M16 3 L21 28" stroke="#9B1B17" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="16" cy="14" rx="8" ry="3" fill="#FFF" opacity="0.25" />
      </>
    ),
  },
  {
    name: 'PHP',
    usage: 'web backend',
    color: '#777BB4',
    url: 'https://www.php.net/',
    svg: (
      <>
        <ellipse cx="16" cy="17" rx="13" ry="11" fill="#777BB4" />
        <text x="16" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial" fill="#FFF">PHP</text>
        <circle cx="16" cy="8" r="2" fill="#777BB4" />
      </>
    ),
  },
  {
    name: 'Bash',
    usage: 'shell, scripts',
    color: '#4EAA25',
    url: 'https://www.gnu.org/software/bash/',
    svg: (
      <>
        <rect x="3" y="6" width="26" height="20" rx="2" fill="#4EAA25" />
        <circle cx="6" cy="9" r="0.8" fill="#FF5F56" />
        <circle cx="8.5" cy="9" r="0.8" fill="#FFBD2E" />
        <circle cx="11" cy="9" r="0.8" fill="#27C93F" />
        <text x="6" y="22" fontSize="10" fontWeight="700" fontFamily="monospace" fill="#FFF">$ _</text>
      </>
    ),
  },
]

const frameworks = [
  {
    name: 'React',
    usage: 'UI, SPAs',
    color: '#61DAFB',
    url: 'https://react.dev/',
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
    url: 'https://nextjs.org/',
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
    url: 'https://nodejs.org/',
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
    url: 'https://vuejs.org/',
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
    url: 'https://tailwindcss.com/',
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
    url: 'https://flask.palletsprojects.com/',
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
  {
    name: 'Express',
    usage: 'Node.js framework',
    color: '#FFFFFF',
    url: 'https://expressjs.com/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#000" />
        <text x="16" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="Arial" fill="#FFF">ex</text>
        <path d="M7 23 L25 23" stroke="#FFF" strokeWidth="1" opacity="0.4" />
      </>
    ),
  },
  {
    name: 'Django',
    usage: 'Python web',
    color: '#092E20',
    url: 'https://www.djangoproject.com/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#092E20" />
        <text x="16" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial" fill="#FFF">djan</text>
      </>
    ),
  },
  {
    name: 'FastAPI',
    usage: 'async Python',
    color: '#009688',
    url: 'https://fastapi.tiangolo.com/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#009688" />
        <text x="16" y="14" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Arial" fill="#FFF">FAST</text>
        <text x="16" y="23" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Arial" fill="#FFF">API</text>
      </>
    ),
  },
  {
    name: 'Svelte',
    usage: 'compiled UI',
    color: '#FF3E00',
    url: 'https://svelte.dev/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#FF3E00" />
        <path d="M16 6 Q10 6 8 12 Q9 9 13 9 Q11 9 10 13 Q12 10 16 12 Q13 12 12 16 Q15 13 19 15 Q16 13 19 17 Q21 15 19 21 Q22 17 20 23" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Angular',
    usage: 'enterprise UI',
    color: '#DD0031',
    url: 'https://angular.dev/',
    svg: (
      <>
        <path d="M5 8 L16 4 L27 8 L25 22 L16 28 L7 22 Z" fill="#DD0031" />
        <path d="M16 4 L16 28 L25 22 L27 8 Z" fill="#C3002F" />
        <text x="16" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial" fill="#FFF">A</text>
      </>
    ),
  },
  {
    name: 'Nuxt',
    usage: 'Vue meta-framework',
    color: '#00DC82',
    url: 'https://nuxt.com/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#00DC82" />
        <path d="M9 22 L13 8 L17 17 L19 13 L23 22" stroke="#030806" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
]

const infrastructure = [
  {
    name: 'Docker',
    usage: 'containers',
    color: '#2496ED',
    url: 'https://www.docker.com/',
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
    url: 'https://www.postgresql.org/',
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
    url: 'https://aws.amazon.com/',
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
    url: 'https://www.linux.org/',
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
    url: 'https://git-scm.com/',
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
    url: 'https://code.visualstudio.com/',
    svg: (
      <>
        <path d="M23 4 L13 14 L21 22 L24 19 L18 14 L24 9 Z" fill="#007ACC" />
        <path d="M13 14 L5 19 L3 17 L9 13 L3 9 L5 7 Z" fill="#007ACC" />
        <path d="M17 14 L20 14" stroke="#007ACC" strokeWidth="0.5" opacity="0" />
      </>
    ),
  },
  {
    name: 'n8n',
    usage: 'workflow automation',
    color: '#EA4B71',
    url: 'https://n8n.io/',
    svg: (
      <>
        <polygon points="16,3 27,9.5 27,22.5 16,29 5,22.5 5,9.5" fill="#EA4B71" />
        <text x="16" y="20" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial" fill="#FFF">n8n</text>
      </>
    ),
  },
  {
    name: 'Obsidian',
    usage: 'knowledge base',
    color: '#7C3AED',
    url: 'https://obsidian.md/',
    svg: (
      <>
        <polygon points="16,3 25,8 28,16 25,24 16,29 7,24 4,16 7,8" fill="#7C3AED" />
        <polygon points="16,3 25,8 28,16 16,16 7,8" fill="#9F67FA" opacity="0.6" />
        <line x1="16" y1="3" x2="16" y2="29" stroke="#FFF" strokeWidth="0.6" opacity="0.5" />
        <line x1="4" y1="16" x2="28" y2="16" stroke="#FFF" strokeWidth="0.6" opacity="0.4" />
        <line x1="7" y1="8" x2="25" y2="24" stroke="#FFF" strokeWidth="0.5" opacity="0.3" />
        <line x1="25" y1="8" x2="7" y2="24" stroke="#FFF" strokeWidth="0.5" opacity="0.3" />
      </>
    ),
  },
  {
    name: 'Kubernetes',
    usage: 'container orchestration',
    color: '#326CE5',
    url: 'https://kubernetes.io/',
    svg: (
      <>
        <polygon points="16,3 27,9 27,22 16,28 5,22 5,9" fill="#326CE5" />
        <circle cx="16" cy="16" r="2.5" fill="none" stroke="#FFF" strokeWidth="1.2" />
        <line x1="16" y1="16" x2="16" y2="9" stroke="#FFF" strokeWidth="1" />
        <line x1="16" y1="16" x2="21" y2="19" stroke="#FFF" strokeWidth="1" />
        <line x1="16" y1="16" x2="11" y2="19" stroke="#FFF" strokeWidth="1" />
        <circle cx="16" cy="9" r="1.5" fill="#FFF" />
        <circle cx="21" cy="19" r="1.5" fill="#FFF" />
        <circle cx="11" cy="19" r="1.5" fill="#FFF" />
      </>
    ),
  },
  {
    name: 'Redis',
    usage: 'in-memory cache',
    color: '#DC382D',
    url: 'https://redis.io/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#DC382D" />
        <path d="M16 6 Q11 6 11 10 Q11 14 16 16 Q21 14 21 10 Q21 6 16 6" fill="#FFF" opacity="0.9" />
        <path d="M16 16 Q11 16 11 20 Q11 24 16 26 Q21 24 21 20 Q21 16 16 16" fill="#FFF" opacity="0.7" />
      </>
    ),
  },
  {
    name: 'MongoDB',
    usage: 'NoSQL database',
    color: '#47A248',
    url: 'https://www.mongodb.com/',
    svg: (
      <>
        <path d="M16 4 Q12 8 12 14 Q12 20 16 28 Q20 20 20 14 Q20 8 16 4" fill="#47A248" />
        <path d="M16 4 Q12 8 12 14 Q12 20 16 28 Q20 20 20 14 Q20 8 16 4" fill="none" stroke="#FFF" strokeWidth="0.5" opacity="0.5" />
        <line x1="16" y1="4" x2="16" y2="28" stroke="#030806" strokeWidth="0.5" opacity="0.4" />
      </>
    ),
  },
  {
    name: 'Vercel',
    usage: 'edge deploys',
    color: '#FFFFFF',
    url: 'https://vercel.com/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#000" />
        <polygon points="16,7 25,24 7,24" fill="#FFF" />
      </>
    ),
  },
]

const crypto = [
  {
    name: 'Bitcoin',
    usage: 'BTC, store of value',
    color: '#F7931A',
    url: 'https://bitcoin.org/',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#F7931A" />
        <path d="M13 7 L13 9 M19 7 L19 9 M13 23 L13 25 M19 23 L19 25" stroke="#F7931A" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M11 11 L17 11 Q20 11 20 13.5 Q20 15.5 17 15.5 L11 15.5" stroke="#FFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 15.5 L18 15.5 Q21 15.5 21 18 Q21 20.5 18 20.5 L11 20.5" stroke="#FFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'Litecoin',
    usage: 'LTC, fast payments',
    color: '#345D9D',
    url: 'https://litecoin.org/',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#345D9D" />
        <path d="M17 7 L11.5 18.5 L16 18.5 L13 25 L23 14 L18 14 L21 7 Z" fill="#FFF" stroke="#FFF" strokeWidth="0.8" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'Monero',
    usage: 'XMR, private',
    color: '#FF6600',
    url: 'https://www.getmonero.org/',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#FF6600" />
        <path d="M7 9 L7 23 L10 23 L10 14.5 L13 19 L15 19 L13 19 L15 19 L18 14.5 L18 23 L21 23 L21 14.5 L25 9 L21 9 L16 17 L11 9 Z" fill="#FFF" stroke="#FFF" strokeWidth="0.5" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'Ethereum',
    usage: 'ETH, smart contracts',
    color: '#627EEA',
    url: 'https://ethereum.org/',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#627EEA" />
        <path d="M16.5 5 L16.5 12.5 L23 15 Z" fill="#FFF" opacity="0.6" />
        <path d="M16.5 5 L10 15 L16.5 12.5 Z" fill="#FFF" />
        <path d="M16.5 19.5 L16.5 26.5 L23 16.5 Z" fill="#FFF" opacity="0.6" />
        <path d="M16.5 26.5 L16.5 19.5 L10 16.5 Z" fill="#FFF" />
        <path d="M16.5 17.5 L23 14 L16.5 11 Z" fill="#FFF" opacity="0.2" />
        <path d="M16.5 17.5 L10 14 L16.5 11 Z" fill="#FFF" opacity="0.4" />
      </>
    ),
  },
  {
    name: 'Solidity',
    usage: 'smart contracts',
    color: '#9FA8DA',
    url: 'https://soliditylang.org/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="4" fill="#363636" />
        <rect x="3" y="3" width="26" height="26" rx="4" fill="none" stroke="#9FA8DA" strokeWidth="0.5" />
        <path d="M9 11 Q9 9 11 9 L19 9 Q22 9 22 12 Q22 14 19 14 L13 14 Q10 14 10 16.5 Q10 19 13 19 L20 19 Q23 19 23 21.5" stroke="#9FA8DA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <line x1="11" y1="22.5" x2="21" y2="22.5" stroke="#9FA8DA" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Tor',
    usage: 'private network',
    color: '#7D4698',
    url: 'https://www.torproject.org/',
    svg: (
      <>
        <path d="M16 4 Q9 6 9 14 Q9 19 12 23 Q14 26 16 28 Q18 26 20 23 Q23 19 23 14 Q23 6 16 4 Z" fill="#7D4698" />
        <path d="M16 7 Q11 9 11 14 Q11 18 13 21 Q14.5 23.5 16 25 Q17.5 23.5 19 21 Q21 18 21 14 Q21 9 16 7 Z" fill="none" stroke="#FFF" strokeWidth="0.5" opacity="0.4" />
        <path d="M16 7 Q13 12 13 16 Q13 20 16 24" stroke="#FFF" strokeWidth="0.6" fill="none" opacity="0.5" />
        <path d="M16 7 Q19 12 19 16 Q19 20 16 24" stroke="#FFF" strokeWidth="0.6" fill="none" opacity="0.5" />
        <line x1="13" y1="16" x2="19" y2="16" stroke="#FFF" strokeWidth="0.6" opacity="0.5" />
        <path d="M14 11 Q16 13 18 11" stroke="#FFF" strokeWidth="0.5" fill="none" opacity="0.4" />
      </>
    ),
  },
  {
    name: 'IPFS',
    usage: 'decentralized storage',
    color: '#65C2CB',
    url: 'https://ipfs.tech/',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#65C2CB" />
        <path d="M16 6 L23 10 L23 16 L20 17.5 L17 16 L17 12 L20 13.5 L20 11 L16 8.5 L12 11 L12 19 L16 21.5 L20 19 L20 17.5 L23 16 L23 22 L16 26 L9 22 L9 10 Z" fill="#030806" opacity="0.5" />
        <path d="M16 7 L22 10.5 L22 15.5 L19 17 L16 15.5 L16 12.5 L19 14 L19 11.5 L16 9.5 L13 11.5 L13 18.5 L16 20.5 L19 18.5 L19 17 L22 15.5 L22 21.5 L16 25 L10 21.5 L10 10.5 Z" fill="#FFF" />
      </>
    ),
  },
  {
    name: 'Polygon',
    usage: 'ETH L2, scaling',
    color: '#8247E5',
    url: 'https://polygon.technology/',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#8247E5" />
        <path d="M11 11 L16 8 L21 11 L21 16 L16 19 L11 16 Z" fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 11 L16 14 L21 11 M16 14 L16 19" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'PGP',
    usage: 'encrypted comms',
    color: '#D4A017',
    url: 'https://www.openpgp.org/',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#D4A017" />
        <circle cx="11" cy="16" r="5" stroke="#030806" strokeWidth="1.8" fill="none" />
        <circle cx="11" cy="16" r="1.8" fill="#030806" />
        <line x1="16" y1="16" x2="26" y2="16" stroke="#030806" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="16" x2="22" y2="20" stroke="#030806" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="25" y1="16" x2="25" y2="19" stroke="#030806" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Solana',
    usage: 'SOL, fast L1',
    color: '#9945FF',
    url: 'https://solana.com/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#9945FF" />
        <rect x="7" y="9" width="14" height="2.5" rx="0.5" fill="#FFF" transform="skewX(-20)" />
        <rect x="9" y="14.5" width="14" height="2.5" rx="0.5" fill="#14F195" transform="skewX(-20)" />
        <rect x="7" y="20" width="14" height="2.5" rx="0.5" fill="#FFF" transform="skewX(-20)" />
      </>
    ),
  },
  {
    name: 'Polkadot',
    usage: 'DOT, interoperability',
    color: '#E6007A',
    url: 'https://polkadot.network/',
    svg: (
      <>
        <circle cx="16" cy="16" r="13" fill="#E6007A" />
        <circle cx="16" cy="16" r="8" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.4" />
        <circle cx="16" cy="9" r="2" fill="#FFF" />
        <circle cx="16" cy="23" r="2" fill="#FFF" />
        <circle cx="9" cy="16" r="2" fill="#FFF" />
        <circle cx="23" cy="16" r="2" fill="#FFF" />
        <circle cx="16" cy="16" r="2.5" fill="#FFF" />
      </>
    ),
  },
  {
    name: 'Chainlink',
    usage: 'oracles, LINK',
    color: '#2A5ADA',
    url: 'https://chain.link/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="3" fill="#2A5ADA" />
        <polygon points="16,5 25,10 25,22 16,27 7,22 7,10" fill="none" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" />
        <line x1="11" y1="13" x2="21" y2="13" stroke="#FFF" strokeWidth="1.5" />
        <line x1="11" y1="16" x2="21" y2="16" stroke="#FFF" strokeWidth="1.5" />
        <line x1="11" y1="19" x2="21" y2="19" stroke="#FFF" strokeWidth="1.5" />
      </>
    ),
  },
]

const ai = [
  {
    name: 'Claude',
    usage: 'Anthropic LLM',
    color: '#D97757',
    url: 'https://www.anthropic.com/claude',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#D97757" />
        <path d="M16 5 L19 13 L27 16 L19 19 L16 27 L13 19 L5 16 L13 13 Z" fill="#FFF" />
        <path d="M16 11 L18.5 17 L16 17 L16 15 L16 17 L13.5 17 Z" fill="#D97757" />
      </>
    ),
  },
  {
    name: 'ChatGPT',
    usage: 'OpenAI LLM',
    color: '#10A37F',
    url: 'https://chat.openai.com/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#10A37F" />
        <g fill="none" stroke="#FFF" strokeWidth="1.4">
          <ellipse cx="16" cy="10" rx="2.2" ry="4.5" />
          <ellipse cx="16" cy="22" rx="2.2" ry="4.5" />
          <ellipse cx="11" cy="12.2" rx="2.2" ry="4.5" transform="rotate(-60 11 12.2)" />
          <ellipse cx="21" cy="12.2" rx="2.2" ry="4.5" transform="rotate(60 21 12.2)" />
          <ellipse cx="11" cy="19.8" rx="2.2" ry="4.5" transform="rotate(60 11 19.8)" />
          <ellipse cx="21" cy="19.8" rx="2.2" ry="4.5" transform="rotate(-60 21 19.8)" />
        </g>
        <circle cx="16" cy="16" r="1.5" fill="#FFF" />
      </>
    ),
  },
  {
    name: 'Grok',
    usage: 'xAI LLM',
    color: '#FFFFFF',
    url: 'https://x.ai/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#000" />
        <path d="M22 7 L13 7 L8 12 L8 20 L13 25 L22 25" stroke="#FFF" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M15 14 L22 14 L22 21 L18 21" stroke="#FFF" strokeWidth="2.2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'llama.cpp',
    usage: 'local LLM runtime',
    color: '#0866FF',
    url: 'https://github.com/ggerganov/llama.cpp',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#0866FF" />
        <path d="M10 11 L11 6 L14 10 Z" fill="#FFF" />
        <path d="M22 11 L21 6 L18 10 Z" fill="#FFF" />
        <path d="M9 14 Q9 22 16 22 Q23 22 23 14 Q23 11 20 11 L12 11 Q9 11 9 14 Z" fill="#FFF" />
        <circle cx="13" cy="15" r="1" fill="#0866FF" />
        <circle cx="19" cy="15" r="1" fill="#0866FF" />
        <ellipse cx="16" cy="18.5" rx="1.2" ry="0.7" fill="#0866FF" />
        <path d="M13 20 Q16 22 19 20" stroke="#0866FF" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'HuggingFace',
    usage: 'model hub',
    color: '#FFD21E',
    url: 'https://huggingface.co/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#FFD21E" />
        <circle cx="11.5" cy="12.5" r="1.6" fill="#000" />
        <circle cx="20.5" cy="12.5" r="1.6" fill="#000" />
        <path d="M10 16.5 Q16 22.5 22 16.5" stroke="#000" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M14 19.5 Q16 21 18 19.5 L17 18 L15 18 Z" fill="#FF9D28" />
        <ellipse cx="16" cy="19.8" rx="1.5" ry="1" fill="#FF9D28" />
      </>
    ),
  },
  {
    name: 'Ollama',
    usage: 'local model runner',
    color: '#FFFFFF',
    url: 'https://ollama.com/',
    svg: (
      <>
        <rect x="3" y="3" width="26" height="26" rx="5" fill="#000" />
        <path d="M10 12 L11 7 L14 11" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M22 12 L21 7 L18 11" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M9 15 Q9 22 16 22 Q23 22 23 15 Q23 12 20 12 L12 12 Q9 12 9 15 Z" stroke="#FFF" strokeWidth="1.5" fill="none" />
        <circle cx="13" cy="16" r="0.8" fill="#FFF" />
        <circle cx="19" cy="16" r="0.8" fill="#FFF" />
        <path d="M14 19 Q16 20 18 19" stroke="#FFF" strokeWidth="1" fill="none" strokeLinecap="round" />
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
          <StackTile key={item.name} name={item.name} usage={item.usage} color={item.color} url={item.url}>
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
        <StackGrid title="CRYPTO" items={crypto} />
        <StackGrid title="AI" items={ai} />
      </div>
    </div>
  )
}
