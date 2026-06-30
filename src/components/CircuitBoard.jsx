import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Global mouse position — always tracks regardless of what's on top
const globalMouse = { x: 0.5, y: 0.5 }

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    globalMouse.x = e.clientX / window.innerWidth
    globalMouse.y = 1.0 - e.clientY / window.innerHeight
  })
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      globalMouse.x = e.touches[0].clientX / window.innerWidth
      globalMouse.y = 1.0 - e.touches[0].clientY / window.innerHeight
    }
  }, { passive: true })
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      globalMouse.x = e.touches[0].clientX / window.innerWidth
      globalMouse.y = 1.0 - e.touches[0].clientY / window.innerHeight
    }
  }, { passive: true })
}

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * 3.0 + uTime * 0.5) * 0.04;
    pos.z += cos(pos.y * 3.0 + uTime * 0.4) * 0.04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime;

    // ─── MOUSE BEND ZONE ───────────────────────
    vec2 mOff = uv - uMouse;
    float mDist = length(mOff);
    float mRadius = 0.35;

    float mFalloff = smoothstep(mRadius, 0.0, mDist);

    // Smooth gravitational warp — traces bend toward cursor
    float bendStrength = mFalloff * mFalloff; // quadratic falloff for natural feel
    vec2 bendDir = normalize(mOff + 0.001);
    float bendAmount = bendStrength * 0.12;

    // Twirl — slight rotation around cursor
    float angle = atan(mOff.y, mOff.x);
    float twirl = bendStrength * 0.3;
    float cosA = cos(twirl);
    float sinA = sin(twirl);
    vec2 twirlOffset = vec2(
      mOff.x * cosA - mOff.y * sinA - mOff.x,
      mOff.x * sinA + mOff.y * cosA - mOff.y
    );

    // Combine: pull inward + twirl
    vec2 warpOffset = -bendDir * bendAmount + twirlOffset * 0.02;
    vec2 glitchUv = uv + warpOffset;

    // ─── GRID (on warped UV) ───────────────────
    vec2 grid = floor(glitchUv * 30.0);
    vec2 f = fract(glitchUv * 30.0);
    float h = hash(grid);

    // ─── CIRCUIT TRACES ────────────────────────
    float hLine = smoothstep(0.46, 0.5, f.y) * smoothstep(0.54, 0.5, f.y);
    float hTrace = step(0.4, h) * hLine;

    float vLine = smoothstep(0.46, 0.5, f.x) * smoothstep(0.54, 0.5, f.x);
    float vTrace = step(0.25, h) * step(h, 0.75) * vLine;

    // ─── NODES ─────────────────────────────────
    float nodeDist = length(f - 0.5);
    float node = smoothstep(0.12, 0.03, nodeDist);
    float isNode = step(0.65, h) * node;

    // ─── DATA PULSES ───────────────────────────
    float pulseH = sin(glitchUv.x * 30.0 - t * 3.0 + h * 20.0) * 0.5 + 0.5;
    pulseH = smoothstep(0.85, 1.0, pulseH) * hTrace * step(0.5, h);

    float pulseV = sin(glitchUv.y * 30.0 - t * 2.5 + h * 15.0) * 0.5 + 0.5;
    pulseV = smoothstep(0.85, 1.0, pulseV) * vTrace * step(0.3, h) * step(h, 0.7);

    float pulse = max(pulseH, pulseV);

    // ─── NODE BLINK ────────────────────────────
    float blink = sin(t * 2.0 + h * 30.0) * 0.5 + 0.5;
    blink = smoothstep(0.7, 1.0, blink) * isNode;

    // ─── BIG WAVE PULSE ────────────────────────
    float wave = sin(uv.x * 8.0 + uv.y * 4.0 + t * 0.8) * 0.5 + 0.5;
    wave = smoothstep(0.6, 0.8, wave);

    // ─── COLOR ─────────────────────────────────
    vec3 dimGreen = vec3(0.0, 0.06, 0.03);
    vec3 midGreen = vec3(0.0, 0.25, 0.12);
    vec3 brightGreen = vec3(0.0, 1.0, 0.4);
    vec3 cyan = vec3(0.0, 0.8, 0.7);
    vec3 white = vec3(0.8, 1.0, 0.9);

    vec3 color = dimGreen;
    color = mix(color, midGreen, (hTrace + vTrace) * 0.4);
    color = mix(color, midGreen * 1.3, wave * (hTrace + vTrace) * 0.2);
    color = mix(color, brightGreen, pulse * 0.9);
    color = mix(color, brightGreen, blink * 0.8);
    color = mix(color, white, blink * 0.3);

    // Subtle glow at bend center
    color += brightGreen * mFalloff * 0.15;
    color += cyan * bendStrength * 0.1;

    // ─── ALPHA ─────────────────────────────────
    float alpha = 0.0;
    alpha += (hTrace + vTrace) * 0.35;
    alpha += wave * (hTrace + vTrace) * 0.1;
    alpha += pulse * 0.5;
    alpha += blink * 0.6;
    alpha += mFalloff * 0.12;

    float edge = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
    edge *= smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
    alpha *= edge;

    gl_FragColor = vec4(color, alpha);
  }
`

export default function CircuitBoard() {
  const meshRef = useRef()
  const { viewport } = useThree()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  }), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const u = meshRef.current.material.uniforms
    u.uTime.value = state.clock.getElapsedTime()
    u.uMouse.value.lerp(new THREE.Vector2(globalMouse.x, globalMouse.y), 0.05)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -4]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
