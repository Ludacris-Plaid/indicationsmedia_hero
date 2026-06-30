import { useEffect, useState, useRef } from 'react'

export default function CustomCursor({ cursorPosition, hoveredProject }) {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const touchTimeout = useRef(null)

  useEffect(() => {
    const enter = () => setIsVisible(true)
    const leave = () => setIsVisible(false)
    document.addEventListener('mouseenter', enter)
    document.addEventListener('mouseleave', leave)
    return () => {
      document.removeEventListener('mouseenter', enter)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])

  useEffect(() => {
    const onTouchStart = (e) => {
      if (e.touches.length > 0) {
        setIsVisible(true)
        if (touchTimeout.current) clearTimeout(touchTimeout.current)
      }
    }
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        setIsVisible(true)
        if (touchTimeout.current) clearTimeout(touchTimeout.current)
      }
    }
    const onTouchEnd = () => {
      touchTimeout.current = setTimeout(() => {
        setIsVisible(false)
      }, 1500)
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      if (touchTimeout.current) clearTimeout(touchTimeout.current)
    }
  }, [])

  useEffect(() => {
    if (!cursorRef.current || !dotRef.current) return
    cursorRef.current.style.transform = `translate(${cursorPosition.x - 16}px, ${cursorPosition.y - 16}px)`
    dotRef.current.style.transform = `translate(${cursorPosition.x - 3}px, ${cursorPosition.y - 3}px)`
  }, [cursorPosition])

  const color = hoveredProject ? '#00ff66' : '#00ff66'

  return (
    <>
      {/* Crosshair outer */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      >
        {/* Horizontal line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: color,
          opacity: 0.5,
          transform: 'translateY(-0.5px)',
        }} />
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '1px',
          background: color,
          opacity: 0.5,
          transform: 'translateX(-0.5px)',
        }} />
        {/* Corner marks */}
        {[[0, 0], [100, 0], [0, 100], [100, 100]].map(([x, y], i) => (
          <div key={i} style={{
            position: 'absolute',
            [x === 0 ? 'left' : 'right']: 0,
            [y === 0 ? 'top' : 'bottom']: 0,
            width: '4px',
            height: '4px',
            borderColor: color,
            borderStyle: 'solid',
            borderWidth: 0,
            [y === 0 ? 'borderTopWidth' : 'borderBottomWidth']: '1px',
            [x === 0 ? 'borderLeftWidth' : 'borderRightWidth']: '1px',
            opacity: 0.8,
          }} />
        ))}
      </div>

      {/* Center dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color,
          pointerEvents: 'none',
          zIndex: 10001,
          opacity: isVisible ? 1 : 0,
          boxShadow: `0 0 8px ${color}60`,
          willChange: 'transform',
        }}
      />
    </>
  )
}
