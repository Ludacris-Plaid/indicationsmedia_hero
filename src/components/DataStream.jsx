import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[];/\\|=+-*&^%$#@!'

export default function DataStream() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let columns, drops

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      columns = Math.floor(canvas.width / 18)
      drops = Array(columns).fill(1).map(() => Math.random() * -100)
    }

    resize()
    window.addEventListener('resize', resize)

    function draw() {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = '14px monospace'

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * 18
        const y = drops[i] * 18

        // Lead character is bright
        const brightness = Math.random()
        if (brightness > 0.95) {
          ctx.fillStyle = '#ffffff'
        } else if (brightness > 0.8) {
          ctx.fillStyle = '#00ff66'
        } else {
          ctx.fillStyle = `rgba(0, 255, 102, ${0.15 + Math.random() * 0.35})`
        }

        ctx.fillText(char, x, y)

        // Reset when off screen
        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }

        drops[i] += 0.5 + Math.random() * 0.5
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        opacity: 0.35,
        mixBlendMode: 'screen',
      }}
    />
  )
}
