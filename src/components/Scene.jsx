import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import CircuitBoard from './CircuitBoard'
import DataParticles from './DataParticles'

export default function Scene({ isMobile }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isMobile || !canvasRef.current) return
    const el = canvasRef.current
    const block = (e) => e.stopPropagation()
    el.addEventListener('touchstart', block, { passive: false })
    el.addEventListener('touchmove', block, { passive: false })
    el.addEventListener('touchend', block, { passive: false })
    return () => {
      el.removeEventListener('touchstart', block)
      el.removeEventListener('touchmove', block)
      el.removeEventListener('touchend', block)
    }
  }, [isMobile])

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#030806', pointerEvents: 'none' }}
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
