import { useEffect, useState, useRef } from 'react'
import useIsMobile from '../hooks/useIsMobile'

function HexStream() {
  const [lines, setLines] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLines(prev => {
        const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')
        const addr = `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`
        const newLine = `${addr}  ${hex}`
        const next = [...prev, newLine]
        return next.slice(-12)
      })
    }, 150)

    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 20,
      fontFamily: "'Courier New', monospace",
      fontSize: '10px',
      lineHeight: '1.6',
      color: 'rgba(0, 255, 102, 0.3)',
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          opacity: 0.3 + (i / lines.length) * 0.7,
        }}>
          {line}
        </div>
      ))}
    </div>
  )
}

function StatusBar() {
  const [time, setTime] = useState('')
  const [mem, setMem] = useState(65)
  const [gpu, setGpu] = useState(52)
  const [net, setNet] = useState(234)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toTimeString().slice(0, 8))
      setMem(Math.floor(Math.random() * 40 + 60))
      setGpu(Math.floor(Math.random() * 30 + 40))
      setNet(Math.floor(Math.random() * 500))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 20,
      fontFamily: "'Courier New', monospace",
      fontSize: '10px',
      color: 'rgba(0, 255, 102, 0.25)',
      pointerEvents: 'none',
      userSelect: 'none',
      textAlign: 'right',
      lineHeight: '1.8',
    }}>
      <div>SYS.TIME {time}</div>
      <div>MEM.USAGE {mem}%</div>
      <div>GPU.LOAD {gpu}%</div>
      <div>NET.IN {net}KB/s</div>
    </div>
  )
}

function ScanlineOverlay() {
  return (
    <>
      {/* CRT scanlines */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 15,
        pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        mixBlendMode: 'multiply',
      }} />
      {/* Vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 14,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
      }} />
      {/* Chromatic aberration flicker */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 16,
        pointerEvents: 'none',
        animation: 'flicker 0.15s infinite',
        opacity: 0,
      }} />
    </>
  )
}

function GlitchBar() {
  const [bars, setBars] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const y = Math.random() * 100
        const h = Math.random() * 3 + 1
        const offset = (Math.random() - 0.5) * 20
        const newBars = [{ y, h, offset, id: Date.now() }]
        setBars(newBars)
        setTimeout(() => setBars([]), 80)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 17,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {bars.map(bar => (
        <div
          key={bar.id}
          style={{
            position: 'absolute',
            top: `${bar.y}%`,
            left: 0,
            right: 0,
            height: `${bar.h}%`,
            background: `rgba(0, 255, 102, 0.03)`,
            transform: `translateX(${bar.offset}px)`,
          }}
        />
      ))}
    </div>
  )
}

export default function GlitchOverlay() {
  const isMobile = useIsMobile()

  return (
    <>
      {!isMobile && <HexStream />}
      {!isMobile && <StatusBar />}
      <ScanlineOverlay />
      {!isMobile && <GlitchBar />}
      <style>{`
        @keyframes flicker {
          0% { opacity: 0; }
          5% { opacity: 0.02; }
          10% { opacity: 0; }
          15% { opacity: 0.01; }
          20% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
