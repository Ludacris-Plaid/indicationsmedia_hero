import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CircuitBoard from './CircuitBoard'
import DataParticles from './DataParticles'

export default function Scene({ isMobile }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: isMobile ? 'auto' : 'none',
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
          <DataParticles count={800} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}
