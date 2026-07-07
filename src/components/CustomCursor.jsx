import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function CustomCursor({ hoveredProject }) {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(true)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    setIsTouch(mq.matches)
    const onChange = (e) => setIsTouch(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (isTouch) return
    const enter = () => setIsVisible(true)
    const leave = () => setIsVisible(false)
    document.addEventListener('mouseenter', enter)
    document.addEventListener('mouseleave', leave)
    return () => {
      document.removeEventListener('mouseenter', enter)
      document.removeEventListener('mouseleave', leave)
    }
  }, [isTouch])

  useEffect(() => {
    if (isTouch) return
    document.documentElement.style.cursor = 'none'
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY })
    document.addEventListener('mousemove', onMove, { passive: true })
    setPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    return () => {
      document.documentElement.style.cursor = ''
      document.removeEventListener('mousemove', onMove)
    }
  }, [isTouch])

  if (isTouch) return null

  const color = hoveredProject?.color || '#00ff66'

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 2147483647,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.2s',
    }}>
      {/* Halo */}
      <div style={{
        position: 'absolute',
        top: pos.y - 20,
        left: pos.x - 20,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
      }} />

      {/* Crosshair */}
      <div style={{
        position: 'absolute',
        top: pos.y - 16,
        left: pos.x - 16,
        width: '32px',
        height: '32px',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: '1.5px', background: 'rgba(255,255,255,0.8)',
          transform: 'translateY(-0.75px)',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: '1.5px', background: 'rgba(255,255,255,0.8)',
          transform: 'translateX(-0.75px)',
        }} />
        {[[0, 0], [100, 0], [0, 100], [100, 100]].map(([x, y], i) => (
          <div key={i} style={{
            position: 'absolute',
            [x === 0 ? 'left' : 'right']: 0,
            [y === 0 ? 'top' : 'bottom']: 0,
            width: '6px', height: '6px',
            borderColor: color, borderStyle: 'solid', borderWidth: 0,
            [y === 0 ? 'borderTopWidth' : 'borderBottomWidth']: '1.5px',
            [x === 0 ? 'borderLeftWidth' : 'borderRightWidth']: '1.5px',
            opacity: 0.9,
          }} />
        ))}
      </div>

      {/* Dot */}
      <div style={{
        position: 'absolute',
        top: pos.y - 4,
        left: pos.x - 4,
        width: '8px', height: '8px',
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 12px ${color}, 0 0 24px ${color}80`,
      }} />
    </div>,
    document.body
  )
}
