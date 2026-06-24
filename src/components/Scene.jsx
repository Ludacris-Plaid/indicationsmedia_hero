import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CircuitBoard from './CircuitBoard'
import DataParticles from './DataParticles'

export default function Scene({ isMobile }) {
  if (isMobile) {
    return <MobileParticles />
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#030806' }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#030806']} />

          <CircuitBoard />
          <DataParticles count={800} />
        </Suspense>
      </Canvas>
    </div>
  )
}

function MobileParticles() {
  return (
    <canvas
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      ref={(canvas) => {
        if (!canvas || canvas._running) return
        canvas._running = true

        const ctx = canvas.getContext('2d')
        let w, h
        const particles = []

        function resize() {
          w = canvas.width = window.innerWidth
          h = canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < 120; i++) {
          particles.push({
            x: Math.random() * 2000,
            y: Math.random() * 4000,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.5,
            phase: Math.random() * Math.PI * 2,
          })
        }

        function draw() {
          ctx.clearRect(0, 0, w, h)
          const t = Date.now() * 0.001

          for (const p of particles) {
            p.x += p.vx + Math.sin(t * 0.3 + p.phase) * 0.4
            p.y += p.vy + Math.cos(t * 0.2 + p.phase) * 0.3

            if (p.x < 0) p.x = w
            if (p.x > w) p.x = 0
            if (p.y < 0) p.y = h
            if (p.y > h) p.y = 0

            const pulse = 0.3 + Math.sin(t * 2 + p.phase) * 0.3
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(0, 255, 102, ${pulse})`
            ctx.fill()

            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(0, 255, 102, ${pulse * 0.15})`
            ctx.fill()
          }

          requestAnimationFrame(draw)
        }
        draw()
      }}
    />
  )
}
