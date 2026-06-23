import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const globalMouse = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1
    globalMouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
  })
}

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  attribute float aSize;
  attribute float aSpeed;
  attribute float aPhase;
  varying float vBrightness;

  void main() {
    vec3 pos = position;

    // Float gently
    float t = uTime * aSpeed + aPhase;
    pos.x += sin(t) * 0.15;
    pos.y += cos(t * 0.7) * 0.15;
    pos.z += sin(t * 1.3) * 0.08;

    // Mouse push
    vec2 toMouse = pos.xy - uMouse * 6.0;
    float mDist = length(toMouse);
    float push = smoothstep(2.0, 0.0, mDist) * 0.8;
    pos.xy += normalize(toMouse) * push;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (2.5 / -mvPosition.z) * (1.0 + push);
    gl_Position = projectionMatrix * mvPosition;

    vBrightness = 0.3 + push * 0.7;
  }
`

const fragmentShader = `
  varying float vBrightness;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.0, dist);
    float glow = pow(core, 2.0);

    vec3 color = mix(
      vec3(0.0, 0.4, 0.2),
      vec3(0.0, 1.0, 0.5),
      glow
    );

    float alpha = glow * vBrightness * 0.6;

    gl_FragColor = vec4(color, alpha);
  }
`

function generateDataParticles(count) {
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const speeds = new Float32Array(count)
  const phases = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 14
    positions[i3 + 1] = (Math.random() - 0.5) * 10
    positions[i3 + 2] = (Math.random() - 0.5) * 6 - 1

    sizes[i] = Math.random() * 2.5 + 0.5
    speeds[i] = (Math.random() - 0.5) * 0.15
    phases[i] = Math.random() * Math.PI * 2
  }

  return { positions, sizes, speeds, phases }
}

export default function DataParticles({ count = 800 }) {
  const meshRef = useRef()
  const [data] = useState(() => generateDataParticles(count))

  const [uniforms] = useState(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }))

  useFrame((state) => {
    if (!meshRef.current) return
    const u = meshRef.current.material.uniforms
    u.uTime.value = state.clock.getElapsedTime()
    u.uMouse.value.lerp(new THREE.Vector2(globalMouse.x, globalMouse.y), 0.03)
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={data.sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" count={count} array={data.speeds} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={data.phases} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
